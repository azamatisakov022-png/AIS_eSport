package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventResultResponse {

    private Long id;
    private Long athleteId;
    private String athleteName;
    private String athleteRank;
    private Integer place;
    private String medalType;
    private String resultValue;
}
