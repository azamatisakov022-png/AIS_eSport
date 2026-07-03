import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import './Analytics.css'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, MetricCard } from '../components/ui'

/* ══════════════════════════════════════════════════════
   MOCK DATA - 3 years
   ══════════════════════════════════════════════════════ */
const DATA = {
    2024: {
        kpi: { titles: 72, titlesTrend: null, apps: 198, appsTrend: null, avgDays: 14.8, avgDaysTrend: null, rejected: 18, rejectedPct: 9, rejectedTrend: null },
        monthly: [
            { m: 'Янв', ms: 4, kms: 7 }, { m: 'Фев', ms: 3, kms: 5 }, { m: 'Мар', ms: 6, kms: 9 },
            { m: 'Апр', ms: 5, kms: 8 }, { m: 'Май', ms: 7, kms: 10 }, { m: 'Июн', ms: 8, kms: 12 },
            { m: 'Июл', ms: 5, kms: 7 }, { m: 'Авг', ms: 4, kms: 6 }, { m: 'Сен', ms: 6, kms: 9 },
            { m: 'Окт', ms: 7, kms: 11 }, { m: 'Ноя', ms: 5, kms: 8 }, { m: 'Дек', ms: 4, kms: 6 },
        ],
        appTypes: [
            { label: 'Регистрация тренеров', value: 82, color: '#2563EB' },
            { label: 'Присвоение звания', value: 64, color: '#d97706' },
            { label: 'Судейская категория', value: 32, color: '#7C3AED' },
            { label: 'Восстановление документов', value: 20, color: '#94a3b8' },
        ],
        regions: [
            { name: 'Бишкек', ath: 1080, tr: 72, jd: 28 },
            { name: 'Чуйская', ath: 590, tr: 38, jd: 17 },
            { name: 'Ош', ath: 460, tr: 32, jd: 15 },
            { name: 'Иссык-Кульская', ath: 365, tr: 24, jd: 12 },
            { name: 'Джалал-Абадская', ath: 310, tr: 20, jd: 10 },
            { name: 'Нарынская', ath: 195, tr: 14, jd: 7 },
            { name: 'Баткенская', ath: 168, tr: 12, jd: 6 },
            { name: 'Таласская', ath: 130, tr: 9, jd: 4 },
            { name: 'Ошская (область)', ath: 102, tr: 7, jd: 3 },
        ],
        sports: [
            { name: 'Бокс', total: 367, ms: 12, kms: 45, rest: 310 },
            { name: 'Борьба', total: 334, ms: 10, kms: 38, rest: 286 },
            { name: 'Футбол', total: 270, ms: 3, kms: 20, rest: 247 },
            { name: 'Дзюдо', total: 248, ms: 8, kms: 30, rest: 210 },
            { name: 'Лёгкая атлетика', total: 220, ms: 6, kms: 25, rest: 189 },
            { name: 'Тяжёлая атлетика', total: 178, ms: 5, kms: 18, rest: 155 },
            { name: 'Гимнастика', total: 156, ms: 4, kms: 16, rest: 136 },
            { name: 'Плавание', total: 134, ms: 3, kms: 12, rest: 119 },
            { name: 'Волейбол', total: 120, ms: 2, kms: 10, rest: 108 },
            { name: 'Теннис', total: 98, ms: 1, kms: 8, rest: 89 },
        ],
        efficiency: [
            { m: 'Янв', submitted: 18, processed: 15, rejected: 2, avgDays: 15.2 },
            { m: 'Фев', submitted: 14, processed: 12, rejected: 1, avgDays: 14.5 },
            { m: 'Мар', submitted: 22, processed: 20, rejected: 2, avgDays: 15.8 },
            { m: 'Апр', submitted: 16, processed: 14, rejected: 1, avgDays: 14.0 },
            { m: 'Май', submitted: 19, processed: 17, rejected: 2, avgDays: 15.1 },
            { m: 'Июн', submitted: 21, processed: 19, rejected: 3, avgDays: 16.0 },
            { m: 'Июл', submitted: 13, processed: 12, rejected: 1, avgDays: 13.5 },
            { m: 'Авг', submitted: 11, processed: 10, rejected: 1, avgDays: 14.2 },
            { m: 'Сен', submitted: 17, processed: 15, rejected: 2, avgDays: 15.0 },
            { m: 'Окт', submitted: 20, processed: 18, rejected: 1, avgDays: 14.8 },
            { m: 'Ноя', submitted: 15, processed: 14, rejected: 1, avgDays: 14.3 },
            { m: 'Дек', submitted: 12, processed: 11, rejected: 1, avgDays: 13.9 },
        ],
        ranks: [
            { rank: 'ЗМС КР', assigned: 2, total: 42, revoked: 0, expiring: null },
            { rank: 'МСМК', assigned: 5, total: 78, revoked: 1, expiring: null },
            { rank: 'МС КР', assigned: 28, total: 360, revoked: 3, expiring: null },
            { rank: 'КМС', assigned: 37, total: 790, revoked: 0, expiring: 120 },
            { rank: 'I разряд', assigned: 72, total: 1100, revoked: 0, expiring: 380 },
            { rank: 'II разряд', assigned: 95, total: 1150, revoked: 0, expiring: 290 },
            { rank: 'III разряд', assigned: 88, total: 980, revoked: 0, expiring: 210 },
        ],
    },
    2025: {
        kpi: { titles: 79, titlesTrend: '+10%', apps: 215, appsTrend: '+9%', avgDays: 13.4, avgDaysTrend: '-1.4 дня', rejected: 16, rejectedPct: 7, rejectedTrend: '-2%' },
        monthly: [
            { m: 'Янв', ms: 5, kms: 8 }, { m: 'Фев', ms: 4, kms: 7 }, { m: 'Мар', ms: 7, kms: 10 },
            { m: 'Апр', ms: 6, kms: 9 }, { m: 'Май', ms: 8, kms: 11 }, { m: 'Июн', ms: 9, kms: 14 },
            { m: 'Июл', ms: 6, kms: 8 }, { m: 'Авг', ms: 5, kms: 7 }, { m: 'Сен', ms: 7, kms: 10 },
            { m: 'Окт', ms: 8, kms: 12 }, { m: 'Ноя', ms: 6, kms: 9 }, { m: 'Дек', ms: 5, kms: 7 },
        ],
        appTypes: [
            { label: 'Регистрация тренеров', value: 91, color: '#2563EB' },
            { label: 'Присвоение звания', value: 72, color: '#d97706' },
            { label: 'Судейская категория', value: 34, color: '#7C3AED' },
            { label: 'Восстановление документов', value: 18, color: '#94a3b8' },
        ],
        regions: [
            { name: 'Бишкек', ath: 1160, tr: 80, jd: 31 },
            { name: 'Чуйская', ath: 640, tr: 42, jd: 19 },
            { name: 'Ош', ath: 498, tr: 35, jd: 17 },
            { name: 'Иссык-Кульская', ath: 395, tr: 27, jd: 13 },
            { name: 'Джалал-Абадская', ath: 345, tr: 23, jd: 11 },
            { name: 'Нарынская', ath: 215, tr: 16, jd: 8 },
            { name: 'Баткенская', ath: 182, tr: 13, jd: 6 },
            { name: 'Таласская', ath: 145, tr: 10, jd: 5 },
            { name: 'Ошская (область)', ath: 115, tr: 8, jd: 3 },
        ],
        sports: [
            { name: 'Бокс', total: 395, ms: 14, kms: 48, rest: 333 },
            { name: 'Борьба', total: 362, ms: 12, kms: 42, rest: 308 },
            { name: 'Футбол', total: 290, ms: 4, kms: 23, rest: 263 },
            { name: 'Дзюдо', total: 268, ms: 9, kms: 33, rest: 226 },
            { name: 'Лёгкая атлетика', total: 240, ms: 7, kms: 28, rest: 205 },
            { name: 'Тяжёлая атлетика', total: 195, ms: 6, kms: 20, rest: 169 },
            { name: 'Гимнастика', total: 170, ms: 5, kms: 18, rest: 147 },
            { name: 'Плавание', total: 148, ms: 4, kms: 14, rest: 130 },
            { name: 'Волейбол', total: 132, ms: 3, kms: 12, rest: 117 },
            { name: 'Теннис', total: 108, ms: 2, kms: 9, rest: 97 },
        ],
        efficiency: [
            { m: 'Янв', submitted: 20, processed: 18, rejected: 2, avgDays: 14.0 },
            { m: 'Фев', submitted: 16, processed: 15, rejected: 1, avgDays: 13.2 },
            { m: 'Мар', submitted: 24, processed: 22, rejected: 2, avgDays: 14.5 },
            { m: 'Апр', submitted: 18, processed: 17, rejected: 1, avgDays: 12.8 },
            { m: 'Май', submitted: 21, processed: 19, rejected: 2, avgDays: 13.6 },
            { m: 'Июн', submitted: 23, processed: 21, rejected: 2, avgDays: 14.1 },
            { m: 'Июл', submitted: 15, processed: 14, rejected: 1, avgDays: 12.5 },
            { m: 'Авг', submitted: 13, processed: 12, rejected: 1, avgDays: 13.0 },
            { m: 'Сен', submitted: 19, processed: 17, rejected: 1, avgDays: 13.8 },
            { m: 'Окт', submitted: 22, processed: 20, rejected: 1, avgDays: 13.3 },
            { m: 'Ноя', submitted: 14, processed: 13, rejected: 1, avgDays: 12.9 },
            { m: 'Дек', submitted: 10, processed: 10, rejected: 1, avgDays: 12.4 },
        ],
        ranks: [
            { rank: 'ЗМС КР', assigned: 2, total: 44, revoked: 0, expiring: null },
            { rank: 'МСМК', assigned: 7, total: 84, revoked: 1, expiring: null },
            { rank: 'МС КР', assigned: 31, total: 388, revoked: 2, expiring: null },
            { rank: 'КМС', assigned: 39, total: 845, revoked: 0, expiring: 138 },
            { rank: 'I разряд', assigned: 80, total: 1170, revoked: 0, expiring: 400 },
            { rank: 'II разряд', assigned: 102, total: 1200, revoked: 0, expiring: 310 },
            { rank: 'III разряд', assigned: 94, total: 1050, revoked: 0, expiring: 230 },
        ],
    },
    2026: {
        kpi: { titles: 89, titlesTrend: '+12%', apps: 234, appsTrend: '+8%', avgDays: 11.3, avgDaysTrend: '−2.1 дня', rejected: 14, rejectedPct: 6, rejectedTrend: '−3%' },
        monthly: [
            { m: 'Янв', ms: 6, kms: 9 }, { m: 'Фев', ms: 5, kms: 8 }, { m: 'Мар', ms: 8, kms: 12 },
            { m: 'Апр', ms: 7, kms: 11 }, { m: 'Май', ms: 9, kms: 13 }, { m: 'Июн', ms: 11, kms: 16 },
            { m: 'Июл', ms: 7, kms: 9 }, { m: 'Авг', ms: 6, kms: 8 }, { m: 'Сен', ms: 8, kms: 11 },
            { m: 'Окт', ms: 9, kms: 14 }, { m: 'Ноя', ms: 7, kms: 10 }, { m: 'Дек', ms: 6, kms: 8 },
        ],
        appTypes: [
            { label: 'Регистрация тренеров', value: 98, color: '#2563EB' },
            { label: 'Присвоение звания', value: 78, color: '#d97706' },
            { label: 'Судейская категория', value: 38, color: '#7C3AED' },
            { label: 'Восстановление документов', value: 20, color: '#94a3b8' },
        ],
        regions: [
            { name: 'Бишкек', ath: 1240, tr: 89, jd: 34 },
            { name: 'Чуйская', ath: 687, tr: 45, jd: 21 },
            { name: 'Ош', ath: 534, tr: 38, jd: 18 },
            { name: 'Иссык-Кульская', ath: 423, tr: 29, jd: 14 },
            { name: 'Джалал-Абадская', ath: 378, tr: 25, jd: 12 },
            { name: 'Нарынская', ath: 231, tr: 17, jd: 9 },
            { name: 'Баткенская', ath: 198, tr: 14, jd: 7 },
            { name: 'Таласская', ath: 156, tr: 11, jd: 5 },
            { name: 'Ошская (область)', ath: 126, tr: 9, jd: 4 },
        ],
        sports: [
            { name: 'Бокс', total: 423, ms: 16, kms: 52, rest: 355 },
            { name: 'Борьба', total: 387, ms: 14, kms: 46, rest: 327 },
            { name: 'Футбол', total: 312, ms: 5, kms: 25, rest: 282 },
            { name: 'Дзюдо', total: 289, ms: 11, kms: 36, rest: 242 },
            { name: 'Лёгкая атлетика', total: 256, ms: 8, kms: 30, rest: 218 },
            { name: 'Тяжёлая атлетика', total: 210, ms: 7, kms: 22, rest: 181 },
            { name: 'Гимнастика', total: 184, ms: 6, kms: 20, rest: 158 },
            { name: 'Плавание', total: 159, ms: 5, kms: 16, rest: 138 },
            { name: 'Волейбол', total: 142, ms: 3, kms: 13, rest: 126 },
            { name: 'Теннис', total: 118, ms: 2, kms: 10, rest: 106 },
        ],
        efficiency: [
            { m: 'Янв', submitted: 22, processed: 21, rejected: 1, avgDays: 12.0 },
            { m: 'Фев', submitted: 18, processed: 17, rejected: 1, avgDays: 11.5 },
            { m: 'Мар', submitted: 26, processed: 25, rejected: 2, avgDays: 12.2 },
            { m: 'Апр', submitted: 20, processed: 19, rejected: 1, avgDays: 10.8 },
            { m: 'Май', submitted: 23, processed: 22, rejected: 1, avgDays: 11.4 },
            { m: 'Июн', submitted: 25, processed: 24, rejected: 2, avgDays: 11.9 },
            { m: 'Июл', submitted: 17, processed: 16, rejected: 1, avgDays: 10.2 },
            { m: 'Авг', submitted: 15, processed: 15, rejected: 1, avgDays: 10.8 },
            { m: 'Сен', submitted: 21, processed: 20, rejected: 1, avgDays: 11.1 },
            { m: 'Окт', submitted: 24, processed: 23, rejected: 1, avgDays: 11.3 },
            { m: 'Ноя', submitted: 13, processed: 12, rejected: 1, avgDays: 10.6 },
            { m: 'Дек', submitted: 10, processed: 10, rejected: 1, avgDays: 10.0 },
        ],
        ranks: [
            { rank: 'ЗМС КР', assigned: 3, total: 47, revoked: 0, expiring: null },
            { rank: 'МСМК', assigned: 8, total: 89, revoked: 1, expiring: null },
            { rank: 'МС КР', assigned: 34, total: 412, revoked: 2, expiring: null },
            { rank: 'КМС', assigned: 44, total: 891, revoked: 0, expiring: 156 },
            { rank: 'I разряд', assigned: 89, total: 1243, revoked: 0, expiring: 423 },
            { rank: 'II разряд', assigned: 112, total: 1280, revoked: 0, expiring: 340 },
            { rank: 'III разряд', assigned: 101, total: 1099, revoked: 0, expiring: 250 },
        ],
    },
}

const YEARS = [2024, 2025, 2026]
const QUARTER_KEYS = [
    { key: 'fullYear', labelKey: 'analytics.quarters.fullYear' },
    { key: 'Q1', labelKey: 'analytics.quarters.q1' },
    { key: 'Q2', labelKey: 'analytics.quarters.q2' },
    { key: 'Q3', labelKey: 'analytics.quarters.q3' },
    { key: 'Q4', labelKey: 'analytics.quarters.q4' },
]

/* ── SVG Line Chart ── */
function LineChart({ data }) {
    const W = 520, H = 240, PAD_L = 36, PAD_R = 16, PAD_T = 28, PAD_B = 30
    const cW = W - PAD_L - PAD_R, cH = H - PAD_T - PAD_B
    const maxVal = Math.max(...data.map(d => Math.max(d.ms, d.kms))) + 3

    const x = (i) => PAD_L + (i / (data.length - 1)) * cW
    const y = (v) => PAD_T + (1 - v / maxVal) * cH

    const msPoints = data.map((d, i) => `${x(i)},${y(d.ms)}`).join(' ')
    const kmsPoints = data.map((d, i) => `${x(i)},${y(d.kms)}`).join(' ')

    const gridLines = []
    const gridStep = Math.ceil(maxVal / 4)
    for (let v = 0; v <= maxVal; v += gridStep) {
        gridLines.push(v)
    }

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="an-line-svg">
            {/* Grid lines */}
            {gridLines.map(v => (
                <g key={v}>
                    <line x1={PAD_L} y1={y(v)} x2={W - PAD_R} y2={y(v)} stroke="#e2e8f0" strokeWidth="1" />
                    <text x={PAD_L - 6} y={y(v) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{v}</text>
                </g>
            ))}
            {/* X labels */}
            {data.map((d, i) => (
                <text key={d.m} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.m}</text>
            ))}
            {/* KMS line — значения не подписываем на каждой точке (шум); только последняя */}
            <polyline points={kmsPoints} fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {data.map((d, i) => (
                <circle key={`kms-${i}`} cx={x(i)} cy={y(d.kms)} r="3" fill="#7C3AED" stroke="#fff" strokeWidth="1.5">
                    <title>{d.m}: {d.kms}</title>
                </circle>
            ))}
            <text x={x(data.length - 1)} y={y(data[data.length - 1].kms) - 9} textAnchor="middle" fontSize="10" fill="#7C3AED" fontWeight="700">{data[data.length - 1].kms}</text>
            {/* MS line */}
            <polyline points={msPoints} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {data.map((d, i) => (
                <circle key={`ms-${i}`} cx={x(i)} cy={y(d.ms)} r="3" fill="#2563EB" stroke="#fff" strokeWidth="1.5">
                    <title>{d.m}: {d.ms}</title>
                </circle>
            ))}
            <text x={x(data.length - 1)} y={y(data[data.length - 1].ms) + 16} textAnchor="middle" fontSize="10" fill="#2563EB" fontWeight="700">{data[data.length - 1].ms}</text>
        </svg>
    )
}

/* ── Donut Chart ── */
function DonutChart({ data }) {
    const { t } = useTranslation()
    const total = data.reduce((s, d) => s + d.value, 0)
    let accum = 0
    const segments = data.map(d => {
        const start = accum
        const pctNum = (d.value / total) * 100
        accum += pctNum
        return { ...d, start, pctNum, pct: Math.round(pctNum) }
    })
    const gradient = segments.map(s => `${s.color} ${s.start}% ${s.start + s.pctNum}%`).join(', ')

    return (
        <div className="an-donut-wrap">
            <div className="an-donut" style={{ background: `conic-gradient(${gradient})` }}>
                <div className="an-donut__center">
                    <span className="an-donut__total">{total}</span>
                    <span className="an-donut__label">{t('analytics.donutLabel')}</span>
                </div>
            </div>
            <div className="an-donut-legend">
                {segments.map(s => (
                    <div key={s.label} className="an-donut-legend__item">
                        <span className="an-donut-legend__color" style={{ background: s.color }} />
                        <span className="an-donut-legend__text">{s.label}</span>
                        <span className="an-donut-legend__pct">{s.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ── Vertical Bar Chart (SVG) ── */
function SportsBarChart({ data }) {
    const W = 560, H = 220, PAD_L = 120, PAD_R = 50, PAD_T = 6, PAD_B = 10
    const cW = W - PAD_L - PAD_R, cH = H - PAD_T - PAD_B
    const maxVal = Math.max(...data.map(d => d.total))
    const barH = cH / data.length - 2

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="an-sports-svg">
            {data.map((d, i) => {
                const barY = PAD_T + i * (cH / data.length) + 1
                const barW = (d.total / maxVal) * cW
                return (
                    <g key={d.name}>
                        <text x={PAD_L - 8} y={barY + barH / 2 + 4} textAnchor="end" fontSize="10" fill="#1e293b" fontWeight="600">{d.name}</text>
                        <rect x={PAD_L} y={barY} width={barW} height={barH} rx="3" fill="#2563EB" opacity="0.85" />
                        <text x={PAD_L + barW + 6} y={barY + barH / 2 + 4} fontSize="10" fill="#64748b" fontWeight="700">{d.total}</text>
                    </g>
                )
            })}
        </svg>
    )
}

export default function Analytics() {
    const { t } = useTranslation()
    const toast = useToast()
    const [year, setYear] = useState(2026)
    const [quarter, setQuarter] = useState('fullYear')

    const d = DATA[year]
    const { kpi } = d

    /* Filter monthly data by quarter */
    const qMap = { Q1: [0, 3], Q2: [3, 6], Q3: [6, 9], Q4: [9, 12] }
    const monthly = quarter === 'fullYear' ? d.monthly : d.monthly.slice(...qMap[quarter])
    const efficiency = quarter === 'fullYear' ? d.efficiency : d.efficiency.slice(...qMap[quarter])

    const effTotals = efficiency.reduce((acc, e) => ({
        submitted: acc.submitted + e.submitted,
        processed: acc.processed + e.processed,
        rejected: acc.rejected + e.rejected,
    }), { submitted: 0, processed: 0, rejected: 0 })
    const effAvgDays = (efficiency.reduce((s, e) => s + e.avgDays, 0) / efficiency.length).toFixed(1)

    const regionsMax = Math.max(...d.regions.map(r => r.ath))

    return (
        <div className="an">
            <Breadcrumbs current={t('analytics.registryTitle')} />
            <PageHeader
                title={t('analytics.registryTitle')}
                actions={
                    <div className="an-header__controls">
                        <div className="an-btn-group">
                            {YEARS.map(y => (
                                <button key={y} className={`an-btn ${year === y ? 'an-btn--active' : ''}`}
                                    onClick={() => setYear(y)}>{y}</button>
                            ))}
                        </div>
                        <div className="an-btn-group">
                            {QUARTER_KEYS.map(q => (
                                <button key={q.key} className={`an-btn an-btn--sm ${quarter === q.key ? 'an-btn--active' : ''}`}
                                    onClick={() => setQuarter(q.key)}>{t(q.labelKey)}</button>
                            ))}
                        </div>
                        <Button variant="primary" onClick={() => toast('Экспорт отчёта - в разработке')}>
                            {t('analytics.exportReport')}
                        </Button>
                    </div>
                }
            />

            {/* ── 2. KPI Metrics (общие MetricCard, как во всех реестрах) ── */}
            <div className="an-kpis">
                <MetricCard tone="blue" icon={MetricIcons.medal()} value={kpi.titles} label={t('analytics.kpi.ranksAwarded')} trend={kpi.titlesTrend} />
                <MetricCard tone="green" icon={MetricIcons.clipboard()} value={kpi.apps} label={t('analytics.kpi.applicationsProcessed')} trend={kpi.appsTrend} />
                <MetricCard tone="amber" icon={MetricIcons.clock()} value={`${kpi.avgDays} ${t('analytics.days')}`} label={t('analytics.kpi.avgProcessingTime')} trend={kpi.avgDaysTrend} />
                <MetricCard icon={MetricIcons.rejected()} value={`${kpi.rejected} (${kpi.rejectedPct}%)`} label={t('analytics.kpi.rejections')} trend={kpi.rejectedTrend} />
            </div>

            {/* ── 3. Line Chart + Donut ── */}
            <div className="an-row an-row--charts">
                <div className="an-card an-card--chart">
                    <h2 className="an-card__title">{t('analytics.charts.ranksDynamic')}</h2>
                    <div className="an-chart-legend">
                        <span className="an-chart-legend__item"><span className="an-legend-dot" style={{ background: '#2563EB' }} /> {t('analytics.legends.msKr')}</span>
                        <span className="an-chart-legend__item"><span className="an-legend-dot" style={{ background: '#7C3AED' }} /> {t('analytics.legends.kms')}</span>
                    </div>
                    <LineChart data={monthly} />
                </div>
                <div className="an-card">
                    <h2 className="an-card__title">{t('analytics.charts.applicationStructure')}</h2>
                    <DonutChart data={d.appTypes} />
                </div>
            </div>

            {/* ── 4. Regions: компактная таблица — один бар (спортсмены) + числа.
                   Три полосы на общей шкале не работали: судьи (~30) на шкале
                   спортсменов (~1200) были невидимы. ── */}
            <div className="an-card">
                <h2 className="an-card__title">{t('analytics.charts.sportByRegion')}</h2>
                <div className="an-table-wrap">
                    <table className="an-table">
                        <thead>
                            <tr>
                                <th>{t('analytics.regionCol')}</th>
                                <th style={{ width: '45%' }}>{t('analytics.legends.athletes')}</th>
                                <th>{t('analytics.legends.coaches')}</th>
                                <th>{t('analytics.legends.judges')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {d.regions.map(r => (
                                <tr key={r.name}>
                                    <td className="an-table__bold">{r.name}</td>
                                    <td>
                                        <div className="an-cellbar">
                                            <div className="an-cellbar__track">
                                                <div className="an-cellbar__fill" style={{ width: `${(r.ath / regionsMax) * 100}%` }} />
                                            </div>
                                            <span className="an-cellbar__val">{r.ath.toLocaleString('ru-RU')}</span>
                                        </div>
                                    </td>
                                    <td>{r.tr}</td>
                                    <td>{r.jd}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── 5. Sports vertical bars ── */}
            <div className="an-card">
                <h2 className="an-card__title">{t('analytics.charts.sportDynamic')}</h2>
                <SportsBarChart data={d.sports} />
            </div>

            {/* ── 6. Эффективность + Звания рядом (рейтинг регионов удалён —
                   дублировал таблицу регионов выше) ── */}
            <div className="an-row an-row--half">
                <div className="an-card">
                    <h2 className="an-card__title">{t('analytics.efficiency.title')}</h2>
                    <div className="an-table-wrap">
                        <table className="an-table">
                            <thead>
                                <tr>
                                    <th>{t('analytics.efficiencyTable.month')}</th>
                                    <th>{t('analytics.efficiencyTable.submitted')}</th>
                                    <th>{t('analytics.efficiencyTable.processed')}</th>
                                    <th>{t('analytics.efficiencyTable.rejected')}</th>
                                    <th>{t('analytics.efficiencyTable.avgTime')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {efficiency.map(e => (
                                    <tr key={e.m}>
                                        <td className="an-table__bold">{e.m}</td>
                                        <td>{e.submitted}</td>
                                        <td>{e.processed}</td>
                                        <td>{e.rejected}</td>
                                        <td>{e.avgDays} д.</td>
                                    </tr>
                                ))}
                                <tr className="an-table__total">
                                    <td>{t('analytics.totalRow')}</td>
                                    <td>{effTotals.submitted}</td>
                                    <td>{effTotals.processed}</td>
                                    <td>{effTotals.rejected}</td>
                                    <td>{effAvgDays} д.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="an-card">
                    <h2 className="an-card__title">{t('analytics.ranksTable.title', { year })}</h2>
                    <div className="an-table-wrap">
                        <table className="an-table">
                            <thead>
                                <tr>
                                    <th>{t('analytics.ranksTable.rank')}</th>
                                    <th>{t('analytics.ranksTable.awardedInYear', { year })}</th>
                                    <th>{t('analytics.ranksTable.totalInRegistry')}</th>
                                    <th>{t('analytics.ranksTable.deprived')}</th>
                                    <th>{t('analytics.ranksTable.expiring')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {d.ranks.map(r => (
                                    <tr key={r.rank}>
                                        <td className="an-table__bold">{r.rank}</td>
                                        <td>{r.assigned}</td>
                                        <td>{r.total.toLocaleString('ru-RU')}</td>
                                        <td>{r.revoked}</td>
                                        <td>
                                            {r.expiring ? (
                                                <span className="an-expiring-badge">{r.expiring}</span>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
