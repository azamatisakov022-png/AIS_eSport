package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum EventStatus {

    PLANNED("planned"),
    LIVE("live"),
    FINISHED("finished"),
    CANCELLED("cancelled");

    private final String label;

    EventStatus(String label) {
        this.label = label;
    }
}
