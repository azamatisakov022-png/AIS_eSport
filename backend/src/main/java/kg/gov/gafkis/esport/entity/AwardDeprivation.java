package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "award_deprivations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AwardDeprivation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "athlete_id")
    private Athlete athlete;

    @Column(name = "name")
    private String name;

    @Column(name = "award")
    private String award;

    @Column(name = "sport")
    private String sport;

    @Column(name = "reason")
    private String reason;

    @Column(name = "initiated_date")
    private LocalDate initiatedDate;

    @Column(name = "appeal_deadline")
    private LocalDate appealDeadline;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "\u041D\u0430 \u0440\u0430\u0441\u0441\u043C\u043E\u0442\u0440\u0435\u043D\u0438\u0438";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
