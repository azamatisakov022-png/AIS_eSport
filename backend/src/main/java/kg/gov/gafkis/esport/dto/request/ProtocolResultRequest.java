package kg.gov.gafkis.esport.dto.request;

import lombok.Data;

@Data
public class ProtocolResultRequest {

    private String athleteName;
    private String discipline;
    private Integer place;
    private String medalType;
}
