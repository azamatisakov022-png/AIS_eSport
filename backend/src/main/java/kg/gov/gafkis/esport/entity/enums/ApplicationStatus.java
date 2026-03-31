package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum ApplicationStatus {

    SUBMITTED("Подана"),
    REVIEWING("На рассмотрении"),
    NEEDS_REVISION("Требует доработки"),
    AWARDED("Присвоено"),
    REJECTED("Отказано");

    private final String label;

    ApplicationStatus(String label) {
        this.label = label;
    }
}
