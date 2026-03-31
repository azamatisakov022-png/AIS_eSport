package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum EmploymentType {

    STAFF("Штатный"),
    PART_TIME("Совместитель");

    private final String label;

    EmploymentType(String label) {
        this.label = label;
    }
}
