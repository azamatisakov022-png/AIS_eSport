package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TeamAthleteRequest {

    @NotNull(message = "ID спортсмена обязателен")
    private Long athleteId;

    private String role;

    private Integer sinceYear;
}
