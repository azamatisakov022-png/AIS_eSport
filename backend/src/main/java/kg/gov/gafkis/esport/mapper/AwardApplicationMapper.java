package kg.gov.gafkis.esport.mapper;

import kg.gov.gafkis.esport.dto.response.AwardApplicationListResponse;
import kg.gov.gafkis.esport.dto.response.AwardApplicationResponse;
import kg.gov.gafkis.esport.dto.response.DeprivationResponse;
import kg.gov.gafkis.esport.dto.response.RestorationResponse;
import kg.gov.gafkis.esport.entity.AwardApplication;
import kg.gov.gafkis.esport.entity.AwardApplicationHistory;
import kg.gov.gafkis.esport.entity.AwardCommissionMember;
import kg.gov.gafkis.esport.entity.AwardDeprivation;
import kg.gov.gafkis.esport.entity.AwardRestoration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Mapper(componentModel = "spring")
public interface AwardApplicationMapper {

    @Mapping(target = "athleteId", expression = "java(app.getAthlete() != null ? app.getAthlete().getId() : null)")
    @Mapping(target = "athleteName", expression = "java(app.getAthlete() != null ? app.getAthlete().getFullName() : null)")
    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    @Mapping(target = "routingLevel", expression = "java(routingLevel(app.getAward()))")
    @Mapping(target = "routingBody", expression = "java(routingBody(app.getAward()))")
    @Mapping(target = "commissionMembers", source = "commissionMembers")
    @Mapping(target = "history", source = "history")
    AwardApplicationResponse toResponse(AwardApplication app);

    @Mapping(target = "remainingDays", expression = "java(computeRemainingDays(app.getDeadline()))")
    @Mapping(target = "routingLevel", expression = "java(routingLevel(app.getAward()))")
    @Mapping(target = "routingBody", expression = "java(routingBody(app.getAward()))")
    AwardApplicationListResponse toListResponse(AwardApplication app);

    List<AwardApplicationListResponse> toListResponse(List<AwardApplication> apps);

    AwardApplicationResponse.CommissionMemberResponse toCommissionMemberResponse(AwardCommissionMember member);

    List<AwardApplicationResponse.CommissionMemberResponse> toCommissionMemberResponseList(List<AwardCommissionMember> members);

    AwardApplicationResponse.HistoryResponse toHistoryResponse(AwardApplicationHistory history);

    List<AwardApplicationResponse.HistoryResponse> toHistoryResponseList(List<AwardApplicationHistory> historyList);

    @Mapping(target = "athleteId", expression = "java(dep.getAthlete() != null ? dep.getAthlete().getId() : null)")
    @Mapping(target = "athleteName", expression = "java(dep.getAthlete() != null ? dep.getAthlete().getFullName() : null)")
    DeprivationResponse toDeprivationResponse(AwardDeprivation dep);

    List<DeprivationResponse> toDeprivationResponseList(List<AwardDeprivation> deprivations);

    @Mapping(target = "athleteId", expression = "java(rest.getAthlete() != null ? rest.getAthlete().getId() : null)")
    @Mapping(target = "athleteName", expression = "java(rest.getAthlete() != null ? rest.getAthlete().getFullName() : null)")
    RestorationResponse toRestorationResponse(AwardRestoration rest);

    List<RestorationResponse> toRestorationResponseList(List<AwardRestoration> restorations);

    @Named("computeRemainingDays")
    default Long computeRemainingDays(LocalDate deadline) {
        if (deadline == null) {
            return null;
        }
        long days = ChronoUnit.DAYS.between(LocalDate.now(), deadline);
        return Math.max(days, 0);
    }

    /** Уровень маршрута присвоения по званию/разряду (ответ Управления развития массового спорта). */
    @Named("routingLevel")
    default String routingLevel(String award) {
        if (award == null) return "-";
        String u = award.toUpperCase();
        if (u.contains("ЗМС") || u.contains("ЗАСЛУЖЕНН")) return "Кабинет Министров";
        if (u.contains("МСМК") || u.contains("МС КР") || u.contains("МАСТЕР СПОРТА")
                || u.contains("КМС") || u.contains("КАНДИДАТ")) return "Агентство";
        return "Региональный орган";
    }

    /** Кто принимает решение по уровню маршрута. */
    @Named("routingBody")
    default String routingBody(String award) {
        return switch (routingLevel(award)) {
            case "Кабинет Министров" -> "Представление Агентства в Кабинет Министров (ЗМС)";
            case "Агентство" -> "Приказ Агентства через комиссию (КМС/МС/МСМК)";
            default -> "Решение регионального органа (разряды I-III)";
        };
    }
}
