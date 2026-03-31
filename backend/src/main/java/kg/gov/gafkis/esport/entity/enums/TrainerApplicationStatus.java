package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum TrainerApplicationStatus {

    SUBMITTED("submitted"),
    REVIEW("review"),
    REVISION("revision"),
    REGISTERED("registered"),
    REJECTED("rejected"),
    ANNULLED("annulled");

    private final String label;

    TrainerApplicationStatus(String label) {
        this.label = label;
    }
}
