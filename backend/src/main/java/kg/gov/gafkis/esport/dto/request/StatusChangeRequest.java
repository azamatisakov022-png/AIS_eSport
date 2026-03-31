package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StatusChangeRequest {

    @NotBlank(message = "Статус обязателен")
    private String status;

    private String reason;
}
