package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.EventParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {

    List<EventParticipant> findByEventId(Long eventId);

    void deleteByEventIdAndAthleteId(Long eventId, Long athleteId);

    boolean existsByEventIdAndAthleteId(Long eventId, Long athleteId);
}
