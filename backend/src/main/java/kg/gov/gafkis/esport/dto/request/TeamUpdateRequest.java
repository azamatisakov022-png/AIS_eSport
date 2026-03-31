package kg.gov.gafkis.esport.dto.request;

import lombok.Data;

@Data
public class TeamUpdateRequest {

    private String name;

    private String sport;

    private String ageCategory;

    private String gender;

    private Long headCoachId;

    private String doctorName;
}
