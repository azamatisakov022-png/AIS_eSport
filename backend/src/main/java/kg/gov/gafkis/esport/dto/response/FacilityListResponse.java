package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FacilityListResponse {

    private Long id;
    private String name;
    private String type;
    private String region;
    private String city;
    private Integer capacity;
    private String ownerOrganizationName;
    private String status;
}
