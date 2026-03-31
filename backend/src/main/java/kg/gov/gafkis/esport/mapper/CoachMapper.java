package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.CoachListResponse;
import kg.gov.gafkis.esport.dto.response.CoachResponse;
import kg.gov.gafkis.esport.entity.Coach;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CoachMapper {

    @Mapping(target = "organizationId", source = "organization.id")
    @Mapping(target = "organizationName", source = "organization.name")
    @Mapping(target = "sex", expression = "java(coach.getSex() != null ? coach.getSex().name() : null)")
    @Mapping(target = "status", source = "coach", qualifiedByName = "computeStatus")
    CoachResponse toResponse(Coach coach);

    @Mapping(target = "organizationName", source = "organization.name")
    @Mapping(target = "status", source = "coach", qualifiedByName = "computeStatus")
    CoachListResponse toListResponse(Coach coach);

    List<CoachListResponse> toListResponse(List<Coach> coaches);

    @Named("computeStatus")
    default String computeStatus(Coach coach) {
        if (coach.isAnnulled()) {
            return "annulled";
        }
        if (coach.getEndDate() != null && coach.getEndDate().isBefore(LocalDate.now().plusDays(90))) {
            return "expiring";
        }
        return "active";
    }
}
