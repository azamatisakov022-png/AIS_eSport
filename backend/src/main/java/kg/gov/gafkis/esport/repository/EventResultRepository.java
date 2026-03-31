package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.EventResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventResultRepository extends JpaRepository<EventResult, Long> {

    List<EventResult> findByEventId(Long eventId);
}
