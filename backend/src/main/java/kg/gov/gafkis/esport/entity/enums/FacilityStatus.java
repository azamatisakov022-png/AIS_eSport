package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum FacilityStatus {

    ACTIVE("active"),
    RECONSTRUCTION("reconstruction"),
    CLOSED("closed");

    private final String label;

    FacilityStatus(String label) {
        this.label = label;
    }
}
