package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum EventLevel {

    REPUBLICAN("Республиканский"),
    INTERNATIONAL("Международный");

    private final String label;

    EventLevel(String label) {
        this.label = label;
    }
}
