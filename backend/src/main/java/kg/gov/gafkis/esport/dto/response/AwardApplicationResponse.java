package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AwardApplicationResponse {

    private Long id;
    private String appNo;
    private Long athleteId;
    private String athleteName;
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
    private String conclusion;
    private String rejectReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<CommissionMemberResponse> commissionMembers;
    private List<HistoryResponse> history;

    @Data
    @Builder
    public static class CommissionMemberResponse {
        private Long id;
        private String name;
        private String position;
    }

    @Data
    @Builder
    public static class HistoryResponse {
        private Long id;
        private String action;
        private String userName;
        private LocalDateTime createdAt;
    }
}
