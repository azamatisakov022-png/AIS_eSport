import { useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, StatusDot } from '../components/ui'
import { loadSchedules, WEEK_DAYS } from '../cabinet/scheduleStore'
import './registries.css'

/* Служебный портал (УРФКиМС): расписания тренеров всех спортшкол.
   Цель — выездной контроль: открыть график тренера и внезапно проверить занятие
   (требование заказчика, 16.07.2026). Заполняют спортшколы в своих ЛК. */

export default function CoachSchedules() {
    const [schedules] = useState(loadSchedules)
    const [regionF, setRegionF] = useState('')
    const [schoolF, setSchoolF] = useState('')

    const regions = [...new Set(schedules.map(c => c.region))]
    const schools = [...new Set(schedules.filter(c => !regionF || c.region === regionF).map(c => c.school))]
    const filtered = schedules.filter(c => (!regionF || c.region === regionF) && (!schoolF || c.school === schoolF))
    const noCert = schedules.filter(c => !c.cert).length

    const selStyle = { padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit' }

    return (
        <div className="reg">
            <Breadcrumbs current="Расписания тренеров" />
            <PageHeader
                title="Расписания тренеров"
                subtitle={`Годовые графики занятий, заполняют спортшколы · тренеров в графике: ${schedules.length} · без свидетельства: ${noCert}`}
            />

            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <select style={selStyle} value={regionF} onChange={e => { setRegionF(e.target.value); setSchoolF('') }}>
                    <option value="">Все регионы</option>
                    {regions.map(r => <option key={r}>{r}</option>)}
                </select>
                <select style={selStyle} value={schoolF} onChange={e => setSchoolF(e.target.value)}>
                    <option value="">Все спортшколы</option>
                    {schools.map(sch => <option key={sch}>{sch}</option>)}
                </select>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
                {filtered.map(c => (
                    <div key={c.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                            <div>
                                <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)' }}>{c.coach}</div>
                                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{c.sport} · {c.school} · {c.region}</div>
                            </div>
                            <StatusDot tone={c.cert ? 'green' : 'red'}>{c.cert ? 'Свидетельство: есть' : 'Нет свидетельства'}</StatusDot>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                            <thead>
                                <tr>{WEEK_DAYS.map(d => <th key={d} style={{ padding: '6px 8px', background: 'var(--bg-panel)', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11.5, textAlign: 'center' }}>{d}</th>)}</tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {WEEK_DAYS.map(day => {
                                        const lessons = c.items.filter(i => i.day === day)
                                        return (
                                            <td key={day} style={{ padding: '8px', border: '1px solid var(--border-color)', verticalAlign: 'top', textAlign: 'center', minWidth: 90 }}>
                                                {lessons.length === 0 ? <span style={{ color: 'var(--text-muted)' }}>—</span> : lessons.map((l, i) => (
                                                    <div key={i} style={{ marginBottom: 4 }}>
                                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{l.from}–{l.to}</div>
                                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.venue}</div>
                                                    </div>
                                                ))}
                                            </td>
                                        )
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div style={{ fontSize: 13.5, color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px dashed var(--border-color)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
                        По выбранным фильтрам расписаний нет
                    </div>
                )}
            </div>
        </div>
    )
}
