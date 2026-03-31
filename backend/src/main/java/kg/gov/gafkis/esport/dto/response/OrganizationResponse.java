package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrganizationResponse {

    private Long id;
    private String name;
    private String type;
    private String sport;
    private String inn;
    private LocalDate regDate;
    private String region;
    private String address;
    private String phone;
    private String email;
    private String website;
    private String headName;
    private String headTitle;
    private String accreditation;
    private int athletesCount;
    private int coachesCount;
    private boolean isArchived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrganizationStaffResponse> staff;
}
