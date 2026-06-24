package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AthleteResponse {

    private Long id;
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
    private String club;
    private String organizationName;
    private Long organizationId;
    private String teamName;
    private Long teamId;

    private LocalDate medExpDate;
    private LocalDate medIssuedDate;
    private String medIssuedBy;
    private LocalDate insExpDate;

    private String medStatus;
    private String insStatus;

    private List<MedalResponse> medals;

    private String verificationStatus;
    private String verificationStatusLabel;
    private String lifecycleStatus;
    private String lifecycleStatusLabel;
    private String statusNote;

    private boolean isArchived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
