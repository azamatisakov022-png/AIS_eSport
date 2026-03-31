package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MedalRequest {

    @NotBlank(message = "Тип медали обязателен")
    private String medalType;

    @NotBlank(message = "Название мероприятия обязательно")
    private String eventName;

    @NotNull(message = "Год обязателен")
    private Integer year;

    private String country;
}
