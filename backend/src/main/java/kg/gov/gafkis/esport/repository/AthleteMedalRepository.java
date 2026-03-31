package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.AthleteMedal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AthleteMedalRepository extends JpaRepository<AthleteMedal, Long> {

    List<AthleteMedal> findByAthleteId(Long athleteId);
}
