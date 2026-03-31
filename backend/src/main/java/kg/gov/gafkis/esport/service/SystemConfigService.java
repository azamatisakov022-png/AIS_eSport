package kg.gov.gafkis.esport.service;

import kg.gov.gafkis.esport.entity.SystemConfig;
import kg.gov.gafkis.esport.repository.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SystemConfigService {

    private final SystemConfigRepository systemConfigRepository;

    @Transactional(readOnly = true)
    public Map<String, String> getAll() {
        return systemConfigRepository.findAll().stream()
                .collect(Collectors.toMap(SystemConfig::getKey, SystemConfig::getValue));
    }

    @Transactional(readOnly = true)
    public String get(String key) {
        return systemConfigRepository.findById(key)
                .map(SystemConfig::getValue)
                .orElse(null);
    }

    public void set(String key, String value) {
        SystemConfig config = systemConfigRepository.findById(key)
                .orElse(SystemConfig.builder()
                        .key(key)
                        .build());
        config.setValue(value);
        systemConfigRepository.save(config);
        log.info("Обновлён параметр конфигурации: {} = {}", key, value);
    }
}
