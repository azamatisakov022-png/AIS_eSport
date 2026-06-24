package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * Результат публичной проверки документа по номеру (QR).
 * Причина недействительности/приостановки видна всем (ответ Адыла №14).
 */
@Data
@Builder
public class DocumentVerifyResponse {

    private String code;
    private boolean found;
    /** Тип документа: «Судейское удостоверение», «Свидетельство тренера», «Свидетельство об аккредитации». */
    private String docType;
    private String holder;
    /** «Действителен» / «Приостановлен» / «Недействителен». */
    private String statusLabel;
    private boolean valid;
    /** Причина приостановки/недействительности (если есть). */
    private String reason;
    private LocalDate issued;
    private LocalDate validUntil;
    /** Доп. сведения (категория, вид спорта и т.п.). */
    private String extra;
}
