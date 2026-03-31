package kg.gov.gafkis.esport.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import kg.gov.gafkis.esport.dto.response.AthleteListResponse;
import kg.gov.gafkis.esport.dto.response.AthleteResponse;
import kg.gov.gafkis.esport.dto.response.MedalResponse;
import kg.gov.gafkis.esport.entity.Athlete;
import kg.gov.gafkis.esport.entity.AthleteMedal;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-01T16:23:34+0600",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class AthleteMapperImpl implements AthleteMapper {

    @Override
    public AthleteResponse toResponse(Athlete athlete) {
        if ( athlete == null ) {
            return null;
        }

        AthleteResponse.AthleteResponseBuilder athleteResponse = AthleteResponse.builder();

        athleteResponse.medals( toMedalResponseList( athlete.getMedals() ) );
        athleteResponse.birthDate( athlete.getBirthDate() );
        athleteResponse.createdAt( athlete.getCreatedAt() );
        athleteResponse.email( athlete.getEmail() );
        athleteResponse.fullName( athlete.getFullName() );
        athleteResponse.id( athlete.getId() );
        athleteResponse.insExpDate( athlete.getInsExpDate() );
        athleteResponse.medExpDate( athlete.getMedExpDate() );
        athleteResponse.medIssuedBy( athlete.getMedIssuedBy() );
        athleteResponse.medIssuedDate( athlete.getMedIssuedDate() );
        athleteResponse.phone( athlete.getPhone() );
        athleteResponse.rank( athlete.getRank() );
        athleteResponse.region( athlete.getRegion() );
        athleteResponse.sport( athlete.getSport() );
        athleteResponse.updatedAt( athlete.getUpdatedAt() );

        athleteResponse.sex( athlete.getSex() != null ? athlete.getSex().name() : null );
        athleteResponse.coachId( athlete.getCoach() != null ? athlete.getCoach().getId() : null );
        athleteResponse.coachName( athlete.getCoach() != null ? athlete.getCoach().getFullName() : athlete.getCoachName() );
        athleteResponse.organizationId( athlete.getOrganization() != null ? athlete.getOrganization().getId() : null );
        athleteResponse.organizationName( athlete.getOrganization() != null ? athlete.getOrganization().getName() : null );
        athleteResponse.teamId( athlete.getTeam() != null ? athlete.getTeam().getId() : null );
        athleteResponse.teamName( athlete.getTeam() != null ? athlete.getTeam().getName() : null );
        athleteResponse.medStatus( computeStatus(athlete.getMedExpDate()) );
        athleteResponse.insStatus( computeStatus(athlete.getInsExpDate()) );

        return athleteResponse.build();
    }

    @Override
    public AthleteListResponse toListResponse(Athlete athlete) {
        if ( athlete == null ) {
            return null;
        }

        AthleteListResponse.AthleteListResponseBuilder athleteListResponse = AthleteListResponse.builder();

        athleteListResponse.birthDate( athlete.getBirthDate() );
        athleteListResponse.fullName( athlete.getFullName() );
        athleteListResponse.id( athlete.getId() );
        athleteListResponse.rank( athlete.getRank() );
        athleteListResponse.region( athlete.getRegion() );
        athleteListResponse.sport( athlete.getSport() );

        athleteListResponse.sex( athlete.getSex() != null ? athlete.getSex().name() : null );
        athleteListResponse.coachName( athlete.getCoach() != null ? athlete.getCoach().getFullName() : athlete.getCoachName() );
        athleteListResponse.organizationName( athlete.getOrganization() != null ? athlete.getOrganization().getName() : null );
        athleteListResponse.medStatus( computeStatus(athlete.getMedExpDate()) );
        athleteListResponse.insStatus( computeStatus(athlete.getInsExpDate()) );

        return athleteListResponse.build();
    }

    @Override
    public List<AthleteListResponse> toListResponse(List<Athlete> athletes) {
        if ( athletes == null ) {
            return null;
        }

        List<AthleteListResponse> list = new ArrayList<AthleteListResponse>( athletes.size() );
        for ( Athlete athlete : athletes ) {
            list.add( toListResponse( athlete ) );
        }

        return list;
    }

    @Override
    public MedalResponse toMedalResponse(AthleteMedal medal) {
        if ( medal == null ) {
            return null;
        }

        MedalResponse.MedalResponseBuilder medalResponse = MedalResponse.builder();

        medalResponse.year( medal.getYear() );
        medalResponse.country( medal.getCountry() );
        medalResponse.eventName( medal.getEventName() );
        medalResponse.id( medal.getId() );
        medalResponse.medalType( medal.getMedalType() );

        return medalResponse.build();
    }

    @Override
    public List<MedalResponse> toMedalResponseList(List<AthleteMedal> medals) {
        if ( medals == null ) {
            return null;
        }

        List<MedalResponse> list = new ArrayList<MedalResponse>( medals.size() );
        for ( AthleteMedal athleteMedal : medals ) {
            list.add( toMedalResponse( athleteMedal ) );
        }

        return list;
    }
}
