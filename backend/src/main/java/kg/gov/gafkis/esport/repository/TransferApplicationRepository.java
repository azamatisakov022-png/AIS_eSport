package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.TransferApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TransferApplicationRepository extends JpaRepository<TransferApplication, Long>,
        JpaSpecificationExecutor<TransferApplication> {

    long countByStatus(String status);
}
