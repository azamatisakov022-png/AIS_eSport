package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.EventCreateRequest;
import kg.gov.gafkis.esport.dto.request.EventParticipantRequest;
import kg.gov.gafkis.esport.dto.request.EventResultRequest;
import kg.gov.gafkis.esport.dto.request.EventUpdateRequest;
import kg.gov.gafkis.esport.dto.response.*;
import kg.gov.gafkis.esport.entity.Athlete;
import kg.gov.gafkis.esport.entity.Event;
import kg.gov.gafkis.esport.entity.EventParticipant;
import kg.gov.gafkis.esport.entity.EventResult;
import kg.gov.gafkis.esport.entity.Judge;
import kg.gov.gafkis.esport.exception.DuplicateResourceException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.EventMapper;
import kg.gov.gafkis.esport.repository.AthleteRepository;
import kg.gov.gafkis.esport.repository.EventParticipantRepository;
import kg.gov.gafkis.esport.repository.EventRepository;
import kg.gov.gafkis.esport.repository.EventResultRepository;
import kg.gov.gafkis.esport.repository.JudgeRepository;
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
public class EventService {

    private final EventRepository eventRepository;
    private final EventParticipantRepository participantRepository;
    private final EventResultRepository resultRepository;
    private final AthleteRepository athleteRepository;
    private final JudgeRepository judgeRepository;
    private final EventMapper eventMapper;

    // ======================== Events CRUD ========================

    @Transactional(readOnly = true)
    public PagedResponse<EventListResponse> getAll(String search, String type, String sport,
                                                    String status, Boolean inPlan, Pageable pageable) {
        Specification<Event> spec = buildSpecification(search, type, sport, status, inPlan);
        Page<Event> page = eventRepository.findAll(spec, pageable);
        List<EventListResponse> content = eventMapper.toListResponse(page.getContent());

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
    public EventResponse getById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Мероприятие", "id", id));
        return eventMapper.toResponse(event);
    }

    public EventResponse create(EventCreateRequest request) {
        Event event = Event.builder()
                .title(request.getTitle())
                .type(request.getType())
                .sport(request.getSport())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .city(request.getCity())
                .venue(request.getVenue())
                .ageCategory(request.getAgeCategory())
                .level(request.getLevel())
                .organizer(request.getOrganizer())
                .inPlan(request.getInPlan() != null && request.getInPlan())
                .funded(request.getFunded() != null && request.getFunded())
                .cancelled(false)
                .build();

        // Compute initial status from dates
        event.setStatus(computeStatus(event));

        // Resolve judge reference
        if (request.getJudgeId() != null) {
            Judge judge = judgeRepository.findById(request.getJudgeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Судья", "id", request.getJudgeId()));
            event.setMainJudge(judge);
        }

        event = eventRepository.save(event);
        log.info("Создано мероприятие: {} (id={})", event.getTitle(), event.getId());
        return eventMapper.toResponse(event);
    }

    public EventResponse update(Long id, EventUpdateRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Мероприятие", "id", id));

        if (request.getTitle() != null) {
            event.setTitle(request.getTitle());
        }
        if (request.getType() != null) {
            event.setType(request.getType());
        }
        if (request.getSport() != null) {
            event.setSport(request.getSport());
        }
        if (request.getStartDate() != null) {
            event.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            event.setEndDate(request.getEndDate());
        }
        if (request.getCity() != null) {
            event.setCity(request.getCity());
        }
        if (request.getVenue() != null) {
            event.setVenue(request.getVenue());
        }
        if (request.getAgeCategory() != null) {
            event.setAgeCategory(request.getAgeCategory());
        }
        if (request.getLevel() != null) {
            event.setLevel(request.getLevel());
        }
        if (request.getOrganizer() != null) {
            event.setOrganizer(request.getOrganizer());
        }
        if (request.getInPlan() != null) {
            event.setInPlan(request.getInPlan());
        }
        if (request.getFunded() != null) {
            event.setFunded(request.getFunded());
        }
        if (request.getJudgeId() != null) {
            Judge judge = judgeRepository.findById(request.getJudgeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Судья", "id", request.getJudgeId()));
            event.setMainJudge(judge);
        }

        // Recompute status based on updated dates
        event.setStatus(computeStatus(event));

        event = eventRepository.save(event);
        log.info("Обновлено мероприятие: {} (id={})", event.getTitle(), event.getId());
        return eventMapper.toResponse(event);
    }

    public EventResponse cancel(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Мероприятие", "id", id));
        event.setCancelled(true);
        event.setStatus("cancelled");
        event = eventRepository.save(event);
        log.info("Отменено мероприятие: {} (id={})", event.getTitle(), event.getId());
        return eventMapper.toResponse(event);
    }

    // ======================== Participants ========================

    public EventParticipantResponse addParticipant(Long eventId, EventParticipantRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Мероприятие", "id", eventId));

        Athlete athlete = athleteRepository.findById(request.getAthleteId())
                .orElseThrow(() -> new ResourceNotFoundException("Спортсмен", "id", request.getAthleteId()));

        if (participantRepository.existsByEventIdAndAthleteId(eventId, request.getAthleteId())) {
            throw new DuplicateResourceException("Участник мероприятия", "athleteId", request.getAthleteId());
        }

        EventParticipant participant = EventParticipant.builder()
                .event(event)
                .athlete(athlete)
                .weightClass(request.getWeightClass())
                .build();

        participant = participantRepository.save(participant);
        log.info("Добавлен участник {} в мероприятие {} (id={})", athlete.getFullName(), event.getTitle(), eventId);
        return eventMapper.toParticipantResponse(participant);
    }

    public void removeParticipant(Long eventId, Long athleteId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Мероприятие", "id", eventId);
        }
        if (!participantRepository.existsByEventIdAndAthleteId(eventId, athleteId)) {
            throw new ResourceNotFoundException("Участник мероприятия", "athleteId", athleteId);
        }
        participantRepository.deleteByEventIdAndAthleteId(eventId, athleteId);
        log.info("Удален участник athleteId={} из мероприятия eventId={}", athleteId, eventId);
    }

    @Transactional(readOnly = true)
    public List<EventParticipantResponse> getParticipants(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Мероприятие", "id", eventId);
        }
        List<EventParticipant> participants = participantRepository.findByEventId(eventId);
        return eventMapper.toParticipantResponse(participants);
    }

    // ======================== Results ========================

    public EventResultResponse addResult(Long eventId, EventResultRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Мероприятие", "id", eventId));

        Athlete athlete = athleteRepository.findById(request.getAthleteId())
                .orElseThrow(() -> new ResourceNotFoundException("Спортсмен", "id", request.getAthleteId()));

        EventResult result = EventResult.builder()
                .event(event)
                .athlete(athlete)
                .place(request.getPlace())
                .medalType(request.getMedalType())
                .resultValue(request.getResultValue())
                .build();

        result = resultRepository.save(result);
        log.info("Добавлен результат для {} в мероприятии {} (id={})", athlete.getFullName(), event.getTitle(), eventId);
        return eventMapper.toResultResponse(result);
    }

    @Transactional(readOnly = true)
    public List<EventResultResponse> getResults(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Мероприятие", "id", eventId);
        }
        List<EventResult> results = resultRepository.findByEventId(eventId);
        return eventMapper.toResultResponse(results);
    }

    // ======================== Helpers ========================

    private String computeStatus(Event event) {
        if (event.isCancelled()) {
            return "cancelled";
        }
        LocalDate today = LocalDate.now();
        if (event.getEndDate() != null && event.getEndDate().isBefore(today)) {
            return "finished";
        }
        if (event.getStartDate() != null && event.getEndDate() != null
                && !event.getStartDate().isAfter(today) && !event.getEndDate().isBefore(today)) {
            return "live";
        }
        return "planned";
    }

    private Specification<Event> buildSpecification(String search, String type, String sport,
                                                      String status, Boolean inPlan) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by title (case-insensitive LIKE)
            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("title")),
                        "%" + search.trim().toLowerCase() + "%"));
            }

            // Exact match filters
            if (type != null && !type.isBlank()) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (sport != null && !sport.isBlank()) {
                predicates.add(cb.equal(root.get("sport"), sport));
            }

            // Status filter: compute from dates/cancelled or match stored status
            if (status != null && !status.isBlank()) {
                LocalDate today = LocalDate.now();
                switch (status.toLowerCase()) {
                    case "cancelled" -> predicates.add(cb.equal(root.get("cancelled"), true));
                    case "finished" -> {
                        predicates.add(cb.equal(root.get("cancelled"), false));
                        predicates.add(cb.lessThan(root.get("endDate"), today));
                    }
                    case "live" -> {
                        predicates.add(cb.equal(root.get("cancelled"), false));
                        predicates.add(cb.lessThanOrEqualTo(root.get("startDate"), today));
                        predicates.add(cb.greaterThanOrEqualTo(root.get("endDate"), today));
                    }
                    case "planned" -> {
                        predicates.add(cb.equal(root.get("cancelled"), false));
                        predicates.add(cb.greaterThan(root.get("startDate"), today));
                    }
                    default -> predicates.add(cb.equal(root.get("status"), status));
                }
            }

            // Boolean filter for inPlan
            if (inPlan != null) {
                predicates.add(cb.equal(root.get("inPlan"), inPlan));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
