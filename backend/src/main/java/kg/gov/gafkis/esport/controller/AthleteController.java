package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.AthleteCreateRequest;
import kg.gov.gafkis.esport.dto.request.AthleteUpdateRequest;
import kg.gov.gafkis.esport.dto.request.MedalRequest;
import kg.gov.gafkis.esport.dto.request.StatusChangeRequest;
import kg.gov.gafkis.esport.dto.response.AthleteListResponse;
import kg.gov.gafkis.esport.dto.response.AthleteResponse;
import kg.gov.gafkis.esport.dto.response.MedalResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.service.AthleteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/athletes")
@RequiredArgsConstructor
@Tag(name = "Athletes", description = "Управление реестром спортсменов")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
public class AthleteController {

    private final AthleteService athleteService;

    @GetMapping
    @Operation(summary = "Получить список спортсменов", description = "Получение списка спортсменов с фильтрацией и пагинацией")
    public ResponseEntity<PagedResponse<AthleteListResponse>> getAll(
            @Parameter(description = "Поиск по ФИО") @RequestParam(required = false) String search,
            @Parameter(description = "Фильтр по виду спорта") @RequestParam(required = false) String sport,
            @Parameter(description = "Фильтр по разряду") @RequestParam(required = false) String rank,
            @Parameter(description = "Фильтр по региону") @RequestParam(required = false) String region,
            @Parameter(description = "Фильтр по статусу мед. справки (valid/expiring/expired)") @RequestParam(required = false) String medStatus,
            @Parameter(description = "Фильтр по статусу верификации (DRAFT/IN_REVIEW/VERIFIED/REJECTED)") @RequestParam(required = false) String verification,
            @PageableDefault(size = 20) Pageable pageable) {
        PagedResponse<AthleteListResponse> response = athleteService.getAll(search, sport, rank, region, medStatus, verification, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить спортсмена по ID", description = "Получение детальной информации о спортсмене")
    public ResponseEntity<AthleteResponse> getById(@PathVariable Long id) {
        AthleteResponse response = athleteService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Создать спортсмена", description = "Регистрация нового спортсмена в системе")
    public ResponseEntity<AthleteResponse> create(@Valid @RequestBody AthleteCreateRequest request) {
        AthleteResponse response = athleteService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить спортсмена", description = "Частичное обновление данных спортсмена")
    public ResponseEntity<AthleteResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody AthleteUpdateRequest request) {
        AthleteResponse response = athleteService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Архивировать спортсмена", description = "Мягкое удаление (перевод в архив)")
    public ResponseEntity<Void> archive(@PathVariable Long id) {
        athleteService.archive(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/submit")
    @Operation(summary = "Отправить на проверку", description = "Черновик/Отклонено -> На проверке")
    public ResponseEntity<AthleteResponse> submit(@PathVariable Long id) {
        return ResponseEntity.ok(athleteService.submitForReview(id));
    }

    @PostMapping("/{id}/verify")
    @Operation(summary = "Подтвердить запись", description = "На проверке -> Подтверждено")
    public ResponseEntity<AthleteResponse> verify(@PathVariable Long id) {
        return ResponseEntity.ok(athleteService.verify(id));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Отклонить запись", description = "На проверке -> Отклонено (с указанием причины)")
    public ResponseEntity<AthleteResponse> reject(@PathVariable Long id, @RequestBody(required = false) StatusChangeRequest request) {
        String reason = request != null ? request.getReason() : null;
        return ResponseEntity.ok(athleteService.reject(id, reason));
    }

    @PostMapping("/{id}/lifecycle")
    @Operation(summary = "Сменить статус жизненного цикла", description = "ACTIVE/INACTIVE/SUSPENDED/DISQUALIFIED/RETIRED/EXCLUDED")
    public ResponseEntity<AthleteResponse> changeLifecycle(@PathVariable Long id, @Valid @RequestBody StatusChangeRequest request) {
        return ResponseEntity.ok(athleteService.changeLifecycle(id, request.getStatus(), request.getReason()));
    }

    @PostMapping("/{id}/medals")
    @Operation(summary = "Добавить медаль", description = "Добавление медали/награды спортсмену")
    public ResponseEntity<MedalResponse> addMedal(@PathVariable Long id,
                                                   @Valid @RequestBody MedalRequest request) {
        MedalResponse response = athleteService.addMedal(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
