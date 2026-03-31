package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrganizationStaffResponse {

    private Long id;
    private String name;
    private String role;
    private String rank;
}
