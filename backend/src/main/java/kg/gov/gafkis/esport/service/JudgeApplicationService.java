package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.JudgeApplicationCreateRequest;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.response.JudgeApplicationListResponse;
import kg.gov.gafkis.esport.dto.response.JudgeApplicationResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.entity.Judge;
import kg.gov.gafkis.esport.entity.JudgeApplication;
import kg.gov.gafkis.esport.entity.JudgeApplicationHistory;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.JudgeApplicationMapper;
import kg.gov.gafkis.esport.repository.JudgeApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class JudgeApplicationService {

    private final JudgeApplicationRepository judgeApplicationRepository;
    private final JudgeApplicationMapper judgeApplicationMapper;
    private final JudgeService judgeService;

    private static final DateTimeFormatter APP_NO_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd'-'HHmmssSSS");

    @Transactional(readOnly = true)
    public PagedResponse<JudgeApplicationListResponse> getAll(String search, String category, String status,
                                                               Pageable pageable) {
        Specification<JudgeApplication> spec = buildSpecification(search, category, status);
        Page<JudgeApplication> page = judgeApplicationRepository.findAll(spec, pageable);
        List<JudgeApplicationListResponse> content = judgeApplicationMapper.toListResponse(page.getContent());
        return new PagedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional(readOnly = true)
    public JudgeApplicationResponse getById(Long id) {
        JudgeApplication app = judgeApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка на судейскую категорию", "id", id));
        return judgeApplicationMapper.toResponse(app);
    }

    public JudgeApplicationResponse create(JudgeApplicationCreateRequest request) {
        String appNo = "JD-" + LocalDateTime.now().format(APP_NO_FORMATTER);
        LocalDate submitDate = LocalDate.now();
        int docsTotal = request.getDocsTotal() != null ? request.getDocsTotal() : 4;

        JudgeApplication app = JudgeApplication.builder()
                .appNo(appNo)
                .applicantName(request.getApplicantName())
                .inn(request.getInn())
                .phone(request.getPhone())
                .email(request.getEmail())
                .sport(request.getSport())
                .currentCategory(request.getCurrentCategory())
                .requestedCategory(request.getRequestedCategory())
                .eventsServed(request.getEventsServed())
                .experienceYears(request.getExperienceYears())
                .region(request.getRegion())
                .status(JudgeWorkflow.SUBMITTED)
                .docsUploaded(0)
                .docsTotal(docsTotal)
                .submitDate(submitDate)
                // на старте действует срок проверки документов
                .deadline(addWorkingDays(submitDate, JudgeWorkflow.DOC_CHECK_DAYS))
                .build();

        app.getHistory().add(JudgeApplicationHistory.builder()
                .judgeApplication(app)
                .action("Заявка создана")
                .userName("system")
                .build());

        app = judgeApplicationRepository.save(app);
        log.info("Создана заявка на судейскую категорию: {} (id={})", appNo, app.getId());
        return judgeApplicationMapper.toResponse(app);
    }

    public JudgeApplicationResponse changeStatus(Long id, StatusChangeRequest request) {
        JudgeApplication app = judgeApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка на судейскую категорию", "id", id));

        String currentStatus = app.getStatus();
        String newStatus = request.getStatus();
        String track = JudgeWorkflow.track(app.getRequestedCategory());

        if (!JudgeWorkflow.nextStatuses(currentStatus, track).contains(newStatus)) {
            throw new BadRequestException(
                    String.format("Недопустимый переход статуса: '%s' -> '%s'", currentStatus, newStatus));
        }

        if (JudgeWorkflow.REJECTED.equals(newStatus)) {
            if (request.getReason() == null || request.getReason().isBlank()) {
                throw new BadRequestException("Причина отказа обязательна");
            }
            app.setRejectReason(request.getReason());
        }

        // Приём документов (переход к аттестации / согласованию) — стартует срок рассмотрения
        if ((JudgeWorkflow.ATTESTATION.equals(newStatus) || JudgeWorkflow.AGENCY_APPROVAL.equals(newStatus))
                && JudgeWorkflow.DOC_CHECK.equals(currentStatus)) {
            app.setDeadline(addWorkingDays(LocalDate.now(), JudgeWorkflow.TERM_DAYS));
        }

        app.setStatus(newStatus);

        // Выдача удостоверения / запись международной категории — заносим судью в реестр
        if (JudgeWorkflow.issuesCertificate(newStatus) && app.getJudgeId() == null) {
            Judge judge = judgeService.issueFromApplication(
                    app.getApplicantName(), app.getRequestedCategory(), app.getSport(),
                    app.getRegion(), app.getPhone(), app.getEmail());
            app.setJudgeId(judge.getId());
            app.getHistory().add(JudgeApplicationHistory.builder()
                    .judgeApplication(app)
                    .action("Категория «" + app.getRequestedCategory() + "» внесена в реестр судей, удостоверение "
                            + judge.getCertNumber())
                    .userName("system")
                    .build());
            log.info("Заявка {} -> реестр судьи id={}", app.getAppNo(), judge.getId());
        }

        app.getHistory().add(JudgeApplicationHistory.builder()
                .judgeApplication(app)
                .action("Статус изменён: " + currentStatus + " -> " + newStatus)
                .userName("system")
                .build());

        app = judgeApplicationRepository.save(app);
        log.info("Изменён статус заявки {} на '{}' (id={})", app.getAppNo(), newStatus, app.getId());
        return judgeApplicationMapper.toResponse(app);
    }

    // ======================== helpers ========================

    static LocalDate addWorkingDays(LocalDate startDate, int workingDays) {
        if (workingDays <= 0) {
            return startDate;
        }
        LocalDate result = startDate;
        int added = 0;
        while (added < workingDays) {
            result = result.plusDays(1);
            DayOfWeek dow = result.getDayOfWeek();
            if (dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY) {
                added++;
            }
        }
        return result;
    }

    private Specification<JudgeApplication> buildSpecification(String search, String category, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("applicantName")), pattern),
                        cb.like(cb.lower(root.get("appNo")), pattern)
                ));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("requestedCategory"), category));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
