package kg.gov.gafkis.esport.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CoachUpdateRequest {

    private String fullName;

    private LocalDate birthDate;

    private String sex;

    private String phone;

    private String email;

    private LocalDate regDate;

    private String sport;

    private String rank;

    private Long organizationId;

    private String employment;

    private String region;
}
