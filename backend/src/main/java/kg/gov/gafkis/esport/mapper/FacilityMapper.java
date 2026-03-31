package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.FacilityListResponse;
import kg.gov.gafkis.esport.dto.response.FacilityResponse;
import kg.gov.gafkis.esport.entity.Facility;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FacilityMapper {

    @Mapping(target = "ownerOrganizationId", source = "ownerOrganization.id")
    @Mapping(target = "ownerOrganizationName", source = "ownerOrganization.name")
    FacilityResponse toResponse(Facility facility);

    @Mapping(target = "ownerOrganizationName", source = "ownerOrganization.name")
    FacilityListResponse toListResponse(Facility facility);

    List<FacilityListResponse> toListResponse(List<Facility> facilities);
}
