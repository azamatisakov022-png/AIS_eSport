package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventParticipantResponse {

    private Long id;
    private Long athleteId;
    private String athleteName;
    private String athleteRank;
    private String athleteRegion;
    private String weightClass;
}
