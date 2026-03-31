package kg.gov.gafkis.esport.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EventUpdateRequest {

    private String title;

    private String type;

    private LocalDate startDate;

    private LocalDate endDate;

    private String sport;

    private String city;

    private String venue;

    private String ageCategory;

    private String level;

    private String organizer;

    private Long judgeId;

    private Boolean inPlan;

    private Boolean funded;
}
