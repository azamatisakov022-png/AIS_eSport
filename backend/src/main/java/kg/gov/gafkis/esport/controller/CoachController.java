package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.CoachCreateRequest;
import kg.gov.gafkis.esport.dto.request.CoachUpdateRequest;
import kg.gov.gafkis.esport.dto.response.CoachListResponse;
import kg.gov.gafkis.esport.dto.response.CoachResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.service.CoachService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/coaches")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
@Tag(name = "Coaches", description = "API для управления тренерами")
public class CoachController {

    private final CoachService coachService;

    @GetMapping
    @Operation(summary = "Список тренеров", description = "Получение списка тренеров с фильтрацией и пагинацией")
    public ResponseEntity<PagedResponse<CoachListResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sport,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String org,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(coachService.getAll(search, sport, region, org, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить тренера", description = "Получение тренера по ID")
    public ResponseEntity<CoachResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(coachService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Создать тренера", description = "Создание нового тренера с автоматической генерацией номера свидетельства")
    public ResponseEntity<CoachResponse> create(@Valid @RequestBody CoachCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(coachService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить тренера", description = "Обновление данных тренера")
    public ResponseEntity<CoachResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody CoachUpdateRequest request) {
        return ResponseEntity.ok(coachService.update(id, request));
    }

    @PatchMapping("/{id}/annul")
    @Operation(summary = "Аннулировать тренера", description = "Аннулирование свидетельства тренера")
    public ResponseEntity<Void> annul(@PathVariable Long id) {
        coachService.annul(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    @Operation(summary = "Количество тренеров", description = "Получение количества активных неаннулированных тренеров")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(coachService.count());
    }
}
