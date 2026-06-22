package kg.gov.gafkis.esport.service;

import java.util.List;

/**
 * Статусная машина присвоения судейских категорий.
 * Подтверждено заказчиком (ответ Адыла №10, 2026-06-22).
 *
 * Три трека по уровню категории:
 *  - regional      — II, III категории: региональный орган / аккредитованная федерация (без комиссии Агентства);
 *  - agency        — I, национальная, высшая национальная: Агентство через аттестационную комиссию;
 *  - international  — международная: международная федерация по представлению национальной, система записывает.
 *
 * Лестницы:
 *  regional:     Подана → Проверка документов → [На доработке] → Аттестация → Присвоено → Выдано удостоверение
 *  agency:       Подана → Проверка документов → [На доработке] → Аттестация → Рассмотрение комиссией → Присвоено → Выдано удостоверение
 *  international: Подана → Проверка документов → [На доработке] → Согласование Агентства → Передано в международную федерацию → Записано
 */
public final class JudgeWorkflow {

    private JudgeWorkflow() {
    }

    /** Срок проверки комплектности документов (рабочие дни). */
    public static final int DOC_CHECK_DAYS = 7;
    /** Срок рассмотрения аттестационной комиссией (рабочие дни). */
    public static final int TERM_DAYS = 10;

    public static final String SUBMITTED = "Подана";
    public static final String DOC_CHECK = "Проверка документов";
    public static final String REVISION = "На доработке";
    public static final String ATTESTATION = "Аттестация";
    public static final String COMMISSION = "Рассмотрение комиссией";
    public static final String AGENCY_APPROVAL = "Согласование Агентства";
    public static final String SENT_INTL = "Передано в международную федерацию";
    public static final String ASSIGNED = "Присвоено";
    public static final String ISSUED = "Выдано удостоверение";
    public static final String RECORDED = "Записано";
    public static final String REJECTED = "Отклонена";
    public static final String WITHDRAWN = "Отозвана";

    /** Трек обработки по запрашиваемой категории. */
    public static String track(String category) {
        if (category == null) {
            return "regional";
        }
        String u = category.toUpperCase();
        if (u.contains("МЕЖДУНАР")) {
            return "international";
        }
        if (u.contains("ВЫСШ") || u.contains("НАЦИОНАЛ") || u.startsWith("I КАТЕГ") || u.equals("I")) {
            return "agency";
        }
        return "regional"; // II, III категории
    }

    public static String trackLabel(String track) {
        return switch (track == null ? "regional" : track) {
            case "international" -> "Международная федерация (через Агентство)";
            case "agency" -> "Агентство — аттестационная комиссия";
            default -> "Региональный орган / аккредитованная федерация";
        };
    }

    /** Кто присваивает категорию (ответ Адыла №10). */
    public static String assignedBy(String category) {
        if (category == null) {
            return "—";
        }
        String u = category.toUpperCase();
        if (u.contains("МЕЖДУНАР")) {
            return "Международная федерация по представлению национальной";
        }
        if (u.contains("ВЫСШ") || u.contains("НАЦИОНАЛ")) {
            return "Агентство по решению аттестационной комиссии";
        }
        if (u.startsWith("III")) {
            return "Региональный орган / аккредитованная федерация";
        }
        if (u.startsWith("II")) {
            return "Региональный орган или республиканская федерация";
        }
        if (u.startsWith("I")) {
            return "Агентство либо уполномоченная республиканская федерация";
        }
        return "Региональный орган / аккредитованная федерация";
    }

    /** Допустимые следующие статусы с учётом трека. */
    public static List<String> nextStatuses(String status, String track) {
        if (status == null) {
            return List.of();
        }
        return switch (status) {
            case SUBMITTED -> List.of(DOC_CHECK, WITHDRAWN);
            case DOC_CHECK -> "international".equals(track)
                    ? List.of(AGENCY_APPROVAL, REVISION, REJECTED)
                    : List.of(ATTESTATION, REVISION, REJECTED);
            case REVISION -> List.of(DOC_CHECK, WITHDRAWN);
            case ATTESTATION -> "agency".equals(track)
                    ? List.of(COMMISSION, REJECTED)
                    : List.of(ASSIGNED, REJECTED);
            case COMMISSION -> List.of(ASSIGNED, REJECTED);
            case AGENCY_APPROVAL -> List.of(SENT_INTL, REJECTED);
            case SENT_INTL -> List.of(RECORDED);
            case ASSIGNED -> List.of(ISSUED);
            default -> List.of(); // Выдано удостоверение / Записано / Отклонена / Отозвана — терминальные
        };
    }

    /** Создаётся ли запись в реестре судей при данном статусе. */
    public static boolean issuesCertificate(String status) {
        return ISSUED.equals(status) || RECORDED.equals(status);
    }
}
