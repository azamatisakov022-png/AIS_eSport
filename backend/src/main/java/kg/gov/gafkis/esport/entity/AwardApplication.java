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
@Table(name = "award_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AwardApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "app_no", unique = true)
    private String appNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "athlete_id")
    private Athlete athlete;

    @Column(name = "applicant_name")
    private String applicantName;

    @Column(name = "award")
    private String award;

    @Column(name = "sport")
    private String sport;

    @Column(name = "submit_date")
    private LocalDate submitDate;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "\u041F\u043E\u0434\u0430\u043D\u0430";

    @Column(name = "docs_uploaded", nullable = false)
    @Builder.Default
    private int docsUploaded = 0;

    @Column(name = "docs_total", nullable = false)
    @Builder.Default
    private int docsTotal = 0;

    @Column(name = "award_group")
    private String awardGroup;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "conclusion")
    private String conclusion;

    @Column(name = "reject_reason")
    private String rejectReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "awardApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AwardCommissionMember> commissionMembers = new ArrayList<>();

    @OneToMany(mappedBy = "awardApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AwardApplicationHistory> history = new ArrayList<>();
}
