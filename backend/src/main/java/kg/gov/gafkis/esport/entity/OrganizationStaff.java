package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "organization_staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(name = "name")
    private String name;

    @Column(name = "role")
    private String role;

    @Column(name = "rank")
    private String rank;
}
