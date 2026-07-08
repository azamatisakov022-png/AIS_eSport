import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import './Analytics.css'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, MetricCard } from '../components/ui'
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Cell, BarChart, Bar, LabelList, ComposedChart, Line,
} from 'recharts'

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

/* ── Общая палитра графиков (читается в светлой и тёмной теме) ── */
const CH = {
    blue: '#3B82F6', violet: '#8B5CF6', green: '#22A06B', amber: '#F59E0B',
    axis: '#8A94A6', grid: 'rgba(138, 148, 166, 0.22)',
}
const TOOLTIP_STYLE = {
    background: 'var(--bg-card)', border: '1px solid var(--border-color)',
    borderRadius: 10, fontSize: 12, color: 'var(--text-primary)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
}

/* ── Динамика присвоений: плавные area-кривые с градиентной заливкой ── */
function RanksAreaChart({ data, msLabel, kmsLabel }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <defs>
                    <linearGradient id="anGradMs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CH.blue} stopOpacity={0.28} />
                        <stop offset="100%" stopColor={CH.blue} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="anGradKms" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CH.violet} stopOpacity={0.24} />
                        <stop offset="100%" stopColor={CH.violet} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CH.grid} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: CH.axis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: CH.axis }} axisLine={false} tickLine={false} allowDecimals={false} width={34} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="kms" name={kmsLabel} stroke={CH.violet} strokeWidth={2.5} fill="url(#anGradKms)" dot={false} activeDot={{ r: 4 }} />
                <Area type="monotone" dataKey="ms" name={msLabel} stroke={CH.blue} strokeWidth={2.5} fill="url(#anGradMs)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
        </ResponsiveContainer>
    )
}

/* ── Структура заявлений: пончик с итогом в центре ── */
function AppStructureDonut({ data }) {
    const { t } = useTranslation()
    const total = data.reduce((s, x) => s + x.value, 0)
    return (
        <div className="an-donut-wrap">
            <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="label" innerRadius={64} outerRadius={94}
                            paddingAngle={2} cornerRadius={5} strokeWidth={0} isAnimationActive={false}>
                            {data.map((s) => <Cell key={s.label} fill={s.color} />)}
                        </Pie>
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                    </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>{total}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('analytics.donutLabel')}</span>
                </div>
            </div>
            <div className="an-donut-legend">
                {data.map(s => (
                    <div key={s.label} className="an-donut-legend__item">
                        <span className="an-donut-legend__color" style={{ background: s.color }} />
                        <span className="an-donut-legend__text">{s.label}</span>
                        <span className="an-donut-legend__pct">{Math.round((s.value / total) * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ── Топ видов спорта: горизонтальные бары со скруглением ── */
function SportsBar({ data, valueLabel }) {
    return (
        <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 48, left: 12, bottom: 4 }} barCategoryGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke={CH.grid} horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={126} tick={{ fontSize: 12, fill: CH.axis }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(138,148,166,0.08)' }} />
                <Bar dataKey="total" name={valueLabel} fill={CH.blue} radius={[0, 6, 6, 0]} barSize={16}>
                    <LabelList dataKey="total" position="right" style={{ fontSize: 11, fontWeight: 700, fill: CH.axis }} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

/* ── Эффективность: подано/обработано (бары) + средний срок (линия) ── */
function EfficiencyChart({ data, submittedLabel, processedLabel, daysLabel }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data} margin={{ top: 8, right: 0, left: -16, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke={CH.grid} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: CH.axis }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="l" tick={{ fontSize: 11, fill: CH.axis }} axisLine={false} tickLine={false} allowDecimals={false} width={34} />
                <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: CH.amber }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar yAxisId="l" dataKey="submitted" name={submittedLabel} fill={CH.blue} fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                <Bar yAxisId="l" dataKey="processed" name={processedLabel} fill={CH.green} fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                <Line yAxisId="r" type="monotone" dataKey="avgDays" name={daysLabel} stroke={CH.amber} strokeWidth={2.5} dot={false} />
            </ComposedChart>
        </ResponsiveContainer>
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
                    <RanksAreaChart data={monthly} msLabel={t('analytics.legends.msKr')} kmsLabel={t('analytics.legends.kms')} />
                </div>
                <div className="an-card">
                    <h2 className="an-card__title">{t('analytics.charts.applicationStructure')}</h2>
                    <AppStructureDonut data={d.appTypes} />
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
                                <th style={{ width: '32%' }}>{t('analytics.legends.athletes')}</th>
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
                <SportsBar data={d.sports} valueLabel={t('analytics.legends.athletes')} />
            </div>

            {/* ── 6. Эффективность + Звания рядом (рейтинг регионов удалён —
                   дублировал таблицу регионов выше) ── */}
            <div className="an-row an-row--half">
                <div className="an-card">
                    <h2 className="an-card__title">{t('analytics.efficiency.title')}</h2>
                    <EfficiencyChart
                        data={efficiency}
                        submittedLabel={t('analytics.efficiencyTable.submitted')}
                        processedLabel={t('analytics.efficiencyTable.processed')}
                        daysLabel={t('analytics.efficiencyTable.avgTime')}
                    />
                    <div className="an-eff-summary">
                        <span>{t('analytics.efficiencyTable.submitted')}: <b>{effTotals.submitted}</b></span>
                        <span>{t('analytics.efficiencyTable.processed')}: <b>{effTotals.processed}</b></span>
                        <span>{t('analytics.efficiencyTable.rejected')}: <b>{effTotals.rejected}</b></span>
                        <span>{t('analytics.efficiencyTable.avgTime')}: <b>{effAvgDays} д.</b></span>
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
