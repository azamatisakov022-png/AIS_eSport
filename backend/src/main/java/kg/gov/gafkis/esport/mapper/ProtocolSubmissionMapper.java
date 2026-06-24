package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.ProtocolListResponse;
import kg.gov.gafkis.esport.dto.response.ProtocolResponse;
import kg.gov.gafkis.esport.entity.ProtocolResult;
import kg.gov.gafkis.esport.entity.ProtocolSubmission;
import kg.gov.gafkis.esport.entity.ProtocolSubmissionHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProtocolSubmissionMapper {

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    @Mapping(target = "nextStatuses", expression = "java(kg.gov.gafkis.esport.service.ProtocolWorkflow.nextStatuses(app.getStatus()))")
    @Mapping(target = "results", source = "results")
    @Mapping(target = "history", source = "history")
    ProtocolResponse toResponse(ProtocolSubmission app);

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    @Mapping(target = "resultsCount", expression = "java(app.getResults() != null ? app.getResults().size() : 0)")
    ProtocolListResponse toListResponse(ProtocolSubmission app);

    List<ProtocolListResponse> toListResponse(List<ProtocolSubmission> apps);

    ProtocolResponse.ResultResponse toResultResponse(ProtocolResult result);

    List<ProtocolResponse.ResultResponse> toResultResponseList(List<ProtocolResult> results);

    ProtocolResponse.HistoryResponse toHistoryResponse(ProtocolSubmissionHistory history);

    List<ProtocolResponse.HistoryResponse> toHistoryResponseList(List<ProtocolSubmissionHistory> historyList);

    @Named("computeRemainingDays")
    default Long computeRemainingDays(LocalDate deadline) {
        if (deadline == null) {
            return null;
        }
        long days = ChronoUnit.DAYS.between(LocalDate.now(), deadline);
        return Math.max(days, 0);
    }
}
