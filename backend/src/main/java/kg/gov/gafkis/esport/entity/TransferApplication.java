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
@Table(name = "transfer_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "app_no", unique = true)
    private String appNo;

    /** Спортсмен из реестра (если привязан) — его клуб обновится при оформлении. */
    @Column(name = "athlete_id")
    private Long athleteId;

    @Column(name = "athlete_name")
    private String athleteName;

    @Column(name = "sport")
    private String sport;

    @Column(name = "old_club")
    private String oldClub;

    @Column(name = "new_club")
    private String newClub;

    @Column(name = "region")
    private String region;

    @Column(name = "reason")
    private String reason;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

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

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "transferApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TransferApplicationHistory> history = new ArrayList<>();
}
