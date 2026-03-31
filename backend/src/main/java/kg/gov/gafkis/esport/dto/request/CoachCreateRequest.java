package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CoachCreateRequest {

    @NotBlank(message = "ФИО обязательно")
    private String fullName;

    @NotNull(message = "Дата рождения обязательна")
    private LocalDate birthDate;

    @NotBlank(message = "Пол обязателен")
    private String sex;

    private String phone;

    private String email;

    @NotNull(message = "Дата регистрации обязательна")
    private LocalDate regDate;

    private String sport;

    private String rank;

    private Long organizationId;

    private String employment;

    private String region;
}
