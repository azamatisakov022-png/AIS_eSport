package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.AthleteListResponse;
import kg.gov.gafkis.esport.dto.response.AthleteResponse;
import kg.gov.gafkis.esport.dto.response.MedalResponse;
import kg.gov.gafkis.esport.entity.Athlete;
import kg.gov.gafkis.esport.entity.AthleteMedal;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring")
public interface AthleteMapper {

    @Mapping(target = "sex", expression = "java(athlete.getSex() != null ? athlete.getSex().name() : null)")
    @Mapping(target = "coachId", expression = "java(athlete.getCoach() != null ? athlete.getCoach().getId() : null)")
    @Mapping(target = "coachName", expression = "java(athlete.getCoach() != null ? athlete.getCoach().getFullName() : athlete.getCoachName())")
    @Mapping(target = "organizationId", expression = "java(athlete.getOrganization() != null ? athlete.getOrganization().getId() : null)")
    @Mapping(target = "organizationName", expression = "java(athlete.getOrganization() != null ? athlete.getOrganization().getName() : null)")
    @Mapping(target = "teamId", expression = "java(athlete.getTeam() != null ? athlete.getTeam().getId() : null)")
    @Mapping(target = "teamName", expression = "java(athlete.getTeam() != null ? athlete.getTeam().getName() : null)")
    @Mapping(target = "medStatus", expression = "java(computeStatus(athlete.getMedExpDate()))")
    @Mapping(target = "insStatus", expression = "java(computeStatus(athlete.getInsExpDate()))")
    @Mapping(target = "verificationStatus", expression = "java(athlete.getVerificationStatus() != null ? athlete.getVerificationStatus().name() : null)")
    @Mapping(target = "verificationStatusLabel", expression = "java(athlete.getVerificationStatus() != null ? athlete.getVerificationStatus().getLabel() : null)")
    @Mapping(target = "lifecycleStatus", expression = "java(athlete.getLifecycleStatus() != null ? athlete.getLifecycleStatus().name() : null)")
    @Mapping(target = "lifecycleStatusLabel", expression = "java(athlete.getLifecycleStatus() != null ? athlete.getLifecycleStatus().getLabel() : null)")
    @Mapping(target = "medals", source = "medals")
    AthleteResponse toResponse(Athlete athlete);

    @Mapping(target = "sex", expression = "java(athlete.getSex() != null ? athlete.getSex().name() : null)")
    @Mapping(target = "coachName", expression = "java(athlete.getCoach() != null ? athlete.getCoach().getFullName() : athlete.getCoachName())")
    @Mapping(target = "organizationName", expression = "java(athlete.getOrganization() != null ? athlete.getOrganization().getName() : null)")
    @Mapping(target = "medStatus", expression = "java(computeStatus(athlete.getMedExpDate()))")
    @Mapping(target = "insStatus", expression = "java(computeStatus(athlete.getInsExpDate()))")
    @Mapping(target = "verificationStatus", expression = "java(athlete.getVerificationStatus() != null ? athlete.getVerificationStatus().name() : null)")
    @Mapping(target = "verificationStatusLabel", expression = "java(athlete.getVerificationStatus() != null ? athlete.getVerificationStatus().getLabel() : null)")
    @Mapping(target = "lifecycleStatus", expression = "java(athlete.getLifecycleStatus() != null ? athlete.getLifecycleStatus().name() : null)")
    @Mapping(target = "lifecycleStatusLabel", expression = "java(athlete.getLifecycleStatus() != null ? athlete.getLifecycleStatus().getLabel() : null)")
    AthleteListResponse toListResponse(Athlete athlete);

    List<AthleteListResponse> toListResponse(List<Athlete> athletes);

    @Mapping(target = "year", source = "year")
    MedalResponse toMedalResponse(AthleteMedal medal);

    List<MedalResponse> toMedalResponseList(List<AthleteMedal> medals);

    @Named("computeStatus")
    default String computeStatus(LocalDate expirationDate) {
        if (expirationDate == null) {
            return "unknown";
        }
        LocalDate today = LocalDate.now();
        if (expirationDate.isAfter(today.plusDays(30))) {
            return "valid";
        }
        if (expirationDate.isAfter(today)) {
            return "expiring";
        }
        return "expired";
    }
}
