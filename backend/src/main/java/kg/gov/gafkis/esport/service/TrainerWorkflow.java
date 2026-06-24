package kg.gov.gafkis.esport.service;

import java.util.List;

/**
 * Статусная машина заявок на свидетельство тренера.
 * Подтверждено заказчиком (ответ Адыла №9, 2026-06-22): свидетельство выдаётся на 3 года,
 * продление каждые 3 года через переаттестацию и дополнительное обучение.
 *
 * Коды статусов совпадают с фронтендом (i18n-подписи trainerApplications.statuses.*):
 *  submitted → review → [revision] → registered → [annulled]; rejected — отказ.
 */
public final class TrainerWorkflow {

    private TrainerWorkflow() {
    }

    /** Срок действия свидетельства тренера (лет). */
    public static final int CERT_VALIDITY_YEARS = 3;
    /** Срок рассмотрения заявки (рабочие дни). */
    public static final int TERM_DAYS = 15;

    public static final String SUBMITTED = "submitted";
    public static final String REVIEW = "review";
    public static final String REVISION = "revision";
    public static final String REGISTERED = "registered";
    public static final String REJECTED = "rejected";
    public static final String ANNULLED = "annulled";

    /** Допустимые следующие статусы из текущего. */
    public static List<String> nextStatuses(String status) {
        if (status == null) {
            return List.of();
        }
        return switch (status) {
            case SUBMITTED -> List.of(REVIEW, REJECTED);
            case REVIEW -> List.of(REGISTERED, REVISION, REJECTED);
            case REVISION -> List.of(REVIEW, REJECTED);
            case REGISTERED -> List.of(ANNULLED);
            default -> List.of(); // rejected / annulled — терминальные
        };
    }
}
