package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProtocolCreateRequest {

    @NotBlank(message = "Наименование федерации обязательно")
    private String federationName;

    private String sport;

    @NotBlank(message = "Наименование соревнования обязательно")
    private String eventName;

    private LocalDate eventDate;
    private String level;
    private String city;
    private String phone;
    private String email;

    private List<ProtocolResultRequest> results;
}
