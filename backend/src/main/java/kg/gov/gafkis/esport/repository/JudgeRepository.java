package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.Judge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Repository
public interface JudgeRepository extends JpaRepository<Judge, Long>, JpaSpecificationExecutor<Judge> {

    long countByIsArchivedFalseAndAnnulledFalse();

    Optional<Judge> findByCertNumber(String certNumber);

    Page<Judge> findByIsArchivedFalseAndAnnulledFalse(Pageable pageable);
}
