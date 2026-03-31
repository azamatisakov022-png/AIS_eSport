package kg.gov.gafkis.esport.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import kg.gov.gafkis.esport.dto.response.OrganizationListResponse;
import kg.gov.gafkis.esport.dto.response.OrganizationResponse;
import kg.gov.gafkis.esport.dto.response.OrganizationStaffResponse;
import kg.gov.gafkis.esport.entity.Organization;
import kg.gov.gafkis.esport.entity.OrganizationStaff;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-01T16:23:34+0600",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class OrganizationMapperImpl implements OrganizationMapper {

    @Override
    public OrganizationResponse toResponse(Organization organization) {
        if ( organization == null ) {
            return null;
        }

        OrganizationResponse.OrganizationResponseBuilder organizationResponse = OrganizationResponse.builder();

        organizationResponse.staff( toStaffResponseList( organization.getStaff() ) );
        organizationResponse.accreditation( organization.getAccreditation() );
        organizationResponse.address( organization.getAddress() );
        organizationResponse.athletesCount( organization.getAthletesCount() );
        organizationResponse.coachesCount( organization.getCoachesCount() );
        organizationResponse.createdAt( organization.getCreatedAt() );
        organizationResponse.email( organization.getEmail() );
        organizationResponse.headName( organization.getHeadName() );
        organizationResponse.headTitle( organization.getHeadTitle() );
        organizationResponse.id( organization.getId() );
        organizationResponse.inn( organization.getInn() );
        organizationResponse.name( organization.getName() );
        organizationResponse.phone( organization.getPhone() );
        organizationResponse.regDate( organization.getRegDate() );
        organizationResponse.region( organization.getRegion() );
        organizationResponse.sport( organization.getSport() );
        organizationResponse.type( organization.getType() );
        organizationResponse.updatedAt( organization.getUpdatedAt() );
        organizationResponse.website( organization.getWebsite() );

        return organizationResponse.build();
    }

    @Override
    public OrganizationListResponse toListResponse(Organization organization) {
        if ( organization == null ) {
            return null;
        }

        OrganizationListResponse.OrganizationListResponseBuilder organizationListResponse = OrganizationListResponse.builder();

        organizationListResponse.accreditation( organization.getAccreditation() );
        organizationListResponse.athletesCount( organization.getAthletesCount() );
        organizationListResponse.coachesCount( organization.getCoachesCount() );
        organizationListResponse.headName( organization.getHeadName() );
        organizationListResponse.id( organization.getId() );
        organizationListResponse.name( organization.getName() );
        organizationListResponse.region( organization.getRegion() );
        organizationListResponse.sport( organization.getSport() );
        organizationListResponse.type( organization.getType() );

        return organizationListResponse.build();
    }

    @Override
    public List<OrganizationListResponse> toListResponse(List<Organization> organizations) {
        if ( organizations == null ) {
            return null;
        }

        List<OrganizationListResponse> list = new ArrayList<OrganizationListResponse>( organizations.size() );
        for ( Organization organization : organizations ) {
            list.add( toListResponse( organization ) );
        }

        return list;
    }

    @Override
    public OrganizationStaffResponse toStaffResponse(OrganizationStaff staff) {
        if ( staff == null ) {
            return null;
        }

        OrganizationStaffResponse.OrganizationStaffResponseBuilder organizationStaffResponse = OrganizationStaffResponse.builder();

        organizationStaffResponse.id( staff.getId() );
        organizationStaffResponse.name( staff.getName() );
        organizationStaffResponse.rank( staff.getRank() );
        organizationStaffResponse.role( staff.getRole() );

        return organizationStaffResponse.build();
    }

    @Override
    public List<OrganizationStaffResponse> toStaffResponseList(List<OrganizationStaff> staffList) {
        if ( staffList == null ) {
            return null;
        }

        List<OrganizationStaffResponse> list = new ArrayList<OrganizationStaffResponse>( staffList.size() );
        for ( OrganizationStaff organizationStaff : staffList ) {
            list.add( toStaffResponse( organizationStaff ) );
        }

        return list;
    }
}
