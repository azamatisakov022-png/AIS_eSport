package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class RestorationResponse {

    private Long id;
    private Long athleteId;
    private String athleteName;
    private String name;
    private String award;
    private String sport;
    private LocalDate submitDate;
    private LocalDate deadline;
    private String votes;
    private String status;
    private LocalDateTime createdAt;
}
