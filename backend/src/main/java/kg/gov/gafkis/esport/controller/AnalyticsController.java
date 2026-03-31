package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kg.gov.gafkis.esport.dto.response.AnalyticsResponse;
import kg.gov.gafkis.esport.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Аналитика и статистика")
@PreAuthorize("hasAnyRole('SUPERADMIN', 'EMPLOYEE')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/kpi")
    @Operation(summary = "Получить аналитику", description = "KPI, месячные данные, распределение по регионам и видам спорта")
    public ResponseEntity<AnalyticsResponse> getKpi(
            @Parameter(description = "Год для анализа")
            @RequestParam(required = false) Integer year) {
        int effectiveYear = (year != null) ? year : LocalDate.now().getYear();
        AnalyticsResponse response = analyticsService.getAnalytics(effectiveYear);
        return ResponseEntity.ok(response);
    }
}
