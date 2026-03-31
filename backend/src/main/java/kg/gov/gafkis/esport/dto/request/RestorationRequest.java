package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RestorationRequest {

    private Long athleteId;

    @NotBlank(message = "ФИО обязательно")
    private String name;

    @NotBlank(message = "Награда обязательна")
    private String award;

    private String sport;
}
