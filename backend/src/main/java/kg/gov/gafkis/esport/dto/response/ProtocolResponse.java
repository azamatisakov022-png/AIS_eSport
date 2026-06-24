package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProtocolResponse {

    private Long id;
    private String appNo;
    private String federationName;
    private String sport;
    private String eventName;
    private LocalDate eventDate;
    private String level;
    private String city;
    private String phone;
    private String email;
    private String status;
    private LocalDate submitDate;
    private LocalDate deadline;
    private Long remainingDays;
    private String rejectReason;
    private List<String> nextStatuses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<ResultResponse> results;
    private List<HistoryResponse> history;

    @Data
    @Builder
    public static class ResultResponse {
        private Long id;
        private String athleteName;
        private String discipline;
        private Integer place;
        private String medalType;
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
