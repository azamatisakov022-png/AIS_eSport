package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ApplicantNotificationResponse {

    private Long id;
    private String recipientEmail;
    private String recipientName;
    private String serviceType;
    private String appNo;
    private String status;
    private String message;
    private String channel;
    private boolean isRead;
    private LocalDateTime createdAt;
}
