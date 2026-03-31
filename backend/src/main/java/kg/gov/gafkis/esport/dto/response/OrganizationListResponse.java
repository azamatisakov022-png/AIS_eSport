package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrganizationListResponse {

    private Long id;
    private String name;
    private String type;
    private String sport;
    private String region;
    private String headName;
    private int athletesCount;
    private int coachesCount;
    private String accreditation;
}
