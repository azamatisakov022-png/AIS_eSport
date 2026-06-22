package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class AwardApplicationListResponse {

    private Long id;
    private String appNo;
    private String applicantName;
    private String award;
    private String sport;
    private LocalDate submitDate;
    private String status;
    private int docsUploaded;
    private int docsTotal;
    private String awardGroup;
    private String routingLevel;
    private String routingBody;
    private LocalDate deadline;
    private Long remainingDays;
}
