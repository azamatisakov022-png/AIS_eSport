package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FacilityCreateRequest {

    @NotBlank(message = "Название объекта обязательно")
    private String name;

    @NotBlank(message = "Тип объекта обязателен")
    private String type;

    private String address;

    private String region;

    private String city;

    private Double lat;

    private Double lng;

    private Integer capacity;

    private Integer areaSqm;

    private Long ownerOrganizationId;

    private String equipment;

    private String schedule;
}
