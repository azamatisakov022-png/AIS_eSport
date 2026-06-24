package kg.gov.gafkis.esport.service;

import java.util.List;

/**
 * Статусная машина аккредитации спортивных федераций.
 * Подтверждено заказчиком (ответ Адыла №12, 2026-06-22): срок рассмотрения 14 рабочих дней;
 * «приостановить» = федерация теряет права аккредитованной (не представляет вид спорта в гос.органах,
 * ограничение в гос.финансировании, не выдвигает кандидатов).
 *
 * Жизненный цикл:
 *  Подана → Проверка документов → [На доработке] → Аккредитована ↔ Приостановлена → Аккредитация отозвана
 *  Отклонена / Отозвана — терминальные на этапе рассмотрения.
 */
public final class AccreditationWorkflow {

    private AccreditationWorkflow() {
    }

    /** Срок рассмотрения заявки (рабочие дни). */
    public static final int TERM_DAYS = 14;
    /** Срок действия аккредитации (лет). */
    public static final int VALIDITY_YEARS = 4;

    public static final String SUBMITTED = "Подана";
    public static final String DOC_CHECK = "Проверка документов";
    public static final String REVISION = "На доработке";
    public static final String ACCREDITED = "Аккредитована";
    public static final String SUSPENDED = "Приостановлена";
    public static final String REVOKED = "Аккредитация отозвана";
    public static final String REJECTED = "Отклонена";
    public static final String WITHDRAWN = "Отозвана";

    /** Допустимые следующие статусы из текущего. */
    public static List<String> nextStatuses(String status) {
        if (status == null) {
            return List.of();
        }
        return switch (status) {
            case SUBMITTED -> List.of(DOC_CHECK, WITHDRAWN);
            case DOC_CHECK -> List.of(ACCREDITED, REVISION, REJECTED);
            case REVISION -> List.of(DOC_CHECK, WITHDRAWN);
            case ACCREDITED -> List.of(SUSPENDED, REVOKED);
            case SUSPENDED -> List.of(ACCREDITED, REVOKED); // Аккредитована = возобновить
            default -> List.of(); // Аккредитация отозвана / Отклонена / Отозвана — терминальные
        };
    }
}
