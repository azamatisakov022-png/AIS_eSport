package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CoachListResponse {

    private Long id;
    private String fullName;
    private String certNumber;
    private String sport;
    private String rank;
    private String organizationName;
    private String region;
    private LocalDate endDate;
    private String status;
    private boolean annulled;
}
