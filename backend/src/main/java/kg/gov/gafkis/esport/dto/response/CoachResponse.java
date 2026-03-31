package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class CoachResponse {

    private Long id;
    private String fullName;
    private LocalDate birthDate;
    private String sex;
    private String phone;
    private String email;
    private String certNumber;
    private LocalDate regDate;
    private String sport;
    private String rank;
    private Long organizationId;
    private String organizationName;
    private String employment;
    private String region;
    private boolean annulled;
    private LocalDate endDate;
    private String status;
    private boolean isArchived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
