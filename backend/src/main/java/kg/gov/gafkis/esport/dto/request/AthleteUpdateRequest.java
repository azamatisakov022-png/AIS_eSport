package kg.gov.gafkis.esport.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AthleteUpdateRequest {

    private String fullName;

    private LocalDate birthDate;

    private String sex;

    private String phone;

    private String email;

    private String region;

    private String sport;

    private String rank;

    private String coachName;

    private Long coachId;

    private Long organizationId;

    private Long teamId;

    private LocalDate medExpDate;

    private LocalDate medIssuedDate;

    private String medIssuedBy;

    private LocalDate insExpDate;
}
