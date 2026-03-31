package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.AwardApplicationCreateRequest;
import kg.gov.gafkis.esport.dto.request.DeprivationRequest;
import kg.gov.gafkis.esport.dto.request.RestorationRequest;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.response.AwardApplicationListResponse;
import kg.gov.gafkis.esport.dto.response.AwardApplicationResponse;
import kg.gov.gafkis.esport.dto.response.DeprivationResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.RestorationResponse;
import kg.gov.gafkis.esport.entity.Athlete;
import kg.gov.gafkis.esport.entity.AwardApplication;
import kg.gov.gafkis.esport.entity.AwardApplicationHistory;
import kg.gov.gafkis.esport.entity.AwardDeprivation;
import kg.gov.gafkis.esport.entity.AwardRestoration;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.AwardApplicationMapper;
import kg.gov.gafkis.esport.repository.AthleteRepository;
import kg.gov.gafkis.esport.repository.AwardApplicationRepository;
import kg.gov.gafkis.esport.repository.AwardDeprivationRepository;
import kg.gov.gafkis.esport.repository.AwardRestorationRepository;
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
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AwardApplicationService {

    private final AwardApplicationRepository awardApplicationRepository;
    private final AwardDeprivationRepository awardDeprivationRepository;
    private final AwardRestorationRepository awardRestorationRepository;
    private final AthleteRepository athleteRepository;
    private final AwardApplicationMapper awardApplicationMapper;

    private static final DateTimeFormatter APP_NO_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd'-'HHmmss");

    /**
     * Valid status transitions: from -> allowed targets.
     */
    private static final Map<String, Set<String>> STATUS_TRANSITIONS = Map.of(
            "Подана", Set.of("На рассмотрении", "Отклонена", "Отозвана"),
            "На рассмотрении", Set.of("Одобрена", "Отклонена", "На доработке"),
            "На доработке", Set.of("На рассмотрении", "Отозвана"),
            "Одобрена", Set.of("Награждена"),
            "Отклонена", Set.of("Подана"),
            "Отозвана", Set.of("Подана")
    );

    // ======================== Award Applications ========================

    @Transactional(readOnly = true)
    public PagedResponse<AwardApplicationListResponse> getAll(String search, String group, String status,
                                                               Pageable pageable) {
        Specification<AwardApplication> spec = buildSpecification(search, group, status);
        Page<AwardApplication> page = awardApplicationRepository.findAll(spec, pageable);
        List<AwardApplicationListResponse> content = awardApplicationMapper.toListResponse(page.getContent());

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
    public AwardApplicationResponse getById(Long id) {
        AwardApplication app = awardApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка на награду", "id", id));
        return awardApplicationMapper.toResponse(app);
    }

    public AwardApplicationResponse create(AwardApplicationCreateRequest request) {
        String appNo = "AW-" + LocalDateTime.now().format(APP_NO_FORMATTER);

        String awardGroup = computeAwardGroup(request.getAward());
        LocalDate submitDate = LocalDate.now();
        int workingDays = getWorkingDaysForGroup(awardGroup);
        LocalDate deadline = addWorkingDays(submitDate, workingDays);
        int docsTotal = request.getDocsTotal() != null ? request.getDocsTotal() : getDefaultDocsTotal(awardGroup);

        AwardApplication app = AwardApplication.builder()
                .appNo(appNo)
                .applicantName(request.getApplicantName())
                .award(request.getAward())
                .sport(request.getSport())
                .submitDate(submitDate)
                .status("Подана")
                .docsUploaded(0)
                .docsTotal(docsTotal)
                .awardGroup(awardGroup)
                .deadline(deadline)
                .build();

        if (request.getAthleteId() != null) {
            Athlete athlete = athleteRepository.findById(request.getAthleteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Спортсмен", "id", request.getAthleteId()));
            app.setAthlete(athlete);
        }

        // Add initial history record
        AwardApplicationHistory historyEntry = AwardApplicationHistory.builder()
                .awardApplication(app)
                .action("Заявка создана")
                .userName("system")
                .build();
        app.getHistory().add(historyEntry);

        app = awardApplicationRepository.save(app);
        log.info("Создана заявка на награду: {} (id={})", appNo, app.getId());
        return awardApplicationMapper.toResponse(app);
    }

    public AwardApplicationResponse changeStatus(Long id, StatusChangeRequest request) {
        AwardApplication app = awardApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка на награду", "id", id));

        String currentStatus = app.getStatus();
        String newStatus = request.getStatus();

        // Validate transition
        Set<String> allowed = STATUS_TRANSITIONS.get(currentStatus);
        if (allowed == null || !allowed.contains(newStatus)) {
            throw new BadRequestException(
                    String.format("Недопустимый переход статуса: '%s' -> '%s'", currentStatus, newStatus));
        }

        // If rejecting, reason is required
        if ("Отклонена".equals(newStatus)) {
            if (request.getReason() == null || request.getReason().isBlank()) {
                throw new BadRequestException("Причина отклонения обязательна");
            }
            app.setRejectReason(request.getReason());
        }

        app.setStatus(newStatus);

        // Add history record
        AwardApplicationHistory historyEntry = AwardApplicationHistory.builder()
                .awardApplication(app)
                .action("Статус изменён: " + currentStatus + " -> " + newStatus)
                .userName("system")
                .build();
        app.getHistory().add(historyEntry);

        app = awardApplicationRepository.save(app);
        log.info("Изменён статус заявки {} на '{}' (id={})", app.getAppNo(), newStatus, app.getId());
        return awardApplicationMapper.toResponse(app);
    }

    // ======================== Deprivations ========================

    @Transactional(readOnly = true)
    public List<DeprivationResponse> getDeprivations() {
        List<AwardDeprivation> deprivations = awardDeprivationRepository.findAll();
        return awardApplicationMapper.toDeprivationResponseList(deprivations);
    }

    public DeprivationResponse createDeprivation(DeprivationRequest request) {
        AwardDeprivation dep = AwardDeprivation.builder()
                .name(request.getName())
                .award(request.getAward())
                .sport(request.getSport())
                .reason(request.getReason())
                .initiatedDate(LocalDate.now())
                .appealDeadline(addWorkingDays(LocalDate.now(), 30))
                .status("На рассмотрении")
                .build();

        if (request.getAthleteId() != null) {
            Athlete athlete = athleteRepository.findById(request.getAthleteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Спортсмен", "id", request.getAthleteId()));
            dep.setAthlete(athlete);
        }

        dep = awardDeprivationRepository.save(dep);
        log.info("Создано лишение награды: {} (id={})", dep.getName(), dep.getId());
        return awardApplicationMapper.toDeprivationResponse(dep);
    }

    // ======================== Restorations ========================

    @Transactional(readOnly = true)
    public List<RestorationResponse> getRestorations() {
        List<AwardRestoration> restorations = awardRestorationRepository.findAll();
        return awardApplicationMapper.toRestorationResponseList(restorations);
    }

    public RestorationResponse createRestoration(RestorationRequest request) {
        LocalDate submitDate = LocalDate.now();
        AwardRestoration rest = AwardRestoration.builder()
                .name(request.getName())
                .award(request.getAward())
                .sport(request.getSport())
                .submitDate(submitDate)
                .deadline(addWorkingDays(submitDate, 30))
                .status("На рассмотрении")
                .build();

        if (request.getAthleteId() != null) {
            Athlete athlete = athleteRepository.findById(request.getAthleteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Спортсмен", "id", request.getAthleteId()));
            rest.setAthlete(athlete);
        }

        rest = awardRestorationRepository.save(rest);
        log.info("Создано восстановление награды: {} (id={})", rest.getName(), rest.getId());
        return awardApplicationMapper.toRestorationResponse(rest);
    }

    // ======================== Working Days Calculator ========================

    /**
     * Adds the specified number of working days to the given start date,
     * skipping weekends (Saturday and Sunday).
     */
    static LocalDate addWorkingDays(LocalDate startDate, int workingDays) {
        if (workingDays <= 0) {
            return startDate;
        }

        LocalDate result = startDate;
        int addedDays = 0;

        while (addedDays < workingDays) {
            result = result.plusDays(1);
            DayOfWeek dayOfWeek = result.getDayOfWeek();
            if (dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY) {
                addedDays++;
            }
        }

        return result;
    }

    // ======================== Helper Methods ========================

    /**
     * Computes the award group based on the award title:
     * - Group A: ЗМС КР, МСМК
     * - Group B: МС КР, КМС
     * - Group C: all others
     */
    private String computeAwardGroup(String award) {
        if (award == null) {
            return "C";
        }
        String upper = award.toUpperCase().trim();
        if (upper.contains("ЗМС") || upper.contains("МСМК")) {
            return "A";
        }
        if (upper.contains("МС КР") || upper.contains("КМС")) {
            return "B";
        }
        return "C";
    }

    /**
     * Returns the number of working days for the deadline based on the award group:
     * - A = 30 working days
     * - B = 20 working days
     * - C = 15 working days
     */
    private int getWorkingDaysForGroup(String group) {
        return switch (group) {
            case "A" -> 30;
            case "B" -> 20;
            default -> 15;
        };
    }

    /**
     * Returns default docsTotal for each award group.
     */
    private int getDefaultDocsTotal(String group) {
        return switch (group) {
            case "A" -> 10;
            case "B" -> 8;
            default -> 5;
        };
    }

    private Specification<AwardApplication> buildSpecification(String search, String group, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate namePredicate = cb.like(cb.lower(root.get("applicantName")), pattern);
                Predicate appNoPredicate = cb.like(cb.lower(root.get("appNo")), pattern);
                predicates.add(cb.or(namePredicate, appNoPredicate));
            }

            if (group != null && !group.isBlank()) {
                predicates.add(cb.equal(root.get("awardGroup"), group));
            }

            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
