package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EventResultRequest {

    @NotNull(message = "ID спортсмена обязателен")
    private Long athleteId;

    private Integer place;

    private String medalType;

    private String resultValue;
}
