package kg.gov.gafkis.esport.service;

import kg.gov.gafkis.esport.dto.request.CoachCreateRequest;
import kg.gov.gafkis.esport.dto.request.CoachUpdateRequest;
import kg.gov.gafkis.esport.dto.response.CoachListResponse;
import kg.gov.gafkis.esport.dto.response.CoachResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.entity.Coach;
import kg.gov.gafkis.esport.entity.Organization;
import kg.gov.gafkis.esport.entity.enums.Sex;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.CoachMapper;
import kg.gov.gafkis.esport.repository.CoachRepository;
import kg.gov.gafkis.esport.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CoachService {

    private final CoachRepository coachRepository;
    private final OrganizationRepository organizationRepository;
    private final CoachMapper coachMapper;

    @Transactional(readOnly = true)
    public PagedResponse<CoachListResponse> getAll(String search, String sport, String region,
                                                    String org, String status, Pageable pageable) {
        Specification<Coach> spec = buildSpecification(search, sport, region, org, status);
        Page<Coach> page = coachRepository.findAll(spec, pageable);

        List<CoachListResponse> content = coachMapper.toListResponse(page.getContent());

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
    public CoachResponse getById(Long id) {
        Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Тренер", "id", id));
        return coachMapper.toResponse(coach);
    }

    public CoachResponse create(CoachCreateRequest request) {
        Organization organization = null;
        if (request.getOrganizationId() != null) {
            organization = organizationRepository.findById(request.getOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Организация", "id", request.getOrganizationId()));
        }

        String certNumber = generateCertNumber(request.getRegDate());
        LocalDate endDate = request.getRegDate().plusYears(3);

        Coach coach = Coach.builder()
                .fullName(request.getFullName())
                .birthDate(request.getBirthDate())
                .sex(Sex.valueOf(request.getSex()))
                .phone(request.getPhone())
                .email(request.getEmail())
                .certNumber(certNumber)
                .regDate(request.getRegDate())
                .sport(request.getSport())
                .rank(request.getRank())
                .organization(organization)
                .employment(request.getEmployment())
                .region(request.getRegion())
                .endDate(endDate)
                .build();

        coach = coachRepository.save(coach);
        log.info("Создан тренер: {} с номером свидетельства {}", coach.getFullName(), certNumber);

        return coachMapper.toResponse(coach);
    }

    public CoachResponse update(Long id, CoachUpdateRequest request) {
        Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Тренер", "id", id));

        if (request.getFullName() != null) {
            coach.setFullName(request.getFullName());
        }
        if (request.getBirthDate() != null) {
            coach.setBirthDate(request.getBirthDate());
        }
        if (request.getSex() != null) {
            coach.setSex(Sex.valueOf(request.getSex()));
        }
        if (request.getPhone() != null) {
            coach.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            coach.setEmail(request.getEmail());
        }
        if (request.getRegDate() != null) {
            coach.setRegDate(request.getRegDate());
            coach.setEndDate(request.getRegDate().plusYears(3));
        }
        if (request.getSport() != null) {
            coach.setSport(request.getSport());
        }
        if (request.getRank() != null) {
            coach.setRank(request.getRank());
        }
        if (request.getOrganizationId() != null) {
            Organization organization = organizationRepository.findById(request.getOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Организация", "id", request.getOrganizationId()));
            coach.setOrganization(organization);
        }
        if (request.getEmployment() != null) {
            coach.setEmployment(request.getEmployment());
        }
        if (request.getRegion() != null) {
            coach.setRegion(request.getRegion());
        }

        coach = coachRepository.save(coach);
        log.info("Обновлён тренер: id={}", id);

        return coachMapper.toResponse(coach);
    }

    public void annul(Long id) {
        Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Тренер", "id", id));
        coach.setAnnulled(true);
        coachRepository.save(coach);
        log.info("Аннулирован тренер: id={}", id);
    }

    @Transactional(readOnly = true)
    public long count() {
        return coachRepository.countByIsArchivedFalseAndAnnulledFalse();
    }

    private String generateCertNumber(LocalDate regDate) {
        int year = regDate.getYear();
        String prefix = "СВ-КР-" + year + "-";

        long maxSeq = coachRepository.findAll().stream()
                .filter(c -> c.getCertNumber() != null && c.getCertNumber().startsWith(prefix))
                .map(c -> {
                    try {
                        String seqStr = c.getCertNumber().substring(prefix.length());
                        return Long.parseLong(seqStr);
                    } catch (NumberFormatException | IndexOutOfBoundsException e) {
                        return 0L;
                    }
                })
                .max(Long::compareTo)
                .orElse(0L);

        return prefix + String.format("%05d", maxSeq + 1);
    }

    private Specification<Coach> buildSpecification(String search, String sport, String region,
                                                     String org, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only non-archived
            predicates.add(cb.isFalse(root.get("isArchived")));

            // Search by fullName
            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("fullName")),
                        "%" + search.toLowerCase() + "%"));
            }

            // Filter by sport
            if (sport != null && !sport.isBlank()) {
                predicates.add(cb.equal(root.get("sport"), sport));
            }

            // Filter by region
            if (region != null && !region.isBlank()) {
                predicates.add(cb.equal(root.get("region"), region));
            }

            // Filter by organization name
            if (org != null && !org.isBlank()) {
                predicates.add(cb.like(cb.lower(root.join("organization").get("name")),
                        "%" + org.toLowerCase() + "%"));
            }

            // Filter by status
            if (status != null && !status.isBlank()) {
                switch (status) {
                    case "annulled" -> predicates.add(cb.isTrue(root.get("annulled")));
                    case "expiring" -> {
                        predicates.add(cb.isFalse(root.get("annulled")));
                        predicates.add(cb.lessThan(root.get("endDate"),
                                LocalDate.now().plusDays(90)));
                        predicates.add(cb.greaterThanOrEqualTo(root.get("endDate"),
                                LocalDate.now()));
                    }
                    case "active" -> {
                        predicates.add(cb.isFalse(root.get("annulled")));
                        predicates.add(cb.greaterThanOrEqualTo(root.get("endDate"),
                                LocalDate.now().plusDays(90)));
                    }
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
