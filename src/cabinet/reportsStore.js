/* Отчётность подведомственных организаций (ответы УРФКиМС/СВД, 17-20.07.2026).
   Подведомственные организации (спортшколы, областные управления) ежемесячно
   сдают отчёт из 4 разделов: присвоенные звания/разряды, медали на международных
   соревнованиях, проведённые мероприятия, учебно-тренировочные сборы (УТС).
   Отдел СВД (спорта высших достижений) ЦА ГАФКиС принимает отчёты и формирует своды. */

/* Метаданные разделов — используются и в форме подачи, и в рассмотрении/своде. */
export const REPORT_SECTIONS = [
    {
        key: 'titles', label: 'Присвоенные звания и разряды', unit: 'званий',
        cols: [
            { key: 'athlete', label: 'Спортсмен', ph: 'ФИО', flex: '1 1 240px' },
            { key: 'rank', label: 'Звание/разряд', type: 'rank', flex: '0 0 150px' },
            { key: 'sport', label: 'Вид спорта', ph: 'Дзюдо', flex: '1 1 160px' },
        ],
    },
    {
        key: 'medals', label: 'Медали на международных соревнованиях', unit: 'медалей',
        cols: [
            { key: 'athlete', label: 'Спортсмен', ph: 'ФИО', flex: '1 1 220px' },
            { key: 'sport', label: 'Вид спорта', ph: 'Бокс', flex: '1 1 130px' },
            { key: 'competition', label: 'Соревнование', ph: 'Кубок Азии 2026', flex: '1 1 200px' },
            { key: 'medal', label: 'Медаль', type: 'medal', flex: '0 0 130px' },
        ],
    },
    {
        key: 'events', label: 'Проведённые мероприятия', unit: 'мероприятий',
        cols: [
            { key: 'name', label: 'Наименование', ph: 'Первенство школы', flex: '1 1 260px' },
            { key: 'date', label: 'Дата', type: 'date', flex: '0 0 150px' },
            { key: 'participants', label: 'Участников', type: 'number', ph: '80', flex: '0 0 120px' },
        ],
    },
    {
        key: 'camps', label: 'Учебно-тренировочные сборы (УТС)', unit: 'сборов',
        cols: [
            { key: 'name', label: 'Наименование / место', ph: 'УТС, Чолпон-Ата', flex: '1 1 240px' },
            { key: 'sport', label: 'Вид спорта', ph: 'Плавание', flex: '1 1 140px' },
            { key: 'dates', label: 'Сроки', ph: '01–14.07.2026', flex: '0 0 160px' },
            { key: 'participants', label: 'Участников', type: 'number', ph: '24', flex: '0 0 120px' },
        ],
    },
]

export const RANK_OPTIONS = ['III юн.', 'II юн.', 'I юн.', 'III', 'II', 'I', 'КМС', 'МС', 'МСМК', 'ЗМС']
export const MEDAL_OPTIONS = ['Золото', 'Серебро', 'Бронза']

/* Организация текущего кабинета (демо). */
export const MY_ORG = { name: 'СДЮСШ «Олимп»', type: 'Спортшкола', region: 'Чуйская область' }

const KEY = 'esport_monthly_reports'

const emptySections = () => ({ titles: [], medals: [], events: [], camps: [] })

const SEED = [
    {
        id: 1, num: 'ОТЧ-2026-06-001', org: 'СДЮСШ «Олимп»', orgType: 'Спортшкола', region: 'Чуйская область',
        period: '2026-06', status: 'accepted', submittedAt: '2026-07-03', acceptedAt: '2026-07-05',
        reviewer: 'Отдел СВД', note: '',
        titles: [
            { athlete: 'Джумабаев Эрлан Калыкович', rank: 'КМС', sport: 'Дзюдо' },
            { athlete: 'Ормонов Азамат Бакытович', rank: 'II юн.', sport: 'Бокс' },
        ],
        medals: [
            { athlete: 'Кулматова Айгерим Сагынбековна', sport: 'Лёгкая атлетика', competition: 'Первенство ЦА 2026', medal: 'Серебро' },
        ],
        events: [
            { name: 'Первенство школы по дзюдо', date: '2026-06-14', participants: 96 },
        ],
        camps: [
            { name: 'УТС, Чолпон-Ата', sport: 'Дзюдо', dates: '05–18.06.2026', participants: 22 },
        ],
    },
    {
        id: 2, num: 'ОТЧ-2026-06-002', org: 'СДЮСШОР №3 г. Бишкек', orgType: 'Спортшкола', region: 'Главное управление (Бишкек)',
        period: '2026-06', status: 'accepted', submittedAt: '2026-07-02', acceptedAt: '2026-07-04',
        reviewer: 'Отдел СВД', note: '',
        titles: [
            { athlete: 'Сыдыков Тимур Асанович', rank: 'I', sport: 'Плавание' },
        ],
        medals: [
            { athlete: 'Абдырахманов Нурбек', sport: 'Бокс', competition: 'Кубок Азии 2026', medal: 'Бронза' },
            { athlete: 'Токтогулова Айсулуу', sport: 'Плавание', competition: 'Кубок Азии 2026', medal: 'Золото' },
        ],
        events: [
            { name: 'Открытый турнир по плаванию', date: '2026-06-21', participants: 140 },
        ],
        camps: [],
    },
    {
        id: 3, num: 'ОТЧ-2026-07-001', org: 'Областное управление ФКиС (Ошская обл.)', orgType: 'Областное управление', region: 'Ошская область',
        period: '2026-07', status: 'submitted', submittedAt: '2026-07-16', acceptedAt: '', reviewer: '', note: '',
        titles: [
            { athlete: 'Мамасалиев Улан', rank: 'КМС', sport: 'Борьба' },
            { athlete: 'Абдуллаева Нургуль', rank: 'I', sport: 'Таэквондо' },
        ],
        medals: [],
        events: [
            { name: 'Областная спартакиада', date: '2026-07-10', participants: 320 },
        ],
        camps: [
            { name: 'УТС сборной области, Ош', sport: 'Борьба', dates: '03–17.07.2026', participants: 30 },
        ],
    },
]

export function loadReports() {
    try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch { /* ignore */ }
    return SEED
}
export function saveReports(list) { try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* ignore */ } }

export const rpToday = () => new Date().toISOString().slice(0, 10)

export function reportStatus(r) {
    if (r.status === 'accepted') return { label: 'Принят в свод', tone: 'green' }
    if (r.status === 'returned') return { label: 'Возвращён на доработку', tone: 'red' }
    return { label: 'На проверке в отделе СВД', tone: 'amber' }
}

/* 'Июль 2026' из '2026-07' */
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
export function periodLabel(period) {
    const [y, m] = String(period).split('-')
    return `${MONTHS[Number(m) - 1] || m} ${y}`
}

/* Список периодов, встречающихся в отчётах (для фильтра), от новых к старым. */
export function reportPeriods(list) {
    return [...new Set(list.map(r => r.period))].sort().reverse()
}

/* Кол-во строк по разделам отчёта. */
export function sectionCount(r, key) { return (r[key] || []).length }

/* Свод: суммирование по принятым отчётам за период. */
export function buildSvod(list, period) {
    const accepted = list.filter(r => r.period === period && r.status === 'accepted')
    const totals = {}
    REPORT_SECTIONS.forEach(s => { totals[s.key] = 0 })
    const medalsByKind = { Золото: 0, Серебро: 0, Бронза: 0 }
    accepted.forEach(r => {
        REPORT_SECTIONS.forEach(s => { totals[s.key] += (r[s.key] || []).length })
        ;(r.medals || []).forEach(m => { if (medalsByKind[m.medal] !== undefined) medalsByKind[m.medal]++ })
    })
    return { orgs: accepted.length, totals, medalsByKind }
}

export { emptySections }
