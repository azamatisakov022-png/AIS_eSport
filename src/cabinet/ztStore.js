/* Присвоение звания «Заслуженный тренер КР» (ответы 2026-07-20, ЕСК + флоу 1.0).
   Маршрут: тренер (подача пакета) → федерация (генсек, президент) → Дирекция по видам
   спорта (методист, директор) → ЦА «Отдел анализа и развития спорта высших достижений»
   (специалист готовит приказ, начальник) → директор ГАФКиС (или зам). Шаг 0 = подача в ЛК. */

const SUBMIT = { role: 'Тренер (подача пакета)', name: '—', level: 'Спортшкола' }
const STEPS = [
    { role: 'Генеральный секретарь федерации', name: 'Осмонов Кубан Асанович', level: 'Федерация' },
    { role: 'Президент федерации', name: 'Абдраимов Марат Кадырович', level: 'Федерация' },
    { role: 'Методист Дирекции по видам спорта', name: 'Ниязова Гульмира Токтогуловна', level: 'Дирекция по видам спорта' },
    { role: 'Директор Дирекции по видам спорта', name: 'Асанов Тилек Мукашевич', level: 'Дирекция по видам спорта' },
    { role: 'Специалист отдела АиРСВД', name: 'Кыдыков Азамат Русланович', level: 'ЦА ГАФКиС' },
    { role: 'Начальник отдела АиРСВД', name: 'Бекбоев Нурлан Токтогулович', level: 'ЦА ГАФКиС' },
    { role: 'Директор ГАФКиС', name: 'Мамбетов Азамат Жыргалбекович', level: 'ЦА ГАФКиС', signer: true },
]
export const ZT_ROUTE = [SUBMIT, ...STEPS]

export const ZT_ROLES = STEPS.map(r => ({ role: r.role, name: r.name, level: r.level }))

/* Пакет документов заявителя (согласие на ПД — при регистрации, не здесь; паспорт — из ЕСИ). */
export const ZT_DOCS = [
    { key: 'photo', label: '2 фото 3х4' },
    { key: 'labor', label: 'Копия трудовой книжки' },
    { key: 'noCriminal', label: 'Справка о несудимости' },
    { key: 'certificate', label: 'Свидетельство о допуске к тренерской деятельности' },
    { key: 'students', label: 'Список подготовленных спортсменов (заверен печатью организации)' },
]

const KEY = 'esport_zt'
const ACTING_KEY = 'esport_zt_acting_role'

const SEED = [
    {
        id: 1, num: 'ЗТ-2026-001', coach: 'Иванов Сергей Петрович', inn: '21203198500202', sport: 'Дзюдо',
        region: 'Чуйская область', federation: 'Федерация дзюдо КР', experience: 27,
        students: [
            { name: 'Джумабаев Эрлан Калыкович', rank: 'МС' },
            { name: 'Асанов Бекболот Маратович', rank: 'КМС' },
            { name: 'Кулов Азамат Т.', rank: 'МС' },
        ],
        docs: { photo: true, labor: true, noCriminal: true, certificate: true, students: true },
        step: 3, returned: false, submittedAt: '2026-07-08', visas: ['2026-07-08', '2026-07-09', '2026-07-11'], order: '', badgeIssued: false,
    },
    {
        id: 2, num: 'ЗТ-2026-002', coach: 'Касымова Айгуль Талантовна', inn: '22107198800404', sport: 'Лёгкая атлетика',
        region: 'Главное управление (Бишкек)', federation: 'Федерация лёгкой атлетики КР', experience: 26,
        students: [
            { name: 'Токтогулова Н.А.', rank: 'МСМК' },
            { name: 'Орозова Ж.К.', rank: 'МС' },
        ],
        docs: { photo: true, labor: true, noCriminal: true, certificate: true, students: true },
        step: 6, returned: false, submittedAt: '2026-06-30', visas: ['2026-06-30', '2026-07-01', '2026-07-03', '2026-07-05', '2026-07-08', '2026-07-10'], order: 'СВД-2026-077', badgeIssued: false,
    },
]

export function loadZt() { try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch { /* ignore */ } return SEED }
export function saveZt(list) { try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* ignore */ } }
export function loadZtActing() { try { return localStorage.getItem(ACTING_KEY) || 'any' } catch { return 'any' } }
export function saveZtActing(r) { try { localStorage.setItem(ACTING_KEY, r) } catch { /* ignore */ } }

export function ztStatus(z) {
    if (z.returned) return { label: 'Возвращён на доработку', tone: 'red' }
    if (z.step >= ZT_ROUTE.length) return { label: 'Звание ЗТ присвоено', tone: 'green' }
    return { label: `Шаг ${z.step + 1} из ${ZT_ROUTE.length} — ${ZT_ROUTE[z.step].role}`, tone: 'amber' }
}
export const ztToday = () => new Date().toISOString().slice(0, 10)
