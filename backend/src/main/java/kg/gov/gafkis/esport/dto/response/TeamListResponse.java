package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamListResponse {

    private Long id;
    private String name;
    private String sport;
    private String ageCategory;
    private String gender;
    private String status;
    private String headCoachName;
    private int athleteCount;
}
