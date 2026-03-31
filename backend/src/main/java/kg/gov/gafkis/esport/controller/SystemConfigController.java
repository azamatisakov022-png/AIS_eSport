package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kg.gov.gafkis.esport.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/system-config")
@RequiredArgsConstructor
@Tag(name = "System Config", description = "Системные настройки приложения")
@PreAuthorize("hasRole('SUPERADMIN')")
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    @GetMapping
    @Operation(summary = "Получить все настройки", description = "Возвращает все системные настройки в формате ключ-значение")
    public ResponseEntity<Map<String, String>> getAll() {
        Map<String, String> config = systemConfigService.getAll();
        return ResponseEntity.ok(config);
    }

    @PutMapping
    @Operation(summary = "Обновить настройки", description = "Обновление системных настроек (карта ключ-значение)")
    public ResponseEntity<Void> update(@RequestBody Map<String, String> configMap) {
        configMap.forEach(systemConfigService::set);
        return ResponseEntity.noContent().build();
    }
}
