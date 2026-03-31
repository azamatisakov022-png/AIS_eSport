package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum Sex {

    MALE("М"),
    FEMALE("Ж");

    private final String label;

    Sex(String label) {
        this.label = label;
    }
}
