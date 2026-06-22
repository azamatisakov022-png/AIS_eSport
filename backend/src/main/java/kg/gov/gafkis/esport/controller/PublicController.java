package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kg.gov.gafkis.esport.dto.response.*;
import kg.gov.gafkis.esport.entity.*;
import kg.gov.gafkis.esport.entity.enums.AthleteVerificationStatus;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.*;
import kg.gov.gafkis.esport.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@Tag(name = "Public API", description = "Public read-only endpoints")
public class PublicController {

    private final AthleteRepository athleteRepository;
    private final CoachRepository coachRepository;
    private final JudgeRepository judgeRepository;
    private final EventRepository eventRepository;
    private final FacilityRepository facilityRepository;
    private final OrganizationRepository organizationRepository;
    private final AthleteMapper athleteMapper;
    private final CoachMapper coachMapper;
    private final JudgeMapper judgeMapper;
    private final EventMapper eventMapper;
    private final FacilityMapper facilityMapper;
    private final OrganizationMapper organizationMapper;

    // ─── Athletes ───────────────────────────────────────────────────────

    @GetMapping("/athletes")
    @Operation(summary = "Public list of athletes", description = "Только подтверждённые (VERIFIED), не в архиве")
    public ResponseEntity<PagedResponse<AthleteListResponse>> getAthletes(
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<AthleteListResponse> page = athleteRepository
                .findByIsArchivedFalseAndVerificationStatus(AthleteVerificationStatus.VERIFIED, pageable)
                .map(athleteMapper::toListResponse);

        return ResponseEntity.ok(PagedResponse.from(page));
    }

    @GetMapping("/athletes/{id}")
    @Operation(summary = "Athlete detail", description = "Только подтверждённый спортсмен; персональные контакты скрыты")
    @Transactional(readOnly = true)
    public ResponseEntity<AthleteResponse> getAthlete(@PathVariable Long id) {

        Athlete athlete = athleteRepository.findById(id)
                .filter(a -> !a.isArchived() && a.getVerificationStatus() == AthleteVerificationStatus.VERIFIED)
                .orElseThrow(() -> new ResourceNotFoundException("Athlete", "id", id));

        AthleteResponse resp = athleteMapper.toResponse(athlete);
        // Публично не раскрываем персональные контакты
        resp.setPhone(null);
        resp.setEmail(null);
        return ResponseEntity.ok(resp);
    }

    // ─── Coaches ────────────────────────────────────────────────────────

    @GetMapping("/coaches")
    @Operation(summary = "Public list of coaches", description = "Paginated list of non-archived, non-annulled coaches")
    public ResponseEntity<PagedResponse<CoachListResponse>> getCoaches(
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<CoachListResponse> page = coachRepository
                .findByIsArchivedFalseAndAnnulledFalse(pageable)
                .map(coachMapper::toListResponse);

        return ResponseEntity.ok(PagedResponse.from(page));
    }

    // ─── Judges ─────────────────────────────────────────────────────────

    @GetMapping("/judges")
    @Operation(summary = "Public list of judges", description = "Paginated list of non-archived, non-annulled judges")
    public ResponseEntity<PagedResponse<JudgeListResponse>> getJudges(
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<JudgeListResponse> page = judgeRepository
                .findByIsArchivedFalseAndAnnulledFalse(pageable)
                .map(judgeMapper::toListResponse);

        return ResponseEntity.ok(PagedResponse.from(page));
    }

    // ─── Events ─────────────────────────────────────────────────────────

    @GetMapping("/events")
    @Operation(summary = "Public list of events", description = "Paginated list of events with optional sport/status filter")
    public ResponseEntity<PagedResponse<EventListResponse>> getEvents(
            @Parameter(description = "Filter by sport") @RequestParam(required = false) String sport,
            @Parameter(description = "Filter by status") @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        Specification<Event> spec = Specification.where(null);

        if (sport != null && !sport.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("sport"), sport));
        }
        if (status != null && !status.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        Page<EventListResponse> page = eventRepository
                .findAll(spec, pageable)
                .map(eventMapper::toListResponse);

        return ResponseEntity.ok(PagedResponse.from(page));
    }

    @GetMapping("/events/{id}")
    @Operation(summary = "Event detail", description = "Get a single event by ID")
    public ResponseEntity<EventResponse> getEvent(@PathVariable Long id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));

        return ResponseEntity.ok(eventMapper.toResponse(event));
    }

    // ─── Facilities ─────────────────────────────────────────────────────

    @GetMapping("/facilities")
    @Operation(summary = "Public list of facilities", description = "Paginated list of facilities with optional type/region filter")
    public ResponseEntity<PagedResponse<FacilityListResponse>> getFacilities(
            @Parameter(description = "Filter by type") @RequestParam(required = false) String type,
            @Parameter(description = "Filter by region") @RequestParam(required = false) String region,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        Specification<Facility> spec = Specification.where(null);

        if (type != null && !type.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), type));
        }
        if (region != null && !region.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("region"), region));
        }

        Page<FacilityListResponse> page = facilityRepository
                .findAll(spec, pageable)
                .map(facilityMapper::toListResponse);

        return ResponseEntity.ok(PagedResponse.from(page));
    }

    // ─── Organizations ──────────────────────────────────────────────────

    @GetMapping("/organizations")
    @Operation(summary = "Public list of organizations", description = "Paginated list of non-archived organizations")
    public ResponseEntity<PagedResponse<OrganizationListResponse>> getOrganizations(
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<OrganizationListResponse> page = organizationRepository
                .findByIsArchivedFalse(pageable)
                .map(organizationMapper::toListResponse);

        return ResponseEntity.ok(PagedResponse.from(page));
    }
}
