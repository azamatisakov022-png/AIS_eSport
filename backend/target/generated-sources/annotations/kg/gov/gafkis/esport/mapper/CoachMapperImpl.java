package kg.gov.gafkis.esport.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import kg.gov.gafkis.esport.dto.response.CoachListResponse;
import kg.gov.gafkis.esport.dto.response.CoachResponse;
import kg.gov.gafkis.esport.entity.Coach;
import kg.gov.gafkis.esport.entity.Organization;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-01T16:23:34+0600",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class CoachMapperImpl implements CoachMapper {

    @Override
    public CoachResponse toResponse(Coach coach) {
        if ( coach == null ) {
            return null;
        }

        CoachResponse.CoachResponseBuilder coachResponse = CoachResponse.builder();

        coachResponse.organizationId( coachOrganizationId( coach ) );
        coachResponse.organizationName( coachOrganizationName( coach ) );
        coachResponse.status( computeStatus( coach ) );
        coachResponse.annulled( coach.isAnnulled() );
        coachResponse.birthDate( coach.getBirthDate() );
        coachResponse.certNumber( coach.getCertNumber() );
        coachResponse.createdAt( coach.getCreatedAt() );
        coachResponse.email( coach.getEmail() );
        coachResponse.employment( coach.getEmployment() );
        coachResponse.endDate( coach.getEndDate() );
        coachResponse.fullName( coach.getFullName() );
        coachResponse.id( coach.getId() );
        coachResponse.phone( coach.getPhone() );
        coachResponse.rank( coach.getRank() );
        coachResponse.regDate( coach.getRegDate() );
        coachResponse.region( coach.getRegion() );
        coachResponse.sport( coach.getSport() );
        coachResponse.updatedAt( coach.getUpdatedAt() );

        coachResponse.sex( coach.getSex() != null ? coach.getSex().name() : null );

        return coachResponse.build();
    }

    @Override
    public CoachListResponse toListResponse(Coach coach) {
        if ( coach == null ) {
            return null;
        }

        CoachListResponse.CoachListResponseBuilder coachListResponse = CoachListResponse.builder();

        coachListResponse.organizationName( coachOrganizationName( coach ) );
        coachListResponse.status( computeStatus( coach ) );
        coachListResponse.annulled( coach.isAnnulled() );
        coachListResponse.certNumber( coach.getCertNumber() );
        coachListResponse.endDate( coach.getEndDate() );
        coachListResponse.fullName( coach.getFullName() );
        coachListResponse.id( coach.getId() );
        coachListResponse.rank( coach.getRank() );
        coachListResponse.region( coach.getRegion() );
        coachListResponse.sport( coach.getSport() );

        return coachListResponse.build();
    }

    @Override
    public List<CoachListResponse> toListResponse(List<Coach> coaches) {
        if ( coaches == null ) {
            return null;
        }

        List<CoachListResponse> list = new ArrayList<CoachListResponse>( coaches.size() );
        for ( Coach coach : coaches ) {
            list.add( toListResponse( coach ) );
        }

        return list;
    }

    private Long coachOrganizationId(Coach coach) {
        Organization organization = coach.getOrganization();
        if ( organization == null ) {
            return null;
        }
        return organization.getId();
    }

    private String coachOrganizationName(Coach coach) {
        Organization organization = coach.getOrganization();
        if ( organization == null ) {
            return null;
        }
        return organization.getName();
    }
}
