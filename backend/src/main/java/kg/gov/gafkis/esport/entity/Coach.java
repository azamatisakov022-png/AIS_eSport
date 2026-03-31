package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import kg.gov.gafkis.esport.entity.enums.Sex;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "coaches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coach {

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

    @Column(name = "cert_number")
    private String certNumber;

    @Column(name = "reg_date")
    private LocalDate regDate;

    @Column(name = "sport")
    private String sport;

    @Column(name = "rank")
    private String rank;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Column(name = "employment")
    private String employment;

    @Column(name = "region")
    private String region;

    @Column(name = "annulled", nullable = false)
    @Builder.Default
    private boolean annulled = false;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_archived", nullable = false)
    @Builder.Default
    private boolean isArchived = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
