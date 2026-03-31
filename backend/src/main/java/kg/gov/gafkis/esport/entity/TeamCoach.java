package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "team_coaches", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"team_id", "coach_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamCoach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;

    @Column(name = "role")
    private String role;
}
