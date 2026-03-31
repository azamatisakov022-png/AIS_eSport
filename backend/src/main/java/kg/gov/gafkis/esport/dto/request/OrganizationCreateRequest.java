package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class OrganizationCreateRequest {

    @NotBlank(message = "Название организации обязательно")
    private String name;

    @NotBlank(message = "Тип организации обязателен")
    private String type;

    private String sport;

    private String inn;

    private LocalDate regDate;

    private String region;

    private String address;

    private String phone;

    private String email;

    private String website;

    private String headName;

    private String headTitle;
}
