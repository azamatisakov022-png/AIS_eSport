package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class JudgeListResponse {

    private Long id;
    private String fullName;
    private String certNumber;
    private String category;
    private List<String> sports;
    private String region;
    private LocalDate endDate;
    private String status;
    private boolean annulled;
}
