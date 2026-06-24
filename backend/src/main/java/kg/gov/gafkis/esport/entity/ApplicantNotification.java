package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Уведомление заявителю (гражданину/организации) о смене статуса его заявки.
 * Канал — только e-mail (решение заказчика 2026-06-24; СМС не используется).
 * В прототипе реальная отправка письма не выполняется — фиксируется факт и адрес;
 * реальный SMTP подключается отдельным модулем.
 */
@Entity
@Table(name = "applicant_notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_email")
    private String recipientEmail;

    @Column(name = "recipient_name")
    private String recipientName;

    /** Услуга: «Звание/разряд», «Судейская категория», «Свидетельство тренера» и т.д. */
    @Column(name = "service_type")
    private String serviceType;

    @Column(name = "app_no")
    private String appNo;

    @Column(name = "status")
    private String status;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    /** Канал доставки (email). */
    @Column(name = "channel", nullable = false)
    @Builder.Default
    private String channel = "email";

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean isRead = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
