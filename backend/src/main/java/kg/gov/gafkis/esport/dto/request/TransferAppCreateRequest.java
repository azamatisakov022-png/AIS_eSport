package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TransferAppCreateRequest {

    private Long athleteId;

    @NotBlank(message = "ФИО спортсмена обязательно")
    private String athleteName;

    private String sport;
    private String oldClub;

    @NotBlank(message = "Новый клуб обязателен")
    private String newClub;

    private String region;
    private String reason;
    private String phone;
    private String email;
    private Integer docsTotal;
}
