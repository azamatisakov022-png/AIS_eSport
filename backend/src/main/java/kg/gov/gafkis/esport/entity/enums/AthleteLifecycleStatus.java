package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

/** Жизненный цикл спортсмена в реестре. */
@Getter
public enum AthleteLifecycleStatus {

    ACTIVE("Активный"),
    INACTIVE("Временно не участвует"),
    SUSPENDED("Приостановлен"),
    DISQUALIFIED("Дисквалифицирован"),
    RETIRED("Завершил карьеру"),
    EXCLUDED("Исключён");

    private final String label;

    AthleteLifecycleStatus(String label) {
        this.label = label;
    }
}
