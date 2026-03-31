package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class DeprivationResponse {

    private Long id;
    private Long athleteId;
    private String athleteName;
    private String name;
    private String award;
    private String sport;
    private String reason;
    private LocalDate initiatedDate;
    private LocalDate appealDeadline;
    private String status;
    private LocalDateTime createdAt;
}
