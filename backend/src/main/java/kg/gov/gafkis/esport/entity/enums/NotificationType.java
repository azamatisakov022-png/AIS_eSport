package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum NotificationType {

    INFO("info"),
    WARNING("warning"),
    ERROR("error"),
    SUCCESS("success");

    private final String label;

    NotificationType(String label) {
        this.label = label;
    }
}
