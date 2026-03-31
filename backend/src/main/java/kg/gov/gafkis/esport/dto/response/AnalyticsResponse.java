package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class AnalyticsResponse {

    private KpiData kpi;
    private List<MonthlyData> monthlyTitles;
    private Map<String, Long> appTypeDistribution;
    private List<RegionData> regionBreakdown;
    private List<SportData> sportRanking;

    @Data
    @Builder
    public static class KpiData {
        private long titlesAssigned;
        private long appsProcessed;
        private double avgProcessingDays;
        private long rejections;
    }

    @Data
    @Builder
    public static class MonthlyData {
        private String month;
        private long msKr;
        private long kms;
    }

    @Data
    @Builder
    public static class RegionData {
        private String region;
        private long athletes;
        private long coaches;
        private long judges;
    }

    @Data
    @Builder
    public static class SportData {
        private String sport;
        private long count;
    }
}
