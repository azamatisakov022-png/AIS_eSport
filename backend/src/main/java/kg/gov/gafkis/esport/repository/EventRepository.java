package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {

    long countByStatus(String status);

    List<Event> findByStatusAndStartDateBetween(String status, LocalDate from, LocalDate to);
}
