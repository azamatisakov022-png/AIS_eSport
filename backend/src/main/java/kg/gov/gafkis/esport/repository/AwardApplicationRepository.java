package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.AwardApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AwardApplicationRepository extends JpaRepository<AwardApplication, Long>,
        JpaSpecificationExecutor<AwardApplication> {

    long countByStatus(String status);
}
