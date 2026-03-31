package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TeamCreateRequest {

    @NotBlank(message = "Название команды обязательно")
    private String name;

    @NotBlank(message = "Вид спорта обязателен")
    private String sport;

    private String ageCategory;

    private String gender;

    private Long headCoachId;

    private String doctorName;
}
