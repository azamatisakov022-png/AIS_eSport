package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class TransferAppListResponse {

    private Long id;
    private String appNo;
    private String athleteName;
    private String sport;
    private String oldClub;
    private String newClub;
    private String status;
    private int docsUploaded;
    private int docsTotal;
    private LocalDate submitDate;
    private LocalDate deadline;
    private Long remainingDays;
}
