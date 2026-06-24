package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kg.gov.gafkis.esport.dto.response.ApplicantNotificationResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.service.ApplicantNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/applicant-notifications")
@RequiredArgsConstructor
@Tag(name = "Applicant Notifications", description = "Уведомления заявителям о смене статуса заявок (e-mail)")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
public class ApplicantNotificationController {

    private final ApplicantNotificationService applicantNotificationService;

    @GetMapping
    @Operation(summary = "Лента уведомлений заявителю (опц. фильтр по e-mail)")
    public ResponseEntity<PagedResponse<ApplicantNotificationResponse>> getAll(
            @RequestParam(required = false) String email,
            @PageableDefault(size = 50, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(applicantNotificationService.getAll(email, pageable));
    }
}
