package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamCoachResponse {

    private Long id;
    private Long coachId;
    private String coachName;
    private String role;
}
