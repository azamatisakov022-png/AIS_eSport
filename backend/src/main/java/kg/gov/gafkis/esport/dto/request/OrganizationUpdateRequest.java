package kg.gov.gafkis.esport.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class OrganizationUpdateRequest {

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
}
