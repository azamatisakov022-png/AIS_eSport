package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RestorationAppCreateRequest {

    @NotBlank(message = "ФИО заявителя обязательно")
    private String applicantName;

    private String inn;
    private String phone;
    private String email;

    @NotBlank(message = "Тип документа обязателен")
    private String docType;

    private String reason;
    private String oldNumber;
    private LocalDate issueDate;
    private Integer docsTotal;
}
