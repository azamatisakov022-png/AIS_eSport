package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum EventType {

    INTERNATIONAL("international"),
    CHAMPIONSHIP("championship"),
    PREMIER("premier"),
    SPARTAKIAD("spartakiad"),
    TOURNAMENT("tournament"),
    OTHER("other");

    private final String label;

    EventType(String label) {
        this.label = label;
    }
}
