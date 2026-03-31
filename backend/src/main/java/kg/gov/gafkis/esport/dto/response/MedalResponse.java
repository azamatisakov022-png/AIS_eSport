package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MedalResponse {

    private Long id;
    private String medalType;
    private String eventName;
    private Integer year;
    private String country;
}
