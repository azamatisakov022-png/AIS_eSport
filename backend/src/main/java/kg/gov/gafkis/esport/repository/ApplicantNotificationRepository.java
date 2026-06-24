package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.ApplicantNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicantNotificationRepository extends JpaRepository<ApplicantNotification, Long>,
        JpaSpecificationExecutor<ApplicantNotification> {
}
