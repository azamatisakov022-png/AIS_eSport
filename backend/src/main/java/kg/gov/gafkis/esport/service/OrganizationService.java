package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.OrganizationCreateRequest;
import kg.gov.gafkis.esport.dto.request.OrganizationUpdateRequest;
import kg.gov.gafkis.esport.dto.response.OrganizationListResponse;
import kg.gov.gafkis.esport.dto.response.OrganizationResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.entity.Organization;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.OrganizationMapper;
import kg.gov.gafkis.esport.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationMapper organizationMapper;

    @Transactional(readOnly = true)
    public PagedResponse<OrganizationListResponse> getAll(String search, String type, String sport,
                                                            String region, String accreditation, Pageable pageable) {
        Specification<Organization> spec = buildSpecification(search, type, sport, region, accreditation);
        Page<Organization> page = organizationRepository.findAll(spec, pageable);

        List<OrganizationListResponse> content = organizationMapper.toListResponse(page.getContent());

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
    public OrganizationResponse getById(Long id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Организация", "id", id));
        return organizationMapper.toResponse(organization);
    }

    public OrganizationResponse create(OrganizationCreateRequest request) {
        Organization organization = Organization.builder()
                .name(request.getName())
                .type(request.getType())
                .sport(request.getSport())
                .inn(request.getInn())
                .regDate(request.getRegDate())
                .region(request.getRegion())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail())
                .website(request.getWebsite())
                .headName(request.getHeadName())
                .headTitle(request.getHeadTitle())
                .build();

        organization = organizationRepository.save(organization);
        log.info("Создана организация: {} (id={})", organization.getName(), organization.getId());
        return organizationMapper.toResponse(organization);
    }

    public OrganizationResponse update(Long id, OrganizationUpdateRequest request) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Организация", "id", id));

        if (request.getName() != null) {
            organization.setName(request.getName());
        }
        if (request.getType() != null) {
            organization.setType(request.getType());
        }
        if (request.getSport() != null) {
            organization.setSport(request.getSport());
        }
        if (request.getInn() != null) {
            organization.setInn(request.getInn());
        }
        if (request.getRegDate() != null) {
            organization.setRegDate(request.getRegDate());
        }
        if (request.getRegion() != null) {
            organization.setRegion(request.getRegion());
        }
        if (request.getAddress() != null) {
            organization.setAddress(request.getAddress());
        }
        if (request.getPhone() != null) {
            organization.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            organization.setEmail(request.getEmail());
        }
        if (request.getWebsite() != null) {
            organization.setWebsite(request.getWebsite());
        }
        if (request.getHeadName() != null) {
            organization.setHeadName(request.getHeadName());
        }
        if (request.getHeadTitle() != null) {
            organization.setHeadTitle(request.getHeadTitle());
        }

        organization = organizationRepository.save(organization);
        log.info("Обновлена организация: {} (id={})", organization.getName(), organization.getId());
        return organizationMapper.toResponse(organization);
    }

    public void archive(Long id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Организация", "id", id));
        organization.setArchived(true);
        organizationRepository.save(organization);
        log.info("Архивирована организация: {} (id={})", organization.getName(), organization.getId());
    }

    public OrganizationResponse changeAccreditation(Long id, String status) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Организация", "id", id));

        String oldStatus = organization.getAccreditation();
        organization.setAccreditation(status);
        organization = organizationRepository.save(organization);
        log.info("Изменён статус аккредитации организации id={}: {} -> {}", id, oldStatus, status);

        return organizationMapper.toResponse(organization);
    }

    @Transactional(readOnly = true)
    public long count() {
        return organizationRepository.countByIsArchivedFalse();
    }

    private Specification<Organization> buildSpecification(String search, String type, String sport,
                                                             String region, String accreditation) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only non-archived
            predicates.add(cb.isFalse(root.get("isArchived")));

            // Search by name
            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")),
                        "%" + search.trim().toLowerCase() + "%"));
            }

            // Filter by type
            if (type != null && !type.isBlank()) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            // Filter by sport
            if (sport != null && !sport.isBlank()) {
                predicates.add(cb.equal(root.get("sport"), sport));
            }

            // Filter by region
            if (region != null && !region.isBlank()) {
                predicates.add(cb.equal(root.get("region"), region));
            }

            // Filter by accreditation status
            if (accreditation != null && !accreditation.isBlank()) {
                predicates.add(cb.equal(root.get("accreditation"), accreditation));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
