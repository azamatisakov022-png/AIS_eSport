package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum DocumentType {

    PASSPORT("Копия паспорта"),
    PHOTO("Фотографии"),
    DIPLOMA("Диплом"),
    MEDICAL("Медсправка"),
    RANK_CERT("Свидетельство о звании"),
    PROTOCOL("Протокол соревнований"),
    BACKGROUND_CHECK("Справка о несудимости"),
    EMPLOYMENT_RECORD("Копия трудовой книжки"),
    CHARTER("Устав"),
    REGISTRATION_CERT("Свидетельство о регистрации"),
    OTHER("Другое");

    private final String label;

    DocumentType(String label) {
        this.label = label;
    }
}
