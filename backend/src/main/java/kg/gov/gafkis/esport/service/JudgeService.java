package kg.gov.gafkis.esport.service;

import kg.gov.gafkis.esport.dto.request.JudgeCreateRequest;
import kg.gov.gafkis.esport.dto.request.JudgeUpdateRequest;
import kg.gov.gafkis.esport.dto.response.JudgeListResponse;
import kg.gov.gafkis.esport.dto.response.JudgeResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.entity.Judge;
import kg.gov.gafkis.esport.entity.Organization;
import kg.gov.gafkis.esport.entity.enums.Sex;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.JudgeMapper;
import kg.gov.gafkis.esport.repository.JudgeRepository;
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
public class JudgeService {

    private final JudgeRepository judgeRepository;
    private final OrganizationRepository organizationRepository;
    private final JudgeMapper judgeMapper;

    @Transactional(readOnly = true)
    public PagedResponse<JudgeListResponse> getAll(String search, String category, String sport,
                                                    String region, String status, Pageable pageable) {
        Specification<Judge> spec = buildSpecification(search, category, sport, region, status);
        Page<Judge> page = judgeRepository.findAll(spec, pageable);

        List<JudgeListResponse> content = judgeMapper.toListResponse(page.getContent());

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
    public JudgeResponse getById(Long id) {
        Judge judge = judgeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Судья", "id", id));
        return judgeMapper.toResponse(judge);
    }

    public JudgeResponse create(JudgeCreateRequest request) {
        Organization organization = null;
        if (request.getOrganizationId() != null) {
            organization = organizationRepository.findById(request.getOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Организация", "id", request.getOrganizationId()));
        }

        LocalDate attestDate = request.getAttestDate() != null ? request.getAttestDate() : LocalDate.now();
        String certNumber = generateCertNumber(attestDate);
        LocalDate endDate = attestDate.plusYears(4);

        Judge judge = Judge.builder()
                .fullName(request.getFullName())
                .birthDate(request.getBirthDate())
                .sex(Sex.valueOf(request.getSex()))
                .phone(request.getPhone())
                .email(request.getEmail())
                .certNumber(certNumber)
                .category(request.getCategory())
                .sports(request.getSports() != null ? request.getSports() : new ArrayList<>())
                .attestDate(attestDate)
                .endDate(endDate)
                .region(request.getRegion())
                .organization(organization)
                .build();

        judge = judgeRepository.save(judge);
        log.info("Создан судья: {} с номером удостоверения {}", judge.getFullName(), certNumber);

        return judgeMapper.toResponse(judge);
    }

    public JudgeResponse update(Long id, JudgeUpdateRequest request) {
        Judge judge = judgeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Судья", "id", id));

        if (request.getFullName() != null) {
            judge.setFullName(request.getFullName());
        }
        if (request.getBirthDate() != null) {
            judge.setBirthDate(request.getBirthDate());
        }
        if (request.getSex() != null) {
            judge.setSex(Sex.valueOf(request.getSex()));
        }
        if (request.getPhone() != null) {
            judge.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            judge.setEmail(request.getEmail());
        }
        if (request.getCategory() != null) {
            judge.setCategory(request.getCategory());
        }
        if (request.getSports() != null) {
            judge.setSports(request.getSports());
        }
        if (request.getAttestDate() != null) {
            judge.setAttestDate(request.getAttestDate());
            judge.setEndDate(request.getAttestDate().plusYears(4));
        }
        if (request.getRegion() != null) {
            judge.setRegion(request.getRegion());
        }
        if (request.getOrganizationId() != null) {
            Organization organization = organizationRepository.findById(request.getOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Организация", "id", request.getOrganizationId()));
            judge.setOrganization(organization);
        }

        judge = judgeRepository.save(judge);
        log.info("Обновлён судья: id={}", id);

        return judgeMapper.toResponse(judge);
    }

    public void annul(Long id) {
        Judge judge = judgeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Судья", "id", id));
        judge.setAnnulled(true);
        judgeRepository.save(judge);
        log.info("Аннулирован судья: id={}", id);
    }

    public JudgeResponse promote(Long id, String newCategory) {
        Judge judge = judgeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Судья", "id", id));

        if (judge.isAnnulled()) {
            throw new BadRequestException("Невозможно повысить категорию аннулированного судьи");
        }

        String oldCategory = judge.getCategory();
        judge.setCategory(newCategory);
        judge.setAttestDate(LocalDate.now());
        judge.setEndDate(LocalDate.now().plusYears(4));

        judge = judgeRepository.save(judge);
        log.info("Повышена категория судьи id={}: {} -> {}", id, oldCategory, newCategory);

        return judgeMapper.toResponse(judge);
    }

    @Transactional(readOnly = true)
    public long count() {
        return judgeRepository.countByIsArchivedFalseAndAnnulledFalse();
    }

    /**
     * Выдача удостоверения судьи из утверждённой заявки: создаёт запись в реестре
     * с автогенерацией номера, датой аттестации (сегодня) и сроком на 4 года.
     */
    public Judge issueFromApplication(String fullName, String category, String sport,
                                      String region, String phone, String email) {
        LocalDate attestDate = LocalDate.now();
        String certNumber = generateCertNumber(attestDate);

        List<String> sports = new ArrayList<>();
        if (sport != null && !sport.isBlank()) {
            sports.add(sport);
        }

        Judge judge = Judge.builder()
                .fullName(fullName)
                .phone(phone)
                .email(email)
                .certNumber(certNumber)
                .category(category)
                .sports(sports)
                .attestDate(attestDate)
                .endDate(attestDate.plusYears(4))
                .region(region)
                .build();

        judge = judgeRepository.save(judge);
        log.info("Выдано удостоверение судьи из заявки: {} -> {} ({})", fullName, category, certNumber);
        return judge;
    }

    private String generateCertNumber(LocalDate attestDate) {
        int year = attestDate.getYear();
        String prefix = "УД-КР-" + year + "-";

        long maxSeq = judgeRepository.findByCertNumberStartingWith(prefix).stream()
                .filter(j -> j.getCertNumber() != null && j.getCertNumber().startsWith(prefix))
                .map(j -> {
                    try {
                        String seqStr = j.getCertNumber().substring(prefix.length());
                        return Long.parseLong(seqStr);
                    } catch (NumberFormatException | IndexOutOfBoundsException e) {
                        return 0L;
                    }
                })
                .max(Long::compareTo)
                .orElse(0L);

        return prefix + String.format("%04d", maxSeq + 1);
    }

    private Specification<Judge> buildSpecification(String search, String category, String sport,
                                                      String region, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only non-archived
            predicates.add(cb.isFalse(root.get("isArchived")));

            // Search by fullName or certNumber
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("fullName")), pattern),
                        cb.like(cb.lower(root.get("certNumber")), pattern)
                ));
            }

            // Filter by category
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            // Filter by sport (ElementCollection join)
            if (sport != null && !sport.isBlank()) {
                predicates.add(cb.isMember(sport, root.get("sports")));
            }

            // Filter by region
            if (region != null && !region.isBlank()) {
                predicates.add(cb.equal(root.get("region"), region));
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
