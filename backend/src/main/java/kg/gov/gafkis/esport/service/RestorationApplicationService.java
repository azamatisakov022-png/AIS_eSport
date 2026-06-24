package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.RestorationAppCreateRequest;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.RestorationAppListResponse;
import kg.gov.gafkis.esport.dto.response.RestorationAppResponse;
import kg.gov.gafkis.esport.entity.RestorationApplication;
import kg.gov.gafkis.esport.entity.RestorationApplicationHistory;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.RestorationApplicationMapper;
import kg.gov.gafkis.esport.repository.RestorationApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RestorationApplicationService {

    private final RestorationApplicationRepository restorationApplicationRepository;
    private final RestorationApplicationMapper restorationApplicationMapper;

    private static final DateTimeFormatter APP_NO_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd'-'HHmmssSSS");

    @Transactional(readOnly = true)
    public PagedResponse<RestorationAppListResponse> getAll(String search, String status, Pageable pageable) {
        Specification<RestorationApplication> spec = buildSpecification(search, status);
        Page<RestorationApplication> page = restorationApplicationRepository.findAll(spec, pageable);
        List<RestorationAppListResponse> content = restorationApplicationMapper.toListResponse(page.getContent());
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
    public RestorationAppResponse getById(Long id) {
        RestorationApplication app = restorationApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка на восстановление", "id", id));
        return restorationApplicationMapper.toResponse(app);
    }

    public RestorationAppResponse create(RestorationAppCreateRequest request) {
        String appNo = "RD-" + LocalDateTime.now().format(APP_NO_FORMATTER);
        LocalDate submitDate = LocalDate.now();
        int docsTotal = request.getDocsTotal() != null ? request.getDocsTotal() : 2;

        RestorationApplication app = RestorationApplication.builder()
                .appNo(appNo)
                .applicantName(request.getApplicantName())
                .inn(request.getInn())
                .phone(request.getPhone())
                .email(request.getEmail())
                .docType(request.getDocType())
                .reason(request.getReason())
                .oldNumber(request.getOldNumber())
                .issueDate(request.getIssueDate())
                .status(RestorationWorkflow.SUBMITTED)
                .docsUploaded(0)
                .docsTotal(docsTotal)
                .submitDate(submitDate)
                .deadline(AwardApplicationService.addWorkingDays(submitDate, RestorationWorkflow.TERM_DAYS))
                .build();

        app.getHistory().add(RestorationApplicationHistory.builder()
                .restorationApplication(app)
                .action("Заявка создана")
                .userName("system")
                .build());

        app = restorationApplicationRepository.save(app);
        log.info("Создана заявка на восстановление документа: {} (id={})", appNo, app.getId());
        return restorationApplicationMapper.toResponse(app);
    }

    public RestorationAppResponse changeStatus(Long id, StatusChangeRequest request) {
        RestorationApplication app = restorationApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка на восстановление", "id", id));

        String currentStatus = app.getStatus();
        String newStatus = request.getStatus();

        if (!RestorationWorkflow.nextStatuses(currentStatus).contains(newStatus)) {
            throw new BadRequestException(
                    String.format("Недопустимый переход статуса: '%s' -> '%s'", currentStatus, newStatus));
        }

        if (RestorationWorkflow.REJECTED.equals(newStatus)) {
            if (request.getReason() == null || request.getReason().isBlank()) {
                throw new BadRequestException("Причина отказа обязательна");
            }
            app.setRejectReason(request.getReason());
        }

        app.setStatus(newStatus);

        // Выдан дубликат: генерируем номер дубликата, помечаем старый документ недействительным
        if (RestorationWorkflow.DUPLICATE_ISSUED.equals(newStatus) && app.getDupNumber() == null) {
            int year = Year.now().getValue();
            long count = restorationApplicationRepository.countByDupNumberNotNull();
            app.setDupNumber(String.format("ДУБ-КР-%d-%04d", year, count + 1));
            app.setOldInvalidated(true);
            app.getHistory().add(RestorationApplicationHistory.builder()
                    .restorationApplication(app)
                    .action("Выдан дубликат " + app.getDupNumber()
                            + (app.getOldNumber() != null ? "; документ " + app.getOldNumber() + " признан недействительным" : ""))
                    .userName("system")
                    .build());
            log.info("Заявка {}: выдан дубликат {} (старый {} недействителен)", app.getAppNo(), app.getDupNumber(), app.getOldNumber());
        }

        app.getHistory().add(RestorationApplicationHistory.builder()
                .restorationApplication(app)
                .action("Статус изменён: " + currentStatus + " -> " + newStatus)
                .userName("system")
                .build());

        app = restorationApplicationRepository.save(app);
        log.info("Изменён статус заявки на восстановление {} на '{}' (id={})", app.getAppNo(), newStatus, app.getId());
        return restorationApplicationMapper.toResponse(app);
    }

    private Specification<RestorationApplication> buildSpecification(String search, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("applicantName")), pattern),
                        cb.like(cb.lower(root.get("appNo")), pattern)
                ));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
