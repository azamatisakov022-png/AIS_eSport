package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;

/** Строка результата в протоколе соревнования (спортсмен — место — медаль). */
@Entity
@Table(name = "protocol_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProtocolResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "protocol_submission_id", nullable = false)
    private ProtocolSubmission protocolSubmission;

    @Column(name = "athlete_name")
    private String athleteName;

    @Column(name = "discipline")
    private String discipline;

    @Column(name = "place")
    private Integer place;

    @Column(name = "medal_type")
    private String medalType;
}
