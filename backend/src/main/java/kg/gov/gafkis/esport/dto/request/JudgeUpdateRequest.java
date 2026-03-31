package kg.gov.gafkis.esport.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class JudgeUpdateRequest {

    private String fullName;

    private LocalDate birthDate;

    private String sex;

    private String phone;

    private String email;

    private String category;

    private List<String> sports;

    private LocalDate attestDate;

    private String region;

    private Long organizationId;
}
