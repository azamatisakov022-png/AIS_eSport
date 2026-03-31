package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class EventResponse {

    private Long id;
    private String title;
    private String type;
    private String sport;
    private LocalDate startDate;
    private LocalDate endDate;
    private String city;
    private String venue;
    private String ageCategory;
    private String level;
    private String organizer;

    private Long judgeId;
    private String judgeName;

    private boolean inPlan;
    private boolean funded;
    private boolean cancelled;
    private String status;

    private int participantsCount;
    private int resultsCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
