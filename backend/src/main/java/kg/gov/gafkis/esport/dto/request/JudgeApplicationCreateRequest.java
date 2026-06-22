package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JudgeApplicationCreateRequest {

    @NotBlank(message = "ФИО заявителя обязательно")
    private String applicantName;

    private String inn;
    private String phone;
    private String email;
    private String sport;
    private String currentCategory;

    @NotBlank(message = "Запрашиваемая категория обязательна")
    private String requestedCategory;

    private Integer eventsServed;
    private Integer experienceYears;
    private String region;
    private Integer docsTotal;
}
