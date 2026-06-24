package kg.gov.gafkis.esport.service;

import java.util.List;

/**
 * Статусная машина перехода спортсмена в другой клуб.
 * Подтверждено заказчиком (ответ Адыла №13, 2026-06-22): переход подтверждают
 * старый клуб, новый клуб и федерация (последовательная цепочка подтверждений).
 *
 * Лестница:
 *  Подана → Подтверждён старым клубом → Подтверждён новым клубом → Подтверждён федерацией → Переход оформлен
 *  Отклонена (любой стороной, с причиной) / Отозвана — терминальные.
 */
public final class TransferWorkflow {

    private TransferWorkflow() {
    }

    /** Срок рассмотрения перехода (рабочие дни). */
    public static final int TERM_DAYS = 10;

    public static final String SUBMITTED = "Подана";
    public static final String OLD_CLUB_OK = "Подтверждён старым клубом";
    public static final String NEW_CLUB_OK = "Подтверждён новым клубом";
    public static final String FEDERATION_OK = "Подтверждён федерацией";
    public static final String COMPLETED = "Переход оформлен";
    public static final String REJECTED = "Отклонена";
    public static final String WITHDRAWN = "Отозвана";

    /** Допустимые следующие статусы из текущего. */
    public static List<String> nextStatuses(String status) {
        if (status == null) {
            return List.of();
        }
        return switch (status) {
            case SUBMITTED -> List.of(OLD_CLUB_OK, REJECTED, WITHDRAWN);
            case OLD_CLUB_OK -> List.of(NEW_CLUB_OK, REJECTED);
            case NEW_CLUB_OK -> List.of(FEDERATION_OK, REJECTED);
            case FEDERATION_OK -> List.of(COMPLETED);
            default -> List.of(); // Переход оформлен / Отклонена / Отозвана — терминальные
        };
    }
}
