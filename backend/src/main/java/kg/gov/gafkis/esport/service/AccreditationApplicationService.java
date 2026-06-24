package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.AccreditationAppCreateRequest;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.response.AccreditationAppListResponse;
import kg.gov.gafkis.esport.dto.response.AccreditationAppResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.entity.AccreditationApplication;
import kg.gov.gafkis.esport.entity.AccreditationApplicationHistory;
import kg.gov.gafkis.esport.entity.Organization;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.AccreditationApplicationMapper;
import kg.gov.gafkis.esport.repository.AccreditationApplicationRepository;
import kg.gov.gafkis.esport.repository.OrganizationRepository;
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
public class AccreditationApplicationService {

    private final AccreditationApplicationRepository accreditationApplicationRepository;
    private final AccreditationApplicationMapper accreditationApplicationMapper;
    private final ApplicantNotificationService applicantNotificationService;
    private final OrganizationRepository organizationRepository;

    private static final DateTimeFormatter APP_NO_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd'-'HHmmssSSS");

    @Transactional(readOnly = true)
    public PagedResponse<AccreditationAppListResponse> getAll(String search, String status, Pageable pageable) {
        Specification<AccreditationApplication> spec = buildSpecification(search, status);
        Page<AccreditationApplication> page = accreditationApplicationRepository.findAll(spec, pageable);
        List<AccreditationAppListResponse> content = accreditationApplicationMapper.toListResponse(page.getContent());
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
    public AccreditationAppResponse getById(Long id) {
        AccreditationApplication app = accreditationApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка на аккредитацию", "id", id));
        return accreditationApplicationMapper.toResponse(app);
    }

    public AccreditationAppResponse create(AccreditationAppCreateRequest request) {
        String appNo = "AC-" + LocalDateTime.now().format(APP_NO_FORMATTER);
        LocalDate submitDate = LocalDate.now();
        int docsTotal = request.getDocsTotal() != null ? request.getDocsTotal() : 6;

        AccreditationApplication app = AccreditationApplication.builder()
                .appNo(appNo)
                .federationName(request.getFederationName())
                .sport(request.getSport())
                .inn(request.getInn())
                .headName(request.getHeadName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .organizationId(request.getOrganizationId())
                .status(AccreditationWorkflow.SUBMITTED)
                .docsUploaded(0)
                .docsTotal(docsTotal)
                .submitDate(submitDate)
                .deadline(AwardApplicationService.addWorkingDays(submitDate, AccreditationWorkflow.TERM_DAYS))
                .build();

        app.getHistory().add(history(app, "Заявка создана"));

        app = accreditationApplicationRepository.save(app);
        log.info("Создана заявка на аккредитацию: {} (id={})", appNo, app.getId());
        return accreditationApplicationMapper.toResponse(app);
    }

    public AccreditationAppResponse changeStatus(Long id, StatusChangeRequest request) {
        AccreditationApplication app = accreditationApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка на аккредитацию", "id", id));

        String currentStatus = app.getStatus();
        String newStatus = request.getStatus();
        String reason = request.getReason();

        if (!AccreditationWorkflow.nextStatuses(currentStatus).contains(newStatus)) {
            throw new BadRequestException(
                    String.format("Недопустимый переход статуса: '%s' -> '%s'", currentStatus, newStatus));
        }

        // Причина обязательна при отказе, приостановке и отзыве аккредитации
        if (AccreditationWorkflow.REJECTED.equals(newStatus) || AccreditationWorkflow.SUSPENDED.equals(newStatus)
                || AccreditationWorkflow.REVOKED.equals(newStatus)) {
            if (reason == null || reason.isBlank()) {
                throw new BadRequestException("Причина обязательна для статуса «" + newStatus + "»");
            }
        }

        switch (newStatus) {
            case AccreditationWorkflow.ACCREDITED -> {
                if (app.getAccreditationNumber() == null) {
                    int year = Year.now().getValue();
                    long count = accreditationApplicationRepository.countByAccreditationNumberNotNull();
                    app.setAccreditationNumber(String.format("АКР-%d-%04d", year, count + 1));
                    app.setAccreditationEnd(LocalDate.now().plusYears(AccreditationWorkflow.VALIDITY_YEARS));
                    app.getHistory().add(history(app, "Аккредитация предоставлена, свидетельство " + app.getAccreditationNumber()));
                } else {
                    // возобновление после приостановки
                    app.getHistory().add(history(app, "Действие аккредитации возобновлено"));
                }
                app.setSuspensionReason(null);
                updateOrganization(app, AccreditationWorkflow.ACCREDITED);
            }
            case AccreditationWorkflow.SUSPENDED -> {
                app.setSuspensionReason(reason);
                app.getHistory().add(history(app, "Действие аккредитации приостановлено: " + reason));
                updateOrganization(app, AccreditationWorkflow.SUSPENDED);
            }
            case AccreditationWorkflow.REVOKED -> {
                app.setRejectReason(reason);
                app.getHistory().add(history(app, "Аккредитация отозвана: " + reason));
                updateOrganization(app, AccreditationWorkflow.REVOKED);
            }
            case AccreditationWorkflow.REJECTED -> app.setRejectReason(reason);
            default -> { /* без побочных эффектов */ }
        }

        app.setStatus(newStatus);
        app.getHistory().add(history(app, "Статус изменён: " + currentStatus + " -> " + newStatus));

        app = accreditationApplicationRepository.save(app);
        applicantNotificationService.notify(app.getEmail(), app.getFederationName(), "Аккредитация федерации", app.getAppNo(), newStatus);
        log.info("Изменён статус заявки на аккредитацию {} на '{}' (id={})", app.getAppNo(), newStatus, app.getId());
        return accreditationApplicationMapper.toResponse(app);
    }

    /** Отражение статуса аккредитации в реестре организаций (если федерация привязана). */
    private void updateOrganization(AccreditationApplication app, String accreditationStatus) {
        if (app.getOrganizationId() == null) {
            return;
        }
        organizationRepository.findById(app.getOrganizationId()).ifPresent(org -> {
            org.setAccreditation(accreditationStatus);
            organizationRepository.save(org);
            log.info("Организация id={} — аккредитация: {}", org.getId(), accreditationStatus);
        });
    }

    private AccreditationApplicationHistory history(AccreditationApplication app, String action) {
        return AccreditationApplicationHistory.builder()
                .accreditationApplication(app)
                .action(action)
                .userName("system")
                .build();
    }

    private Specification<AccreditationApplication> buildSpecification(String search, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("federationName")), pattern),
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
