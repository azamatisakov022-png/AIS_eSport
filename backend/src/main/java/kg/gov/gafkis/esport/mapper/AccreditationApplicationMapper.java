package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.AccreditationAppListResponse;
import kg.gov.gafkis.esport.dto.response.AccreditationAppResponse;
import kg.gov.gafkis.esport.entity.AccreditationApplication;
import kg.gov.gafkis.esport.entity.AccreditationApplicationHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Mapper(componentModel = "spring")
public interface AccreditationApplicationMapper {

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    @Mapping(target = "nextStatuses", expression = "java(kg.gov.gafkis.esport.service.AccreditationWorkflow.nextStatuses(app.getStatus()))")
    @Mapping(target = "history", source = "history")
    AccreditationAppResponse toResponse(AccreditationApplication app);

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    AccreditationAppListResponse toListResponse(AccreditationApplication app);

    List<AccreditationAppListResponse> toListResponse(List<AccreditationApplication> apps);

    AccreditationAppResponse.HistoryResponse toHistoryResponse(AccreditationApplicationHistory history);

    List<AccreditationAppResponse.HistoryResponse> toHistoryResponseList(List<AccreditationApplicationHistory> historyList);

    @Named("computeRemainingDays")
    default Long computeRemainingDays(LocalDate deadline) {
        if (deadline == null) {
            return null;
        }
        long days = ChronoUnit.DAYS.between(LocalDate.now(), deadline);
        return Math.max(days, 0);
    }
}
