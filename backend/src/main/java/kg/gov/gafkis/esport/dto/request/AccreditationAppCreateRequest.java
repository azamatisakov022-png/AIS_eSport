package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AccreditationAppCreateRequest {

    @NotBlank(message = "Наименование федерации обязательно")
    private String federationName;

    private String sport;
    private String inn;
    private String headName;
    private String phone;
    private String email;
    private Long organizationId;
    private Integer docsTotal;
}
