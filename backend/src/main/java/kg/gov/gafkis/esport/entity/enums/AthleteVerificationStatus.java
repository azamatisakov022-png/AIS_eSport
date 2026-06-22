package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

/** Статус верификации записи спортсмена в реестре. */
@Getter
public enum AthleteVerificationStatus {

    DRAFT("Черновик"),
    IN_REVIEW("На проверке"),
    VERIFIED("Подтверждено"),
    REJECTED("Отклонено");

    private final String label;

    AthleteVerificationStatus(String label) {
        this.label = label;
    }
}
