package kg.gov.gafkis.esport.repository;

import kg.gov.gafkis.esport.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByEntityTypeAndEntityId(String entityType, Long entityId);

    long countByEntityTypeAndEntityId(String entityType, Long entityId);
}
