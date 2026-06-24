package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.request.TransferAppCreateRequest;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.TransferAppListResponse;
import kg.gov.gafkis.esport.dto.response.TransferAppResponse;
import kg.gov.gafkis.esport.entity.TransferApplication;
import kg.gov.gafkis.esport.entity.TransferApplicationHistory;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.TransferApplicationMapper;
import kg.gov.gafkis.esport.repository.AthleteRepository;
import kg.gov.gafkis.esport.repository.TransferApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TransferApplicationService {

    private final TransferApplicationRepository transferApplicationRepository;
    private final TransferApplicationMapper transferApplicationMapper;
    private final AthleteRepository athleteRepository;

    private static final DateTimeFormatter APP_NO_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd'-'HHmmssSSS");

    @Transactional(readOnly = true)
    public PagedResponse<TransferAppListResponse> getAll(String search, String status, Pageable pageable) {
        Specification<TransferApplication> spec = buildSpecification(search, status);
        Page<TransferApplication> page = transferApplicationRepository.findAll(spec, pageable);
        List<TransferAppListResponse> content = transferApplicationMapper.toListResponse(page.getContent());
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
    public TransferAppResponse getById(Long id) {
        TransferApplication app = transferApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка на переход", "id", id));
        return transferApplicationMapper.toResponse(app);
    }

    public TransferAppResponse create(TransferAppCreateRequest request) {
        String appNo = "TF-" + LocalDateTime.now().format(APP_NO_FORMATTER);
        LocalDate submitDate = LocalDate.now();
        int docsTotal = request.getDocsTotal() != null ? request.getDocsTotal() : 3;

        TransferApplication app = TransferApplication.builder()
                .appNo(appNo)
                .athleteId(request.getAthleteId())
                .athleteName(request.getAthleteName())
                .sport(request.getSport())
                .oldClub(request.getOldClub())
                .newClub(request.getNewClub())
                .region(request.getRegion())
                .reason(request.getReason())
                .phone(request.getPhone())
                .email(request.getEmail())
                .status(TransferWorkflow.SUBMITTED)
                .docsUploaded(0)
                .docsTotal(docsTotal)
                .submitDate(submitDate)
                .deadline(AwardApplicationService.addWorkingDays(submitDate, TransferWorkflow.TERM_DAYS))
                .build();

        app.getHistory().add(history(app, "Заявка создана"));

        app = transferApplicationRepository.save(app);
        log.info("Создана заявка на переход спортсмена: {} (id={})", appNo, app.getId());
        return transferApplicationMapper.toResponse(app);
    }

    public TransferAppResponse changeStatus(Long id, StatusChangeRequest request) {
        TransferApplication app = transferApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка на переход", "id", id));

        String currentStatus = app.getStatus();
        String newStatus = request.getStatus();

        if (!TransferWorkflow.nextStatuses(currentStatus).contains(newStatus)) {
            throw new BadRequestException(
                    String.format("Недопустимый переход статуса: '%s' -> '%s'", currentStatus, newStatus));
        }

        if (TransferWorkflow.REJECTED.equals(newStatus)) {
            if (request.getReason() == null || request.getReason().isBlank()) {
                throw new BadRequestException("Причина отклонения обязательна");
            }
            app.setRejectReason(request.getReason());
        }

        app.setStatus(newStatus);

        // Переход оформлен — обновляем клуб спортсмена в реестре
        if (TransferWorkflow.COMPLETED.equals(newStatus) && app.getAthleteId() != null) {
            final TransferApplication ref = app;
            athleteRepository.findById(app.getAthleteId()).ifPresent(ath -> {
                ath.setClub(ref.getNewClub());
                athleteRepository.save(ath);
                ref.getHistory().add(history(ref,
                        "Спортсмен " + ath.getFullName() + " переведён в «" + ref.getNewClub() + "» (отражено в реестре)"));
                log.info("Спортсмену id={} обновлён клуб: {}", ath.getId(), ref.getNewClub());
            });
        }

        app.getHistory().add(history(app, "Статус изменён: " + currentStatus + " -> " + newStatus));

        app = transferApplicationRepository.save(app);
        log.info("Изменён статус заявки на переход {} на '{}' (id={})", app.getAppNo(), newStatus, app.getId());
        return transferApplicationMapper.toResponse(app);
    }

    private TransferApplicationHistory history(TransferApplication app, String action) {
        return TransferApplicationHistory.builder()
                .transferApplication(app)
                .action(action)
                .userName("system")
                .build();
    }

    private Specification<TransferApplication> buildSpecification(String search, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("athleteName")), pattern),
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
