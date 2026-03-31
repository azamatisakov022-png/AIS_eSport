package kg.gov.gafkis.esport.service;

import kg.gov.gafkis.esport.dto.response.AnalyticsResponse;
import kg.gov.gafkis.esport.dto.response.AnalyticsResponse.*;
import kg.gov.gafkis.esport.entity.Athlete;
import kg.gov.gafkis.esport.entity.AwardApplication;
import kg.gov.gafkis.esport.entity.Coach;
import kg.gov.gafkis.esport.entity.Judge;
import kg.gov.gafkis.esport.entity.enums.Region;
import kg.gov.gafkis.esport.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final AwardApplicationRepository awardApplicationRepository;
    private final AthleteRepository athleteRepository;
    private final CoachRepository coachRepository;
    private final JudgeRepository judgeRepository;

    public AnalyticsResponse getAnalytics(int year) {
        List<AwardApplication> allApps = awardApplicationRepository.findAll();

        // Filter applications for the given year
        List<AwardApplication> yearApps = allApps.stream()
                .filter(app -> app.getCreatedAt() != null && app.getCreatedAt().getYear() == year)
                .toList();

        // KPI
        long titlesAssigned = yearApps.stream()
                .filter(app -> "Присвоено".equals(app.getStatus()))
                .count();

        long appsProcessed = yearApps.stream()
                .filter(app -> !"Подана".equals(app.getStatus()) && !"На рассмотрении".equals(app.getStatus()))
                .count();

        long rejections = yearApps.stream()
                .filter(app -> "Отклонена".equals(app.getStatus()))
                .count();

        double avgProcessingDays = yearApps.stream()
                .filter(app -> app.getSubmitDate() != null && app.getUpdatedAt() != null
                        && !"Подана".equals(app.getStatus()) && !"На рассмотрении".equals(app.getStatus()))
                .mapToLong(app -> ChronoUnit.DAYS.between(
                        app.getSubmitDate(),
                        app.getUpdatedAt().toLocalDate()))
                .average()
                .orElse(0.0);

        KpiData kpi = KpiData.builder()
                .titlesAssigned(titlesAssigned)
                .appsProcessed(appsProcessed)
                .avgProcessingDays(Math.round(avgProcessingDays * 10.0) / 10.0)
                .rejections(rejections)
                .build();

        // Monthly titles breakdown
        List<MonthlyData> monthlyTitles = buildMonthlyTitles(yearApps);

        // App type distribution
        Map<String, Long> appTypeDistribution = yearApps.stream()
                .filter(app -> app.getAward() != null)
                .collect(Collectors.groupingBy(AwardApplication::getAward, Collectors.counting()));

        // Region breakdown
        List<RegionData> regionBreakdown = buildRegionBreakdown();

        // Sport ranking
        List<SportData> sportRanking = buildSportRanking();

        return AnalyticsResponse.builder()
                .kpi(kpi)
                .monthlyTitles(monthlyTitles)
                .appTypeDistribution(appTypeDistribution)
                .regionBreakdown(regionBreakdown)
                .sportRanking(sportRanking)
                .build();
    }

    private List<MonthlyData> buildMonthlyTitles(List<AwardApplication> yearApps) {
        String[] months = {"Янв", "Фев", "Мар", "Апр", "Май", "Июн",
                "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"};

        List<AwardApplication> assigned = yearApps.stream()
                .filter(app -> "Присвоено".equals(app.getStatus()) && app.getUpdatedAt() != null)
                .toList();

        List<MonthlyData> result = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            final int month = i + 1;
            long msKr = assigned.stream()
                    .filter(app -> app.getUpdatedAt().getMonthValue() == month)
                    .filter(app -> app.getAward() != null && app.getAward().contains("МС КР"))
                    .count();
            long kms = assigned.stream()
                    .filter(app -> app.getUpdatedAt().getMonthValue() == month)
                    .filter(app -> app.getAward() != null && app.getAward().contains("КМС"))
                    .count();

            result.add(MonthlyData.builder()
                    .month(months[i])
                    .msKr(msKr)
                    .kms(kms)
                    .build());
        }
        return result;
    }

    private List<RegionData> buildRegionBreakdown() {
        List<Athlete> athletes = athleteRepository.findAll().stream()
                .filter(a -> !a.isArchived())
                .toList();
        List<Coach> coaches = coachRepository.findAll().stream()
                .filter(c -> !c.isArchived() && !c.isAnnulled())
                .toList();
        List<Judge> judges = judgeRepository.findAll().stream()
                .filter(j -> !j.isArchived() && !j.isAnnulled())
                .toList();

        List<RegionData> result = new ArrayList<>();
        for (Region region : Region.values()) {
            String regionName = region.getLabel();
            String regionCode = region.name();

            long athleteCount = athletes.stream()
                    .filter(a -> regionCode.equals(a.getRegion()) || regionName.equals(a.getRegion()))
                    .count();
            long coachCount = coaches.stream()
                    .filter(c -> regionCode.equals(c.getRegion()) || regionName.equals(c.getRegion()))
                    .count();
            long judgeCount = judges.stream()
                    .filter(j -> regionCode.equals(j.getRegion()) || regionName.equals(j.getRegion()))
                    .count();

            result.add(RegionData.builder()
                    .region(regionName)
                    .athletes(athleteCount)
                    .coaches(coachCount)
                    .judges(judgeCount)
                    .build());
        }
        return result;
    }

    private List<SportData> buildSportRanking() {
        Map<String, Long> sportCounts = athleteRepository.findAll().stream()
                .filter(a -> !a.isArchived() && a.getSport() != null && !a.getSport().isBlank())
                .collect(Collectors.groupingBy(Athlete::getSport, Collectors.counting()));

        return sportCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> SportData.builder()
                        .sport(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .toList();
    }
}
