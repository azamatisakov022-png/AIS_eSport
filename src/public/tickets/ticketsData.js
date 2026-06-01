/**
 * Mock ticketing data for the online ticket sales demo.
 * Ties to spectacle events from the events registry.
 * `schemeType` drives the visual arena layout (ArenaScheme.jsx).
 * Sectors carry price (KGS), colour, total & sold seats.
 */

export const TICKET_EVENTS = [
    {
        id: 7,
        title: 'Кубок Президента КР по футболу',
        sport: 'Футбол',
        city: 'Бишкек',
        venue: 'Стадион «Дордой-Арена»',
        date: '2026-05-15',
        time: '18:00',
        schemeType: 'stadium',
        emoji: '⚽',
        sectors: [
            { id: 'vip', name: 'VIP-ложа', price: 2500, color: '#a855f7', total: 60, sold: 41 },
            { id: 'west', name: 'Западная трибуна', price: 900, color: '#2563eb', total: 1800, sold: 980 },
            { id: 'east', name: 'Восточная трибуна', price: 700, color: '#0ea5e9', total: 1800, sold: 1240 },
            { id: 'north', name: 'Северная трибуна', price: 400, color: '#16a34a', total: 2500, sold: 600 },
            { id: 'south', name: 'Южная трибуна (фан-сектор)', price: 400, color: '#f59e0b', total: 2500, sold: 2480 },
        ],
    },
    {
        id: 12,
        title: 'Чемпионат мира по кок-бору',
        sport: 'Кок-бору',
        city: 'Бишкек',
        venue: 'Ипподром «Ак-Кула»',
        date: '2026-09-01',
        time: '14:00',
        schemeType: 'hippodrome',
        emoji: '🐎',
        sectors: [
            { id: 'vip', name: 'Почётная трибуна (VIP)', price: 3000, color: '#a855f7', total: 100, sold: 70 },
            { id: 'central', name: 'Центральная трибуна', price: 1200, color: '#2563eb', total: 1500, sold: 820 },
            { id: 'left', name: 'Левая трибуна', price: 600, color: '#16a34a', total: 2000, sold: 410 },
            { id: 'right', name: 'Правая трибуна', price: 600, color: '#f59e0b', total: 2000, sold: 350 },
        ],
    },
    {
        id: 5,
        title: 'Чемпионат Азии по борьбе — отбор',
        sport: 'Борьба',
        city: 'Бишкек',
        venue: 'Дворец спорта им. Кожомкула',
        date: '2026-04-20',
        time: '16:00',
        schemeType: 'arena',
        emoji: '🤼',
        sectors: [
            { id: 'vip', name: 'VIP (у ковра)', price: 1800, color: '#a855f7', total: 40, sold: 22 },
            { id: 'parter', name: 'Партер', price: 800, color: '#2563eb', total: 400, sold: 210 },
            { id: 'tribA', name: 'Трибуна A', price: 500, color: '#0ea5e9', total: 600, sold: 300 },
            { id: 'tribB', name: 'Трибуна B', price: 500, color: '#16a34a', total: 600, sold: 180 },
            { id: 'balcony', name: 'Балкон', price: 300, color: '#f59e0b', total: 800, sold: 760 },
        ],
    },
    {
        id: 9,
        title: 'Международный турнир «Манас Опен» (тхэквондо)',
        sport: 'Тхэквондо',
        city: 'Бишкек',
        venue: 'Дворец спорта им. Кожомкула',
        date: '2026-06-15',
        time: '17:00',
        schemeType: 'arena',
        emoji: '🥋',
        sectors: [
            { id: 'vip', name: 'VIP', price: 1500, color: '#a855f7', total: 40, sold: 12 },
            { id: 'parter', name: 'Партер', price: 700, color: '#2563eb', total: 400, sold: 150 },
            { id: 'tribA', name: 'Трибуна A', price: 450, color: '#0ea5e9', total: 600, sold: 220 },
            { id: 'tribB', name: 'Трибуна B', price: 450, color: '#16a34a', total: 600, sold: 90 },
        ],
    },
    {
        id: 2,
        title: 'Кубок Бишкека по боксу',
        sport: 'Бокс',
        city: 'Бишкек',
        venue: 'СК «Спартак»',
        date: '2026-03-22',
        time: '19:00',
        schemeType: 'arena',
        emoji: '🥊',
        sectors: [
            { id: 'vip', name: 'VIP (ринг-сайд)', price: 2000, color: '#a855f7', total: 30, sold: 18 },
            { id: 'parter', name: 'Партер', price: 900, color: '#2563eb', total: 300, sold: 140 },
            { id: 'tribA', name: 'Трибуна A', price: 500, color: '#0ea5e9', total: 500, sold: 260 },
            { id: 'tribB', name: 'Трибуна B', price: 500, color: '#16a34a', total: 500, sold: 120 },
        ],
    },
    {
        id: 1,
        title: 'Чемпионат КР по дзюдо 2026',
        sport: 'Дзюдо',
        city: 'Бишкек',
        venue: 'Дворец спорта им. Кожомкула',
        date: '2026-03-15',
        time: '15:00',
        schemeType: 'arena',
        emoji: '🥋',
        sectors: [
            { id: 'vip', name: 'VIP', price: 1200, color: '#a855f7', total: 40, sold: 8 },
            { id: 'parter', name: 'Партер', price: 600, color: '#2563eb', total: 400, sold: 110 },
            { id: 'tribA', name: 'Трибуна A', price: 350, color: '#0ea5e9', total: 600, sold: 140 },
            { id: 'tribB', name: 'Трибуна B', price: 350, color: '#16a34a', total: 600, sold: 60 },
        ],
    },
]

export const PAYMENT_METHODS = [
    { id: 'elcart', name: 'Элкарт', hint: 'Национальная платёжная система' },
    { id: 'mbank', name: 'MBank', hint: 'Оплата через приложение' },
    { id: 'odengi', name: 'O!Деньги', hint: 'Электронный кошелёк' },
    { id: 'visa', name: 'Visa / Mastercard', hint: 'Банковская карта' },
]

export function getTicketEvent(id) {
    return TICKET_EVENTS.find(e => String(e.id) === String(id)) || null
}

export function sectorAvailable(sector) {
    return Math.max(0, sector.total - sector.sold)
}

export function fmtPrice(n) {
    return `${n.toLocaleString('ru-RU')} сом`
}

export function fmtDate(iso) {
    try {
        return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
        return iso
    }
}
