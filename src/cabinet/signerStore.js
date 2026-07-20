/* Замещение права подписи руководителей (УРФКиМС/СВД, ответы 16-20.07.2026).
   Когда конечный подписант (директор ГАФКиС и др.) недоступен — отдел кадров/админ
   помечает его недоступным на период, и заявки на финальном шаге подписывает зам.
   Общий механизм для всех маршрутов согласования. */

const KEY = 'esport_signer_delegation'

/* Руководители — конечные подписанты маршрутов. deputy — кто замещает. */
export const SIGNERS = [
    { role: 'Директор ГАФКиС', name: 'Мамбетов Азамат Жыргалбекович', deputy: 'Заместитель директора ГАФКиС', deputyName: 'Осмонов Данияр Мелисович' },
]

const DEFAULT = {
    'Директор ГАФКиС': { unavailable: false, from: '', to: '', reason: '' },
}

export function loadDelegation() {
    try {
        const s = localStorage.getItem(KEY)
        if (s) return { ...DEFAULT, ...JSON.parse(s) }
    } catch { /* ignore */ }
    return { ...DEFAULT }
}

export function saveDelegation(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

/* Активно ли замещение для роли (учёт периода, если задан). */
export function isDelegated(state, role, todayStr) {
    const d = state?.[role]
    if (!d || !d.unavailable) return false
    const t = todayStr || new Date().toISOString().slice(0, 10)
    if (d.from && t < d.from) return false
    if (d.to && t > d.to) return false
    return true
}

export function signerInfo(role) {
    return SIGNERS.find(s => s.role === role) || null
}
