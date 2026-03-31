package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.request.TrainerApplicationCreateRequest;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.TrainerApplicationListResponse;
import kg.gov.gafkis.esport.dto.response.TrainerApplicationResponse;
import kg.gov.gafkis.esport.entity.TrainerApplication;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.TrainerApplicationMapper;
import kg.gov.gafkis.esport.repository.TrainerApplicationRepository;
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
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TrainerApplicationService {

    private final TrainerApplicationRepository trainerApplicationRepository;
    private final TrainerApplicationMapper trainerApplicationMapper;

    private static final DateTimeFormatter APP_NO_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd'-'HHmmss");

    /**
     * Valid status transitions: from -> allowed targets.
     */
    private static final Map<String, Set<String>> STATUS_TRANSITIONS = Map.of(
            "submitted", Set.of("under_review", "rejected", "withdrawn"),
            "under_review", Set.of("approved", "rejected", "revision"),
            "revision", Set.of("under_review", "withdrawn"),
            "approved", Set.of("registered"),
            "rejected", Set.of("submitted"),
            "withdrawn", Set.of("submitted")
    );

    @Transactional(readOnly = true)
    public PagedResponse<TrainerApplicationListResponse> getAll(String search, String status, Pageable pageable) {
        Specification<TrainerApplication> spec = buildSpecification(search, status);
        Page<TrainerApplication> page = trainerApplicationRepository.findAll(spec, pageable);
        List<TrainerApplicationListResponse> content = trainerApplicationMapper.toListResponse(page.getContent());

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
    public TrainerApplicationResponse getById(Long id) {
        TrainerApplication app = trainerApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка тренера", "id", id));
        return trainerApplicationMapper.toResponse(app);
    }

    public TrainerApplicationResponse create(TrainerApplicationCreateRequest request) {
        String appNo = "TR-" + LocalDateTime.now().format(APP_NO_FORMATTER);
        LocalDate submitDate = LocalDate.now();
        LocalDate deadline = AwardApplicationService.addWorkingDays(submitDate, 15);

        TrainerApplication app = TrainerApplication.builder()
                .appNo(appNo)
                .applicantName(request.getApplicantName())
                .birthDate(request.getBirthDate())
                .phone(request.getPhone())
                .email(request.getEmail())
                .sport(request.getSport())
                .submitDate(submitDate)
                .status("submitted")
                .docsUploaded(0)
                .docsTotal(5)
                .tundukVerified(false)
                .deadline(deadline)
                .build();

        app = trainerApplicationRepository.save(app);
        log.info("Создана заявка тренера: {} (id={})", appNo, app.getId());
        return trainerApplicationMapper.toResponse(app);
    }

    public TrainerApplicationResponse changeStatus(Long id, StatusChangeRequest request) {
        TrainerApplication app = trainerApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка тренера", "id", id));

        String currentStatus = app.getStatus();
        String newStatus = request.getStatus();

        Set<String> allowed = STATUS_TRANSITIONS.get(currentStatus);
        if (allowed == null || !allowed.contains(newStatus)) {
            throw new BadRequestException(
                    String.format("Недопустимый переход статуса: '%s' -> '%s'", currentStatus, newStatus));
        }

        app.setStatus(newStatus);
        app = trainerApplicationRepository.save(app);
        log.info("Изменён статус заявки тренера {} на '{}' (id={})", app.getAppNo(), newStatus, app.getId());
        return trainerApplicationMapper.toResponse(app);
    }

    /**
     * Register a trainer application: set status to "registered" and generate certificate number.
     * Certificate number format: СВ-КР-{year}-{5-digit sequential number}
     */
    public TrainerApplicationResponse register(Long id) {
        TrainerApplication app = trainerApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка тренера", "id", id));

        if (!"approved".equals(app.getStatus())) {
            throw new BadRequestException("Регистрация возможна только для одобренных заявок (статус 'approved')");
        }

        app.setStatus("registered");

        // Generate certificate number: СВ-КР-{year}-{5-digit}
        int year = Year.now().getValue();
        long count = trainerApplicationRepository.countByStatus("registered");
        String certNumber = String.format("СВ-КР-%d-%05d", year, count + 1);
        app.setCertNumber(certNumber);

        app = trainerApplicationRepository.save(app);
        log.info("Зарегистрирована заявка тренера: {} cert={} (id={})", app.getAppNo(), certNumber, app.getId());
        return trainerApplicationMapper.toResponse(app);
    }

    private Specification<TrainerApplication> buildSpecification(String search, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate namePredicate = cb.like(cb.lower(root.get("applicantName")), pattern);
                Predicate appNoPredicate = cb.like(cb.lower(root.get("appNo")), pattern);
                predicates.add(cb.or(namePredicate, appNoPredicate));
            }

            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
