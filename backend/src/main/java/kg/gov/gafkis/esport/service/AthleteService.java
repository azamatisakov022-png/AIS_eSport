package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.AthleteCreateRequest;
import kg.gov.gafkis.esport.dto.request.AthleteUpdateRequest;
import kg.gov.gafkis.esport.dto.request.MedalRequest;
import kg.gov.gafkis.esport.dto.response.AthleteListResponse;
import kg.gov.gafkis.esport.dto.response.AthleteResponse;
import kg.gov.gafkis.esport.dto.response.MedalResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.entity.Athlete;
import kg.gov.gafkis.esport.entity.AthleteMedal;
import kg.gov.gafkis.esport.entity.Coach;
import kg.gov.gafkis.esport.entity.Organization;
import kg.gov.gafkis.esport.entity.Team;
import kg.gov.gafkis.esport.entity.enums.AthleteLifecycleStatus;
import kg.gov.gafkis.esport.entity.enums.AthleteVerificationStatus;
import kg.gov.gafkis.esport.entity.enums.Sex;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.AthleteMapper;
import kg.gov.gafkis.esport.repository.AthleteMedalRepository;
import kg.gov.gafkis.esport.repository.AthleteRepository;
import kg.gov.gafkis.esport.repository.CoachRepository;
import kg.gov.gafkis.esport.repository.OrganizationRepository;
import kg.gov.gafkis.esport.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AthleteService {

    private final AthleteRepository athleteRepository;
    private final AthleteMedalRepository athleteMedalRepository;
    private final CoachRepository coachRepository;
    private final OrganizationRepository organizationRepository;
    private final TeamRepository teamRepository;
    private final AthleteMapper athleteMapper;

    @Transactional(readOnly = true)
    public PagedResponse<AthleteListResponse> getAll(String search, String sport, String rank,
                                                      String region, String medStatus,
                                                      String verificationStatus, Pageable pageable) {
        Specification<Athlete> spec = buildSpecification(search, sport, rank, region, medStatus, verificationStatus);
        Page<Athlete> page = athleteRepository.findAll(spec, pageable);
        List<AthleteListResponse> content = athleteMapper.toListResponse(page.getContent());

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
    public AthleteResponse getById(Long id) {
        Athlete athlete = athleteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Спортсмен", "id", id));
        return athleteMapper.toResponse(athlete);
    }

    public AthleteResponse create(AthleteCreateRequest request) {
        Athlete athlete = Athlete.builder()
                .fullName(request.getFullName())
                .birthDate(request.getBirthDate())
                .sex(parseSex(request.getSex()))
                .phone(request.getPhone())
                .email(request.getEmail())
                .region(request.getRegion())
                .sport(request.getSport())
                .rank(request.getRank())
                .coachName(request.getCoachName())
                .medExpDate(request.getMedExpDate())
                .medIssuedDate(request.getMedIssuedDate())
                .medIssuedBy(request.getMedIssuedBy())
                .insExpDate(request.getInsExpDate())
                .isArchived(false)
                .build();

        resolveReferences(athlete, request.getCoachId(), request.getOrganizationId(), request.getTeamId());

        athlete = athleteRepository.save(athlete);
        log.info("Создан спортсмен: {} (id={})", athlete.getFullName(), athlete.getId());
        return athleteMapper.toResponse(athlete);
    }

    public AthleteResponse update(Long id, AthleteUpdateRequest request) {
        Athlete athlete = athleteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Спортсмен", "id", id));

        if (request.getFullName() != null) {
            athlete.setFullName(request.getFullName());
        }
        if (request.getBirthDate() != null) {
            athlete.setBirthDate(request.getBirthDate());
        }
        if (request.getSex() != null) {
            athlete.setSex(parseSex(request.getSex()));
        }
        if (request.getPhone() != null) {
            athlete.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            athlete.setEmail(request.getEmail());
        }
        if (request.getRegion() != null) {
            athlete.setRegion(request.getRegion());
        }
        if (request.getSport() != null) {
            athlete.setSport(request.getSport());
        }
        if (request.getRank() != null) {
            athlete.setRank(request.getRank());
        }
        if (request.getCoachName() != null) {
            athlete.setCoachName(request.getCoachName());
        }
        if (request.getMedExpDate() != null) {
            athlete.setMedExpDate(request.getMedExpDate());
        }
        if (request.getMedIssuedDate() != null) {
            athlete.setMedIssuedDate(request.getMedIssuedDate());
        }
        if (request.getMedIssuedBy() != null) {
            athlete.setMedIssuedBy(request.getMedIssuedBy());
        }
        if (request.getInsExpDate() != null) {
            athlete.setInsExpDate(request.getInsExpDate());
        }

        if (request.getCoachId() != null) {
            Coach coach = coachRepository.findById(request.getCoachId())
                    .orElseThrow(() -> new ResourceNotFoundException("Тренер", "id", request.getCoachId()));
            athlete.setCoach(coach);
        }
        if (request.getOrganizationId() != null) {
            Organization org = organizationRepository.findById(request.getOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Организация", "id", request.getOrganizationId()));
            athlete.setOrganization(org);
        }
        if (request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Команда", "id", request.getTeamId()));
            athlete.setTeam(team);
        }

        athlete = athleteRepository.save(athlete);
        log.info("Обновлен спортсмен: {} (id={})", athlete.getFullName(), athlete.getId());
        return athleteMapper.toResponse(athlete);
    }

    public void archive(Long id) {
        Athlete athlete = athleteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Спортсмен", "id", id));
        athlete.setArchived(true);
        athleteRepository.save(athlete);
        log.info("Архивирован спортсмен: {} (id={})", athlete.getFullName(), athlete.getId());
    }

    // ─── Верификация записи ──────────────────────────────────────────────

    public AthleteResponse submitForReview(Long id) {
        Athlete a = getEntity(id);
        if (a.getVerificationStatus() != AthleteVerificationStatus.DRAFT
                && a.getVerificationStatus() != AthleteVerificationStatus.REJECTED) {
            throw new BadRequestException("На проверку можно отправить только запись в статусе «Черновик» или «Отклонено»");
        }
        a.setVerificationStatus(AthleteVerificationStatus.IN_REVIEW);
        a.setStatusNote(null);
        log.info("Спортсмен {} (id={}) отправлен на проверку", a.getFullName(), id);
        return athleteMapper.toResponse(athleteRepository.save(a));
    }

    public AthleteResponse verify(Long id) {
        Athlete a = getEntity(id);
        if (a.getVerificationStatus() != AthleteVerificationStatus.IN_REVIEW) {
            throw new BadRequestException("Подтвердить можно только запись в статусе «На проверке»");
        }
        a.setVerificationStatus(AthleteVerificationStatus.VERIFIED);
        a.setStatusNote(null);
        log.info("Спортсмен {} (id={}) подтверждён", a.getFullName(), id);
        return athleteMapper.toResponse(athleteRepository.save(a));
    }

    public AthleteResponse reject(Long id, String reason) {
        Athlete a = getEntity(id);
        if (a.getVerificationStatus() != AthleteVerificationStatus.IN_REVIEW) {
            throw new BadRequestException("Отклонить можно только запись в статусе «На проверке»");
        }
        a.setVerificationStatus(AthleteVerificationStatus.REJECTED);
        a.setStatusNote(reason);
        log.info("Спортсмен {} (id={}) отклонён: {}", a.getFullName(), id, reason);
        return athleteMapper.toResponse(athleteRepository.save(a));
    }

    // ─── Жизненный цикл ──────────────────────────────────────────────────

    public AthleteResponse changeLifecycle(Long id, String statusStr, String reason) {
        Athlete a = getEntity(id);
        AthleteLifecycleStatus newStatus;
        try {
            newStatus = AthleteLifecycleStatus.valueOf(statusStr.trim().toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Неизвестный статус жизненного цикла: " + statusStr);
        }
        a.setLifecycleStatus(newStatus);
        a.setStatusNote(reason);
        log.info("Спортсмен {} (id={}): жизненный цикл -> {} ({})", a.getFullName(), id, newStatus, reason);
        return athleteMapper.toResponse(athleteRepository.save(a));
    }

    private Athlete getEntity(Long id) {
        return athleteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Спортсмен", "id", id));
    }

    public MedalResponse addMedal(Long athleteId, MedalRequest request) {
        Athlete athlete = athleteRepository.findById(athleteId)
                .orElseThrow(() -> new ResourceNotFoundException("Спортсмен", "id", athleteId));

        AthleteMedal medal = AthleteMedal.builder()
                .athlete(athlete)
                .medalType(request.getMedalType())
                .eventName(request.getEventName())
                .year(request.getYear())
                .country(request.getCountry())
                .build();

        medal = athleteMedalRepository.save(medal);
        log.info("Добавлена медаль {} спортсмену {} (id={})", request.getMedalType(), athlete.getFullName(), athleteId);
        return athleteMapper.toMedalResponse(medal);
    }

    @Transactional(readOnly = true)
    public long count() {
        return athleteRepository.countByIsArchivedFalse();
    }

    private void resolveReferences(Athlete athlete, Long coachId, Long organizationId, Long teamId) {
        if (coachId != null) {
            Coach coach = coachRepository.findById(coachId)
                    .orElseThrow(() -> new ResourceNotFoundException("Тренер", "id", coachId));
            athlete.setCoach(coach);
        }
        if (organizationId != null) {
            Organization org = organizationRepository.findById(organizationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Организация", "id", organizationId));
            athlete.setOrganization(org);
        }
        if (teamId != null) {
            Team team = teamRepository.findById(teamId)
                    .orElseThrow(() -> new ResourceNotFoundException("Команда", "id", teamId));
            athlete.setTeam(team);
        }
    }

    private Sex parseSex(String sexStr) {
        if (sexStr == null) {
            return null;
        }
        try {
            return Sex.valueOf(sexStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Try matching by label
            for (Sex sex : Sex.values()) {
                if (sex.getLabel().equalsIgnoreCase(sexStr)) {
                    return sex;
                }
            }
            return null;
        }
    }

    private Specification<Athlete> buildSpecification(String search, String sport, String rank,
                                                       String region, String medStatus, String verificationStatus) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only non-archived athletes
            predicates.add(cb.equal(root.get("isArchived"), false));

            // Filter by verification status (DRAFT / IN_REVIEW / VERIFIED / REJECTED)
            if (verificationStatus != null && !verificationStatus.isBlank()) {
                try {
                    predicates.add(cb.equal(root.get("verificationStatus"),
                            AthleteVerificationStatus.valueOf(verificationStatus.trim().toUpperCase())));
                } catch (IllegalArgumentException ignored) {
                    // неизвестный статус - фильтр не применяем
                }
            }

            // Search by fullName (case-insensitive LIKE)
            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("fullName")),
                        "%" + search.trim().toLowerCase() + "%"));
            }

            // Exact match filters
            if (sport != null && !sport.isBlank()) {
                predicates.add(cb.equal(root.get("sport"), sport));
            }
            if (rank != null && !rank.isBlank()) {
                predicates.add(cb.equal(root.get("rank"), rank));
            }
            if (region != null && !region.isBlank()) {
                predicates.add(cb.equal(root.get("region"), region));
            }

            // Medical status filter based on medExpDate
            if (medStatus != null && !medStatus.isBlank()) {
                LocalDate today = LocalDate.now();
                LocalDate thirtyDaysFromNow = today.plusDays(30);

                switch (medStatus.toLowerCase()) {
                    case "valid" -> {
                        // medExpDate is after today + 30 days
                        predicates.add(cb.greaterThan(root.get("medExpDate"), thirtyDaysFromNow));
                    }
                    case "expiring" -> {
                        // medExpDate is after today but not after today + 30 days
                        predicates.add(cb.greaterThan(root.get("medExpDate"), today));
                        predicates.add(cb.lessThanOrEqualTo(root.get("medExpDate"), thirtyDaysFromNow));
                    }
                    case "expired" -> {
                        // medExpDate is today or before
                        predicates.add(cb.lessThanOrEqualTo(root.get("medExpDate"), today));
                    }
                    default -> {
                        // Unknown status, no filter
                    }
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
