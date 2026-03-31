package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_results", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"event_id", "athlete_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "athlete_id", nullable = false)
    private Athlete athlete;

    @Column(name = "place")
    private Integer place;

    @Column(name = "medal_type")
    private String medalType;

    @Column(name = "result_value")
    private String resultValue;
}
