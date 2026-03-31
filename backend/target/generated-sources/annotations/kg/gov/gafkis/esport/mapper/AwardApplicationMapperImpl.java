package kg.gov.gafkis.esport.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import kg.gov.gafkis.esport.dto.response.AwardApplicationListResponse;
import kg.gov.gafkis.esport.dto.response.AwardApplicationResponse;
import kg.gov.gafkis.esport.dto.response.DeprivationResponse;
import kg.gov.gafkis.esport.dto.response.RestorationResponse;
import kg.gov.gafkis.esport.entity.AwardApplication;
import kg.gov.gafkis.esport.entity.AwardApplicationHistory;
import kg.gov.gafkis.esport.entity.AwardCommissionMember;
import kg.gov.gafkis.esport.entity.AwardDeprivation;
import kg.gov.gafkis.esport.entity.AwardRestoration;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-01T16:23:34+0600",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class AwardApplicationMapperImpl implements AwardApplicationMapper {

    @Override
    public AwardApplicationResponse toResponse(AwardApplication app) {
        if ( app == null ) {
            return null;
        }

        AwardApplicationResponse.AwardApplicationResponseBuilder awardApplicationResponse = AwardApplicationResponse.builder();

        awardApplicationResponse.commissionMembers( toCommissionMemberResponseList( app.getCommissionMembers() ) );
        awardApplicationResponse.history( toHistoryResponseList( app.getHistory() ) );
        awardApplicationResponse.appNo( app.getAppNo() );
        awardApplicationResponse.applicantName( app.getApplicantName() );
        awardApplicationResponse.award( app.getAward() );
        awardApplicationResponse.awardGroup( app.getAwardGroup() );
        awardApplicationResponse.conclusion( app.getConclusion() );
        awardApplicationResponse.createdAt( app.getCreatedAt() );
        awardApplicationResponse.deadline( app.getDeadline() );
        awardApplicationResponse.docsTotal( app.getDocsTotal() );
        awardApplicationResponse.docsUploaded( app.getDocsUploaded() );
        awardApplicationResponse.id( app.getId() );
        awardApplicationResponse.rejectReason( app.getRejectReason() );
        awardApplicationResponse.sport( app.getSport() );
        awardApplicationResponse.status( app.getStatus() );
        awardApplicationResponse.submitDate( app.getSubmitDate() );
        awardApplicationResponse.updatedAt( app.getUpdatedAt() );

        awardApplicationResponse.athleteId( app.getAthlete() != null ? app.getAthlete().getId() : null );
        awardApplicationResponse.athleteName( app.getAthlete() != null ? app.getAthlete().getFullName() : null );
        awardApplicationResponse.remainingDays( computeRemainingDays(app.getDeadline()) );

        return awardApplicationResponse.build();
    }

    @Override
    public AwardApplicationListResponse toListResponse(AwardApplication app) {
        if ( app == null ) {
            return null;
        }

        AwardApplicationListResponse.AwardApplicationListResponseBuilder awardApplicationListResponse = AwardApplicationListResponse.builder();

        awardApplicationListResponse.appNo( app.getAppNo() );
        awardApplicationListResponse.applicantName( app.getApplicantName() );
        awardApplicationListResponse.award( app.getAward() );
        awardApplicationListResponse.awardGroup( app.getAwardGroup() );
        awardApplicationListResponse.deadline( app.getDeadline() );
        awardApplicationListResponse.docsTotal( app.getDocsTotal() );
        awardApplicationListResponse.docsUploaded( app.getDocsUploaded() );
        awardApplicationListResponse.id( app.getId() );
        awardApplicationListResponse.sport( app.getSport() );
        awardApplicationListResponse.status( app.getStatus() );
        awardApplicationListResponse.submitDate( app.getSubmitDate() );

        awardApplicationListResponse.remainingDays( computeRemainingDays(app.getDeadline()) );

        return awardApplicationListResponse.build();
    }

    @Override
    public List<AwardApplicationListResponse> toListResponse(List<AwardApplication> apps) {
        if ( apps == null ) {
            return null;
        }

        List<AwardApplicationListResponse> list = new ArrayList<AwardApplicationListResponse>( apps.size() );
        for ( AwardApplication awardApplication : apps ) {
            list.add( toListResponse( awardApplication ) );
        }

        return list;
    }

    @Override
    public AwardApplicationResponse.CommissionMemberResponse toCommissionMemberResponse(AwardCommissionMember member) {
        if ( member == null ) {
            return null;
        }

        AwardApplicationResponse.CommissionMemberResponse.CommissionMemberResponseBuilder commissionMemberResponse = AwardApplicationResponse.CommissionMemberResponse.builder();

        commissionMemberResponse.id( member.getId() );
        commissionMemberResponse.name( member.getName() );
        commissionMemberResponse.position( member.getPosition() );

        return commissionMemberResponse.build();
    }

    @Override
    public List<AwardApplicationResponse.CommissionMemberResponse> toCommissionMemberResponseList(List<AwardCommissionMember> members) {
        if ( members == null ) {
            return null;
        }

        List<AwardApplicationResponse.CommissionMemberResponse> list = new ArrayList<AwardApplicationResponse.CommissionMemberResponse>( members.size() );
        for ( AwardCommissionMember awardCommissionMember : members ) {
            list.add( toCommissionMemberResponse( awardCommissionMember ) );
        }

        return list;
    }

    @Override
    public AwardApplicationResponse.HistoryResponse toHistoryResponse(AwardApplicationHistory history) {
        if ( history == null ) {
            return null;
        }

        AwardApplicationResponse.HistoryResponse.HistoryResponseBuilder historyResponse = AwardApplicationResponse.HistoryResponse.builder();

        historyResponse.action( history.getAction() );
        historyResponse.createdAt( history.getCreatedAt() );
        historyResponse.id( history.getId() );
        historyResponse.userName( history.getUserName() );

        return historyResponse.build();
    }

    @Override
    public List<AwardApplicationResponse.HistoryResponse> toHistoryResponseList(List<AwardApplicationHistory> historyList) {
        if ( historyList == null ) {
            return null;
        }

        List<AwardApplicationResponse.HistoryResponse> list = new ArrayList<AwardApplicationResponse.HistoryResponse>( historyList.size() );
        for ( AwardApplicationHistory awardApplicationHistory : historyList ) {
            list.add( toHistoryResponse( awardApplicationHistory ) );
        }

        return list;
    }

    @Override
    public DeprivationResponse toDeprivationResponse(AwardDeprivation dep) {
        if ( dep == null ) {
            return null;
        }

        DeprivationResponse.DeprivationResponseBuilder deprivationResponse = DeprivationResponse.builder();

        deprivationResponse.appealDeadline( dep.getAppealDeadline() );
        deprivationResponse.award( dep.getAward() );
        deprivationResponse.createdAt( dep.getCreatedAt() );
        deprivationResponse.id( dep.getId() );
        deprivationResponse.initiatedDate( dep.getInitiatedDate() );
        deprivationResponse.name( dep.getName() );
        deprivationResponse.reason( dep.getReason() );
        deprivationResponse.sport( dep.getSport() );
        deprivationResponse.status( dep.getStatus() );

        deprivationResponse.athleteId( dep.getAthlete() != null ? dep.getAthlete().getId() : null );
        deprivationResponse.athleteName( dep.getAthlete() != null ? dep.getAthlete().getFullName() : null );

        return deprivationResponse.build();
    }

    @Override
    public List<DeprivationResponse> toDeprivationResponseList(List<AwardDeprivation> deprivations) {
        if ( deprivations == null ) {
            return null;
        }

        List<DeprivationResponse> list = new ArrayList<DeprivationResponse>( deprivations.size() );
        for ( AwardDeprivation awardDeprivation : deprivations ) {
            list.add( toDeprivationResponse( awardDeprivation ) );
        }

        return list;
    }

    @Override
    public RestorationResponse toRestorationResponse(AwardRestoration rest) {
        if ( rest == null ) {
            return null;
        }

        RestorationResponse.RestorationResponseBuilder restorationResponse = RestorationResponse.builder();

        restorationResponse.award( rest.getAward() );
        restorationResponse.createdAt( rest.getCreatedAt() );
        restorationResponse.deadline( rest.getDeadline() );
        restorationResponse.id( rest.getId() );
        restorationResponse.name( rest.getName() );
        restorationResponse.sport( rest.getSport() );
        restorationResponse.status( rest.getStatus() );
        restorationResponse.submitDate( rest.getSubmitDate() );
        restorationResponse.votes( rest.getVotes() );

        restorationResponse.athleteId( rest.getAthlete() != null ? rest.getAthlete().getId() : null );
        restorationResponse.athleteName( rest.getAthlete() != null ? rest.getAthlete().getFullName() : null );

        return restorationResponse.build();
    }

    @Override
    public List<RestorationResponse> toRestorationResponseList(List<AwardRestoration> restorations) {
        if ( restorations == null ) {
            return null;
        }

        List<RestorationResponse> list = new ArrayList<RestorationResponse>( restorations.size() );
        for ( AwardRestoration awardRestoration : restorations ) {
            list.add( toRestorationResponse( awardRestoration ) );
        }

        return list;
    }
}
