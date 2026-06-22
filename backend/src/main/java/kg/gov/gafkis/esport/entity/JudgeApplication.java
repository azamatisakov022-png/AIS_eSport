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
@Table(name = "judge_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JudgeApplication {

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

    @Column(name = "sport")
    private String sport;

    @Column(name = "current_category")
    private String currentCategory;

    @Column(name = "requested_category")
    private String requestedCategory;

    @Column(name = "events_served")
    private Integer eventsServed;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "region")
    private String region;

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

    @Column(name = "reject_reason")
    private String rejectReason;

    /** Ссылка на запись в реестре судей после выдачи удостоверения. */
    @Column(name = "judge_id")
    private Long judgeId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "judgeApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<JudgeApplicationHistory> history = new ArrayList<>();
}
