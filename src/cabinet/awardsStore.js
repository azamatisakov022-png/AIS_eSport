/* Присвоение спортивных званий и разрядов (звания спортсменов, ответы 17-20.07.2026, ЕСК).
   Три уровня — разные маршруты:
   - Разряды (юношеские/взрослые) — спортшкола (приказ школы);
   - КМС — областное управление;
   - МС / МСМК / ЗМС — полный маршрут (канон, док. 1.0): школа → федерация → Дирекция по видам спорта → ЦА (АиРСВД) → директор ГАФКиС.
   Шаг 0 = подача тренером (в ЛК). Дальше визирование в служебном портале. */

const SCHOOL_STEPS = [
    { role: 'Специалист спортшколы', name: 'Сидоров Максим Борисович', level: 'Спортшкола' },
    { role: 'Начальник спортшколы', name: 'Токтосунов Болот Асанович', level: 'Спортшкола' },
]
const REGION_STEPS = [
    { role: 'Специалист областного управления', name: 'Жумабеков Эрлан Канатович', level: 'Областное управление' },
    { role: 'Начальник областного управления', name: 'Садыков Талант Мирланович', level: 'Областное управление' },
]
const FED_DIR_CA_STEPS = [
    { role: 'Генеральный секретарь федерации', name: 'Осмонов Кубан Асанович', level: 'Федерация' },
    { role: 'Президент федерации', name: 'Абдраимов Марат Кадырович', level: 'Федерация' },
    { role: 'Специалист Дирекции по видам спорта', name: 'Ниязова Гульмира Т.', level: 'Дирекция по видам спорта' },
    { role: 'Директор Дирекции по видам спорта', name: 'Асанов Тилек Мукашевич', level: 'Дирекция по видам спорта' },
    { role: 'Специалист отдела АиРСВД', name: 'Кыдыков Азамат Русланович', level: 'ЦА ГАФКиС' },
    { role: 'Начальник отдела АиРСВД', name: 'Бекбоев Нурлан Токтогулович', level: 'ЦА ГАФКиС' },
    { role: 'Директор ГАФКиС', name: 'Мамбетов Азамат Жыргалбекович', level: 'ЦА ГАФКиС', signer: true },
]
const SUBMIT = { role: 'Тренер (подача)', name: '—', level: 'Спортшкола' }

export const AWARD_LEVELS = {
    youth: { label: 'Юношеский разряд', by: 'спортшкола', route: [SUBMIT, ...SCHOOL_STEPS], order: ['III юн.', 'II юн.', 'I юн.'], badge: false },
    adult: { label: 'Взрослый разряд', by: 'спортшкола', route: [SUBMIT, ...SCHOOL_STEPS], order: ['III', 'II', 'I'], badge: false },
    kms: { label: 'КМС (кандидат в мастера спорта)', by: 'областное управление', route: [SUBMIT, ...SCHOOL_STEPS, ...REGION_STEPS], order: ['КМС'], badge: false },
    title: { label: 'МС / МСМК / ЗМС', by: 'ГАФКиС (АиРСВД)', route: [SUBMIT, ...SCHOOL_STEPS, ...FED_DIR_CA_STEPS], order: ['МС', 'МСМК', 'ЗМС'], badge: true },
}

/* Роли для переключателя «Войти как» — все участники маршрутов, кроме подачи. */
export const AWARD_ROLES = (() => {
    const seen = new Set(); const out = []
    for (const lvl of Object.values(AWARD_LEVELS)) {
        for (const r of lvl.route.slice(1)) {
            if (seen.has(r.role)) continue
            seen.add(r.role); out.push({ role: r.role, name: r.name, level: r.level })
        }
    }
    return out
})()

const KEY = 'esport_awards'
const ACTING_KEY = 'esport_award_acting_role'

const SEED = [
    { id: 1, num: 'ЗВ-2026-001', level: 'title', title: 'МС', athlete: 'Джумабаев Эрлан Калыкович', inn: '21203199500110', sport: 'Дзюдо', discipline: 'весовые категории', competition: 'Чемпионат КР 2026, 1 место', region: 'Чуйская область', school: 'СДЮСШ «Олимп»', coach: 'Иванов С.П.', step: 6, returned: false, submittedAt: '2026-07-05', visas: ['2026-07-05','2026-07-06','2026-07-08','2026-07-10','2026-07-11','2026-07-14'], order: 'НГ-2026-118', badgeIssued: false },
    { id: 2, num: 'ЗВ-2026-002', level: 'kms', title: 'КМС', athlete: 'Кулматова Айгерим Сагынбековна', inn: '22510200200220', sport: 'Лёгкая атлетика', discipline: 'бег 400 м', competition: 'Первенство области 2026, 1 место', region: 'Чуйская область', school: 'СДЮСШ «Олимп»', coach: 'Касымова А.Т.', step: 3, returned: false, submittedAt: '2026-07-12', visas: ['2026-07-12','2026-07-13','2026-07-15'], order: '', badgeIssued: false },
    { id: 3, num: 'ЗВ-2026-003', level: 'youth', title: 'II юн.', athlete: 'Ормонов Азамат Бакытович', inn: '21008201000330', sport: 'Бокс', discipline: 'бокс', competition: 'Городские соревнования 2026, 2 место', region: 'Главное управление (Бишкек)', school: 'СДЮСШОР №3 г. Бишкек', coach: 'Асанов Б.М.', step: 3, returned: false, submittedAt: '2026-06-28', visas: ['2026-06-28','2026-06-29','2026-06-30'], order: 'СШ-2026-045', badgeIssued: false },
]

export function loadAwards() {
    try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch { /* ignore */ }
    return SEED
}
export function saveAwards(list) { try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* ignore */ } }
export function loadAwardActing() { try { return localStorage.getItem(ACTING_KEY) || 'any' } catch { return 'any' } }
export function saveAwardActing(r) { try { localStorage.setItem(ACTING_KEY, r) } catch { /* ignore */ } }

export function awardRoute(a) { return AWARD_LEVELS[a.level].route }
export function awardStatus(a) {
    const route = awardRoute(a)
    if (a.returned) return { label: 'Возвращён на доработку', tone: 'red' }
    if (a.step >= route.length) return { label: `Присвоено: ${a.title}`, tone: 'green' }
    return { label: `Шаг ${a.step + 1} из ${route.length} — ${route[a.step].role}`, tone: 'amber' }
}
export const awToday = () => new Date().toISOString().slice(0, 10)
