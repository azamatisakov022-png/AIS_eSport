package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.AccreditationAppCreateRequest;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.response.AccreditationAppListResponse;
import kg.gov.gafkis.esport.dto.response.AccreditationAppResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.service.AccreditationApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/accreditation-applications")
@RequiredArgsConstructor
@Tag(name = "Accreditation Applications", description = "Заявки на аккредитацию спортивных федераций")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
public class AccreditationApplicationController {

    private final AccreditationApplicationService accreditationApplicationService;

    @GetMapping
    @Operation(summary = "Список заявок на аккредитацию")
    public ResponseEntity<PagedResponse<AccreditationAppListResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(accreditationApplicationService.getAll(search, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить заявку по ID")
    public ResponseEntity<AccreditationAppResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(accreditationApplicationService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Создать заявку на аккредитацию")
    public ResponseEntity<AccreditationAppResponse> create(
            @Valid @RequestBody AccreditationAppCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(accreditationApplicationService.create(request));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Изменить статус заявки")
    public ResponseEntity<AccreditationAppResponse> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusChangeRequest request) {
        return ResponseEntity.ok(accreditationApplicationService.changeStatus(id, request));
    }
}
