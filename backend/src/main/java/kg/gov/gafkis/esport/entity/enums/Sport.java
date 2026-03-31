package kg.gov.gafkis.esport.entity.enums;

import lombok.Getter;

@Getter
public enum Sport {

    BOXING("Бокс"),
    WRESTLING("Борьба"),
    JUDO("Дзюдо"),
    FOOTBALL("Футбол"),
    SWIMMING("Плавание"),
    ATHLETICS("Лёгкая атлетика"),
    KARATE("Каратэ"),
    TAEKWONDO("Тхэквондо"),
    GYMNASTICS("Гимнастика"),
    CHESS("Шахматы"),
    WEIGHTLIFTING("Тяжёлая атлетика"),
    SHOOTING("Стрельба"),
    VOLLEYBALL("Волейбол"),
    KOK_BORU("Кок-бору");

    private final String label;

    Sport(String label) {
        this.label = label;
    }
}
