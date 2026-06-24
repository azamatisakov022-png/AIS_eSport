package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class AccreditationAppListResponse {

    private Long id;
    private String appNo;
    private String federationName;
    private String sport;
    private String status;
    private int docsUploaded;
    private int docsTotal;
    private LocalDate submitDate;
    private LocalDate deadline;
    private Long remainingDays;
    private String accreditationNumber;
    private LocalDate accreditationEnd;
}
