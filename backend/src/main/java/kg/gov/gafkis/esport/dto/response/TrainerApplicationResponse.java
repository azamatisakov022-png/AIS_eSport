package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TrainerApplicationResponse {

    private Long id;
    private String appNo;
    private String applicantName;
    private LocalDate birthDate;
    private String phone;
    private String email;
    private String sport;
    private LocalDate submitDate;
    private String status;
    private int docsUploaded;
    private int docsTotal;
    private String certNumber;
    private LocalDate certIssueDate;
    private LocalDate certEndDate;
    private boolean tundukVerified;
    private LocalDate deadline;
    private Long remainingDays;
    private List<String> nextStatuses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
