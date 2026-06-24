package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.request.TransferAppCreateRequest;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.TransferAppListResponse;
import kg.gov.gafkis.esport.dto.response.TransferAppResponse;
import kg.gov.gafkis.esport.service.TransferApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transfer-applications")
@RequiredArgsConstructor
@Tag(name = "Transfer Applications", description = "Заявки на переход спортсмена в другой клуб")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
public class TransferApplicationController {

    private final TransferApplicationService transferApplicationService;

    @GetMapping
    @Operation(summary = "Список заявок на переход")
    public ResponseEntity<PagedResponse<TransferAppListResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(transferApplicationService.getAll(search, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить заявку по ID")
    public ResponseEntity<TransferAppResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(transferApplicationService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Создать заявку на переход")
    public ResponseEntity<TransferAppResponse> create(
            @Valid @RequestBody TransferAppCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transferApplicationService.create(request));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Изменить статус заявки")
    public ResponseEntity<TransferAppResponse> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusChangeRequest request) {
        return ResponseEntity.ok(transferApplicationService.changeStatus(id, request));
    }
}
