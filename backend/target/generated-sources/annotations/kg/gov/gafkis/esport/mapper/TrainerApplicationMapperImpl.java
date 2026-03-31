package kg.gov.gafkis.esport.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import kg.gov.gafkis.esport.dto.response.TrainerApplicationListResponse;
import kg.gov.gafkis.esport.dto.response.TrainerApplicationResponse;
import kg.gov.gafkis.esport.entity.TrainerApplication;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-01T16:23:34+0600",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class TrainerApplicationMapperImpl implements TrainerApplicationMapper {

    @Override
    public TrainerApplicationResponse toResponse(TrainerApplication app) {
        if ( app == null ) {
            return null;
        }

        TrainerApplicationResponse.TrainerApplicationResponseBuilder trainerApplicationResponse = TrainerApplicationResponse.builder();

        trainerApplicationResponse.appNo( app.getAppNo() );
        trainerApplicationResponse.applicantName( app.getApplicantName() );
        trainerApplicationResponse.birthDate( app.getBirthDate() );
        trainerApplicationResponse.certNumber( app.getCertNumber() );
        trainerApplicationResponse.createdAt( app.getCreatedAt() );
        trainerApplicationResponse.deadline( app.getDeadline() );
        trainerApplicationResponse.docsTotal( app.getDocsTotal() );
        trainerApplicationResponse.docsUploaded( app.getDocsUploaded() );
        trainerApplicationResponse.email( app.getEmail() );
        trainerApplicationResponse.id( app.getId() );
        trainerApplicationResponse.phone( app.getPhone() );
        trainerApplicationResponse.sport( app.getSport() );
        trainerApplicationResponse.status( app.getStatus() );
        trainerApplicationResponse.submitDate( app.getSubmitDate() );
        trainerApplicationResponse.tundukVerified( app.isTundukVerified() );
        trainerApplicationResponse.updatedAt( app.getUpdatedAt() );

        trainerApplicationResponse.remainingDays( computeRemainingDays(app.getDeadline()) );

        return trainerApplicationResponse.build();
    }

    @Override
    public TrainerApplicationListResponse toListResponse(TrainerApplication app) {
        if ( app == null ) {
            return null;
        }

        TrainerApplicationListResponse.TrainerApplicationListResponseBuilder trainerApplicationListResponse = TrainerApplicationListResponse.builder();

        trainerApplicationListResponse.appNo( app.getAppNo() );
        trainerApplicationListResponse.applicantName( app.getApplicantName() );
        trainerApplicationListResponse.certNumber( app.getCertNumber() );
        trainerApplicationListResponse.deadline( app.getDeadline() );
        trainerApplicationListResponse.docsTotal( app.getDocsTotal() );
        trainerApplicationListResponse.docsUploaded( app.getDocsUploaded() );
        trainerApplicationListResponse.id( app.getId() );
        trainerApplicationListResponse.sport( app.getSport() );
        trainerApplicationListResponse.status( app.getStatus() );
        trainerApplicationListResponse.submitDate( app.getSubmitDate() );
        trainerApplicationListResponse.tundukVerified( app.isTundukVerified() );

        trainerApplicationListResponse.remainingDays( computeRemainingDays(app.getDeadline()) );

        return trainerApplicationListResponse.build();
    }

    @Override
    public List<TrainerApplicationListResponse> toListResponse(List<TrainerApplication> apps) {
        if ( apps == null ) {
            return null;
        }

        List<TrainerApplicationListResponse> list = new ArrayList<TrainerApplicationListResponse>( apps.size() );
        for ( TrainerApplication trainerApplication : apps ) {
            list.add( toListResponse( trainerApplication ) );
        }

        return list;
    }
}
