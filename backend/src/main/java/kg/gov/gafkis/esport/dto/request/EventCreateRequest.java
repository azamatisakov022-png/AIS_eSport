package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EventCreateRequest {

    @NotBlank(message = "Название мероприятия обязательно")
    private String title;

    @NotBlank(message = "Тип мероприятия обязателен")
    private String type;

    @NotNull(message = "Дата начала обязательна")
    private LocalDate startDate;

    @NotNull(message = "Дата окончания обязательна")
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
