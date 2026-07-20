/* Демо-стор согласований «школа → область → ЦА ГАФКиС» (процессы УРФКиМС, 16.07.2026).
   Хранится в localStorage: документ, отправленный из ЛК спортшколы, виден в служебном
   портале, и наоборот. У каждого шага маршрута — роль и конкретный исполнитель (демо-ФИО),
   подтверждения фиксируются с датой (лист визирования). */

export const TARIF_ROUTE = [
    { role: 'Бухгалтер спортшколы', name: 'Абдырова Нургуль Кубанычбековна', level: 'Спортшкола' },
    { role: 'Директор спортшколы', name: 'Токтосунов Болот Асанович', level: 'Спортшкола' },
    { role: 'Бухгалтер областного управления', name: 'Осмонова Гульнара Асылбековна', level: 'Областное управление' },
    { role: 'Начальник областного управления', name: 'Садыков Талант Мирланович', level: 'Областное управление' },
    { role: 'Специалист УРФКиМС', name: 'Сатыбалдиев Кубат Жолдошевич', level: 'ЦА ГАФКиС' },
    { role: 'Специалист отдела кадров ГАФКиС', name: 'Кадырова Айгуль Маратовна', level: 'ЦА ГАФКиС' },
    { role: 'Специалист финансового отдела ГАФКиС', name: 'Кулбаева Айдай Кубанычбековна', level: 'ЦА ГАФКиС' },
    { role: 'Начальник УРФКиМС', name: 'Бекбоев Нурлан Токтогулович', level: 'ЦА ГАФКиС' },
    { role: 'Директор ГАФКиС', name: 'Мамбетов Азамат Жыргалбекович', level: 'ЦА ГАФКиС', deputy: 'зам. директора — при отсутствии' },
]

export const PLAN_ROUTE = [
    { role: 'Заместитель директора спортшколы', name: 'Исакова Чолпон Темировна', level: 'Спортшкола' },
    { role: 'Директор спортшколы', name: 'Токтосунов Болот Асанович', level: 'Спортшкола' },
    { role: 'Специалист областного управления', name: 'Жумабеков Эрлан Канатович', level: 'Областное управление' },
    { role: 'Начальник областного управления', name: 'Садыков Талант Мирланович', level: 'Областное управление' },
    { role: 'Специалист УРФКиМС', name: 'Сатыбалдиев Кубат Жолдошевич', level: 'ЦА ГАФКиС' },
    { role: 'Начальник УРФКиМС', name: 'Бекбоев Нурлан Токтогулович', level: 'ЦА ГАФКиС' },
    { role: 'Директор ГАФКиС', name: 'Мамбетов Азамат Жыргалбекович', level: 'ЦА ГАФКиС', deputy: 'зам. директора — при отсутствии' },
]

export const DOC_TYPES = {
    tarif: { label: 'Тарификация тренеров', route: TARIF_ROUTE, prefix: 'ТФ', listPath: '/tarifications' },
    plan: { label: 'План комплектования', route: PLAN_ROUTE, prefix: 'ПК', listPath: '/staffing-plans' },
}

const KEY = 'esport_school_approvals_v2'

/* rows: содержимое документа (электронная форма).
   visas: даты подтверждений по пройденным шагам (индекс = шаг). */
const SEED = [
    {
        id: 1, num: 'ТФ-2026-001', type: 'tarif', school: 'СДЮСШОР №3 г. Бишкек', region: 'Главное управление (Бишкек)',
        year: 2026, step: 4, returned: false, submittedAt: '2026-07-02',
        visas: ['2026-07-02', '2026-07-03', '2026-07-07', '2026-07-09'],
        rows: [
            ['Асанов Бакыт Маратович', 'Дзюдо', '1.0', '18', '14'],
            ['Петрова Наталья Сергеевна', 'Гимнастика', '0.5', '9', '10'],
        ],
    },
    {
        id: 2, num: 'ПК-2026-001', type: 'plan', school: 'СДЮСШ «Олимп»', region: 'Чуйская область',
        year: 2026, step: 7, returned: false, submittedAt: '2026-06-18',
        visas: ['2026-06-18', '2026-06-19', '2026-06-23', '2026-06-25', '2026-06-27', '2026-06-30', '2026-07-02'],
        rows: [
            ['Дзюдо', 'НП-1', '15', 'Иванов С.П.'],
            ['Лёгкая атлетика', 'НП-1', '16', 'Касымова А.Т.'],
        ],
    },
    {
        id: 3, num: 'ТФ-2026-002', type: 'tarif', school: 'ДЮСШ г. Ош', region: 'Ошская область',
        year: 2026, step: 2, returned: false, submittedAt: '2026-07-14',
        visas: ['2026-07-14', '2026-07-15'],
        rows: [
            ['Турдалиев Марат Сапарбекович', 'Борьба', '1.0', '20', '16'],
        ],
    },
]

export function loadApprovals() {
    try {
        const s = localStorage.getItem(KEY)
        if (s) return JSON.parse(s)
    } catch { /* ignore */ }
    return SEED
}

export function saveApprovals(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* ignore */ }
}

export function routeFor(type) { return DOC_TYPES[type].route }

export function statusOf(doc) {
    const route = routeFor(doc.type)
    if (doc.returned) return { label: 'Возвращён на доработку', tone: 'red' }
    if (doc.step >= route.length) return { label: 'Утверждено', tone: 'green' }
    return { label: `Шаг ${doc.step + 1} из ${route.length} — ${route[doc.step].role}`, tone: 'amber' }
}

export const today = () => new Date().toISOString().slice(0, 10)

/* ── «Войти как» (демо): от чьего имени сотрудник действует в маршрутах ──
   Шаги 0–1 выполняет спортшкола в своём ЛК; здесь — участники области и ЦА. */
export const APPROVAL_ROLES = (() => {
    const seen = new Set()
    const out = []
    for (const r of [...TARIF_ROUTE.slice(2), ...PLAN_ROUTE.slice(2)]) {
        if (seen.has(r.role)) continue
        seen.add(r.role)
        out.push({ role: r.role, name: r.name, level: r.level })
    }
    return out
})()

const ACTING_KEY = 'esport_approval_acting_role'

export function loadActingRole() {
    try { return localStorage.getItem(ACTING_KEY) || 'any' } catch { return 'any' }
}

export function saveActingRole(role) {
    try { localStorage.setItem(ACTING_KEY, role) } catch { /* ignore */ }
}
