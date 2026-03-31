package kg.gov.gafkis.esport.dto.request;

import lombok.Data;

@Data
public class UserUpdateRequest {

    private String fullName;
    private String phone;
    private String role;
    private String department;
    private Boolean isActive;
}
