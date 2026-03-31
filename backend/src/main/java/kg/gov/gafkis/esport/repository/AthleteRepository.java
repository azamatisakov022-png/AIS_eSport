package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.Athlete;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AthleteRepository extends JpaRepository<Athlete, Long>, JpaSpecificationExecutor<Athlete> {

    long countByIsArchivedFalse();

    long countByRegionAndIsArchivedFalse(String region);

    long countByRankAndIsArchivedFalse(String rank);

    Page<Athlete> findByIsArchivedFalse(Pageable pageable);
}
