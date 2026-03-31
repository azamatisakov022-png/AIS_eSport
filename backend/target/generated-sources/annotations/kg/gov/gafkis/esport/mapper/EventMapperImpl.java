package kg.gov.gafkis.esport.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import kg.gov.gafkis.esport.dto.response.EventListResponse;
import kg.gov.gafkis.esport.dto.response.EventParticipantResponse;
import kg.gov.gafkis.esport.dto.response.EventResponse;
import kg.gov.gafkis.esport.dto.response.EventResultResponse;
import kg.gov.gafkis.esport.entity.Event;
import kg.gov.gafkis.esport.entity.EventParticipant;
import kg.gov.gafkis.esport.entity.EventResult;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-01T16:23:34+0600",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class EventMapperImpl implements EventMapper {

    @Override
    public EventResponse toResponse(Event event) {
        if ( event == null ) {
            return null;
        }

        EventResponse.EventResponseBuilder eventResponse = EventResponse.builder();

        eventResponse.ageCategory( event.getAgeCategory() );
        eventResponse.cancelled( event.isCancelled() );
        eventResponse.city( event.getCity() );
        eventResponse.createdAt( event.getCreatedAt() );
        eventResponse.endDate( event.getEndDate() );
        eventResponse.funded( event.isFunded() );
        eventResponse.id( event.getId() );
        eventResponse.inPlan( event.isInPlan() );
        eventResponse.level( event.getLevel() );
        eventResponse.organizer( event.getOrganizer() );
        eventResponse.sport( event.getSport() );
        eventResponse.startDate( event.getStartDate() );
        eventResponse.title( event.getTitle() );
        eventResponse.type( event.getType() );
        eventResponse.updatedAt( event.getUpdatedAt() );
        eventResponse.venue( event.getVenue() );

        eventResponse.judgeId( event.getMainJudge() != null ? event.getMainJudge().getId() : null );
        eventResponse.judgeName( event.getMainJudge() != null ? event.getMainJudge().getFullName() : null );
        eventResponse.status( computeStatus(event) );
        eventResponse.participantsCount( event.getParticipants() != null ? event.getParticipants().size() : 0 );
        eventResponse.resultsCount( event.getResults() != null ? event.getResults().size() : 0 );

        return eventResponse.build();
    }

    @Override
    public EventListResponse toListResponse(Event event) {
        if ( event == null ) {
            return null;
        }

        EventListResponse.EventListResponseBuilder eventListResponse = EventListResponse.builder();

        eventListResponse.city( event.getCity() );
        eventListResponse.endDate( event.getEndDate() );
        eventListResponse.funded( event.isFunded() );
        eventListResponse.id( event.getId() );
        eventListResponse.inPlan( event.isInPlan() );
        eventListResponse.sport( event.getSport() );
        eventListResponse.startDate( event.getStartDate() );
        eventListResponse.title( event.getTitle() );
        eventListResponse.type( event.getType() );
        eventListResponse.venue( event.getVenue() );

        eventListResponse.status( computeStatus(event) );

        return eventListResponse.build();
    }

    @Override
    public List<EventListResponse> toListResponse(List<Event> events) {
        if ( events == null ) {
            return null;
        }

        List<EventListResponse> list = new ArrayList<EventListResponse>( events.size() );
        for ( Event event : events ) {
            list.add( toListResponse( event ) );
        }

        return list;
    }

    @Override
    public EventParticipantResponse toParticipantResponse(EventParticipant participant) {
        if ( participant == null ) {
            return null;
        }

        EventParticipantResponse.EventParticipantResponseBuilder eventParticipantResponse = EventParticipantResponse.builder();

        eventParticipantResponse.id( participant.getId() );
        eventParticipantResponse.weightClass( participant.getWeightClass() );

        eventParticipantResponse.athleteId( participant.getAthlete().getId() );
        eventParticipantResponse.athleteName( participant.getAthlete().getFullName() );
        eventParticipantResponse.athleteRank( participant.getAthlete().getRank() );
        eventParticipantResponse.athleteRegion( participant.getAthlete().getRegion() );

        return eventParticipantResponse.build();
    }

    @Override
    public List<EventParticipantResponse> toParticipantResponse(List<EventParticipant> participants) {
        if ( participants == null ) {
            return null;
        }

        List<EventParticipantResponse> list = new ArrayList<EventParticipantResponse>( participants.size() );
        for ( EventParticipant eventParticipant : participants ) {
            list.add( toParticipantResponse( eventParticipant ) );
        }

        return list;
    }

    @Override
    public EventResultResponse toResultResponse(EventResult result) {
        if ( result == null ) {
            return null;
        }

        EventResultResponse.EventResultResponseBuilder eventResultResponse = EventResultResponse.builder();

        eventResultResponse.id( result.getId() );
        eventResultResponse.medalType( result.getMedalType() );
        eventResultResponse.place( result.getPlace() );
        eventResultResponse.resultValue( result.getResultValue() );

        eventResultResponse.athleteId( result.getAthlete().getId() );
        eventResultResponse.athleteName( result.getAthlete().getFullName() );
        eventResultResponse.athleteRank( result.getAthlete().getRank() );

        return eventResultResponse.build();
    }

    @Override
    public List<EventResultResponse> toResultResponse(List<EventResult> results) {
        if ( results == null ) {
            return null;
        }

        List<EventResultResponse> list = new ArrayList<EventResultResponse>( results.size() );
        for ( EventResult eventResult : results ) {
            list.add( toResultResponse( eventResult ) );
        }

        return list;
    }
}
