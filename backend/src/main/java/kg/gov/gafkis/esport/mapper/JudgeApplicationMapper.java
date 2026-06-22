package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.JudgeApplicationListResponse;
import kg.gov.gafkis.esport.dto.response.JudgeApplicationResponse;
import kg.gov.gafkis.esport.entity.JudgeApplication;
import kg.gov.gafkis.esport.entity.JudgeApplicationHistory;
import kg.gov.gafkis.esport.service.JudgeWorkflow;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Mapper(componentModel = "spring")
public interface JudgeApplicationMapper {

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    @Mapping(target = "track", expression = "java(kg.gov.gafkis.esport.service.JudgeWorkflow.track(app.getRequestedCategory()))")
    @Mapping(target = "trackLabel", expression = "java(kg.gov.gafkis.esport.service.JudgeWorkflow.trackLabel(kg.gov.gafkis.esport.service.JudgeWorkflow.track(app.getRequestedCategory())))")
    @Mapping(target = "assignedBy", expression = "java(kg.gov.gafkis.esport.service.JudgeWorkflow.assignedBy(app.getRequestedCategory()))")
    @Mapping(target = "nextStatuses", expression = "java(kg.gov.gafkis.esport.service.JudgeWorkflow.nextStatuses(app.getStatus(), kg.gov.gafkis.esport.service.JudgeWorkflow.track(app.getRequestedCategory())))")
    @Mapping(target = "history", source = "history")
    JudgeApplicationResponse toResponse(JudgeApplication app);

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    @Mapping(target = "track", expression = "java(kg.gov.gafkis.esport.service.JudgeWorkflow.track(app.getRequestedCategory()))")
    @Mapping(target = "trackLabel", expression = "java(kg.gov.gafkis.esport.service.JudgeWorkflow.trackLabel(kg.gov.gafkis.esport.service.JudgeWorkflow.track(app.getRequestedCategory())))")
    @Mapping(target = "assignedBy", expression = "java(kg.gov.gafkis.esport.service.JudgeWorkflow.assignedBy(app.getRequestedCategory()))")
    JudgeApplicationListResponse toListResponse(JudgeApplication app);

    List<JudgeApplicationListResponse> toListResponse(List<JudgeApplication> apps);

    JudgeApplicationResponse.HistoryResponse toHistoryResponse(JudgeApplicationHistory history);

    List<JudgeApplicationResponse.HistoryResponse> toHistoryResponseList(List<JudgeApplicationHistory> historyList);

    @Named("computeRemainingDays")
    default Long computeRemainingDays(LocalDate deadline) {
        if (deadline == null) {
            return null;
        }
        long days = ChronoUnit.DAYS.between(LocalDate.now(), deadline);
        return Math.max(days, 0);
    }
}
