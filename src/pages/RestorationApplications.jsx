import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { restorationApi } from '../api/esport'
import { MetricIcons } from '../components/CabinetIcons'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, MetricCard, Badge } from '../components/ui'
import './AwardApplications.css'

const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'

const STATUSES = ['Подана', 'Проверка документов', 'На доработке', 'Приказ подписан', 'Выдан дубликат', 'Отклонена', 'Отозвана']
const TERMINAL = ['Выдан дубликат', 'Отклонена', 'Отозвана']
const IN_PROGRESS = ['Проверка документов', 'Приказ подписан']

function statusVariant(status) {
    const map = {
        'Подана': 'blue',
        'Проверка документов': 'blue',
        'На доработке': 'amber',
        'Приказ подписан': 'amber',
        'Выдан дубликат': 'green',
        'Отклонена': 'red',
        'Отозвана': 'gray',
    }
    return map[status] || 'gray'
}

export default function RestorationApplications() {
    const navigate = useNavigate()
    const [rows, setRows] = useState([])
    const [search, setSearch] = useState('')
    const [statusF, setStatusF] = useState('all')

    useEffect(() => {
        let alive = true
        restorationApi.list({ size: 200 })
            .then(({ items }) => { if (alive) setRows(items) })
            .catch(() => { /* бэкенд недоступен */ })
        return () => { alive = false }
    }, [])

    const filtered = useMemo(() => rows.filter(a => {
        if (search && !(a.applicantName || '').toLowerCase().includes(search.toLowerCase())
            && !(a.appNo || '').toLowerCase().includes(search.toLowerCase())) return false
        if (statusF !== 'all' && a.status !== statusF) return false
        return true
    }), [rows, search, statusF])

    const metrics = useMemo(() => ({
        total: rows.length,
        inProgress: rows.filter(a => IN_PROGRESS.includes(a.status)).length,
        expiring: rows.filter(a => a.remainingDays != null && a.remainingDays <= 3 && a.remainingDays > 0 && !TERMINAL.includes(a.status)).length,
        issued: rows.filter(a => a.status === 'Выдан дубликат').length,
        rejected: rows.filter(a => a.status === 'Отклонена').length,
    }), [rows])

    return (
        <div className="aw-page">
            <Breadcrumbs current="Восстановление документов" />
            <PageHeader title="Заявки на восстановление документов" />

            <div className="aw-metrics">
                <MetricCard tone="blue" icon={MetricIcons.clipboard()} value={metrics.total} label="Всего заявок" />
                <MetricCard tone="amber" icon={MetricIcons.search()} value={metrics.inProgress} label="В работе" />
                <MetricCard tone="red" icon={MetricIcons.clock()} value={metrics.expiring} label="Истекает срок" />
                <MetricCard tone="green" icon={MetricIcons.active()} value={metrics.issued} label="Выдан дубликат" />
                <MetricCard icon={MetricIcons.rejected()} value={metrics.rejected} label="Отказано" />
            </div>

            <div className="aw-filters">
                <div className="aw-filters__search">
                    <span className="aw-filters__search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder="Поиск по ФИО или номеру заявки..." value={search} onChange={e => setSearch(e.target.value)} />
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
                            <th>Заявитель</th>
                            <th>Тип документа</th>
                            <th>Причина</th>
                            <th>Старый №</th>
                            <th>Подана</th>
                            <th>Осталось</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={9} className="aw-table__empty">Заявки не найдены</td></tr>
                        )}
                        {filtered.map(a => {
                            const term = TERMINAL.includes(a.status)
                            const rd = a.remainingDays
                            const daysClass = rd == null ? '' : rd <= 3 ? 'aw-days--danger' : rd <= 5 ? 'aw-days--warn' : 'aw-days--ok'
                            return (
                                <tr key={a.id}>
                                    <td><span className="aw-appno">{a.appNo}</span></td>
                                    <td>
                                        <span className="aw-person__name">{a.applicantName}</span>
                                    </td>
                                    <td style={{ fontSize: 13 }}>{a.docType}</td>
                                    <td style={{ fontSize: 13, color: '#475569' }}>{a.reason || '—'}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                                        {a.oldNumber || '—'}
                                        {a.oldInvalidated && <span className="aw-badge aw-badge--red" style={{ marginLeft: 6 }}>недейств.</span>}
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{fmt(a.submitDate)}</td>
                                    <td>
                                        {!term && rd != null
                                            ? <span className={`aw-days ${daysClass}`}>{rd > 0 ? `${rd} дн.` : 'просрочено'}</span>
                                            : <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>}
                                    </td>
                                    <td><Badge variant={statusVariant(a.status)}>{a.status}</Badge></td>
                                    <td><button className="aw-btn aw-btn--primary" onClick={() => navigate(`/restoration-applications/${a.id}`)}>Открыть</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
