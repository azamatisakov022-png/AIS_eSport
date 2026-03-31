package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.OrganizationCreateRequest;
import kg.gov.gafkis.esport.dto.request.OrganizationUpdateRequest;
import kg.gov.gafkis.esport.dto.response.OrganizationListResponse;
import kg.gov.gafkis.esport.dto.response.OrganizationResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/organizations")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
@Tag(name = "Organizations", description = "API для управления организациями")
public class OrganizationController {

    private final OrganizationService organizationService;

    @GetMapping
    @Operation(summary = "Список организаций", description = "Получение списка организаций с фильтрацией и пагинацией")
    public ResponseEntity<PagedResponse<OrganizationListResponse>> getAll(
            @Parameter(description = "Поиск по названию") @RequestParam(required = false) String search,
            @Parameter(description = "Фильтр по типу") @RequestParam(required = false) String type,
            @Parameter(description = "Фильтр по виду спорта") @RequestParam(required = false) String sport,
            @Parameter(description = "Фильтр по региону") @RequestParam(required = false) String region,
            @Parameter(description = "Фильтр по аккредитации") @RequestParam(required = false) String accreditation,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(organizationService.getAll(search, type, sport, region, accreditation, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить организацию", description = "Получение организации по ID")
    public ResponseEntity<OrganizationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Создать организацию", description = "Регистрация новой организации в системе")
    public ResponseEntity<OrganizationResponse> create(@Valid @RequestBody OrganizationCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(organizationService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить организацию", description = "Обновление данных организации")
    public ResponseEntity<OrganizationResponse> update(@PathVariable Long id,
                                                        @Valid @RequestBody OrganizationUpdateRequest request) {
        return ResponseEntity.ok(organizationService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Архивировать организацию", description = "Мягкое удаление (перевод в архив)")
    public ResponseEntity<Void> archive(@PathVariable Long id) {
        organizationService.archive(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/accredit")
    @Operation(summary = "Изменить аккредитацию", description = "Изменение статуса аккредитации организации")
    public ResponseEntity<OrganizationResponse> changeAccreditation(@PathVariable Long id,
                                                                      @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(organizationService.changeAccreditation(id, status));
    }

    @GetMapping("/count")
    @Operation(summary = "Количество организаций", description = "Получение количества активных организаций")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(organizationService.count());
    }
}
