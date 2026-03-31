package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum AccreditationStatus {

    ACCREDITED("Аккредитована"),
    UNDER_REVIEW("На рассмотрении"),
    REVOKED("Отозвана");

    private final String label;

    AccreditationStatus(String label) {
        this.label = label;
    }
}
