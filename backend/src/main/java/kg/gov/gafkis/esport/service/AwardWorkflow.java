package kg.gov.gafkis.esport.service;

import java.util.List;

/**
 * Статусная машина присвоения спортивных званий и разрядов.
 * Подтверждено заказчиком (Управление развития массового спорта, ответы Адыла 2026-06-22).
 *
 * Три трека в зависимости от звания:
 *  - direct     — разряды (I-III, юношеские) и КМС: рассматривает один специалист, без комиссии;
 *  - commission — Мастер спорта, МСМК, Заслуженный тренер, ведомственные звания: через комиссию Агентства;
 *  - cabmin     — Заслуженный мастер спорта: комиссия Агентства, затем решение Кабинета Министров.
 *
 * Общая лестница:
 *  Подана → Проверка комплектности → [На доработке] → На рассмотрении → Одобрено
 *         → (только cabmin: Ожидание решения Кабмина) → Приказ подписан → Присвоено
 *  Терминальные: Присвоено, Отклонена, Отозвана.
 */
public final class AwardWorkflow {

    private AwardWorkflow() {
    }

    /** Срок на проверку комплектности документов (рабочие дни). */
    public static final int COMPLETENESS_DAYS = 7;

    public static final String SUBMITTED = "Подана";
    public static final String COMPLETENESS = "Проверка комплектности";
    public static final String REVISION = "На доработке";
    public static final String REVIEW = "На рассмотрении";
    public static final String APPROVED = "Одобрено";
    public static final String AWAIT_CABMIN = "Ожидание решения Кабмина";
    public static final String ORDER_SIGNED = "Приказ подписан";
    public static final String ASSIGNED = "Присвоено";
    public static final String REJECTED = "Отклонена";
    public static final String WITHDRAWN = "Отозвана";

    /** Трек обработки по тексту звания/разряда. */
    public static String track(String award) {
        if (award == null) {
            return "direct";
        }
        String u = award.toUpperCase();
        if (u.contains("ЗМС") || u.contains("ЗАСЛУЖЕННЫЙ МАСТЕР")) {
            return "cabmin";
        }
        if (u.contains("КМС") || u.contains("КАНДИДАТ")) {
            return "direct";
        }
        if (u.contains("МСМК") || u.contains("МАСТЕР СПОРТА") || u.contains("МС КР")
                || u.contains("ЗАСЛУЖЕННЫЙ ТРЕНЕР") || u.contains("ЗТ ") || u.endsWith("ЗТ")
                || u.contains("ПОЧЁТ") || u.contains("ПОЧЕТ") || u.contains("ВЕДОМСТВ")) {
            return "commission";
        }
        return "direct"; // разряды
    }

    /** Человекочитаемое описание трека. */
    public static String trackLabel(String track) {
        return switch (track == null ? "direct" : track) {
            case "cabmin" -> "Через комиссию Агентства и Кабинет Министров";
            case "commission" -> "Через комиссию Агентства";
            default -> "Без комиссии (специалист управления)";
        };
    }

    /** Допустимые следующие статусы из текущего, с учётом трека. */
    public static List<String> nextStatuses(String status, String track) {
        if (status == null) {
            return List.of();
        }
        return switch (status) {
            case SUBMITTED -> List.of(COMPLETENESS, WITHDRAWN);
            case COMPLETENESS -> List.of(REVIEW, REVISION, WITHDRAWN);
            case REVISION -> List.of(COMPLETENESS, WITHDRAWN);
            case REVIEW -> List.of(APPROVED, REVISION, REJECTED);
            case APPROVED -> "cabmin".equals(track) ? List.of(AWAIT_CABMIN) : List.of(ORDER_SIGNED);
            case AWAIT_CABMIN -> List.of(ORDER_SIGNED, REJECTED);
            case ORDER_SIGNED -> List.of(ASSIGNED);
            default -> List.of(); // Присвоено / Отклонена / Отозвана — терминальные
        };
    }

    /** Срок услуги (рабочие дни), стартует после приёма всех документов. */
    public static int serviceTermDays(String group) {
        return switch (group == null ? "C" : group) {
            case "A" -> 30;
            case "B" -> 20;
            default -> 15;
        };
    }
}
