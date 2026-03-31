package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.TeamCoach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamCoachRepository extends JpaRepository<TeamCoach, Long> {

    Optional<TeamCoach> findByTeamIdAndCoachId(Long teamId, Long coachId);

    boolean existsByTeamIdAndCoachId(Long teamId, Long coachId);
}
