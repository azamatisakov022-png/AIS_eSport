package kg.gov.gafkis.esport.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import kg.gov.gafkis.esport.dto.response.JudgeListResponse;
import kg.gov.gafkis.esport.dto.response.JudgeResponse;
import kg.gov.gafkis.esport.entity.Judge;
import kg.gov.gafkis.esport.entity.Organization;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-01T16:23:34+0600",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class JudgeMapperImpl implements JudgeMapper {

    @Override
    public JudgeResponse toResponse(Judge judge) {
        if ( judge == null ) {
            return null;
        }

        JudgeResponse.JudgeResponseBuilder judgeResponse = JudgeResponse.builder();

        judgeResponse.organizationId( judgeOrganizationId( judge ) );
        judgeResponse.organizationName( judgeOrganizationName( judge ) );
        judgeResponse.status( computeStatus( judge ) );
        judgeResponse.annulled( judge.isAnnulled() );
        judgeResponse.attestDate( judge.getAttestDate() );
        judgeResponse.birthDate( judge.getBirthDate() );
        judgeResponse.category( judge.getCategory() );
        judgeResponse.certNumber( judge.getCertNumber() );
        judgeResponse.createdAt( judge.getCreatedAt() );
        judgeResponse.email( judge.getEmail() );
        judgeResponse.endDate( judge.getEndDate() );
        judgeResponse.fullName( judge.getFullName() );
        judgeResponse.id( judge.getId() );
        judgeResponse.phone( judge.getPhone() );
        judgeResponse.region( judge.getRegion() );
        List<String> list = judge.getSports();
        if ( list != null ) {
            judgeResponse.sports( new ArrayList<String>( list ) );
        }
        judgeResponse.updatedAt( judge.getUpdatedAt() );

        judgeResponse.sex( judge.getSex() != null ? judge.getSex().name() : null );

        return judgeResponse.build();
    }

    @Override
    public JudgeListResponse toListResponse(Judge judge) {
        if ( judge == null ) {
            return null;
        }

        JudgeListResponse.JudgeListResponseBuilder judgeListResponse = JudgeListResponse.builder();

        judgeListResponse.status( computeStatus( judge ) );
        judgeListResponse.annulled( judge.isAnnulled() );
        judgeListResponse.category( judge.getCategory() );
        judgeListResponse.certNumber( judge.getCertNumber() );
        judgeListResponse.endDate( judge.getEndDate() );
        judgeListResponse.fullName( judge.getFullName() );
        judgeListResponse.id( judge.getId() );
        judgeListResponse.region( judge.getRegion() );
        List<String> list = judge.getSports();
        if ( list != null ) {
            judgeListResponse.sports( new ArrayList<String>( list ) );
        }

        return judgeListResponse.build();
    }

    @Override
    public List<JudgeListResponse> toListResponse(List<Judge> judges) {
        if ( judges == null ) {
            return null;
        }

        List<JudgeListResponse> list = new ArrayList<JudgeListResponse>( judges.size() );
        for ( Judge judge : judges ) {
            list.add( toListResponse( judge ) );
        }

        return list;
    }

    private Long judgeOrganizationId(Judge judge) {
        Organization organization = judge.getOrganization();
        if ( organization == null ) {
            return null;
        }
        return organization.getId();
    }

    private String judgeOrganizationName(Judge judge) {
        Organization organization = judge.getOrganization();
        if ( organization == null ) {
            return null;
        }
        return organization.getName();
    }
}
