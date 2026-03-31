package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kg.gov.gafkis.esport.dto.response.NotificationResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.security.CurrentUser;
import kg.gov.gafkis.esport.security.UserPrincipal;
import kg.gov.gafkis.esport.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Уведомления пользователя")
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Получить уведомления", description = "Список уведомлений текущего пользователя с пагинацией")
    public ResponseEntity<PagedResponse<NotificationResponse>> getAll(
            @CurrentUser UserPrincipal currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        PagedResponse<NotificationResponse> response = notificationService.getByUser(currentUser.getId(), pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Отметить как прочитанное", description = "Пометить одно уведомление как прочитанное")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        notificationService.markRead(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/read-all")
    @Operation(summary = "Прочитать все", description = "Пометить все уведомления текущего пользователя как прочитанные")
    public ResponseEntity<Void> markAllRead(@CurrentUser UserPrincipal currentUser) {
        notificationService.markAllRead(currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    @Operation(summary = "Количество непрочитанных", description = "Получить количество непрочитанных уведомлений")
    public ResponseEntity<Map<String, Long>> countUnread(@CurrentUser UserPrincipal currentUser) {
        long count = notificationService.countUnread(currentUser.getId());
        return ResponseEntity.ok(Map.of("unread", count));
    }
}
