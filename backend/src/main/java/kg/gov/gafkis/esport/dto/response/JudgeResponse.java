package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class JudgeResponse {

    private Long id;
    private String fullName;
    private LocalDate birthDate;
    private String sex;
    private String phone;
    private String email;
    private String certNumber;
    private String category;
    private List<String> sports;
    private LocalDate attestDate;
    private LocalDate endDate;
    private String region;
    private Long organizationId;
    private String organizationName;
    private boolean annulled;
    private String status;
    private boolean isArchived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
