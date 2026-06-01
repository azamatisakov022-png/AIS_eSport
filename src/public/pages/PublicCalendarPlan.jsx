import { useState, useMemo } from 'react'
import PublicHero, { PublicHeroCounter } from '../components/PublicHero'
import { useAnimatedCounter } from '../useDesignEffects'
import { CALENDAR_PLAN } from './publicContent'
import './publicPages.css'

const LEVELS = ['all', 'Международный', 'Республиканский', 'Массовый']
const LEVEL_BADGE = { 'Международный': 'pp-badge--blue', 'Республиканский': 'pp-badge--green', 'Массовый': 'pp-badge--amber' }

const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
const MON_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

export default function PublicCalendarPlan() {
    const [level, setLevel] = useState('all')
    const [sport, setSport] = useState('all')

    const sports = useMemo(() => Array.from(new Set(CALENDAR_PLAN.map(e => e.sport))).sort(), [])
    const cntEvents = useAnimatedCounter(CALENDAR_PLAN.length)
    const cntSports = useAnimatedCounter(sports.length)

    const filtered = useMemo(() => CALENDAR_PLAN.filter(e =>
        (level === 'all' || e.level === level) && (sport === 'all' || e.sport === sport)
    ), [level, sport])

    const byMonth = useMemo(() => {
        const map = new Map()
        filtered.forEach(e => {
            const m = e.date.slice(0, 7)
            if (!map.has(m)) map.set(m, [])
            map.get(m).push(e)
        })
        return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
    }, [filtered])

    return (
        <div className="pub-section">
            <PublicHero title="Календарный план мероприятий" description="Полный календарь спортивных мероприятий Кыргызской Республики на 2026 год." variant="indigo" layoutMode="abstract">
                <PublicHeroCounter animRef={cntEvents.ref} value={cntEvents.value} label="мероприятий" />
                <PublicHeroCounter animRef={cntSports.ref} value={cntSports.value} label="видов спорта" />
            </PublicHero>

            <div className="pub-container pp-wrap">
                <div className="pp-toolbar">
                    <div className="pp-chips">
                        {LEVELS.map(l => (
                            <button key={l} className={`pp-chip${level === l ? ' pp-chip--active' : ''}`} onClick={() => setLevel(l)}>
                                {l === 'all' ? 'Все уровни' : l}
                            </button>
                        ))}
                    </div>
                    <select className="pp-search" style={{ maxWidth: 220 }} value={sport} onChange={e => setSport(e.target.value)}>
                        <option value="all">Все виды спорта</option>
                        {sports.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {byMonth.map(([m, events]) => {
                    const monthIdx = Number(m.slice(5, 7)) - 1
                    return (
                        <div key={m} className="pp-cal-month">
                            <h2 className="pp-cal-month__head">{MONTHS[monthIdx]} {m.slice(0, 4)}</h2>
                            {events.map((e, i) => {
                                const d = new Date(e.date)
                                return (
                                    <div key={i} className="pp-cal-event">
                                        <div className="pp-cal-event__date">
                                            <div className="pp-cal-event__day">{d.getDate()}</div>
                                            <div className="pp-cal-event__mon">{MON_SHORT[d.getMonth()]}</div>
                                        </div>
                                        <div className="pp-cal-event__body">
                                            <h3 className="pp-cal-event__title">{e.title}</h3>
                                            <div className="pp-cal-event__meta">
                                                <span className={`pp-badge ${LEVEL_BADGE[e.level] || 'pp-badge--gray'}`}>{e.level}</span>
                                                <span>📍 {e.place}</span>
                                                <span>🎯 {e.sport}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
                {filtered.length === 0 && (
                    <div className="pp-empty"><div className="pp-empty__icon">📅</div>Мероприятий по выбранным фильтрам не найдено.</div>
                )}
            </div>
        </div>
    )
}
