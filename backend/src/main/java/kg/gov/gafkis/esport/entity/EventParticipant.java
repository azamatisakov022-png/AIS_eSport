package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_participants", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"event_id", "athlete_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "athlete_id", nullable = false)
    private Athlete athlete;

    @Column(name = "weight_class")
    private String weightClass;
}
