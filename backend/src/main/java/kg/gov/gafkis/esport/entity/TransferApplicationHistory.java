package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "transfer_application_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferApplicationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transfer_application_id", nullable = false)
    private TransferApplication transferApplication;

    @Column(name = "action")
    private String action;

    @Column(name = "user_name")
    private String userName;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
