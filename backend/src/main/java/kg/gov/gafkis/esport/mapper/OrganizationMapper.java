package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.OrganizationListResponse;
import kg.gov.gafkis.esport.dto.response.OrganizationResponse;
import kg.gov.gafkis.esport.dto.response.OrganizationStaffResponse;
import kg.gov.gafkis.esport.entity.Organization;
import kg.gov.gafkis.esport.entity.OrganizationStaff;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrganizationMapper {

    @Mapping(target = "staff", source = "staff")
    OrganizationResponse toResponse(Organization organization);

    OrganizationListResponse toListResponse(Organization organization);

    List<OrganizationListResponse> toListResponse(List<Organization> organizations);

    OrganizationStaffResponse toStaffResponse(OrganizationStaff staff);

    List<OrganizationStaffResponse> toStaffResponseList(List<OrganizationStaff> staffList);
}
