package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.ProtocolSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProtocolSubmissionRepository extends JpaRepository<ProtocolSubmission, Long>,
        JpaSpecificationExecutor<ProtocolSubmission> {
}
