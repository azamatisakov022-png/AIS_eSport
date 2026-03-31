package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.EventListResponse;
import kg.gov.gafkis.esport.dto.response.EventParticipantResponse;
import kg.gov.gafkis.esport.dto.response.EventResponse;
import kg.gov.gafkis.esport.dto.response.EventResultResponse;
import kg.gov.gafkis.esport.entity.Event;
import kg.gov.gafkis.esport.entity.EventParticipant;
import kg.gov.gafkis.esport.entity.EventResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring")
public interface EventMapper {

    @Mapping(target = "judgeId", expression = "java(event.getMainJudge() != null ? event.getMainJudge().getId() : null)")
    @Mapping(target = "judgeName", expression = "java(event.getMainJudge() != null ? event.getMainJudge().getFullName() : null)")
    @Mapping(target = "status", expression = "java(computeStatus(event))")
    @Mapping(target = "participantsCount", expression = "java(event.getParticipants() != null ? event.getParticipants().size() : 0)")
    @Mapping(target = "resultsCount", expression = "java(event.getResults() != null ? event.getResults().size() : 0)")
    EventResponse toResponse(Event event);

    @Mapping(target = "status", expression = "java(computeStatus(event))")
    EventListResponse toListResponse(Event event);

    List<EventListResponse> toListResponse(List<Event> events);

    @Mapping(target = "athleteId", expression = "java(participant.getAthlete().getId())")
    @Mapping(target = "athleteName", expression = "java(participant.getAthlete().getFullName())")
    @Mapping(target = "athleteRank", expression = "java(participant.getAthlete().getRank())")
    @Mapping(target = "athleteRegion", expression = "java(participant.getAthlete().getRegion())")
    EventParticipantResponse toParticipantResponse(EventParticipant participant);

    List<EventParticipantResponse> toParticipantResponse(List<EventParticipant> participants);

    @Mapping(target = "athleteId", expression = "java(result.getAthlete().getId())")
    @Mapping(target = "athleteName", expression = "java(result.getAthlete().getFullName())")
    @Mapping(target = "athleteRank", expression = "java(result.getAthlete().getRank())")
    EventResultResponse toResultResponse(EventResult result);

    List<EventResultResponse> toResultResponse(List<EventResult> results);

    @Named("computeStatus")
    default String computeStatus(Event event) {
        if (event.isCancelled()) {
            return "cancelled";
        }
        LocalDate today = LocalDate.now();
        if (event.getEndDate() != null && event.getEndDate().isBefore(today)) {
            return "finished";
        }
        if (event.getStartDate() != null && event.getEndDate() != null
                && !event.getStartDate().isAfter(today) && !event.getEndDate().isBefore(today)) {
            return "live";
        }
        return "planned";
    }
}
