import { useState, useMemo, Fragment } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader } from '../components/ui'
import { SPORTS } from './sportsData'
import './registries.css'

/* Реестр «Виды спорта» — из Национального реестра видов спорта и спортивных
   дисциплин КР 2025 (офиц. xls). Единый справочник для всей АИС: звания, тренеры,
   объекты, мероприятия ссылаются на этот перечень. */

const CLASS_TONE = {
    'Олимпийский': '#2563eb',
    'Неолимпийский': '#0e7c86',
    'Национальный': '#b45309',
    'Адаптивный (ОДА)': '#7c3aed',
    'Адаптивный': '#7c3aed',
    'Адаптивный (интеллект.)': '#7c3aed',
    'Прочий': '#64748b',
}
const CLASSES = ['Олимпийский', 'Неолимпийский', 'Национальный', 'Адаптивный (ОДА)', 'Адаптивный', 'Адаптивный (интеллект.)']
const GROUPS = ['А', 'В', 'С']

export default function SportsRegistry() {
    const [search, setSearch] = useState('')
    const [clsF, setClsF] = useState('')
    const [groupF, setGroupF] = useState('')
    const [expanded, setExpanded] = useState(null)

    const filtered = useMemo(() => SPORTS.filter(s => {
        if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.code.includes(search)) return false
        if (clsF && s.clsLabel !== clsF) return false
        if (groupF && s.group !== groupF) return false
        return true
    }), [search, clsF, groupF])

    const totalDisc = useMemo(() => SPORTS.reduce((n, s) => n + s.disciplines.length, 0), [])
    const selStyle = { padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit' }

    return (
        <div className="reg">
            <Breadcrumbs current="Виды спорта" />
            <PageHeader
                title="Реестр видов спорта"
                subtitle={`Национальный реестр видов спорта и спортивных дисциплин КР · видов: ${SPORTS.length} · дисциплин: ${totalDisc}`}
            />

            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <input className="reg-filter" placeholder="Поиск по названию или коду..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ flex: '1 1 280px', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit' }} />
                <select style={selStyle} value={clsF} onChange={e => setClsF(e.target.value)}>
                    <option value="">Все классы</option>
                    {CLASSES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select style={selStyle} value={groupF} onChange={e => setGroupF(e.target.value)}>
                    <option value="">Все группы</option>
                    {GROUPS.map(g => <option key={g} value={g}>Группа {g}</option>)}
                </select>
            </div>

            <div className="reg-table-wrap">
                <table className="reg-table">
                    <thead>
                        <tr>
                            <th style={{ width: 44 }}>№</th>
                            <th>Вид спорта</th>
                            <th>Код</th>
                            <th>Класс</th>
                            <th>Группа</th>
                            <th>Дисциплин</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((s, idx) => (
                            <Fragment key={`${s.no}-${s.code}-${idx}`}>
                                <tr style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === `${s.no}-${idx}` ? null : `${s.no}-${idx}`)}>
                                    <td>{s.no}</td>
                                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: 12.5 }}>{s.code}</td>
                                    <td>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: CLASS_TONE[s.clsLabel] || '#64748b' }} />
                                            {s.clsLabel}
                                        </span>
                                    </td>
                                    <td>{s.group || '—'}</td>
                                    <td>{s.disciplines.length}</td>
                                </tr>
                                {expanded === `${s.no}-${idx}` && s.disciplines.length > 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ background: 'var(--bg-panel)', padding: '10px 18px' }}>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Спортивные дисциплины:</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {s.disciplines.map((d, i) => (
                                                    <span key={i} style={{ fontSize: 12.5, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '4px 10px', color: 'var(--text-primary)' }}>{d}</span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={6} className="reg-table__empty">Ничего не найдено</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
