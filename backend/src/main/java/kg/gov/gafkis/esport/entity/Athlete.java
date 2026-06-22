package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import kg.gov.gafkis.esport.entity.enums.AthleteLifecycleStatus;
import kg.gov.gafkis.esport.entity.enums.AthleteVerificationStatus;
import kg.gov.gafkis.esport.entity.enums.Sex;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "athletes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Athlete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "sex")
    private Sex sex;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "region")
    private String region;

    @Column(name = "sport")
    private String sport;

    @Column(name = "rank")
    private String rank;

    @Column(name = "coach_name")
    private String coachName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id")
    private Coach coach;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(name = "med_exp_date")
    private LocalDate medExpDate;

    @Column(name = "med_issued_date")
    private LocalDate medIssuedDate;

    @Column(name = "med_issued_by")
    private String medIssuedBy;

    @Column(name = "ins_exp_date")
    private LocalDate insExpDate;

    @Column(name = "is_archived", nullable = false)
    @Builder.Default
    private boolean isArchived = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 20)
    @Builder.Default
    private AthleteVerificationStatus verificationStatus = AthleteVerificationStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "lifecycle_status", nullable = false, length = 20)
    @Builder.Default
    private AthleteLifecycleStatus lifecycleStatus = AthleteLifecycleStatus.ACTIVE;

    @Column(name = "status_note", length = 500)
    private String statusNote;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "athlete", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AthleteMedal> medals = new ArrayList<>();
}
