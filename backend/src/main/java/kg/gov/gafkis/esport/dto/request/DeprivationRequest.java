package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeprivationRequest {

    private Long athleteId;

    @NotBlank(message = "ФИО обязательно")
    private String name;

    @NotBlank(message = "Награда обязательна")
    private String award;

    @NotBlank(message = "Причина обязательна")
    private String reason;

    private String sport;
}
