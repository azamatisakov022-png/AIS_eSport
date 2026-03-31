package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum MedalType {

    GOLD("gold"),
    SILVER("silver"),
    BRONZE("bronze");

    private final String label;

    MedalType(String label) {
        this.label = label;
    }
}
