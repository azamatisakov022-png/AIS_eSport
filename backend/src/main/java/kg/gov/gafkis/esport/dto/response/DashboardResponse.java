package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardResponse {

    private MetricsData metrics;
    private List<AlertItem> alerts;
    private List<RecentAppItem> recentApplications;
    private List<UpcomingEventItem> upcomingEvents;

    @Data
    @Builder
    public static class MetricsData {
        private long athletesCount;
        private long coachesCount;
        private long judgesCount;
        private long eventsCount;
        private long pendingAppsCount;
        private long organizationsCount;
    }

    @Data
    @Builder
    public static class AlertItem {
        private String text;
        private String severity;
        private String link;
    }

    @Data
    @Builder
    public static class RecentAppItem {
        private String appNo;
        private String type;
        private String name;
        private String date;
        private String status;
    }

    @Data
    @Builder
    public static class UpcomingEventItem {
        private String date;
        private String title;
        private String type;
        private String place;
    }
}
