import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { protocolsApi } from '../api/esport'
import { MetricIcons } from '../components/CabinetIcons'
import Breadcrumbs from '../components/Breadcrumbs'
import './AwardApplications.css'

const COLORS = ['#2563EB', '#059669', '#7c3aed', '#d97706', '#e11d48', '#0d9488']
const getColor = (id) => COLORS[id % COLORS.length]
const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'
const initials = (name) => { const p = (name || '').replace(/Федерация\s*/i, '').split(' '); return (p[0]?.[0] || '') + (p[1]?.[0] || '') }

const STATUSES = ['Подан', 'На проверке', 'На доработке', 'Опубликован', 'Отклонён', 'Отозван']
const TERMINAL = ['Опубликован', 'Отклонён', 'Отозван']

function badgeClass(status) {
    const map = {
        'Подан': 'aw-badge--blue',
        'На проверке': 'aw-badge--yellow',
        'На доработке': 'aw-badge--orange',
        'Опубликован': 'aw-badge--green',
        'Отклонён': 'aw-badge--red',
        'Отозван': 'aw-badge--gray',
    }
    return map[status] || 'aw-badge--gray'
}

export default function ProtocolSubmissions() {
    const navigate = useNavigate()
    const [rows, setRows] = useState([])
    const [search, setSearch] = useState('')
    const [statusF, setStatusF] = useState('all')

    useEffect(() => {
        let alive = true
        protocolsApi.list({ size: 200 })
            .then(({ items }) => { if (alive) setRows(items) })
            .catch(() => { /* бэкенд недоступен */ })
        return () => { alive = false }
    }, [])

    const filtered = useMemo(() => rows.filter(a => {
        if (search && !(a.federationName || '').toLowerCase().includes(search.toLowerCase())
            && !(a.eventName || '').toLowerCase().includes(search.toLowerCase())
            && !(a.appNo || '').toLowerCase().includes(search.toLowerCase())) return false
        if (statusF !== 'all' && a.status !== statusF) return false
        return true
    }), [rows, search, statusF])

    const metrics = useMemo(() => ({
        total: rows.length,
        review: rows.filter(a => a.status === 'Подан' || a.status === 'На проверке').length,
        published: rows.filter(a => a.status === 'Опубликован').length,
        rejected: rows.filter(a => a.status === 'Отклонён').length,
    }), [rows])

    return (
        <div className="aw-page">
            <Breadcrumbs current="Протоколы соревнований" />
            <div className="aw-header">
                <h1 className="aw-header__title">Протоколы соревнований (от федераций)</h1>
            </div>

            <div className="aw-metrics">
                <div className="aw-metric aw-metric--blue">
                    <div className="aw-metric__icon">{MetricIcons.clipboard()}</div>
                    <div className="aw-metric__body"><span className="aw-metric__value">{metrics.total}</span><span className="aw-metric__label">Всего протоколов</span></div>
                </div>
                <div className="aw-metric aw-metric--yellow">
                    <div className="aw-metric__icon">{MetricIcons.search()}</div>
                    <div className="aw-metric__body"><span className="aw-metric__value">{metrics.review}</span><span className="aw-metric__label">На проверке</span></div>
                </div>
                <div className="aw-metric aw-metric--green">
                    <div className="aw-metric__icon">{MetricIcons.active()}</div>
                    <div className="aw-metric__body"><span className="aw-metric__value">{metrics.published}</span><span className="aw-metric__label">Опубликовано</span></div>
                </div>
                <div className="aw-metric aw-metric--gray">
                    <div className="aw-metric__icon">{MetricIcons.rejected()}</div>
                    <div className="aw-metric__body"><span className="aw-metric__value">{metrics.rejected}</span><span className="aw-metric__label">Отклонено</span></div>
                </div>
            </div>

            <div className="aw-filters">
                <div className="aw-filters__search">
                    <span className="aw-filters__search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder="Поиск по федерации, соревнованию или номеру..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="aw-filters__select" value={statusF} onChange={e => setStatusF(e.target.value)}>
                    <option value="all">Все статусы</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="aw-table-wrap">
                <table className="aw-table">
                    <thead>
                        <tr>
                            <th>№ заявки</th>
                            <th>Федерация</th>
                            <th>Соревнование</th>
                            <th>Вид спорта</th>
                            <th>Результатов</th>
                            <th>Подан</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} className="aw-table__empty">Протоколы не найдены</td></tr>
                        )}
                        {filtered.map(a => (
                            <tr key={a.id}>
                                <td><span className="aw-appno">{a.appNo}</span></td>
                                <td>
                                    <div className="aw-person">
                                        <div className="aw-avatar" style={{ background: getColor(a.id) }}>{initials(a.federationName)}</div>
                                        <span className="aw-person__name">{a.federationName}</span>
                                    </div>
                                </td>
                                <td style={{ fontSize: 13 }}>{a.eventName}<div style={{ fontSize: 11, color: '#94a3b8' }}>{fmt(a.eventDate)}{a.level ? ` · ${a.level}` : ''}</div></td>
                                <td>{a.sport || '—'}</td>
                                <td><span className="aw-completeness aw-completeness--full">{a.resultsCount}</span></td>
                                <td style={{ whiteSpace: 'nowrap' }}>{fmt(a.submitDate)}</td>
                                <td><span className={`aw-badge ${badgeClass(a.status)}`}>{a.status}</span></td>
                                <td><button className="aw-btn aw-btn--primary" onClick={() => navigate(`/protocol-submissions/${a.id}`)}>Открыть</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
