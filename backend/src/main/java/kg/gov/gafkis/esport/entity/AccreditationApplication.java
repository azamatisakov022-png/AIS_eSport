package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "accreditation_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccreditationApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "app_no", unique = true)
    private String appNo;

    @Column(name = "federation_name")
    private String federationName;

    @Column(name = "sport")
    private String sport;

    @Column(name = "inn")
    private String inn;

    @Column(name = "head_name")
    private String headName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    /** Связь с реестром организаций (если федерация уже заведена). */
    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "Подана";

    @Column(name = "docs_uploaded", nullable = false)
    @Builder.Default
    private int docsUploaded = 0;

    @Column(name = "docs_total", nullable = false)
    @Builder.Default
    private int docsTotal = 0;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "submit_date")
    private LocalDate submitDate;

    /** Номер свидетельства об аккредитации. */
    @Column(name = "accreditation_number")
    private String accreditationNumber;

    @Column(name = "accreditation_end")
    private LocalDate accreditationEnd;

    /** Причина приостановки прав аккредитованной федерации. */
    @Column(name = "suspension_reason")
    private String suspensionReason;

    @Column(name = "reject_reason")
    private String rejectReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "accreditationApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AccreditationApplicationHistory> history = new ArrayList<>();
}
