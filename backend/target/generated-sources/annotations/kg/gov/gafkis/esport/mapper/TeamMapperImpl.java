package kg.gov.gafkis.esport.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import kg.gov.gafkis.esport.dto.response.TeamAthleteResponse;
import kg.gov.gafkis.esport.dto.response.TeamCoachResponse;
import kg.gov.gafkis.esport.dto.response.TeamListResponse;
import kg.gov.gafkis.esport.dto.response.TeamResponse;
import kg.gov.gafkis.esport.entity.Athlete;
import kg.gov.gafkis.esport.entity.Coach;
import kg.gov.gafkis.esport.entity.Team;
import kg.gov.gafkis.esport.entity.TeamAthlete;
import kg.gov.gafkis.esport.entity.TeamCoach;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-01T16:23:34+0600",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class TeamMapperImpl implements TeamMapper {

    @Override
    public TeamResponse toResponse(Team team) {
        if ( team == null ) {
            return null;
        }

        TeamResponse.TeamResponseBuilder teamResponse = TeamResponse.builder();

        teamResponse.headCoachId( teamHeadCoachId( team ) );
        teamResponse.headCoachName( teamHeadCoachFullName( team ) );
        teamResponse.teamAthletes( toTeamAthleteResponseList( team.getTeamAthletes() ) );
        teamResponse.teamCoaches( toTeamCoachResponseList( team.getTeamCoaches() ) );
        teamResponse.ageCategory( team.getAgeCategory() );
        teamResponse.createdAt( team.getCreatedAt() );
        teamResponse.doctorName( team.getDoctorName() );
        teamResponse.gender( team.getGender() );
        teamResponse.id( team.getId() );
        teamResponse.name( team.getName() );
        teamResponse.sport( team.getSport() );
        teamResponse.status( team.getStatus() );
        teamResponse.updatedAt( team.getUpdatedAt() );

        return teamResponse.build();
    }

    @Override
    public TeamListResponse toListResponse(Team team) {
        if ( team == null ) {
            return null;
        }

        TeamListResponse.TeamListResponseBuilder teamListResponse = TeamListResponse.builder();

        teamListResponse.headCoachName( teamHeadCoachFullName( team ) );
        teamListResponse.athleteCount( countAthletes( team ) );
        teamListResponse.ageCategory( team.getAgeCategory() );
        teamListResponse.gender( team.getGender() );
        teamListResponse.id( team.getId() );
        teamListResponse.name( team.getName() );
        teamListResponse.sport( team.getSport() );
        teamListResponse.status( team.getStatus() );

        return teamListResponse.build();
    }

    @Override
    public List<TeamListResponse> toListResponse(List<Team> teams) {
        if ( teams == null ) {
            return null;
        }

        List<TeamListResponse> list = new ArrayList<TeamListResponse>( teams.size() );
        for ( Team team : teams ) {
            list.add( toListResponse( team ) );
        }

        return list;
    }

    @Override
    public TeamAthleteResponse toTeamAthleteResponse(TeamAthlete teamAthlete) {
        if ( teamAthlete == null ) {
            return null;
        }

        TeamAthleteResponse.TeamAthleteResponseBuilder teamAthleteResponse = TeamAthleteResponse.builder();

        teamAthleteResponse.athleteId( teamAthleteAthleteId( teamAthlete ) );
        teamAthleteResponse.athleteName( teamAthleteAthleteFullName( teamAthlete ) );
        teamAthleteResponse.id( teamAthlete.getId() );
        teamAthleteResponse.role( teamAthlete.getRole() );
        teamAthleteResponse.sinceYear( teamAthlete.getSinceYear() );

        return teamAthleteResponse.build();
    }

    @Override
    public List<TeamAthleteResponse> toTeamAthleteResponseList(List<TeamAthlete> teamAthletes) {
        if ( teamAthletes == null ) {
            return null;
        }

        List<TeamAthleteResponse> list = new ArrayList<TeamAthleteResponse>( teamAthletes.size() );
        for ( TeamAthlete teamAthlete : teamAthletes ) {
            list.add( toTeamAthleteResponse( teamAthlete ) );
        }

        return list;
    }

    @Override
    public TeamCoachResponse toTeamCoachResponse(TeamCoach teamCoach) {
        if ( teamCoach == null ) {
            return null;
        }

        TeamCoachResponse.TeamCoachResponseBuilder teamCoachResponse = TeamCoachResponse.builder();

        teamCoachResponse.coachId( teamCoachCoachId( teamCoach ) );
        teamCoachResponse.coachName( teamCoachCoachFullName( teamCoach ) );
        teamCoachResponse.id( teamCoach.getId() );
        teamCoachResponse.role( teamCoach.getRole() );

        return teamCoachResponse.build();
    }

    @Override
    public List<TeamCoachResponse> toTeamCoachResponseList(List<TeamCoach> teamCoaches) {
        if ( teamCoaches == null ) {
            return null;
        }

        List<TeamCoachResponse> list = new ArrayList<TeamCoachResponse>( teamCoaches.size() );
        for ( TeamCoach teamCoach : teamCoaches ) {
            list.add( toTeamCoachResponse( teamCoach ) );
        }

        return list;
    }

    private Long teamHeadCoachId(Team team) {
        Coach headCoach = team.getHeadCoach();
        if ( headCoach == null ) {
            return null;
        }
        return headCoach.getId();
    }

    private String teamHeadCoachFullName(Team team) {
        Coach headCoach = team.getHeadCoach();
        if ( headCoach == null ) {
            return null;
        }
        return headCoach.getFullName();
    }

    private Long teamAthleteAthleteId(TeamAthlete teamAthlete) {
        Athlete athlete = teamAthlete.getAthlete();
        if ( athlete == null ) {
            return null;
        }
        return athlete.getId();
    }

    private String teamAthleteAthleteFullName(TeamAthlete teamAthlete) {
        Athlete athlete = teamAthlete.getAthlete();
        if ( athlete == null ) {
            return null;
        }
        return athlete.getFullName();
    }

    private Long teamCoachCoachId(TeamCoach teamCoach) {
        Coach coach = teamCoach.getCoach();
        if ( coach == null ) {
            return null;
        }
        return coach.getId();
    }

    private String teamCoachCoachFullName(TeamCoach teamCoach) {
        Coach coach = teamCoach.getCoach();
        if ( coach == null ) {
            return null;
        }
        return coach.getFullName();
    }
}
