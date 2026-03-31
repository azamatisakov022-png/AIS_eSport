package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "team_athletes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"team_id", "athlete_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamAthlete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "athlete_id", nullable = false)
    private Athlete athlete;

    @Column(name = "role")
    private String role;

    @Column(name = "since_year")
    private Integer sinceYear;
}
