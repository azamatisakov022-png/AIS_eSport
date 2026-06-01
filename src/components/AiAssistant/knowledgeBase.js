/**
 * Knowledge base for the AIS eSport AI assistant.
 *
 * Structured map of the whole portal + government services + document
 * checklists. The rule-based engine (assistantEngine.js) reads this to give
 * accurate navigation + reference answers. When a real LLM is wired in later,
 * this same structure can be serialized into the system prompt / retrieval
 * context so the model stays grounded in the real portal.
 */

/* ── Public portal sections ── */
export const PUBLIC_SECTIONS = [
    { key: 'home', to: '/public', labels: ['главная', 'домой', 'башкы', 'home', 'старт'], title: 'Главная' },
    { key: 'news', to: '/public/news', labels: ['новости', 'жаңылыктар', 'news'], title: 'Новости' },
    { key: 'about', to: '/public/about', labels: ['о гафкис', 'агентство', 'руководство', 'структура', 'about'], title: 'О ГАФКиС' },
    { key: 'npa', to: '/public/npa', labels: ['нпа', 'законы', 'постановления', 'нормативн', 'акты', 'кодекс'], title: 'Нормативно-правовые акты' },
    { key: 'budget', to: '/public/budget', labels: ['бюджет', 'финансиров', 'budget'], title: 'Программный бюджет' },
    { key: 'calendar', to: '/public/calendar', labels: ['календарь', 'календарн', 'план мероприятий', 'расписание'], title: 'Календарный план' },
    { key: 'athletes', to: '/public/athletes', labels: ['спортсмен', 'атлет', 'рейтинг', 'athlete', 'спортчу'], title: 'Спортсмены' },
    { key: 'coaches', to: '/public/coaches', labels: ['тренер', 'наставник', 'coach', 'машыктыруучу'], title: 'Тренеры' },
    { key: 'judges', to: '/public/judges', labels: ['судья', 'судьи', 'рефери', 'арбитр', 'judge'], title: 'Судьи' },
    { key: 'teams', to: '/public/teams', labels: ['команд', 'сборн', 'team'], title: 'Сборные команды' },
    { key: 'sports', to: '/public/sports', labels: ['виды спорта', 'дисциплин', 'вид спорта', 'sport types'], title: 'Виды спорта' },
    { key: 'events', to: '/public/events', labels: ['мероприят', 'соревнован', 'турнир', 'чемпионат', 'событи', 'event'], title: 'Мероприятия' },
    { key: 'announcements', to: '/public/announcements', labels: ['объявлен', 'ваканси', 'тендер', 'аренда', 'announcement'], title: 'Объявления' },
    { key: 'organizations', to: '/public/organizations', labels: ['организац', 'федерац', 'клуб', 'ассоциац', 'лига', 'organization'], title: 'Организации' },
    { key: 'facilities', to: '/public/facilities', labels: ['объект', 'стадион', 'бассейн', 'зал', 'арена', 'манеж', 'спортобъект', 'facility', 'инфраструктур'], title: 'Спортивные объекты' },
    { key: 'schools', to: '/public/schools', labels: ['школ', 'дюсш', 'сдюшор', 'уор', 'school'], title: 'Спортивные школы' },
    { key: 'services', to: '/public/services', labels: ['госуслуг', 'услуг', 'service', 'кызмат'], title: 'Государственные услуги' },
    { key: 'verify', to: '/public/verify', labels: ['проверк', 'подлинност', 'qr', 'верифик', 'verify', 'текшер'], title: 'Проверка документа' },
    { key: 'trainerReg', to: '/public/trainer-registration', labels: ['регистрац тренера', 'стать тренером', 'регистрация тренер', 'тренерский сертификат'], title: 'Регистрация тренера' },
    { key: 'awardApp', to: '/public/award-application', labels: ['звание', 'разряд', 'заявка на звание', 'присвоен', 'награда'], title: 'Заявка на присвоение звания' },
    { key: 'login', to: '/public/login', labels: ['вход', 'войти', 'логин', 'личный кабинет', 'кабинет', 'авториз', 'login', 'кирүү'], title: 'Личный кабинет / Вход' },
    { key: 'antidoping', to: '/public/antidoping', labels: ['допинг', 'антидопинг', 'doping'], title: 'Антидопинговая деятельность' },
    { key: 'anticorruption', to: '/public/anticorruption', labels: ['коррупц', 'антикоррупц', 'corruption'], title: 'Антикоррупционные меры' },
    { key: 'reception', to: '/public/reception', labels: ['приёмная', 'приемная', 'обращен', 'жалоб', 'reception'], title: 'Интернет-приёмная' },
]

/* ── Internal portal sections ── */
export const INTERNAL_SECTIONS = [
    { key: 'dashboard', to: '/dashboard', labels: ['дашборд', 'главная', 'панель', 'сводка', 'dashboard'], title: 'Дашборд' },
    { key: 'athletes', to: '/athletes', labels: ['спортсмен', 'реестр спортсмен', 'athlete'], title: 'Реестр спортсменов' },
    { key: 'coaches', to: '/coaches', labels: ['тренер', 'реестр тренер', 'coach'], title: 'Реестр тренеров' },
    { key: 'judges', to: '/judges', labels: ['судья', 'судьи', 'реестр судей', 'judge'], title: 'Реестр судей' },
    { key: 'organizations', to: '/organizations', labels: ['организац', 'федерац', 'organization'], title: 'Реестр организаций' },
    { key: 'facilities', to: '/facilities', labels: ['объект', 'спортобъект', 'facility'], title: 'Реестр спортивных объектов' },
    { key: 'events', to: '/events', labels: ['мероприят', 'соревнован', 'event'], title: 'Реестр мероприятий' },
    { key: 'teams', to: '/teams', labels: ['команд', 'сборн', 'team'], title: 'Реестр команд' },
    { key: 'trainerApps', to: '/trainer-applications', labels: ['заявки тренер', 'регистрац тренер', 'trainer application'], title: 'Заявки на регистрацию тренеров' },
    { key: 'awardApps', to: '/award-applications', labels: ['заявки на звания', 'присвоен', 'лишен', 'восстановлен', 'award'], title: 'Заявки на присвоение званий' },
    { key: 'analytics', to: '/analytics', labels: ['аналитик', 'отчёт', 'отчет', 'kpi', 'статистик', 'analytics'], title: 'Аналитика' },
    { key: 'settings', to: '/settings', labels: ['настройк', 'пользовател', 'аудит', 'settings'], title: 'Настройки' },
]

/* ── Government services with document checklists & deadlines (from ТЗ) ── */
export const GOV_SERVICES = [
    {
        key: 'trainerReg',
        title: 'Регистрация тренера (получение свидетельства)',
        to: '/public/trainer-registration',
        deadline: '15 календарных дней',
        documents: [
            'ИНН (14 цифр)',
            'Паспорт (PDF/JPG/PNG, до 10 МБ)',
            'Диплом об образовании',
            'Спортивное звание (при наличии)',
            'Справка о судимости',
        ],
        note: 'После одобрения автоматически генерируется свидетельство формата СВ-КР-ГГГГ-XXXXX.',
    },
    {
        key: 'awardApp',
        title: 'Присвоение спортивного звания / разряда',
        to: '/public/award-application',
        deadline: 'зависит от группы: А — 30 раб. дней, Б — 20 раб. дней, В — 15 раб. дней',
        documents: [
            'Группа А (ЗМС, МСМК, МС): до 10 документов',
            'Группа Б (КМС): до 8 документов',
            'Группа В (I–III разряды, юношеские): до 5 документов',
        ],
        note: 'Точный список документов зависит от присваиваемого звания.',
    },
    {
        key: 'judgeCategory',
        title: 'Присвоение судейской категории',
        to: '/public/services',
        deadline: 'по регламенту услуги',
        documents: [
            'Заявление',
            'Протокол аттестации',
            'Подтверждение судейской практики',
        ],
        note: 'Подробности — в разделе «Государственные услуги».',
    },
]

/* ── Static facts / contacts ── */
export const FACTS = {
    contacts: {
        org: 'Государственное агентство по делам физической культуры и спорта при Кабинете Министров КР (ГАФКиС)',
        address: 'г. Бишкек',
        email: 'info@sport.gov.kg',
    },
    languages: ['Русский', 'Кыргызский', 'English'],
    accessibility: 'На портале доступна версия для слабовидящих (переключатель в шапке сайта) и поддержка навигации с клавиатуры.',
    verify: 'Проверить подлинность документа можно по его номеру или QR-коду в разделе «Проверка документа».',
}
