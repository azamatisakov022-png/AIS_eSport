package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trainer_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "app_no", unique = true)
    private String appNo;

    @Column(name = "applicant_name")
    private String applicantName;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "sport")
    private String sport;

    @Column(name = "submit_date")
    private LocalDate submitDate;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "submitted";

    @Column(name = "docs_uploaded", nullable = false)
    @Builder.Default
    private int docsUploaded = 0;

    @Column(name = "docs_total", nullable = false)
    @Builder.Default
    private int docsTotal = 5;

    @Column(name = "cert_number")
    private String certNumber;

    @Column(name = "tunduk_verified", nullable = false)
    @Builder.Default
    private boolean tundukVerified = false;

    @Column(name = "deadline")
    private LocalDate deadline;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
