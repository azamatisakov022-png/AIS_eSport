package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.request.TrainerApplicationCreateRequest;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.TrainerApplicationListResponse;
import kg.gov.gafkis.esport.dto.response.TrainerApplicationResponse;
import kg.gov.gafkis.esport.service.TrainerApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/trainer-applications")
@RequiredArgsConstructor
@Tag(name = "Trainer Applications", description = "Управление заявками тренеров")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
public class TrainerApplicationController {

    private final TrainerApplicationService trainerApplicationService;

    @GetMapping
    @Operation(summary = "Получить список заявок тренеров",
            description = "Получение списка заявок с фильтрацией и пагинацией")
    public ResponseEntity<PagedResponse<TrainerApplicationListResponse>> getAll(
            @Parameter(description = "Поиск по ФИО или номеру заявки") @RequestParam(required = false) String search,
            @Parameter(description = "Фильтр по статусу") @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        PagedResponse<TrainerApplicationListResponse> response =
                trainerApplicationService.getAll(search, status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить заявку тренера по ID",
            description = "Получение детальной информации о заявке тренера")
    public ResponseEntity<TrainerApplicationResponse> getById(@PathVariable Long id) {
        TrainerApplicationResponse response = trainerApplicationService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Создать заявку тренера",
            description = "Создание новой заявки на аттестацию тренера")
    public ResponseEntity<TrainerApplicationResponse> create(
            @Valid @RequestBody TrainerApplicationCreateRequest request) {
        TrainerApplicationResponse response = trainerApplicationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Изменить статус заявки тренера",
            description = "Изменение статуса заявки с валидацией допустимых переходов")
    public ResponseEntity<TrainerApplicationResponse> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusChangeRequest request) {
        TrainerApplicationResponse response = trainerApplicationService.changeStatus(id, request);
        return ResponseEntity.ok(response);
    }
}
