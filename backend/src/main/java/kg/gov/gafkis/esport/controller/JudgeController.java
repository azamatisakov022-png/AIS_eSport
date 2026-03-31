package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.JudgeCreateRequest;
import kg.gov.gafkis.esport.dto.request.JudgeUpdateRequest;
import kg.gov.gafkis.esport.dto.response.JudgeListResponse;
import kg.gov.gafkis.esport.dto.response.JudgeResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.service.JudgeService;
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
@RequestMapping("/judges")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
@Tag(name = "Judges", description = "API для управления судьями")
public class JudgeController {

    private final JudgeService judgeService;

    @GetMapping
    @Operation(summary = "Список судей", description = "Получение списка судей с фильтрацией и пагинацией")
    public ResponseEntity<PagedResponse<JudgeListResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sport,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(judgeService.getAll(search, category, sport, region, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить судью", description = "Получение судьи по ID")
    public ResponseEntity<JudgeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(judgeService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Создать судью", description = "Создание нового судьи с автоматической генерацией номера удостоверения")
    public ResponseEntity<JudgeResponse> create(@Valid @RequestBody JudgeCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(judgeService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить судью", description = "Обновление данных судьи")
    public ResponseEntity<JudgeResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody JudgeUpdateRequest request) {
        return ResponseEntity.ok(judgeService.update(id, request));
    }

    @PatchMapping("/{id}/annul")
    @Operation(summary = "Аннулировать судью", description = "Аннулирование удостоверения судьи")
    public ResponseEntity<Void> annul(@PathVariable Long id) {
        judgeService.annul(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/promote")
    @Operation(summary = "Повысить категорию судьи", description = "Повышение судейской категории с обновлением аттестации")
    public ResponseEntity<JudgeResponse> promote(@PathVariable Long id,
                                                   @RequestBody Map<String, String> body) {
        String newCategory = body.get("category");
        return ResponseEntity.ok(judgeService.promote(id, newCategory));
    }

    @GetMapping("/count")
    @Operation(summary = "Количество судей", description = "Получение количества активных неаннулированных судей")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(judgeService.count());
    }
}
