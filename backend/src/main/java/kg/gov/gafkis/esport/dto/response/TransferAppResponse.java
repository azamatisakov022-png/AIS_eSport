package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TransferAppResponse {

    private Long id;
    private String appNo;
    private Long athleteId;
    private String athleteName;
    private String sport;
    private String oldClub;
    private String newClub;
    private String region;
    private String reason;
    private String phone;
    private String email;
    private String status;
    private int docsUploaded;
    private int docsTotal;
    private LocalDate deadline;
    private Long remainingDays;
    private LocalDate submitDate;
    private String rejectReason;
    private List<String> nextStatuses;
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
