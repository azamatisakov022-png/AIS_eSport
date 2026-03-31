package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.TeamAthlete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamAthleteRepository extends JpaRepository<TeamAthlete, Long> {

    Optional<TeamAthlete> findByTeamIdAndAthleteId(Long teamId, Long athleteId);

    boolean existsByTeamIdAndAthleteId(Long teamId, Long athleteId);
}
