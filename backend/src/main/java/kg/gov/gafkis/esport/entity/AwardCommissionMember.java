package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "award_commission_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AwardCommissionMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "award_application_id", nullable = false)
    private AwardApplication awardApplication;

    @Column(name = "name")
    private String name;

    @Column(name = "position")
    private String position;
}
