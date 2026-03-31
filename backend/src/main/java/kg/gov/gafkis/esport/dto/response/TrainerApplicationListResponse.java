package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class TrainerApplicationListResponse {

    private Long id;
    private String appNo;
    private String applicantName;
    private String sport;
    private LocalDate submitDate;
    private String status;
    private int docsUploaded;
    private int docsTotal;
    private String certNumber;
    private boolean tundukVerified;
    private LocalDate deadline;
    private Long remainingDays;
}
