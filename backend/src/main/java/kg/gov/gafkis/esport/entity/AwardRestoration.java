package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "award_restorations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AwardRestoration {

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

    @Column(name = "submit_date")
    private LocalDate submitDate;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "votes")
    private String votes;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "\u041D\u0430 \u0440\u0430\u0441\u0441\u043C\u043E\u0442\u0440\u0435\u043D\u0438\u0438";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
