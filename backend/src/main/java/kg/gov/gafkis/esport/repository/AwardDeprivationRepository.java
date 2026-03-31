package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.AwardDeprivation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AwardDeprivationRepository extends JpaRepository<AwardDeprivation, Long> {
}
