package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Протокол соревнования, загруженный федерацией (ответ Адыла №5).
 */
@Entity
@Table(name = "protocol_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProtocolSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "app_no", unique = true)
    private String appNo;

    @Column(name = "federation_name")
    private String federationName;

    @Column(name = "sport")
    private String sport;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "level")
    private String level;

    @Column(name = "city")
    private String city;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "Подан";

    @Column(name = "submit_date")
    private LocalDate submitDate;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "reject_reason")
    private String rejectReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "protocolSubmission", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProtocolResult> results = new ArrayList<>();

    @OneToMany(mappedBy = "protocolSubmission", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProtocolSubmissionHistory> history = new ArrayList<>();
}
