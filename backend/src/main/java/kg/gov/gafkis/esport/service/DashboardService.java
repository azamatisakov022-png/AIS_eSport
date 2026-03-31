package kg.gov.gafkis.esport.service;

import kg.gov.gafkis.esport.dto.response.DashboardResponse;
import kg.gov.gafkis.esport.dto.response.DashboardResponse.*;
import kg.gov.gafkis.esport.entity.AwardApplication;
import kg.gov.gafkis.esport.entity.Coach;
import kg.gov.gafkis.esport.entity.Event;
import kg.gov.gafkis.esport.entity.Judge;
import kg.gov.gafkis.esport.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final AthleteRepository athleteRepository;
    private final CoachRepository coachRepository;
    private final JudgeRepository judgeRepository;
    private final EventRepository eventRepository;
    private final OrganizationRepository organizationRepository;
    private final AwardApplicationRepository awardApplicationRepository;
    private final TrainerApplicationRepository trainerApplicationRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    public DashboardResponse getDashboard() {
        // Metrics
        long athletesCount = athleteRepository.countByIsArchivedFalse();
        long coachesCount = coachRepository.countByIsArchivedFalseAndAnnulledFalse();
        long judgesCount = judgeRepository.countByIsArchivedFalseAndAnnulledFalse();
        long eventsCount = eventRepository.countByStatus("planned");
        long pendingAppsCount = awardApplicationRepository.countByStatus("На рассмотрении")
                + awardApplicationRepository.countByStatus("Подана");
        long organizationsCount = organizationRepository.countByIsArchivedFalse();

        MetricsData metrics = MetricsData.builder()
                .athletesCount(athletesCount)
                .coachesCount(coachesCount)
                .judgesCount(judgesCount)
                .eventsCount(eventsCount)
                .pendingAppsCount(pendingAppsCount)
                .organizationsCount(organizationsCount)
                .build();

        // Alerts
        List<AlertItem> alerts = buildAlerts();

        // Recent applications (latest 8)
        List<RecentAppItem> recentApplications = buildRecentApplications();

        // Upcoming events (next 5)
        List<UpcomingEventItem> upcomingEvents = buildUpcomingEvents();

        return DashboardResponse.builder()
                .metrics(metrics)
                .alerts(alerts)
                .recentApplications(recentApplications)
                .upcomingEvents(upcomingEvents)
                .build();
    }

    private List<AlertItem> buildAlerts() {
        List<AlertItem> alerts = new ArrayList<>();
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysFromNow = today.plusDays(30);

        // Coaches with expiring certificates
        List<Coach> allCoaches = coachRepository.findAll();
        long expiringCoaches = allCoaches.stream()
                .filter(c -> !c.isArchived() && !c.isAnnulled())
                .filter(c -> c.getEndDate() != null
                        && c.getEndDate().isAfter(today)
                        && !c.getEndDate().isAfter(thirtyDaysFromNow))
                .count();
        if (expiringCoaches > 0) {
            alerts.add(AlertItem.builder()
                    .text("У " + expiringCoaches + " тренеров истекает сертификат в течение 30 дней")
                    .severity("warning")
                    .link("/coaches?certStatus=expiring")
                    .build());
        }

        // Judges with expiring certificates
        List<Judge> allJudges = judgeRepository.findAll();
        long expiringJudges = allJudges.stream()
                .filter(j -> !j.isArchived() && !j.isAnnulled())
                .filter(j -> j.getEndDate() != null
                        && j.getEndDate().isAfter(today)
                        && !j.getEndDate().isAfter(thirtyDaysFromNow))
                .count();
        if (expiringJudges > 0) {
            alerts.add(AlertItem.builder()
                    .text("У " + expiringJudges + " судей истекает сертификат в течение 30 дней")
                    .severity("warning")
                    .link("/judges?certStatus=expiring")
                    .build());
        }

        // Athletes with expired medical
        long expiredMedical = athleteRepository.findAll().stream()
                .filter(a -> !a.isArchived())
                .filter(a -> a.getMedExpDate() != null && !a.getMedExpDate().isAfter(today))
                .count();
        if (expiredMedical > 0) {
            alerts.add(AlertItem.builder()
                    .text("У " + expiredMedical + " спортсменов истекла мед. справка")
                    .severity("error")
                    .link("/athletes?medStatus=expired")
                    .build());
        }

        return alerts;
    }

    private List<RecentAppItem> buildRecentApplications() {
        List<AwardApplication> recent = awardApplicationRepository.findAll(
                PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();

        return recent.stream()
                .map(app -> RecentAppItem.builder()
                        .appNo(app.getAppNo())
                        .type(app.getAward())
                        .name(app.getApplicantName())
                        .date(app.getSubmitDate() != null ? app.getSubmitDate().format(DATE_FMT) : null)
                        .status(app.getStatus())
                        .build())
                .toList();
    }

    private List<UpcomingEventItem> buildUpcomingEvents() {
        LocalDate today = LocalDate.now();
        LocalDate yearFromNow = today.plusYears(1);

        List<Event> upcoming = eventRepository.findByStatusAndStartDateBetween("planned", today, yearFromNow);

        return upcoming.stream()
                .sorted((a, b) -> a.getStartDate().compareTo(b.getStartDate()))
                .limit(5)
                .map(event -> UpcomingEventItem.builder()
                        .date(event.getStartDate() != null ? event.getStartDate().format(DATE_FMT) : null)
                        .title(event.getTitle())
                        .type(event.getType())
                        .place(event.getCity() != null ? event.getCity() : event.getVenue())
                        .build())
                .toList();
    }
}
