package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.RestorationApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestorationApplicationRepository extends JpaRepository<RestorationApplication, Long>,
        JpaSpecificationExecutor<RestorationApplication> {

    long countByStatus(String status);

    /** Сквозная нумерация выданных дубликатов (без зависимости от текущего статуса). */
    long countByDupNumberNotNull();

    /** Документ, признанный недействительным при восстановлении (по старому номеру) — для проверки. */
    Optional<RestorationApplication> findFirstByOldNumberAndOldInvalidatedTrue(String oldNumber);
}
