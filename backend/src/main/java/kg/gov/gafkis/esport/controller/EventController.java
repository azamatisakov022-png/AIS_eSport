package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.EventCreateRequest;
import kg.gov.gafkis.esport.dto.request.EventParticipantRequest;
import kg.gov.gafkis.esport.dto.request.EventResultRequest;
import kg.gov.gafkis.esport.dto.request.EventUpdateRequest;
import kg.gov.gafkis.esport.dto.response.*;
import kg.gov.gafkis.esport.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@Tag(name = "Events", description = "Управление мероприятиями")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
public class EventController {

    private final EventService eventService;

    // ======================== Events CRUD ========================

    @GetMapping
    @Operation(summary = "Получить список мероприятий", description = "Получение списка мероприятий с фильтрацией и пагинацией")
    public ResponseEntity<PagedResponse<EventListResponse>> getAll(
            @Parameter(description = "Поиск по названию") @RequestParam(required = false) String search,
            @Parameter(description = "Фильтр по типу") @RequestParam(required = false) String type,
            @Parameter(description = "Фильтр по виду спорта") @RequestParam(required = false) String sport,
            @Parameter(description = "Фильтр по статусу (planned/live/finished/cancelled)") @RequestParam(required = false) String status,
            @Parameter(description = "Фильтр по плановости") @RequestParam(required = false) Boolean inPlan,
            @PageableDefault(size = 20) Pageable pageable) {
        PagedResponse<EventListResponse> response = eventService.getAll(search, type, sport, status, inPlan, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить мероприятие по ID", description = "Получение детальной информации о мероприятии")
    public ResponseEntity<EventResponse> getById(@PathVariable Long id) {
        EventResponse response = eventService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Создать мероприятие", description = "Регистрация нового мероприятия в системе")
    public ResponseEntity<EventResponse> create(@Valid @RequestBody EventCreateRequest request) {
        EventResponse response = eventService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить мероприятие", description = "Частичное обновление данных мероприятия")
    public ResponseEntity<EventResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody EventUpdateRequest request) {
        EventResponse response = eventService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Отменить мероприятие", description = "Установка статуса 'cancelled' для мероприятия")
    public ResponseEntity<EventResponse> cancel(@PathVariable Long id) {
        EventResponse response = eventService.cancel(id);
        return ResponseEntity.ok(response);
    }

    // ======================== Participants ========================

    @PostMapping("/{id}/participants")
    @Operation(summary = "Добавить участника", description = "Добавление спортсмена как участника мероприятия")
    public ResponseEntity<EventParticipantResponse> addParticipant(
            @PathVariable Long id,
            @Valid @RequestBody EventParticipantRequest request) {
        EventParticipantResponse response = eventService.addParticipant(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}/participants/{athleteId}")
    @Operation(summary = "Удалить участника", description = "Удаление спортсмена из участников мероприятия")
    public ResponseEntity<Void> removeParticipant(@PathVariable Long id,
                                                   @PathVariable Long athleteId) {
        eventService.removeParticipant(id, athleteId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/participants")
    @Operation(summary = "Получить участников", description = "Получение списка участников мероприятия")
    public ResponseEntity<List<EventParticipantResponse>> getParticipants(@PathVariable Long id) {
        List<EventParticipantResponse> response = eventService.getParticipants(id);
        return ResponseEntity.ok(response);
    }

    // ======================== Results ========================

    @PostMapping("/{id}/results")
    @Operation(summary = "Добавить результат", description = "Добавление результата спортсмена в мероприятии")
    public ResponseEntity<EventResultResponse> addResult(
            @PathVariable Long id,
            @Valid @RequestBody EventResultRequest request) {
        EventResultResponse response = eventService.addResult(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/results")
    @Operation(summary = "Получить результаты", description = "Получение списка результатов мероприятия")
    public ResponseEntity<List<EventResultResponse>> getResults(@PathVariable Long id) {
        List<EventResultResponse> response = eventService.getResults(id);
        return ResponseEntity.ok(response);
    }
}
