package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum JudgeCategory {

    INTERNATIONAL("Международная"),
    NATIONAL("Национальная"),
    FIRST("I категория"),
    SPORT_JUDGE("Судья по спорту");

    private final String label;

    JudgeCategory(String label) {
        this.label = label;
    }
}
