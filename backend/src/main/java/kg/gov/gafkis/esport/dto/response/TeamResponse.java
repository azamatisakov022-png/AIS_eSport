package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TeamResponse {

    private Long id;
    private String name;
    private String sport;
    private String ageCategory;
    private String gender;
    private String status;
    private Long headCoachId;
    private String headCoachName;
    private String doctorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TeamAthleteResponse> teamAthletes;
    private List<TeamCoachResponse> teamCoaches;
}
