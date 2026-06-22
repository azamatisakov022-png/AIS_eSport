package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.JudgeApplicationCreateRequest;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.response.JudgeApplicationListResponse;
import kg.gov.gafkis.esport.dto.response.JudgeApplicationResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.service.JudgeApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/judge-applications")
@RequiredArgsConstructor
@Tag(name = "Judge Applications", description = "Заявки на присвоение судейских категорий")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
public class JudgeApplicationController {

    private final JudgeApplicationService judgeApplicationService;

    @GetMapping
    @Operation(summary = "Список заявок на судейские категории")
    public ResponseEntity<PagedResponse<JudgeApplicationListResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(judgeApplicationService.getAll(search, category, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить заявку по ID")
    public ResponseEntity<JudgeApplicationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(judgeApplicationService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Создать заявку на судейскую категорию")
    public ResponseEntity<JudgeApplicationResponse> create(
            @Valid @RequestBody JudgeApplicationCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(judgeApplicationService.create(request));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Изменить статус заявки")
    public ResponseEntity<JudgeApplicationResponse> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusChangeRequest request) {
        return ResponseEntity.ok(judgeApplicationService.changeStatus(id, request));
    }
}
