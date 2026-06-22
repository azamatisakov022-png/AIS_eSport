package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class JudgeApplicationResponse {

    private Long id;
    private String appNo;
    private String applicantName;
    private String inn;
    private String phone;
    private String email;
    private String sport;
    private String currentCategory;
    private String requestedCategory;
    private Integer eventsServed;
    private Integer experienceYears;
    private String region;
    private String status;
    private int docsUploaded;
    private int docsTotal;
    private String track;
    private String trackLabel;
    private String assignedBy;
    private List<String> nextStatuses;
    private LocalDate submitDate;
    private LocalDate deadline;
    private Long remainingDays;
    private String rejectReason;
    private Long judgeId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<HistoryResponse> history;

    @Data
    @Builder
    public static class HistoryResponse {
        private Long id;
        private String action;
        private String userName;
        private LocalDateTime createdAt;
    }
}
