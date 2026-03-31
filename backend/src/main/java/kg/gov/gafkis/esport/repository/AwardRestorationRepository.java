package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.AwardRestoration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AwardRestorationRepository extends JpaRepository<AwardRestoration, Long> {
}
