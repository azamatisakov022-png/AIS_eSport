package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TrainerApplicationCreateRequest {

    @NotBlank(message = "ФИО заявителя обязательно")
    private String applicantName;

    private LocalDate birthDate;

    private String phone;

    private String email;

    private String sport;
}
