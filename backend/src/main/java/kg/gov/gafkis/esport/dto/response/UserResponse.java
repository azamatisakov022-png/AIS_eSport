package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private String department;
    private String linkedEntityType;
    private Long linkedEntityId;
    private boolean isActive;
    private LocalDateTime createdAt;
}
