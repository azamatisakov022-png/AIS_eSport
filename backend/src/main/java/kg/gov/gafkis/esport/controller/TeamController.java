package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.TeamAthleteRequest;
import kg.gov.gafkis.esport.dto.request.TeamCoachRequest;
import kg.gov.gafkis.esport.dto.request.TeamCreateRequest;
import kg.gov.gafkis.esport.dto.request.TeamUpdateRequest;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.TeamAthleteResponse;
import kg.gov.gafkis.esport.dto.response.TeamCoachResponse;
import kg.gov.gafkis.esport.dto.response.TeamListResponse;
import kg.gov.gafkis.esport.dto.response.TeamResponse;
import kg.gov.gafkis.esport.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
@Tag(name = "Teams", description = "API для управления командами")
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    @Operation(summary = "Список команд", description = "Получение списка команд с фильтрацией и пагинацией")
    public ResponseEntity<PagedResponse<TeamListResponse>> getAll(
            @Parameter(description = "Поиск по названию") @RequestParam(required = false) String search,
            @Parameter(description = "Фильтр по виду спорта") @RequestParam(required = false) String sport,
            @Parameter(description = "Фильтр по возрастной категории") @RequestParam(required = false) String ageCategory,
            @Parameter(description = "Фильтр по полу") @RequestParam(required = false) String gender,
            @Parameter(description = "Фильтр по статусу") @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(teamService.getAll(search, sport, ageCategory, gender, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить команду", description = "Получение команды по ID")
    public ResponseEntity<TeamResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Создать команду", description = "Создание новой команды")
    public ResponseEntity<TeamResponse> create(@Valid @RequestBody TeamCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(teamService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить команду", description = "Обновление данных команды")
    public ResponseEntity<TeamResponse> update(@PathVariable Long id,
                                                @Valid @RequestBody TeamUpdateRequest request) {
        return ResponseEntity.ok(teamService.update(id, request));
    }

    @PatchMapping("/{id}/disband")
    @Operation(summary = "Расформировать команду", description = "Перевод команды в статус disbanded")
    public ResponseEntity<Void> disband(@PathVariable Long id) {
        teamService.disband(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/athletes")
    @Operation(summary = "Добавить спортсмена в команду", description = "Добавление спортсмена в состав команды")
    public ResponseEntity<TeamAthleteResponse> addAthlete(@PathVariable Long id,
                                                            @Valid @RequestBody TeamAthleteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(teamService.addAthlete(id, request));
    }

    @DeleteMapping("/{id}/athletes/{athleteId}")
    @Operation(summary = "Удалить спортсмена из команды", description = "Удаление спортсмена из состава команды")
    public ResponseEntity<Void> removeAthlete(@PathVariable Long id,
                                                @PathVariable Long athleteId) {
        teamService.removeAthlete(id, athleteId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/coaches")
    @Operation(summary = "Добавить тренера в команду", description = "Добавление тренера в состав команды")
    public ResponseEntity<TeamCoachResponse> addCoach(@PathVariable Long id,
                                                        @Valid @RequestBody TeamCoachRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(teamService.addCoach(id, request));
    }

    @DeleteMapping("/{id}/coaches/{coachId}")
    @Operation(summary = "Удалить тренера из команды", description = "Удаление тренера из состава команды")
    public ResponseEntity<Void> removeCoach(@PathVariable Long id,
                                              @PathVariable Long coachId) {
        teamService.removeCoach(id, coachId);
        return ResponseEntity.noContent().build();
    }
}
