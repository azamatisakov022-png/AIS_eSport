package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class JudgeApplicationListResponse {

    private Long id;
    private String appNo;
    private String applicantName;
    private String sport;
    private String currentCategory;
    private String requestedCategory;
    private String status;
    private int docsUploaded;
    private int docsTotal;
    private String track;
    private String trackLabel;
    private String assignedBy;
    private String region;
    private LocalDate submitDate;
    private LocalDate deadline;
    private Long remainingDays;
}
