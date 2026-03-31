package kg.gov.gafkis.esport.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FacilityResponse {

    private Long id;
    private String name;
    private String type;
    private String address;
    private String region;
    private String city;
    private Double lat;
    private Double lng;
    private Integer capacity;
    private Integer areaSqm;
    private Long ownerOrganizationId;
    private String ownerOrganizationName;
    private String status;
    private String equipment;
    private String schedule;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
