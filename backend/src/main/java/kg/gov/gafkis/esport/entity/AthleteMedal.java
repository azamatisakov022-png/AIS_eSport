package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "athlete_medals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AthleteMedal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "athlete_id", nullable = false)
    private Athlete athlete;

    @Column(name = "medal_type")
    private String medalType;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "year")
    private int year;

    @Column(name = "country")
    private String country;
}
