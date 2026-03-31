package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.OrganizationStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationStaffRepository extends JpaRepository<OrganizationStaff, Long> {
}
