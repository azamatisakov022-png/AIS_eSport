package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.TeamAthleteResponse;
import kg.gov.gafkis.esport.dto.response.TeamCoachResponse;
import kg.gov.gafkis.esport.dto.response.TeamListResponse;
import kg.gov.gafkis.esport.dto.response.TeamResponse;
import kg.gov.gafkis.esport.entity.Team;
import kg.gov.gafkis.esport.entity.TeamAthlete;
import kg.gov.gafkis.esport.entity.TeamCoach;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TeamMapper {

    @Mapping(target = "headCoachId", source = "headCoach.id")
    @Mapping(target = "headCoachName", source = "headCoach.fullName")
    @Mapping(target = "teamAthletes", source = "teamAthletes")
    @Mapping(target = "teamCoaches", source = "teamCoaches")
    TeamResponse toResponse(Team team);

    @Mapping(target = "headCoachName", source = "headCoach.fullName")
    @Mapping(target = "athleteCount", source = "team", qualifiedByName = "countAthletes")
    TeamListResponse toListResponse(Team team);

    List<TeamListResponse> toListResponse(List<Team> teams);

    @Mapping(target = "athleteId", source = "athlete.id")
    @Mapping(target = "athleteName", source = "athlete.fullName")
    TeamAthleteResponse toTeamAthleteResponse(TeamAthlete teamAthlete);

    List<TeamAthleteResponse> toTeamAthleteResponseList(List<TeamAthlete> teamAthletes);

    @Mapping(target = "coachId", source = "coach.id")
    @Mapping(target = "coachName", source = "coach.fullName")
    TeamCoachResponse toTeamCoachResponse(TeamCoach teamCoach);

    List<TeamCoachResponse> toTeamCoachResponseList(List<TeamCoach> teamCoaches);

    @Named("countAthletes")
    default int countAthletes(Team team) {
        return team.getTeamAthletes() != null ? team.getTeamAthletes().size() : 0;
    }
}
