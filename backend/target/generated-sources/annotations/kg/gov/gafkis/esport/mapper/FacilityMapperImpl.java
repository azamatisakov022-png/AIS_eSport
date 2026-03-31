package kg.gov.gafkis.esport.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import kg.gov.gafkis.esport.dto.response.FacilityListResponse;
import kg.gov.gafkis.esport.dto.response.FacilityResponse;
import kg.gov.gafkis.esport.entity.Facility;
import kg.gov.gafkis.esport.entity.Organization;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-01T16:23:34+0600",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class FacilityMapperImpl implements FacilityMapper {

    @Override
    public FacilityResponse toResponse(Facility facility) {
        if ( facility == null ) {
            return null;
        }

        FacilityResponse.FacilityResponseBuilder facilityResponse = FacilityResponse.builder();

        facilityResponse.ownerOrganizationId( facilityOwnerOrganizationId( facility ) );
        facilityResponse.ownerOrganizationName( facilityOwnerOrganizationName( facility ) );
        facilityResponse.address( facility.getAddress() );
        facilityResponse.areaSqm( facility.getAreaSqm() );
        facilityResponse.capacity( facility.getCapacity() );
        facilityResponse.city( facility.getCity() );
        facilityResponse.createdAt( facility.getCreatedAt() );
        facilityResponse.equipment( facility.getEquipment() );
        facilityResponse.id( facility.getId() );
        facilityResponse.lat( facility.getLat() );
        facilityResponse.lng( facility.getLng() );
        facilityResponse.name( facility.getName() );
        facilityResponse.region( facility.getRegion() );
        facilityResponse.schedule( facility.getSchedule() );
        facilityResponse.status( facility.getStatus() );
        facilityResponse.type( facility.getType() );
        facilityResponse.updatedAt( facility.getUpdatedAt() );

        return facilityResponse.build();
    }

    @Override
    public FacilityListResponse toListResponse(Facility facility) {
        if ( facility == null ) {
            return null;
        }

        FacilityListResponse.FacilityListResponseBuilder facilityListResponse = FacilityListResponse.builder();

        facilityListResponse.ownerOrganizationName( facilityOwnerOrganizationName( facility ) );
        facilityListResponse.capacity( facility.getCapacity() );
        facilityListResponse.city( facility.getCity() );
        facilityListResponse.id( facility.getId() );
        facilityListResponse.name( facility.getName() );
        facilityListResponse.region( facility.getRegion() );
        facilityListResponse.status( facility.getStatus() );
        facilityListResponse.type( facility.getType() );

        return facilityListResponse.build();
    }

    @Override
    public List<FacilityListResponse> toListResponse(List<Facility> facilities) {
        if ( facilities == null ) {
            return null;
        }

        List<FacilityListResponse> list = new ArrayList<FacilityListResponse>( facilities.size() );
        for ( Facility facility : facilities ) {
            list.add( toListResponse( facility ) );
        }

        return list;
    }

    private Long facilityOwnerOrganizationId(Facility facility) {
        Organization ownerOrganization = facility.getOwnerOrganization();
        if ( ownerOrganization == null ) {
            return null;
        }
        return ownerOrganization.getId();
    }

    private String facilityOwnerOrganizationName(Facility facility) {
        Organization ownerOrganization = facility.getOwnerOrganization();
        if ( ownerOrganization == null ) {
            return null;
        }
        return ownerOrganization.getName();
    }
}
