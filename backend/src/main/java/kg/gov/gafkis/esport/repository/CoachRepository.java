package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.Coach;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoachRepository extends JpaRepository<Coach, Long>, JpaSpecificationExecutor<Coach> {

    long countByIsArchivedFalseAndAnnulledFalse();

    Optional<Coach> findByCertNumber(String certNumber);

    Page<Coach> findByIsArchivedFalse(Pageable pageable);

    Page<Coach> findByIsArchivedFalseAndAnnulledFalse(Pageable pageable);
}
