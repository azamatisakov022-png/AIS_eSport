package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.FacilityCreateRequest;
import kg.gov.gafkis.esport.dto.request.FacilityUpdateRequest;
import kg.gov.gafkis.esport.dto.response.FacilityListResponse;
import kg.gov.gafkis.esport.dto.response.FacilityResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.entity.Facility;
import kg.gov.gafkis.esport.entity.Organization;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.FacilityMapper;
import kg.gov.gafkis.esport.repository.FacilityRepository;
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
public class FacilityService {

    private final FacilityRepository facilityRepository;
    private final OrganizationRepository organizationRepository;
    private final FacilityMapper facilityMapper;

    @Transactional(readOnly = true)
    public PagedResponse<FacilityListResponse> getAll(String search, String type, String region,
                                                        String status, Pageable pageable) {
        Specification<Facility> spec = buildSpecification(search, type, region, status);
        Page<Facility> page = facilityRepository.findAll(spec, pageable);

        List<FacilityListResponse> content = facilityMapper.toListResponse(page.getContent());

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
    public FacilityResponse getById(Long id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Спортивный объект", "id", id));
        return facilityMapper.toResponse(facility);
    }

    public FacilityResponse create(FacilityCreateRequest request) {
        Facility facility = Facility.builder()
                .name(request.getName())
                .type(request.getType())
                .address(request.getAddress())
                .region(request.getRegion())
                .city(request.getCity())
                .lat(request.getLat())
                .lng(request.getLng())
                .capacity(request.getCapacity())
                .areaSqm(request.getAreaSqm())
                .equipment(request.getEquipment())
                .schedule(request.getSchedule())
                .build();

        if (request.getOwnerOrganizationId() != null) {
            Organization org = organizationRepository.findById(request.getOwnerOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Организация", "id", request.getOwnerOrganizationId()));
            facility.setOwnerOrganization(org);
        }

        facility = facilityRepository.save(facility);
        log.info("Создан спортивный объект: {} (id={})", facility.getName(), facility.getId());
        return facilityMapper.toResponse(facility);
    }

    public FacilityResponse update(Long id, FacilityUpdateRequest request) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Спортивный объект", "id", id));

        if (request.getName() != null) {
            facility.setName(request.getName());
        }
        if (request.getType() != null) {
            facility.setType(request.getType());
        }
        if (request.getAddress() != null) {
            facility.setAddress(request.getAddress());
        }
        if (request.getRegion() != null) {
            facility.setRegion(request.getRegion());
        }
        if (request.getCity() != null) {
            facility.setCity(request.getCity());
        }
        if (request.getLat() != null) {
            facility.setLat(request.getLat());
        }
        if (request.getLng() != null) {
            facility.setLng(request.getLng());
        }
        if (request.getCapacity() != null) {
            facility.setCapacity(request.getCapacity());
        }
        if (request.getAreaSqm() != null) {
            facility.setAreaSqm(request.getAreaSqm());
        }
        if (request.getStatus() != null) {
            facility.setStatus(request.getStatus());
        }
        if (request.getEquipment() != null) {
            facility.setEquipment(request.getEquipment());
        }
        if (request.getSchedule() != null) {
            facility.setSchedule(request.getSchedule());
        }
        if (request.getOwnerOrganizationId() != null) {
            Organization org = organizationRepository.findById(request.getOwnerOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Организация", "id", request.getOwnerOrganizationId()));
            facility.setOwnerOrganization(org);
        }

        facility = facilityRepository.save(facility);
        log.info("Обновлён спортивный объект: {} (id={})", facility.getName(), facility.getId());
        return facilityMapper.toResponse(facility);
    }

    public void delete(Long id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Спортивный объект", "id", id));
        facility.setStatus("inactive");
        facilityRepository.save(facility);
        log.info("Деактивирован спортивный объект: {} (id={})", facility.getName(), facility.getId());
    }

    private Specification<Facility> buildSpecification(String search, String type, String region, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by name
            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")),
                        "%" + search.trim().toLowerCase() + "%"));
            }

            // Filter by type
            if (type != null && !type.isBlank()) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            // Filter by region
            if (region != null && !region.isBlank()) {
                predicates.add(cb.equal(root.get("region"), region));
            }

            // Filter by status
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
