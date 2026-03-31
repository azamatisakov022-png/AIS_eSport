package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum Role {

    SUPERADMIN("Суперадмин"),
    ADMIN("Админ"),
    EMPLOYEE("Сотрудник"),
    ATHLETE("Спортсмен"),
    COACH("Тренер"),
    JUDGE("Судья");

    private final String label;

    Role(String label) {
        this.label = label;
    }
}
