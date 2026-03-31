package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long>, JpaSpecificationExecutor<Organization> {

    long countByIsArchivedFalse();

    Page<Organization> findByIsArchivedFalse(Pageable pageable);
}
