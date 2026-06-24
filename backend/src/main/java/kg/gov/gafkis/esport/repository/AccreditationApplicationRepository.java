package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.AccreditationApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccreditationApplicationRepository extends JpaRepository<AccreditationApplication, Long>,
        JpaSpecificationExecutor<AccreditationApplication> {

    long countByStatus(String status);

    /** Сколько свидетельств об аккредитации уже выдано (для генерации сквозного номера). */
    long countByAccreditationNumberNotNull();

    /** Поиск по номеру свидетельства об аккредитации (для публичной проверки). */
    Optional<AccreditationApplication> findFirstByAccreditationNumber(String accreditationNumber);
}
