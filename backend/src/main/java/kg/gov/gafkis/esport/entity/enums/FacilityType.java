package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum FacilityType {

    STADIUM("stadium"),
    ARENA("arena"),
    POOL("pool"),
    GYM("gym"),
    DYUSH("dyush"),
    UOR("uor"),
    MANEGE("manege"),
    OTHER("other");

    private final String label;

    FacilityType(String label) {
        this.label = label;
    }
}
