/* Демо-данные заявок на тренерское свидетельство — общие для списка и страницы рассмотрения. */

export const TRAINER_STATUSES = {
    submitted:  { key: 'submitted',  labelKey: 'trainerApplications.statuses.submitted',    css: 'ta-badge--blue' },
    review:     { key: 'review',     labelKey: 'trainerApplications.statuses.underReview',   css: 'ta-badge--yellow' },
    revision:   { key: 'revision',   labelKey: 'trainerApplications.statuses.needsRevision', css: 'ta-badge--orange' },
    registered: { key: 'registered', labelKey: 'trainerApplications.statuses.registered',    css: 'ta-badge--green' },
    rejected:   { key: 'rejected',   labelKey: 'trainerApplications.statuses.rejected',      css: 'ta-badge--red' },
    annulled:   { key: 'annulled',   labelKey: 'trainerApplications.statuses.revoked',       css: 'ta-badge--gray' },
}

export const TRAINER_DOC_LABEL_KEYS = [
    'trainerApplications.docLabels.passport',
    'trainerApplications.docLabels.diploma',
    'trainerApplications.docLabels.rank',
    'trainerApplications.docLabels.criminal',
    'trainerApplications.docLabels.data',
]

export const TRAINER_MOCK = [
    { id: 'TR-20260301-091200', name: 'Асанов Бакыт Маратович',     date: '2026-03-01', sport: 'Дзюдо',             status: 'submitted',  docs: [1,1,1,1,1], phone: '+996 555 112233', email: 'asanov@mail.kg',     birth: '1985-04-12', tunduk: false },
    { id: 'TR-20260302-143015', name: 'Кулматова Айгерим Сагынбековна', date: '2026-03-02', sport: 'Лёгкая атлетика', status: 'review',     docs: [1,1,1,1,1], phone: '+996 700 445566', email: 'kulmatova@gmail.com', birth: '1990-08-22', tunduk: true },
    { id: 'TR-20260303-100500', name: 'Джумабаев Эрлан Калыкович',   date: '2026-03-03', sport: 'Бокс',              status: 'revision',   docs: [1,1,0,1,1], phone: '+996 777 889900', email: 'jumabaev@inbox.kg',  birth: '1988-01-30', tunduk: false },
    { id: 'TR-20260227-084530', name: 'Токтогулова Назира Асылбековна', date: '2026-02-27', sport: 'Плавание',       status: 'review',     docs: [1,1,1,1,1], phone: '+996 550 112244', email: 'toktogulova@mail.kg', birth: '1992-11-05', tunduk: true },
    { id: 'TR-20260220-110000', name: 'Бейшеналиев Данияр Кубатович', date: '2026-02-20', sport: 'Борьба',           status: 'registered', docs: [1,1,1,1,1], phone: '+996 700 998877', email: 'beish@mail.kg',      birth: '1982-06-18', tunduk: false, certNumber: 'СВ-КР-2026-00142' },
    { id: 'TR-20260225-093000', name: 'Абдылдаев Нурбек Турдумаматович', date: '2026-02-25', sport: 'Тхэквондо',   status: 'rejected',   docs: [1,0,0,1,1], phone: '+996 555 667788', email: 'abdyldaev@gmail.com', birth: '1995-03-08', tunduk: false },
    { id: 'TR-20260310-151000', name: 'Сатыбалдиева Мээрим Акжолтоевна', date: '2026-03-10', sport: 'Каратэ',      status: 'submitted',  docs: [1,1,1,1,1], phone: '+996 770 223344', email: 'satybald@mail.kg',   birth: '1993-09-14', tunduk: true },
    { id: 'TR-20260311-080000', name: 'Ормонов Алмаз Кайратович',    date: '2026-03-11', sport: 'Футбол',            status: 'submitted',  docs: [1,1,1,0,1], phone: '+996 500 556677', email: 'ormonov@inbox.kg',   birth: '1987-12-01', tunduk: false },
    { id: 'TR-20260215-120000', name: 'Жумагулов Тимур Эркинович',   date: '2026-02-15', sport: 'Шахматы',           status: 'annulled',   docs: [1,1,1,1,1], phone: '+996 555 998877', email: 'jumagulov@mail.kg',  birth: '1991-07-20', tunduk: false },
    { id: 'TR-20260308-140000', name: 'Касымова Жылдыз Болотбековна', date: '2026-03-08', sport: 'Гимнастика',       status: 'review',     docs: [1,1,1,1,1], phone: '+996 700 112299', email: 'kasymova@gmail.com', birth: '1994-02-28', tunduk: true },
]

export const TRAINER_DEADLINE_DAYS = 15

export function trainerDaysLeft(dateStr) {
    const submitted = new Date(dateStr)
    const deadline = new Date(submitted)
    deadline.setDate(deadline.getDate() + TRAINER_DEADLINE_DAYS)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
}

export function formatDateRu(d) {
    return d ? new Date(d).toLocaleDateString('ru-RU') : '—'
}

export function generateCertNumber() {
    const n = Math.floor(Math.random() * 90000) + 10000
    return `СВ-КР-2026-${String(n).padStart(5, '0')}`
}
