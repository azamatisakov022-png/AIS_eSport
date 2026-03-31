package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.JudgeListResponse;
import kg.gov.gafkis.esport.dto.response.JudgeResponse;
import kg.gov.gafkis.esport.entity.Judge;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring")
public interface JudgeMapper {

    @Mapping(target = "organizationId", source = "organization.id")
    @Mapping(target = "organizationName", source = "organization.name")
    @Mapping(target = "sex", expression = "java(judge.getSex() != null ? judge.getSex().name() : null)")
    @Mapping(target = "status", source = "judge", qualifiedByName = "computeStatus")
    JudgeResponse toResponse(Judge judge);

    @Mapping(target = "status", source = "judge", qualifiedByName = "computeStatus")
    JudgeListResponse toListResponse(Judge judge);

    List<JudgeListResponse> toListResponse(List<Judge> judges);

    @Named("computeStatus")
    default String computeStatus(Judge judge) {
        if (judge.isAnnulled()) {
            return "annulled";
        }
        if (judge.getEndDate() != null && judge.getEndDate().isBefore(LocalDate.now().plusDays(90))) {
            return "expiring";
        }
        return "active";
    }
}
