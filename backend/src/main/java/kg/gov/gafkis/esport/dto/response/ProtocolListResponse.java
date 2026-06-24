package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ProtocolListResponse {

    private Long id;
    private String appNo;
    private String federationName;
    private String sport;
    private String eventName;
    private LocalDate eventDate;
    private String level;
    private String status;
    private int resultsCount;
    private LocalDate submitDate;
    private LocalDate deadline;
    private Long remainingDays;
}
