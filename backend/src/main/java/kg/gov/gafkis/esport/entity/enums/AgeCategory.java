package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum AgeCategory {

    ADULTS("Взрослые"),
    JUNIORS("Юниоры"),
    CADETS("Кадеты"),
    VETERANS("Ветераны");

    private final String label;

    AgeCategory(String label) {
        this.label = label;
    }
}
