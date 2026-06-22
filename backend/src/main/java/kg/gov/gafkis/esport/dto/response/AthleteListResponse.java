package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class AthleteListResponse {

    private Long id;
    private String fullName;
    private LocalDate birthDate;
    private String sex;
    private String sport;
    private String rank;
    private String region;
    private String coachName;
    private String organizationName;
    private String medStatus;
    private String insStatus;
    private String verificationStatus;
    private String verificationStatusLabel;
    private String lifecycleStatus;
    private String lifecycleStatusLabel;
    private boolean isArchived;
}
