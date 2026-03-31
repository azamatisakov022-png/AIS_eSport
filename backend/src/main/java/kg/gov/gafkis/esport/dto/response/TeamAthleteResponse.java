package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamAthleteResponse {

    private Long id;
    private Long athleteId;
    private String athleteName;
    private String role;
    private Integer sinceYear;
}
