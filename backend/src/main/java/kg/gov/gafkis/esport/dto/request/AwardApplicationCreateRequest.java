package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AwardApplicationCreateRequest {

    private Long athleteId;

    @NotBlank(message = "ФИО заявителя обязательно")
    private String applicantName;

    @NotBlank(message = "Награда обязательна")
    private String award;

    private String sport;

    private Integer docsTotal;
}
