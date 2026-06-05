import { useMemo, useState } from 'react'
import { CALENDAR_EVENTS } from './data/intranetData'
import './intranet.css'

const TYPE_LABEL = { meeting: 'Совещание', collegium: 'Коллегия', audit: 'Аудит', deadline: 'Дедлайн', training: 'Тренинг' }
const TYPE_COLOR = {
    meeting: { bg: '#e3f2fd', fg: '#1565c0' },
    collegium: { bg: '#ede7f6', fg: '#5e35b1' },
    audit: { bg: '#fff3e0', fg: '#ef6c00' },
    deadline: { bg: '#ffebee', fg: '#c62828' },
    training: { bg: '#e8f5e9', fg: '#2e7d32' },
}

function fmtFullDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function IntranetCalendar() {
    const [type, setType] = useState('all')

    const filtered = useMemo(() =>
        CALENDAR_EVENTS.filter(e => type === 'all' || e.type === type),
        [type])

    const grouped = useMemo(() => {
        const map = new Map()
        filtered.forEach(e => {
            const key = e.date
            if (!map.has(key)) map.set(key, [])
            map.get(key).push(e)
        })
        return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
    }, [filtered])

    return (
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">Календарь событий</h1>
                    <p className="intra-page-head__sub">Внутренние мероприятия, совещания, дедлайны.</p>
                </div>
            </div>

            <div className="intra-chips">
                <button className={`intra-chip${type === 'all' ? ' intra-chip--active' : ''}`} onClick={() => setType('all')}>
                    Все <span className="intra-chip__count">{CALENDAR_EVENTS.length}</span>
                </button>
                {Object.keys(TYPE_LABEL).map(t => (
                    <button key={t} className={`intra-chip${type === t ? ' intra-chip--active' : ''}`} onClick={() => setType(t)}>
                        {TYPE_LABEL[t]} <span className="intra-chip__count">{CALENDAR_EVENTS.filter(e => e.type === t).length}</span>
                    </button>
                ))}
            </div>

            <div className="intra-cal-list">
                {grouped.map(([date, events]) => (
                    <div key={date} className="intra-cal-day">
                        <div className="intra-cal-day__head">{fmtFullDate(date)}</div>
                        {events.map(e => {
                            const c = TYPE_COLOR[e.type] || { bg: '#f0f0f0', fg: '#666' }
                            return (
                                <div key={e.id} className="intra-cal-day__event">
                                    <div className="intra-cal-day__time">{e.time}</div>
                                    <div className="intra-cal-day__body">
                                        <span className="intra-cal-day__type" style={{ background: c.bg, color: c.fg }}>{TYPE_LABEL[e.type]}</span>
                                        <h4 className="intra-cal-day__title">{e.title}</h4>
                                        <div className="intra-cal-day__place">{e.place !== '-' ? e.place : ''}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
