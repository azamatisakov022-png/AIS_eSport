package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.RestorationAppListResponse;
import kg.gov.gafkis.esport.dto.response.RestorationAppResponse;
import kg.gov.gafkis.esport.entity.RestorationApplication;
import kg.gov.gafkis.esport.entity.RestorationApplicationHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Mapper(componentModel = "spring")
public interface RestorationApplicationMapper {

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    @Mapping(target = "nextStatuses", expression = "java(kg.gov.gafkis.esport.service.RestorationWorkflow.nextStatuses(app.getStatus()))")
    @Mapping(target = "history", source = "history")
    RestorationAppResponse toResponse(RestorationApplication app);

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    RestorationAppListResponse toListResponse(RestorationApplication app);

    List<RestorationAppListResponse> toListResponse(List<RestorationApplication> apps);

    RestorationAppResponse.HistoryResponse toHistoryResponse(RestorationApplicationHistory history);

    List<RestorationAppResponse.HistoryResponse> toHistoryResponseList(List<RestorationApplicationHistory> historyList);

    @Named("computeRemainingDays")
    default Long computeRemainingDays(LocalDate deadline) {
        if (deadline == null) {
            return null;
        }
        long days = ChronoUnit.DAYS.between(LocalDate.now(), deadline);
        return Math.max(days, 0);
    }
}
