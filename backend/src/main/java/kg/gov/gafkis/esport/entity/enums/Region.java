package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum Region {

    BISHKEK("Бишкек"),
    OSH("Ош"),
    CHUY("Чуйская"),
    ISSYK_KUL("Иссык-Кульская"),
    JALAL_ABAD("Джалал-Абадская"),
    NARYN("Нарынская"),
    BATKEN("Баткенская"),
    TALAS("Таласская"),
    OSH_OBLAST("Ошская");

    private final String label;

    Region(String label) {
        this.label = label;
    }
}
