package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.RestorationAppCreateRequest;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.RestorationAppListResponse;
import kg.gov.gafkis.esport.dto.response.RestorationAppResponse;
import kg.gov.gafkis.esport.service.RestorationApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restoration-applications")
@RequiredArgsConstructor
@Tag(name = "Restoration Applications", description = "Заявки на восстановление (дубликат) документа")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
public class RestorationApplicationController {

    private final RestorationApplicationService restorationApplicationService;

    @GetMapping
    @Operation(summary = "Список заявок на восстановление")
    public ResponseEntity<PagedResponse<RestorationAppListResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(restorationApplicationService.getAll(search, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить заявку по ID")
    public ResponseEntity<RestorationAppResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(restorationApplicationService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Создать заявку на восстановление")
    public ResponseEntity<RestorationAppResponse> create(
            @Valid @RequestBody RestorationAppCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(restorationApplicationService.create(request));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Изменить статус заявки")
    public ResponseEntity<RestorationAppResponse> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusChangeRequest request) {
        return ResponseEntity.ok(restorationApplicationService.changeStatus(id, request));
    }
}
