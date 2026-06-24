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

import java.time.LocalDate;

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
    private final TrainerApplicationRepository trainerApplicationRepository;
    private final AccreditationApplicationRepository accreditationApplicationRepository;
    private final RestorationApplicationRepository restorationApplicationRepository;

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

    // ─── Публичная проверка документа по номеру (QR) ────────────────────
    @GetMapping("/verify")
    @Operation(summary = "Проверка документа по номеру",
            description = "Публичная проверка действительности документа; причина отзыва видна всем (№14)")
    @Transactional(readOnly = true)
    public ResponseEntity<DocumentVerifyResponse> verify(@RequestParam String code) {
        return ResponseEntity.ok(verifyCode(code == null ? "" : code.trim()));
    }

    private DocumentVerifyResponse verifyCode(String code) {
        if (code.isEmpty()) {
            return notFound(code);
        }
        LocalDate today = LocalDate.now();

        // 1) Документ, признанный недействительным при восстановлении (выдан дубликат)
        RestorationApplication restored = restorationApplicationRepository
                .findFirstByOldNumberAndOldInvalidatedTrue(code).orElse(null);
        if (restored != null) {
            return DocumentVerifyResponse.builder()
                    .code(code).found(true).docType(restored.getDocType()).holder(restored.getApplicantName())
                    .statusLabel("Недействителен").valid(false)
                    .reason("Документ утрачен/испорчен, выдан дубликат"
                            + (restored.getDupNumber() != null ? " " + restored.getDupNumber() : "")
                            + ". Оригинал недействителен.")
                    .build();
        }

        // 2) Судейское удостоверение
        Judge judge = judgeRepository.findByCertNumber(code).orElse(null);
        if (judge != null) {
            boolean expired = judge.getEndDate() != null && judge.getEndDate().isBefore(today);
            boolean ok = !judge.isAnnulled() && !expired;
            return DocumentVerifyResponse.builder()
                    .code(code).found(true).docType("Судейское удостоверение").holder(judge.getFullName())
                    .statusLabel(ok ? "Действителен" : "Недействителен").valid(ok)
                    .reason(judge.isAnnulled() ? "Удостоверение аннулировано" : expired ? "Истёк срок действия" : null)
                    .issued(judge.getAttestDate()).validUntil(judge.getEndDate())
                    .extra(judge.getCategory())
                    .build();
        }

        // 3) Свидетельство тренера
        TrainerApplication tr = trainerApplicationRepository.findFirstByCertNumber(code).orElse(null);
        if (tr != null) {
            boolean expired = tr.getCertEndDate() != null && tr.getCertEndDate().isBefore(today);
            boolean ok = "registered".equals(tr.getStatus()) && !expired;
            return DocumentVerifyResponse.builder()
                    .code(code).found(true).docType("Свидетельство тренера").holder(tr.getApplicantName())
                    .statusLabel(ok ? "Действителен" : "Недействителен").valid(ok)
                    .reason("annulled".equals(tr.getStatus()) ? "Свидетельство аннулировано"
                            : expired ? "Истёк срок действия" : (!ok ? "Свидетельство не действует" : null))
                    .issued(tr.getCertIssueDate()).validUntil(tr.getCertEndDate())
                    .extra(tr.getSport())
                    .build();
        }

        // 4) Свидетельство об аккредитации федерации
        AccreditationApplication ac = accreditationApplicationRepository.findFirstByAccreditationNumber(code).orElse(null);
        if (ac != null) {
            String s = ac.getStatus();
            boolean ok = "Аккредитована".equals(s);
            boolean suspended = "Приостановлена".equals(s);
            return DocumentVerifyResponse.builder()
                    .code(code).found(true).docType("Свидетельство об аккредитации").holder(ac.getFederationName())
                    .statusLabel(ok ? "Действителен" : suspended ? "Приостановлен" : "Недействителен").valid(ok)
                    .reason(suspended ? ac.getSuspensionReason()
                            : "Аккредитация отозвана".equals(s) ? ac.getRejectReason() : null)
                    .validUntil(ac.getAccreditationEnd())
                    .extra(ac.getSport())
                    .build();
        }

        return notFound(code);
    }

    private DocumentVerifyResponse notFound(String code) {
        return DocumentVerifyResponse.builder()
                .code(code).found(false).statusLabel("Не найден").valid(false)
                .reason("Документ с таким номером не найден в реестрах")
                .build();
    }
}
