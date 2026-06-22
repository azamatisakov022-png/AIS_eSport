package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.JudgeApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface JudgeApplicationRepository extends JpaRepository<JudgeApplication, Long>,
        JpaSpecificationExecutor<JudgeApplication> {

    long countByStatus(String status);
}
