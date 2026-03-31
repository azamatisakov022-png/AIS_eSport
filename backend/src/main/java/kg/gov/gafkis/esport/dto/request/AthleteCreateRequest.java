package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AthleteCreateRequest {

    @NotBlank(message = "ФИО обязательно")
    private String fullName;

    @NotNull(message = "Дата рождения обязательна")
    private LocalDate birthDate;

    @NotBlank(message = "Пол обязателен")
    private String sex;

    private String phone;

    private String email;

    private String region;

    private String sport;

    private String rank;

    private String coachName;

    private Long coachId;

    private Long organizationId;

    private Long teamId;

    private LocalDate medExpDate;

    private LocalDate medIssuedDate;

    private String medIssuedBy;

    private LocalDate insExpDate;
}
