package kg.gov.gafkis.esport.dto.request;

import lombok.Data;

@Data
public class FacilityUpdateRequest {

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

    private String status;

    private String equipment;

    private String schedule;
}
