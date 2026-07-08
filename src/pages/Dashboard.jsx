import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { useRole } from '../context/RoleContext'
import { DashboardIcons } from '../components/CabinetIcons'
import './Dashboard.css'
import { Button, Badge, MetricCard } from '../components/ui'

/* ══════════════════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════════════════ */
const METRICS = [
    { icon: DashboardIcons.athletes, labelKey: 'metrics.athletes', target: 3847, subKey: 'metrics.monthlyIncrease', subCount: 23, color: 'blue' },
    { icon: DashboardIcons.coaches, labelKey: 'metrics.coaches', target: 247, subKey: 'metrics.monthlyIncrease', subCount: 5, color: 'blue' },
    { icon: DashboardIcons.judges, labelKey: 'metrics.judges', target: 186, subKey: 'metrics.monthlyIncrease', subCount: 2, color: 'blue' },
    { icon: DashboardIcons.events, labelKey: 'metrics.events', target: 48, subKey: 'metrics.monthlyIncrease', subCount: 3, color: 'blue' },
    { icon: DashboardIcons.applications, labelKey: 'metrics.applications', target: 14, subKey: 'metrics.requiresAttention', color: 'amber' },
    { icon: DashboardIcons.organizations, labelKey: 'metrics.organizations', target: 124, subKey: 'metrics.monthlyIncrease', subCount: 1, color: 'blue' },
]

const ALERTS = [
    { level: 'red', text: '3 заявки на регистрацию тренеров истекают через < 3 дней', link: '/trainer-applications' },
    { level: 'orange', text: '2 заявки на спортивное звание истекают через < 5 р.д.', link: '/award-applications' },
    { level: 'yellow', text: '5 удостоверений судей истекают в течение 30 дней', link: '/judges' },
    { level: 'blue', text: '12 спортсменов с просроченной медсправкой', link: '/athletes' },
]

const RECENT_APPS = [
    { no: 'ТР-20260310-018', type: 'Регистрация тренера', name: 'Асанов Мирлан Б.', date: '10.03.2026', status: 'Новая', statusCls: 'new' },
    { no: 'AW-20260309-042', type: 'Присвоение звания', name: 'Кулбаева Айдай К.', date: '09.03.2026', status: 'На рассмотрении', statusCls: 'review' },
    { no: 'JD-20260308-007', type: 'Судейская категория', name: 'Эсенов Бакыт Т.', date: '08.03.2026', status: 'На рассмотрении', statusCls: 'review' },
    { no: 'ТР-20260307-017', type: 'Регистрация тренера', name: 'Турсунова Назгуль А.', date: '07.03.2026', status: 'Утверждено', statusCls: 'approved' },
    { no: 'AW-20260306-041', type: 'Присвоение звания', name: 'Джумабаев Айбек М.', date: '06.03.2026', status: 'На рассмотрении', statusCls: 'review' },
    { no: 'ТР-20260305-016', type: 'Регистрация тренера', name: 'Бекбоев Нурлан Т.', date: '05.03.2026', status: 'Утверждено', statusCls: 'approved' },
    { no: 'JD-20260304-006', type: 'Судейская категория', name: 'Осмонова Гульнара А.', date: '04.03.2026', status: 'Утверждено', statusCls: 'approved' },
    { no: 'AW-20260303-040', type: 'Присвоение звания', name: 'Сатыбеков Нурлан К.', date: '03.03.2026', status: 'Отклонено', statusCls: 'rejected' },
]

const UPCOMING_EVENTS = [
    { date: '15.04.2026', title: 'Чемпионат Азии по боксу', type: 'Международный', place: 'г. Ташкент', typeCls: 'intl' },
    { date: '20.05.2026', title: 'Кубок Президента КР', type: 'Республиканский', place: 'г. Бишкек', typeCls: 'national' },
    { date: '01.06.2026', title: 'Чемпионат КР по гимнастике', type: 'Республиканский', place: 'г. Бишкек', typeCls: 'national' },
    { date: '15.06.2026', title: 'Спартакиада школьников', type: 'Региональный', place: 'г. Ош', typeCls: 'regional' },
    { date: '10.07.2026', title: 'Международный турнир по дзюдо', type: 'Международный', place: 'г. Бишкек', typeCls: 'intl' },
]

const RANKS_DATA = [
    { label: 'ЗМС КР', value: 12, color: '#1C1C1E' },
    { label: 'МСМК', value: 34, color: '#3C3C43' },
    { label: 'МС КР', value: 156, color: '#2563EB' },
    { label: 'КМС', value: 412, color: '#3B82F6' },
    { label: 'I разряд', value: 891, color: '#60A5FA' },
    { label: 'II разряд', value: 1243, color: '#93C5FD' },
    { label: 'III разряд', value: 1099, color: '#BFDBFE' },
]

const REGIONS = [
    { name: 'Бишкек', count: 1240, pct: 32 },
    { name: 'Чуйская область', count: 687, pct: 18 },
    { name: 'Ош', count: 534, pct: 14 },
    { name: 'Иссык-Кульская область', count: 423, pct: 11 },
    { name: 'Джалал-Абадская область', count: 378, pct: 10 },
    { name: 'Нарынская область', count: 231, pct: 6 },
    { name: 'Баткенская область', count: 198, pct: 5 },
    { name: 'Таласская область', count: 156, pct: 4 },
]

const ACTIVITY_LOG = [
    { time: '10:23', user: 'Иванов А.К.', action: 'Зарегистрировал тренера', object: 'Бекбоев Н.Т.' },
    { time: '10:18', user: 'Петрова Н.С.', action: 'Утвердила заявку на звание', object: 'Кулбаева А.К. - МС КР' },
    { time: '10:05', user: 'Система', action: 'Автоуведомление: истекает медсправка', object: 'Бейшеналиев Д.К.' },
    { time: '09:47', user: 'Иванов А.К.', action: 'Создал мероприятие', object: 'Кубок Президента КР' },
    { time: '09:32', user: 'Сидоров М.Б.', action: 'Обновил данные спортсмена', object: 'Ормонов А.К.' },
    { time: '09:15', user: 'Петрова Н.С.', action: 'Присвоила судейскую категорию', object: 'Осмонова Г.А. - Национальная' },
    { time: '08:58', user: 'Иванов А.К.', action: 'Добавил организацию', object: 'ФК «Алга» - клуб' },
    { time: '08:40', user: 'Система', action: 'Автоуведомление: истекает удостоверение судьи', object: 'Турсунов Б.С.' },
    { time: '08:22', user: 'Сидоров М.Б.', action: 'Отклонил заявку на звание', object: 'Сатыбеков Н.К. - МСМК' },
    { time: '08:10', user: 'Петрова Н.С.', action: 'Включила в сборную', object: 'Джумабаев А.М. - Бокс' },
]

/* ── Animated counter hook ── */
function useAnimatedCount(target, duration = 1500) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (target === 0) return
        const steps = 60
        const increment = target / steps
        const interval = duration / steps
        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(current))
            }
        }, interval)
        return () => clearInterval(timer)
    }, [target, duration])
    return count
}

const STATUS_VARIANT = { new: 'blue', review: 'amber', approved: 'green', rejected: 'red' }

function DbMetric({ icon, labelKey, target, subKey, subCount, color, t }) {
    const value = useAnimatedCount(target)
    const trend = subCount !== undefined ? t(subKey, { count: subCount }) : t(subKey)
    return <MetricCard tone={color} icon={icon} value={value.toLocaleString('ru-RU')} label={t(labelKey)} trend={trend} />
}

/* ── Live clock ── */
function useClock() {
    const [now, setNow] = useState(new Date())
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(t)
    }, [])
    return now
}

export default function Dashboard() {
    const { t } = useTranslation()
    const toast = useToast()
    const { role } = useRole()
    const now = useClock()
    const ranksMax = Math.max(...RANKS_DATA.map(r => r.value))

    const dateStr = now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    return (
        <div className="db">
            {/* ── 1. Welcome header ── */}
            <div className="db-welcome">
                <div className="db-welcome__left">
                    <h1 className="db-welcome__title">{t('dashboard.welcome', { name: role?.label || 'Пользователь' })}</h1>
                    <div className="db-welcome__meta">
                        <span className="db-welcome__role">{role?.icon} {role?.label}</span>
                        <span className="db-welcome__date">{dateStr}, {timeStr}</span>
                    </div>
                </div>
                <div className="db-welcome__actions">
                    <Button to="/athletes" variant="primary">{t('dashboard.addAthlete')}</Button>
                    <Button to="/applications" variant="outline">{t('dashboard.newApplication')}</Button>
                    <Button to="/events" variant="outline">{t('dashboard.newEvent')}</Button>
                </div>
            </div>

            {/* ── 2. Metrics grid ── */}
            <div className="db-metrics">
                {METRICS.map(m => <DbMetric key={m.labelKey} {...m} t={t} />)}
            </div>

            {/* ── 3. Alerts ── */}
            <div className="db-alerts">
                <h2 className="db-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#d97706" style={{ marginRight: 8, verticalAlign: 'middle', marginTop: -2 }}><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                    {t('dashboard.attention')}
                </h2>
                <div className="db-alerts__list">
                    {ALERTS.map((a, i) => (
                        <div key={i} className={`db-alert db-alert--${a.level}`}>
                            <span className="db-alert__text">{a.text}</span>
                            <Link to={a.link} className="db-alert__btn">{t('dashboard.goTo')}</Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── 4. Applications + Events row ── */}
            <div className="db-row db-row--apps">
                {/* Left: Recent applications */}
                <div className="db-card db-card--wide">
                    <h2 className="db-card__title">{t('dashboard.recentApplications')}</h2>
                    <div className="db-table-wrap">
                        <table className="db-table">
                            <thead>
                                <tr>
                                    <th>{t('dashboard.table.appNumber')}</th>
                                    <th>{t('dashboard.table.type')}</th>
                                    <th>{t('dashboard.table.name')}</th>
                                    <th>{t('dashboard.table.date')}</th>
                                    <th>{t('dashboard.table.status')}</th>
                                    <th>{t('dashboard.table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RECENT_APPS.map(a => (
                                    <tr key={a.no}>
                                        <td className="db-table__mono">{a.no}</td>
                                        <td>{a.type}</td>
                                        <td className="db-table__name">{a.name}</td>
                                        <td>{a.date}</td>
                                        <td><Badge variant={STATUS_VARIANT[a.statusCls]}>{a.status}</Badge></td>
                                        <td>
                                            <button className="db-table__action" onClick={() => toast(`Открыть заявку ${a.no}`)}>
                                                {t('dashboard.open')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Link to="/applications" className="db-card__footer-link">{t('dashboard.allApplications')}</Link>
                </div>

                {/* Right: Upcoming events */}
                <div className="db-card">
                    <h2 className="db-card__title">{t('dashboard.upcomingEvents')}</h2>
                    <div className="db-events-list">
                        {UPCOMING_EVENTS.map((e, i) => (
                            <div key={i} className="db-event-item">
                                <div className="db-event-item__date">{e.date}</div>
                                <div className="db-event-item__info">
                                    <div className="db-event-item__title">{e.title}</div>
                                    <div className="db-event-item__meta">
                                        <span className={`db-event-type db-event-type--${e.typeCls}`}>{e.type}</span>
                                        <span className="db-event-item__place">{e.place}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to="/events" className="db-card__footer-link">{t('dashboard.calendar')}</Link>
                </div>
            </div>

            {/* ── 5. Ranks chart + Regions row ── */}
            <div className="db-row db-row--half">
                {/* Left: Ranks bar chart */}
                <div className="db-card">
                    <h2 className="db-card__title">{t('dashboard.rankDistribution')}</h2>
                    <div className="db-bars">
                        {RANKS_DATA.map(r => (
                            <div key={r.label} className="db-bar-row">
                                <span className="db-bar-row__label">{r.label}</span>
                                <div className="db-bar-row__track">
                                    <div
                                        className="db-bar-row__fill"
                                        style={{ width: `${(r.value / ranksMax) * 100}%`, background: r.color }}
                                    />
                                </div>
                                <span className="db-bar-row__value">{r.value.toLocaleString('ru-RU')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Regions */}
                <div className="db-card">
                    <h2 className="db-card__title">{t('dashboard.regionDistribution')}</h2>
                    <div className="db-regions">
                        {REGIONS.map(r => (
                            <div key={r.name} className="db-region-row">
                                <div className="db-region-row__header">
                                    <span className="db-region-row__name">{r.name}</span>
                                    <span className="db-region-row__count">{r.count.toLocaleString('ru-RU')} {t('dashboard.athleteCount')} ({r.pct}%)</span>
                                </div>
                                <div className="db-region-row__track">
                                    <div className="db-region-row__fill" style={{ width: `${r.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 6. Activity log ── */}
            <div className="db-card">
                <h2 className="db-card__title">{t('dashboard.activityLog')}</h2>
                <div className="db-table-wrap">
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>{t('dashboard.table.time')}</th>
                                <th>{t('dashboard.table.user')}</th>
                                <th>{t('dashboard.table.actionName')}</th>
                                <th>{t('dashboard.table.object')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ACTIVITY_LOG.map((a, i) => (
                                <tr key={i}>
                                    <td className="db-table__time">{a.time}</td>
                                    <td className="db-table__name">{a.user}</td>
                                    <td>{a.action}</td>
                                    <td className="db-table__name">{a.object}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
