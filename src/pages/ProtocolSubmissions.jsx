import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { protocolsApi } from '../api/esport'
import { MetricIcons } from '../components/CabinetIcons'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, MetricCard, Badge } from '../components/ui'
import './AwardApplications.css'

const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'

const STATUSES = ['Подан', 'На проверке', 'На доработке', 'Опубликован', 'Отклонён', 'Отозван']
const TERMINAL = ['Опубликован', 'Отклонён', 'Отозван']

function statusVariant(status) {
    const map = {
        'Подан': 'blue',
        'На проверке': 'amber',
        'На доработке': 'amber',
        'Опубликован': 'green',
        'Отклонён': 'red',
        'Отозван': 'gray',
    }
    return map[status] || 'gray'
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
            <PageHeader title="Протоколы соревнований (от федераций)" />

            <div className="aw-metrics">
                <MetricCard tone="blue" icon={MetricIcons.clipboard()} value={metrics.total} label="Всего протоколов" />
                <MetricCard tone="amber" icon={MetricIcons.search()} value={metrics.review} label="На проверке" />
                <MetricCard tone="green" icon={MetricIcons.active()} value={metrics.published} label="Опубликовано" />
                <MetricCard icon={MetricIcons.rejected()} value={metrics.rejected} label="Отклонено" />
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
                                    <span className="aw-person__name">{a.federationName}</span>
                                </td>
                                <td style={{ fontSize: 13 }}>{a.eventName}<div style={{ fontSize: 11, color: '#94a3b8' }}>{fmt(a.eventDate)}{a.level ? ` · ${a.level}` : ''}</div></td>
                                <td>{a.sport || '—'}</td>
                                <td><span className="aw-completeness aw-completeness--full">{a.resultsCount}</span></td>
                                <td style={{ whiteSpace: 'nowrap' }}>{fmt(a.submitDate)}</td>
                                <td><Badge variant={statusVariant(a.status)}>{a.status}</Badge></td>
                                <td><button className="aw-btn aw-btn--primary" onClick={() => navigate(`/protocol-submissions/${a.id}`)}>Открыть</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
