package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.AwardApplicationCreateRequest;
import kg.gov.gafkis.esport.dto.request.DeprivationRequest;
import kg.gov.gafkis.esport.dto.request.RestorationRequest;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.response.AwardApplicationListResponse;
import kg.gov.gafkis.esport.dto.response.AwardApplicationResponse;
import kg.gov.gafkis.esport.dto.response.DeprivationResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.RestorationResponse;
import kg.gov.gafkis.esport.service.AwardApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/award-applications")
@RequiredArgsConstructor
@Tag(name = "Award Applications", description = "Управление заявками на награды")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
public class AwardApplicationController {

    private final AwardApplicationService awardApplicationService;

    // ======================== Award Applications ========================

    @GetMapping
    @Operation(summary = "Получить список заявок на награды",
            description = "Получение списка заявок с фильтрацией и пагинацией")
    public ResponseEntity<PagedResponse<AwardApplicationListResponse>> getAll(
            @Parameter(description = "Поиск по ФИО или номеру заявки") @RequestParam(required = false) String search,
            @Parameter(description = "Фильтр по группе награды (A/B/C)") @RequestParam(required = false) String group,
            @Parameter(description = "Фильтр по статусу") @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        PagedResponse<AwardApplicationListResponse> response =
                awardApplicationService.getAll(search, group, status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить заявку по ID",
            description = "Получение детальной информации о заявке на награду")
    public ResponseEntity<AwardApplicationResponse> getById(@PathVariable Long id) {
        AwardApplicationResponse response = awardApplicationService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Создать заявку на награду",
            description = "Создание новой заявки на присвоение награды")
    public ResponseEntity<AwardApplicationResponse> create(
            @Valid @RequestBody AwardApplicationCreateRequest request) {
        AwardApplicationResponse response = awardApplicationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Изменить статус заявки",
            description = "Изменение статуса заявки с валидацией допустимых переходов")
    public ResponseEntity<AwardApplicationResponse> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusChangeRequest request) {
        AwardApplicationResponse response = awardApplicationService.changeStatus(id, request);
        return ResponseEntity.ok(response);
    }

    // ======================== Deprivations ========================

    @GetMapping("/deprivations")
    @Operation(summary = "Получить список лишений наград",
            description = "Получение всех записей о лишении наград")
    public ResponseEntity<List<DeprivationResponse>> getDeprivations() {
        List<DeprivationResponse> response = awardApplicationService.getDeprivations();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/deprivations")
    @Operation(summary = "Создать запись о лишении награды",
            description = "Инициирование процедуры лишения награды")
    public ResponseEntity<DeprivationResponse> createDeprivation(
            @Valid @RequestBody DeprivationRequest request) {
        DeprivationResponse response = awardApplicationService.createDeprivation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ======================== Restorations ========================

    @GetMapping("/restorations")
    @Operation(summary = "Получить список восстановлений наград",
            description = "Получение всех записей о восстановлении наград")
    public ResponseEntity<List<RestorationResponse>> getRestorations() {
        List<RestorationResponse> response = awardApplicationService.getRestorations();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/restorations")
    @Operation(summary = "Создать запись о восстановлении награды",
            description = "Инициирование процедуры восстановления награды")
    public ResponseEntity<RestorationResponse> createRestoration(
            @Valid @RequestBody RestorationRequest request) {
        RestorationResponse response = awardApplicationService.createRestoration(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
