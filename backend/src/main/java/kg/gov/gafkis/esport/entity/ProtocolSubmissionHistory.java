package kg.gov.gafkis.esport.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "protocol_submission_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProtocolSubmissionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "protocol_submission_id", nullable = false)
    private ProtocolSubmission protocolSubmission;

    @Column(name = "action")
    private String action;

    @Column(name = "user_name")
    private String userName;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
