package kg.gov.gafkis.esport.service;

import java.util.List;

/**
 * Статусная машина протоколов соревнований, загружаемых федерациями.
 * Подтверждено заказчиком (ответ Адыла №5, 2026-06-22): федерации сами загружают протоколы
 * в систему (а не специалист вбивает результаты вручную); специалист проверяет и публикует.
 *
 * Лестница: Подан → На проверке → [На доработке] → Опубликован
 *           Отклонён / Отозван — терминальные.
 */
public final class ProtocolWorkflow {

    private ProtocolWorkflow() {
    }

    /** Срок проверки протокола (рабочие дни). */
    public static final int TERM_DAYS = 5;

    public static final String SUBMITTED = "Подан";
    public static final String REVIEW = "На проверке";
    public static final String REVISION = "На доработке";
    public static final String PUBLISHED = "Опубликован";
    public static final String REJECTED = "Отклонён";
    public static final String WITHDRAWN = "Отозван";

    public static List<String> nextStatuses(String status) {
        if (status == null) {
            return List.of();
        }
        return switch (status) {
            case SUBMITTED -> List.of(REVIEW, WITHDRAWN);
            case REVIEW -> List.of(PUBLISHED, REVISION, REJECTED);
            case REVISION -> List.of(REVIEW, WITHDRAWN);
            default -> List.of(); // Опубликован / Отклонён / Отозван — терминальные
        };
    }
}
