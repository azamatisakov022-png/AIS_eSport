package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.ProtocolCreateRequest;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.ProtocolListResponse;
import kg.gov.gafkis.esport.dto.response.ProtocolResponse;
import kg.gov.gafkis.esport.entity.ProtocolResult;
import kg.gov.gafkis.esport.entity.ProtocolSubmission;
import kg.gov.gafkis.esport.entity.ProtocolSubmissionHistory;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.ProtocolSubmissionMapper;
import kg.gov.gafkis.esport.repository.ProtocolSubmissionRepository;
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
public class ProtocolSubmissionService {

    private final ProtocolSubmissionRepository protocolSubmissionRepository;
    private final ProtocolSubmissionMapper protocolSubmissionMapper;

    private static final DateTimeFormatter APP_NO_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd'-'HHmmssSSS");

    @Transactional(readOnly = true)
    public PagedResponse<ProtocolListResponse> getAll(String search, String status, Pageable pageable) {
        Specification<ProtocolSubmission> spec = buildSpecification(search, status);
        Page<ProtocolSubmission> page = protocolSubmissionRepository.findAll(spec, pageable);
        List<ProtocolListResponse> content = protocolSubmissionMapper.toListResponse(page.getContent());
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
    public ProtocolResponse getById(Long id) {
        ProtocolSubmission app = protocolSubmissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Протокол соревнования", "id", id));
        return protocolSubmissionMapper.toResponse(app);
    }

    public ProtocolResponse create(ProtocolCreateRequest request) {
        String appNo = "PR-" + LocalDateTime.now().format(APP_NO_FORMATTER);
        LocalDate submitDate = LocalDate.now();

        ProtocolSubmission app = ProtocolSubmission.builder()
                .appNo(appNo)
                .federationName(request.getFederationName())
                .sport(request.getSport())
                .eventName(request.getEventName())
                .eventDate(request.getEventDate())
                .level(request.getLevel())
                .city(request.getCity())
                .phone(request.getPhone())
                .email(request.getEmail())
                .status(ProtocolWorkflow.SUBMITTED)
                .submitDate(submitDate)
                .deadline(AwardApplicationService.addWorkingDays(submitDate, ProtocolWorkflow.TERM_DAYS))
                .build();

        if (request.getResults() != null) {
            final ProtocolSubmission ref = app;
            request.getResults().stream()
                    .filter(r -> r.getAthleteName() != null && !r.getAthleteName().isBlank())
                    .forEach(r -> ref.getResults().add(ProtocolResult.builder()
                            .protocolSubmission(ref)
                            .athleteName(r.getAthleteName())
                            .discipline(r.getDiscipline())
                            .place(r.getPlace())
                            .medalType(r.getMedalType())
                            .build()));
        }

        app.getHistory().add(history(app, "Протокол загружен федерацией (" + app.getResults().size() + " результатов)"));

        app = protocolSubmissionRepository.save(app);
        log.info("Создан протокол соревнования: {} (id={}, результатов={})", appNo, app.getId(), app.getResults().size());
        return protocolSubmissionMapper.toResponse(app);
    }

    public ProtocolResponse changeStatus(Long id, StatusChangeRequest request) {
        ProtocolSubmission app = protocolSubmissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Протокол соревнования", "id", id));

        String currentStatus = app.getStatus();
        String newStatus = request.getStatus();

        if (!ProtocolWorkflow.nextStatuses(currentStatus).contains(newStatus)) {
            throw new BadRequestException(
                    String.format("Недопустимый переход статуса: '%s' -> '%s'", currentStatus, newStatus));
        }

        if (ProtocolWorkflow.REJECTED.equals(newStatus)) {
            if (request.getReason() == null || request.getReason().isBlank()) {
                throw new BadRequestException("Причина отклонения обязательна");
            }
            app.setRejectReason(request.getReason());
        }

        app.setStatus(newStatus);

        if (ProtocolWorkflow.PUBLISHED.equals(newStatus)) {
            app.getHistory().add(history(app, "Протокол опубликован, результаты соревнования официальны"));
        }
        app.getHistory().add(history(app, "Статус изменён: " + currentStatus + " -> " + newStatus));

        app = protocolSubmissionRepository.save(app);
        log.info("Изменён статус протокола {} на '{}' (id={})", app.getAppNo(), newStatus, app.getId());
        return protocolSubmissionMapper.toResponse(app);
    }

    private ProtocolSubmissionHistory history(ProtocolSubmission app, String action) {
        return ProtocolSubmissionHistory.builder()
                .protocolSubmission(app)
                .action(action)
                .userName("system")
                .build();
    }

    private Specification<ProtocolSubmission> buildSpecification(String search, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("federationName")), pattern),
                        cb.like(cb.lower(root.get("eventName")), pattern),
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
