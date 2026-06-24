package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.TrainerApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainerApplicationRepository extends JpaRepository<TrainerApplication, Long>,
        JpaSpecificationExecutor<TrainerApplication> {

    long countByStatus(String status);

    /** Сколько свидетельств уже выдано (сквозная нумерация, без коллизий при registered→annulled). */
    long countByCertNumberNotNull();

    /** Поиск по номеру свидетельства (для публичной проверки). */
    Optional<TrainerApplication> findFirstByCertNumber(String certNumber);
}
