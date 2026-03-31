package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum AthleteRank {

    ZMS_KR("ЗМС КР"),
    MSMK("МСМК"),
    MS_KR("МС КР"),
    KMS("КМС"),
    FIRST("I р."),
    SECOND("II р."),
    THIRD("III р."),
    FIRST_YOUTH("I юн.р."),
    SECOND_YOUTH("II юн.р."),
    THIRD_YOUTH("III юн.р.");

    private final String label;

    AthleteRank(String label) {
        this.label = label;
    }
}
