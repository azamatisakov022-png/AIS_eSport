package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class RestorationAppListResponse {

    private Long id;
    private String appNo;
    private String applicantName;
    private String docType;
    private String reason;
    private String oldNumber;
    private String status;
    private int docsUploaded;
    private int docsTotal;
    private LocalDate submitDate;
    private LocalDate deadline;
    private Long remainingDays;
    private String dupNumber;
    private boolean oldInvalidated;
}
