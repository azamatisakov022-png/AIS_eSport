/* Демо-стор годовых расписаний тренеров (УРФКиМС, 16.07.2026).
   Заполняют спортшколы в ЛК; служебный портал читает для выездных проверок. */

const KEY = 'esport_coach_schedules'

const SEED = [
    {
        id: 1, school: 'СДЮСШ «Олимп»', region: 'Чуйская область', coach: 'Иванов Сергей Петрович',
        sport: 'Дзюдо', cert: true, year: 2026,
        items: [
            { day: 'Пн', from: '16:00', to: '18:00', venue: 'Зал борьбы, ул. Спортивная 12' },
            { day: 'Ср', from: '16:00', to: '18:00', venue: 'Зал борьбы, ул. Спортивная 12' },
            { day: 'Пт', from: '15:00', to: '17:00', venue: 'Зал борьбы, ул. Спортивная 12' },
        ],
    },
    {
        id: 2, school: 'СДЮСШ «Олимп»', region: 'Чуйская область', coach: 'Касымова Айгуль Талантовна',
        sport: 'Лёгкая атлетика', cert: true, year: 2026,
        items: [
            { day: 'Вт', from: '09:00', to: '11:00', venue: 'Стадион «Спартак»' },
            { day: 'Чт', from: '09:00', to: '11:00', venue: 'Стадион «Спартак»' },
            { day: 'Сб', from: '10:00', to: '12:00', venue: 'Стадион «Спартак»' },
        ],
    },
    {
        id: 3, school: 'СДЮСШ «Олимп»', region: 'Чуйская область', coach: 'Бекиев Марат Осконович',
        sport: 'Бокс', cert: false, year: 2026,
        items: [
            { day: 'Пн', from: '18:00', to: '20:00', venue: 'Зал бокса ДЮСШ Токмок' },
            { day: 'Чт', from: '18:00', to: '20:00', venue: 'Зал бокса ДЮСШ Токмок' },
        ],
    },
    {
        id: 4, school: 'СДЮСШОР №3 г. Бишкек', region: 'Главное управление (Бишкек)', coach: 'Асанов Бакыт Маратович',
        sport: 'Дзюдо', cert: true, year: 2026,
        items: [
            { day: 'Вт', from: '17:00', to: '19:00', venue: 'Дворец спорта им. Кожомкулова' },
            { day: 'Пт', from: '17:00', to: '19:00', venue: 'Дворец спорта им. Кожомкулова' },
        ],
    },
    {
        id: 5, school: 'ДЮСШ г. Ош', region: 'Ошская область', coach: 'Турдалиев Марат Сапарбекович',
        sport: 'Борьба', cert: true, year: 2026,
        items: [
            { day: 'Пн', from: '15:00', to: '17:00', venue: 'Стадион г. Ош' },
            { day: 'Ср', from: '15:00', to: '17:00', venue: 'Стадион г. Ош' },
            { day: 'Сб', from: '09:00', to: '11:00', venue: 'Стадион г. Ош' },
        ],
    },
]

export const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function loadSchedules() {
    try {
        const s = localStorage.getItem(KEY)
        if (s) return JSON.parse(s)
    } catch { /* ignore */ }
    return SEED
}

export function saveSchedules(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* ignore */ }
}
