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
@Table(name = "restoration_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestorationApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "app_no", unique = true)
    private String appNo;

    @Column(name = "applicant_name")
    private String applicantName;

    @Column(name = "inn")
    private String inn;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    /** Тип документа: «Свидетельство о спортивном звании», «Судейское удостоверение» и т.д. */
    @Column(name = "doc_type")
    private String docType;

    /** Причина: «Утеря», «Порча / повреждение», «Кража». */
    @Column(name = "reason")
    private String reason;

    /** Номер утраченного документа (если известен). */
    @Column(name = "old_number")
    private String oldNumber;

    @Column(name = "issue_date")
    private LocalDate issueDate;

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

    /** Номер выданного дубликата. */
    @Column(name = "dup_number")
    private String dupNumber;

    /** Старый документ помечен недействительным. */
    @Column(name = "old_invalidated", nullable = false)
    @Builder.Default
    private boolean oldInvalidated = false;

    @Column(name = "reject_reason")
    private String rejectReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "restorationApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RestorationApplicationHistory> history = new ArrayList<>();
}
