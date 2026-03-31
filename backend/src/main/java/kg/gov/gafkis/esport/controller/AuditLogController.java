package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kg.gov.gafkis.esport.dto.response.AuditLogResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/audit-log")
@RequiredArgsConstructor
@Tag(name = "Audit Log", description = "Журнал аудита действий пользователей")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN')")
public class AuditLogController {

    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Получить журнал аудита", description = "Список записей аудита с фильтрацией и пагинацией")
    public ResponseEntity<PagedResponse<AuditLogResponse>> getAll(
            @Parameter(description = "Фильтр по действию") @RequestParam(required = false) String action,
            @Parameter(description = "Фильтр по ID пользователя") @RequestParam(required = false) Long userId,
            @Parameter(description = "Дата начала (yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @Parameter(description = "Дата окончания (yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {

        PagedResponse<AuditLogResponse> response = auditService.getAll(action, userId, dateFrom, dateTo, pageable);
        return ResponseEntity.ok(response);
    }
}
