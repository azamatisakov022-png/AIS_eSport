package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class JudgeCreateRequest {

    @NotBlank(message = "ФИО обязательно")
    private String fullName;

    @NotNull(message = "Дата рождения обязательна")
    private LocalDate birthDate;

    @NotBlank(message = "Пол обязателен")
    private String sex;

    private String phone;

    private String email;

    @NotBlank(message = "Категория обязательна")
    private String category;

    private List<String> sports;

    private LocalDate attestDate;

    private String region;

    private Long organizationId;
}
