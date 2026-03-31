package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kg.gov.gafkis.esport.dto.request.UserCreateRequest;
import kg.gov.gafkis.esport.dto.request.UserUpdateRequest;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.UserResponse;
import kg.gov.gafkis.esport.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Управление пользователями системы")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Получить список пользователей", description = "Список пользователей с фильтрацией и пагинацией")
    public ResponseEntity<PagedResponse<UserResponse>> getAll(
            @Parameter(description = "Поиск по ФИО, логину или email") @RequestParam(required = false) String search,
            @Parameter(description = "Фильтр по роли") @RequestParam(required = false) String role,
            @PageableDefault(size = 20) Pageable pageable) {
        PagedResponse<UserResponse> response = userService.getAll(search, role, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить пользователя по ID", description = "Детальная информация о пользователе")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        UserResponse response = userService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Создать пользователя", description = "Создание нового пользователя администратором")
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        UserResponse response = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить пользователя", description = "Обновление данных пользователя")
    public ResponseEntity<UserResponse> update(@PathVariable Long id,
                                                @Valid @RequestBody UserUpdateRequest request) {
        UserResponse response = userService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/block")
    @Operation(summary = "Заблокировать/разблокировать пользователя", description = "Блокировка или разблокировка учётной записи")
    public ResponseEntity<Void> block(@PathVariable Long id,
                                       @RequestBody Map<String, Boolean> body) {
        boolean blocked = body.getOrDefault("blocked", false);
        userService.block(id, blocked);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/password")
    @Operation(summary = "Сбросить пароль", description = "Сброс пароля пользователя администратором")
    public ResponseEntity<Void> resetPassword(@PathVariable Long id,
                                               @RequestBody Map<String, String> body) {
        String newPassword = body.get("newPassword");
        userService.resetPassword(id, newPassword);
        return ResponseEntity.noContent().build();
    }
}
