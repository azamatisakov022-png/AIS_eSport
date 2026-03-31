package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TeamCoachRequest {

    @NotNull(message = "ID тренера обязателен")
    private Long coachId;

    private String role;
}
