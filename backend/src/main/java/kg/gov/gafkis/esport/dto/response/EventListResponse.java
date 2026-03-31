package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class EventListResponse {

    private Long id;
    private String title;
    private String type;
    private String sport;
    private LocalDate startDate;
    private LocalDate endDate;
    private String city;
    private String venue;
    private String status;
    private boolean inPlan;
    private boolean funded;
}
