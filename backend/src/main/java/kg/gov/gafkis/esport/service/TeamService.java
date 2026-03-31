package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.TeamAthleteRequest;
import kg.gov.gafkis.esport.dto.request.TeamCoachRequest;
import kg.gov.gafkis.esport.dto.request.TeamCreateRequest;
import kg.gov.gafkis.esport.dto.request.TeamUpdateRequest;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.TeamAthleteResponse;
import kg.gov.gafkis.esport.dto.response.TeamCoachResponse;
import kg.gov.gafkis.esport.dto.response.TeamListResponse;
import kg.gov.gafkis.esport.dto.response.TeamResponse;
import kg.gov.gafkis.esport.entity.Athlete;
import kg.gov.gafkis.esport.entity.Coach;
import kg.gov.gafkis.esport.entity.Team;
import kg.gov.gafkis.esport.entity.TeamAthlete;
import kg.gov.gafkis.esport.entity.TeamCoach;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.mapper.TeamMapper;
import kg.gov.gafkis.esport.repository.AthleteRepository;
import kg.gov.gafkis.esport.repository.CoachRepository;
import kg.gov.gafkis.esport.repository.TeamAthleteRepository;
import kg.gov.gafkis.esport.repository.TeamCoachRepository;
import kg.gov.gafkis.esport.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamAthleteRepository teamAthleteRepository;
    private final TeamCoachRepository teamCoachRepository;
    private final AthleteRepository athleteRepository;
    private final CoachRepository coachRepository;
    private final TeamMapper teamMapper;

    @Transactional(readOnly = true)
    public PagedResponse<TeamListResponse> getAll(String search, String sport, String ageCategory,
                                                    String gender, String status, Pageable pageable) {
        Specification<Team> spec = buildSpecification(search, sport, ageCategory, gender, status);
        Page<Team> page = teamRepository.findAll(spec, pageable);

        List<TeamListResponse> content = teamMapper.toListResponse(page.getContent());

        return new PagedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional(readOnly = true)
    public TeamResponse getById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Команда", "id", id));
        return teamMapper.toResponse(team);
    }

    public TeamResponse create(TeamCreateRequest request) {
        Team team = Team.builder()
                .name(request.getName())
                .sport(request.getSport())
                .ageCategory(request.getAgeCategory())
                .gender(request.getGender())
                .doctorName(request.getDoctorName())
                .build();

        if (request.getHeadCoachId() != null) {
            Coach coach = coachRepository.findById(request.getHeadCoachId())
                    .orElseThrow(() -> new ResourceNotFoundException("Тренер", "id", request.getHeadCoachId()));
            team.setHeadCoach(coach);
        }

        team = teamRepository.save(team);
        log.info("Создана команда: {} (id={})", team.getName(), team.getId());
        return teamMapper.toResponse(team);
    }

    public TeamResponse update(Long id, TeamUpdateRequest request) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Команда", "id", id));

        if (request.getName() != null) {
            team.setName(request.getName());
        }
        if (request.getSport() != null) {
            team.setSport(request.getSport());
        }
        if (request.getAgeCategory() != null) {
            team.setAgeCategory(request.getAgeCategory());
        }
        if (request.getGender() != null) {
            team.setGender(request.getGender());
        }
        if (request.getDoctorName() != null) {
            team.setDoctorName(request.getDoctorName());
        }
        if (request.getHeadCoachId() != null) {
            Coach coach = coachRepository.findById(request.getHeadCoachId())
                    .orElseThrow(() -> new ResourceNotFoundException("Тренер", "id", request.getHeadCoachId()));
            team.setHeadCoach(coach);
        }

        team = teamRepository.save(team);
        log.info("Обновлена команда: {} (id={})", team.getName(), team.getId());
        return teamMapper.toResponse(team);
    }

    public void disband(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Команда", "id", id));
        team.setStatus("disbanded");
        teamRepository.save(team);
        log.info("Расформирована команда: {} (id={})", team.getName(), team.getId());
    }

    public TeamAthleteResponse addAthlete(Long teamId, TeamAthleteRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Команда", "id", teamId));

        Athlete athlete = athleteRepository.findById(request.getAthleteId())
                .orElseThrow(() -> new ResourceNotFoundException("Спортсмен", "id", request.getAthleteId()));

        if (teamAthleteRepository.existsByTeamIdAndAthleteId(teamId, request.getAthleteId())) {
            throw new BadRequestException("Спортсмен уже состоит в данной команде");
        }

        TeamAthlete teamAthlete = TeamAthlete.builder()
                .team(team)
                .athlete(athlete)
                .role(request.getRole())
                .sinceYear(request.getSinceYear())
                .build();

        teamAthlete = teamAthleteRepository.save(teamAthlete);
        log.info("Добавлен спортсмен {} в команду {} (id={})", athlete.getFullName(), team.getName(), teamId);
        return teamMapper.toTeamAthleteResponse(teamAthlete);
    }

    public void removeAthlete(Long teamId, Long athleteId) {
        TeamAthlete teamAthlete = teamAthleteRepository.findByTeamIdAndAthleteId(teamId, athleteId)
                .orElseThrow(() -> new ResourceNotFoundException("Спортсмен в команде", "athleteId", athleteId));

        teamAthleteRepository.delete(teamAthlete);
        log.info("Удалён спортсмен (id={}) из команды (id={})", athleteId, teamId);
    }

    public TeamCoachResponse addCoach(Long teamId, TeamCoachRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Команда", "id", teamId));

        Coach coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new ResourceNotFoundException("Тренер", "id", request.getCoachId()));

        if (teamCoachRepository.existsByTeamIdAndCoachId(teamId, request.getCoachId())) {
            throw new BadRequestException("Тренер уже состоит в данной команде");
        }

        TeamCoach teamCoach = TeamCoach.builder()
                .team(team)
                .coach(coach)
                .role(request.getRole())
                .build();

        teamCoach = teamCoachRepository.save(teamCoach);
        log.info("Добавлен тренер {} в команду {} (id={})", coach.getFullName(), team.getName(), teamId);
        return teamMapper.toTeamCoachResponse(teamCoach);
    }

    public void removeCoach(Long teamId, Long coachId) {
        TeamCoach teamCoach = teamCoachRepository.findByTeamIdAndCoachId(teamId, coachId)
                .orElseThrow(() -> new ResourceNotFoundException("Тренер в команде", "coachId", coachId));

        teamCoachRepository.delete(teamCoach);
        log.info("Удалён тренер (id={}) из команды (id={})", coachId, teamId);
    }

    private Specification<Team> buildSpecification(String search, String sport, String ageCategory,
                                                     String gender, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by name
            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")),
                        "%" + search.trim().toLowerCase() + "%"));
            }

            // Filter by sport
            if (sport != null && !sport.isBlank()) {
                predicates.add(cb.equal(root.get("sport"), sport));
            }

            // Filter by age category
            if (ageCategory != null && !ageCategory.isBlank()) {
                predicates.add(cb.equal(root.get("ageCategory"), ageCategory));
            }

            // Filter by gender
            if (gender != null && !gender.isBlank()) {
                predicates.add(cb.equal(root.get("gender"), gender));
            }

            // Filter by status (default: only active)
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), status));
            } else {
                predicates.add(cb.equal(root.get("status"), "active"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
