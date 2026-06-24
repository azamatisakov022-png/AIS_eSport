package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.ProtocolCreateRequest;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.ProtocolListResponse;
import kg.gov.gafkis.esport.dto.response.ProtocolResponse;
import kg.gov.gafkis.esport.service.ProtocolSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/protocol-submissions")
@RequiredArgsConstructor
@Tag(name = "Protocol Submissions", description = "Протоколы соревнований, загружаемые федерациями")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
public class ProtocolSubmissionController {

    private final ProtocolSubmissionService protocolSubmissionService;

    @GetMapping
    @Operation(summary = "Список протоколов соревнований")
    public ResponseEntity<PagedResponse<ProtocolListResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(protocolSubmissionService.getAll(search, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить протокол по ID")
    public ResponseEntity<ProtocolResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(protocolSubmissionService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Загрузить протокол соревнования")
    public ResponseEntity<ProtocolResponse> create(@Valid @RequestBody ProtocolCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(protocolSubmissionService.create(request));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Изменить статус протокола")
    public ResponseEntity<ProtocolResponse> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusChangeRequest request) {
        return ResponseEntity.ok(protocolSubmissionService.changeStatus(id, request));
    }
}
