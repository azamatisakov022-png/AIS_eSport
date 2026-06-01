import { useMemo } from 'react'
import { getStats } from './stats/visitTracker'
import './stats/stats.css'

const fmt = (n) => n.toLocaleString('ru-RU')
const shortDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

/** Public visit statistics dashboard (Распоряжение №59-р). */
export default function PublicStatistics() {
    const stats = useMemo(() => getStats(), [])
    const maxVal = Math.max(...stats.series.map(s => s.value), 1)

    const DEVICE_COLORS = { mobile: '#2563eb', desktop: '#16a34a', tablet: '#f59e0b' }
    const maxPage = Math.max(...stats.topPages.map(p => p.value), 1)

    return (
        <div className="pub-section">
            <div className="pub-container">
                <div className="st-head">
                    <h1 className="st-head__title">📊 Статистика посещаемости</h1>
                    <p className="st-head__sub">Открытые данные о посещаемости портала ГАФКиС. Обновляется в реальном времени.</p>
                </div>

                {/* KPI cards */}
                <div className="st-kpis">
                    <div className="st-kpi">
                        <span className="st-kpi__label">Всего посещений</span>
                        <strong className="st-kpi__value">{fmt(stats.total)}</strong>
                    </div>
                    <div className="st-kpi">
                        <span className="st-kpi__label">Уникальных посетителей</span>
                        <strong className="st-kpi__value">{fmt(stats.unique)}</strong>
                    </div>
                    <div className="st-kpi">
                        <span className="st-kpi__label">Сегодня</span>
                        <strong className="st-kpi__value">{fmt(stats.today)}</strong>
                    </div>
                    <div className="st-kpi">
                        <span className="st-kpi__label">За 30 дней</span>
                        <strong className="st-kpi__value">{fmt(stats.month)}</strong>
                    </div>
                </div>

                <div className="st-grid">
                    {/* Visits-over-time bar chart */}
                    <div className="st-panel st-panel--wide">
                        <h2 className="st-panel__title">Посещения за последние 14 дней</h2>
                        <div className="st-chart">
                            {stats.series.map((s, i) => {
                                const h = Math.max(4, Math.round((s.value / maxVal) * 100))
                                return (
                                    <div key={i} className="st-bar-col" title={`${shortDate(s.date)}: ${fmt(s.value)}`}>
                                        <div className="st-bar-wrap">
                                            <span className="st-bar" style={{ height: `${h}%` }}>
                                                <span className="st-bar__val">{fmt(s.value)}</span>
                                            </span>
                                        </div>
                                        <span className="st-bar__label">{shortDate(s.date)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Device breakdown */}
                    <div className="st-panel">
                        <h2 className="st-panel__title">Устройства</h2>
                        <div className="st-devices">
                            {stats.devices.map(d => (
                                <div key={d.key} className="st-device">
                                    <div className="st-device__top">
                                        <span>{d.label}</span>
                                        <strong>{d.pct}%</strong>
                                    </div>
                                    <div className="st-device__bar">
                                        <span style={{ width: `${d.pct}%`, background: DEVICE_COLORS[d.key] }} />
                                    </div>
                                    <small>{fmt(d.value)} посещений</small>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top pages */}
                    <div className="st-panel st-panel--wide">
                        <h2 className="st-panel__title">Популярные разделы</h2>
                        <ul className="st-pages">
                            {stats.topPages.map((p, i) => (
                                <li key={p.path} className="st-page">
                                    <span className="st-page__rank">{i + 1}</span>
                                    <span className="st-page__name">{p.label}</span>
                                    <div className="st-page__bar">
                                        <span style={{ width: `${Math.round((p.value / maxPage) * 100)}%` }} />
                                    </div>
                                    <span className="st-page__val">{fmt(p.value)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <p className="st-note">Данные собираются обезличенно, в соответствии с политикой конфиденциальности. Персональные данные посетителей не фиксируются.</p>
            </div>
        </div>
    )
}
