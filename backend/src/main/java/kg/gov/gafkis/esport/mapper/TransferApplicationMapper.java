package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.TransferAppListResponse;
import kg.gov.gafkis.esport.dto.response.TransferAppResponse;
import kg.gov.gafkis.esport.entity.TransferApplication;
import kg.gov.gafkis.esport.entity.TransferApplicationHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Mapper(componentModel = "spring")
public interface TransferApplicationMapper {

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    @Mapping(target = "nextStatuses", expression = "java(kg.gov.gafkis.esport.service.TransferWorkflow.nextStatuses(app.getStatus()))")
    @Mapping(target = "history", source = "history")
    TransferAppResponse toResponse(TransferApplication app);

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    TransferAppListResponse toListResponse(TransferApplication app);

    List<TransferAppListResponse> toListResponse(List<TransferApplication> apps);

    TransferAppResponse.HistoryResponse toHistoryResponse(TransferApplicationHistory history);

    List<TransferAppResponse.HistoryResponse> toHistoryResponseList(List<TransferApplicationHistory> historyList);

    @Named("computeRemainingDays")
    default Long computeRemainingDays(LocalDate deadline) {
        if (deadline == null) {
            return null;
        }
        long days = ChronoUnit.DAYS.between(LocalDate.now(), deadline);
        return Math.max(days, 0);
    }
}
