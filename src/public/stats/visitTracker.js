/**
 * Lightweight visit tracker (client-side, demo).
 * Records page views into localStorage and exposes aggregates for the
 * public statistics page (требование Распоряжения КМ КР №59-р —
 * статистика и метрика посещаемости веб-сайта).
 *
 * On a real deployment this is replaced by server-side analytics
 * (Matomo / Yandex.Metrika / GoatCounter) — the getStats() shape stays.
 */

const KEY = 'pub-visits'
const SESSION_KEY = 'pub-visit-session'

const PAGE_LABELS = {
    '/public': 'Главная',
    '/public/news': 'Новости',
    '/public/athletes': 'Спортсмены',
    '/public/coaches': 'Тренеры',
    '/public/judges': 'Судьи',
    '/public/events': 'Мероприятия',
    '/public/tickets': 'Билеты',
    '/public/organizations': 'Организации',
    '/public/facilities': 'Спортивные объекты',
    '/public/schools': 'Спортивные школы',
    '/public/services': 'Госуслуги',
    '/public/verify': 'Проверка документа',
    '/public/login': 'Вход / Кабинет',
    '/public/statistics': 'Статистика',
}

function todayISO(offsetDays = 0) {
    const d = new Date()
    d.setDate(d.getDate() - offsetDays)
    return d.toISOString().slice(0, 10)
}

/* Deterministic-ish seed of last 30 days so the dashboard isn't empty. */
function seed() {
    const byDay = {}
    let total = 0
    for (let i = 29; i >= 0; i--) {
        const date = todayISO(i)
        const dow = new Date(date).getDay() // 0 Sun .. 6 Sat
        const weekend = dow === 0 || dow === 6
        const base = weekend ? 1500 : 1000
        const v = base + Math.round((Math.sin(i * 1.7) + 1) * 350) + (i % 5) * 60
        byDay[date] = v
        total += v
    }
    const byPage = {
        '/public': Math.round(total * 0.34),
        '/public/athletes': Math.round(total * 0.14),
        '/public/events': Math.round(total * 0.11),
        '/public/services': Math.round(total * 0.09),
        '/public/verify': Math.round(total * 0.08),
        '/public/tickets': Math.round(total * 0.07),
        '/public/facilities': Math.round(total * 0.06),
        '/public/news': Math.round(total * 0.05),
        '/public/organizations': Math.round(total * 0.04),
        '/public/coaches': Math.round(total * 0.02),
    }
    const device = {
        mobile: Math.round(total * 0.56),
        desktop: Math.round(total * 0.37),
        tablet: Math.round(total * 0.07),
    }
    return {
        total,
        unique: Math.round(total * 0.41),
        byDay,
        byPage,
        device,
        seededAt: todayISO(),
    }
}

function load() {
    try {
        const raw = localStorage.getItem(KEY)
        if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    const fresh = seed()
    save(fresh)
    return fresh
}

function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

function detectDevice() {
    const w = window.innerWidth
    const ua = navigator.userAgent || ''
    if (/Mobi|Android|iPhone/i.test(ua) || w < 600) return 'mobile'
    if (/iPad|Tablet/i.test(ua) || (w >= 600 && w < 1024)) return 'tablet'
    return 'desktop'
}

/** Record one page view. Call on route change. */
export function recordVisit(path) {
    const data = load()
    const date = todayISO()
    data.total += 1
    data.byDay[date] = (data.byDay[date] || 0) + 1
    data.byPage[path] = (data.byPage[path] || 0) + 1

    // Unique visitor: one per browser session
    if (!sessionStorage.getItem(SESSION_KEY)) {
        sessionStorage.setItem(SESSION_KEY, '1')
        data.unique += 1
        const dev = detectDevice()
        data.device[dev] = (data.device[dev] || 0) + 1
    }
    save(data)
    return data.total
}

/** Aggregated stats for the dashboard. */
export function getStats() {
    const data = load()
    const date = todayISO()

    // Last 14 days series for the chart
    const series = []
    for (let i = 13; i >= 0; i--) {
        const d = todayISO(i)
        series.push({ date: d, value: data.byDay[d] || 0 })
    }

    // Month total (last 30 days)
    let month = 0
    Object.entries(data.byDay).forEach(([d, v]) => {
        const diff = (new Date(date) - new Date(d)) / 86400000
        if (diff >= 0 && diff < 30) month += v
    })

    // Top pages
    const topPages = Object.entries(data.byPage)
        .map(([path, value]) => ({ path, label: PAGE_LABELS[path] || path, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)

    const deviceTotal = Object.values(data.device).reduce((a, b) => a + b, 0) || 1
    const devices = [
        { key: 'mobile', label: 'Мобильные', value: data.device.mobile || 0, pct: Math.round((data.device.mobile || 0) / deviceTotal * 100) },
        { key: 'desktop', label: 'Компьютеры', value: data.device.desktop || 0, pct: Math.round((data.device.desktop || 0) / deviceTotal * 100) },
        { key: 'tablet', label: 'Планшеты', value: data.device.tablet || 0, pct: Math.round((data.device.tablet || 0) / deviceTotal * 100) },
    ]

    return {
        total: data.total,
        unique: data.unique,
        today: data.byDay[date] || 0,
        month,
        series,
        topPages,
        devices,
    }
}

/** Just the running total (for the footer counter). */
export function getTotal() {
    return load().total
}
