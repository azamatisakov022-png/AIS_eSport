package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum TeamStatus {

    ACTIVE("active"),
    FORMING("forming"),
    DISBANDED("disbanded");

    private final String label;

    TeamStatus(String label) {
        this.label = label;
    }
}
