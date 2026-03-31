package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum OrganizationType {

    FEDERATION("federation"),
    SCHOOL("school"),
    CLUB("club"),
    ASSOCIATION("association"),
    LEAGUE("league");

    private final String label;

    OrganizationType(String label) {
        this.label = label;
    }
}
