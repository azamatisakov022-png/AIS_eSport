package kg.gov.gafkis.esport.service;

import java.util.List;

/**
 * Статусная машина восстановления (выдачи дубликата) спортивного документа.
 * Подтверждено заказчиком (ответ Адыла №11, 2026-06-22): дубликат выдаётся по приказу
 * на основании заявления и справки об утере/порче; старый документ помечается недействительным.
 * Срок рассмотрения — 7 рабочих дней.
 *
 * Лестница: Подана → Проверка документов → [На доработке] → Приказ подписан → Выдан дубликат
 * Терминальные: Выдан дубликат, Отклонена, Отозвана.
 */
public final class RestorationWorkflow {

    private RestorationWorkflow() {
    }

    /** Срок рассмотрения заявления (рабочие дни). */
    public static final int TERM_DAYS = 7;

    public static final String SUBMITTED = "Подана";
    public static final String DOC_CHECK = "Проверка документов";
    public static final String REVISION = "На доработке";
    public static final String ORDER_SIGNED = "Приказ подписан";
    public static final String DUPLICATE_ISSUED = "Выдан дубликат";
    public static final String REJECTED = "Отклонена";
    public static final String WITHDRAWN = "Отозвана";

    /** Допустимые следующие статусы из текущего. */
    public static List<String> nextStatuses(String status) {
        if (status == null) {
            return List.of();
        }
        return switch (status) {
            case SUBMITTED -> List.of(DOC_CHECK, WITHDRAWN);
            case DOC_CHECK -> List.of(ORDER_SIGNED, REVISION, REJECTED);
            case REVISION -> List.of(DOC_CHECK, WITHDRAWN);
            case ORDER_SIGNED -> List.of(DUPLICATE_ISSUED);
            default -> List.of(); // Выдан дубликат / Отклонена / Отозвана — терминальные
        };
    }
}
