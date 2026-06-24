package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.TrainerApplicationListResponse;
import kg.gov.gafkis.esport.dto.response.TrainerApplicationResponse;
import kg.gov.gafkis.esport.entity.TrainerApplication;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Mapper(componentModel = "spring")
public interface TrainerApplicationMapper {

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    @Mapping(target = "nextStatuses", expression = "java(kg.gov.gafkis.esport.service.TrainerWorkflow.nextStatuses(app.getStatus()))")
    TrainerApplicationResponse toResponse(TrainerApplication app);

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    TrainerApplicationListResponse toListResponse(TrainerApplication app);

    List<TrainerApplicationListResponse> toListResponse(List<TrainerApplication> apps);

    @Named("computeRemainingDays")
    default Long computeRemainingDays(LocalDate deadline) {
        if (deadline == null) {
            return null;
        }
        long days = ChronoUnit.DAYS.between(LocalDate.now(), deadline);
        return Math.max(days, 0);
    }
}
