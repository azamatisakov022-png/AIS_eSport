package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.FacilityCreateRequest;
import kg.gov.gafkis.esport.dto.request.FacilityUpdateRequest;
import kg.gov.gafkis.esport.dto.response.FacilityListResponse;
import kg.gov.gafkis.esport.dto.response.FacilityResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/facilities")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
@Tag(name = "Facilities", description = "API для управления спортивными объектами")
public class FacilityController {

    private final FacilityService facilityService;

    @GetMapping
    @Operation(summary = "Список объектов", description = "Получение списка спортивных объектов с фильтрацией и пагинацией")
    public ResponseEntity<PagedResponse<FacilityListResponse>> getAll(
            @Parameter(description = "Поиск по названию") @RequestParam(required = false) String search,
            @Parameter(description = "Фильтр по типу") @RequestParam(required = false) String type,
            @Parameter(description = "Фильтр по региону") @RequestParam(required = false) String region,
            @Parameter(description = "Фильтр по статусу") @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(facilityService.getAll(search, type, region, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить объект", description = "Получение спортивного объекта по ID")
    public ResponseEntity<FacilityResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(facilityService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Создать объект", description = "Регистрация нового спортивного объекта в системе")
    public ResponseEntity<FacilityResponse> create(@Valid @RequestBody FacilityCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(facilityService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить объект", description = "Обновление данных спортивного объекта")
    public ResponseEntity<FacilityResponse> update(@PathVariable Long id,
                                                     @Valid @RequestBody FacilityUpdateRequest request) {
        return ResponseEntity.ok(facilityService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Деактивировать объект", description = "Мягкое удаление (перевод в статус inactive)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        facilityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
