import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { transferApi } from '../api/esport'
import { MetricIcons } from '../components/CabinetIcons'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, MetricCard, Badge, TableLoader } from '../components/ui'
import './AwardApplications.css'

const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'

const STATUSES = ['Подана', 'Подтверждён старым клубом', 'Подтверждён новым клубом', 'Подтверждён федерацией', 'Переход оформлен', 'Отклонена', 'Отозвана']
const TERMINAL = ['Переход оформлен', 'Отклонена', 'Отозвана']
const IN_PROGRESS = ['Подана', 'Подтверждён старым клубом', 'Подтверждён новым клубом', 'Подтверждён федерацией']

function statusVariant(status) {
    const map = {
        'Подана': 'blue',
        'Подтверждён старым клубом': 'blue',
        'Подтверждён новым клубом': 'amber',
        'Подтверждён федерацией': 'amber',
        'Переход оформлен': 'green',
        'Отклонена': 'red',
        'Отозвана': 'gray',
    }
    return map[status] || 'gray'
}

export default function TransferApplications() {
    const navigate = useNavigate()
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusF, setStatusF] = useState('all')

    useEffect(() => {
        let alive = true
        transferApi.list({ size: 200 })
            .then(({ items }) => { if (alive) setRows(items) })
            .catch(() => { /* бэкенд недоступен */ })
            .finally(() => { if (alive) setLoading(false) })
        return () => { alive = false }
    }, [])

    const filtered = useMemo(() => rows.filter(a => {
        if (search && !(a.athleteName || '').toLowerCase().includes(search.toLowerCase())
            && !(a.appNo || '').toLowerCase().includes(search.toLowerCase())) return false
        if (statusF !== 'all' && a.status !== statusF) return false
        return true
    }), [rows, search, statusF])

    const metrics = useMemo(() => ({
        total: rows.length,
        inProgress: rows.filter(a => IN_PROGRESS.includes(a.status)).length,
        completed: rows.filter(a => a.status === 'Переход оформлен').length,
        rejected: rows.filter(a => a.status === 'Отклонена' || a.status === 'Отозвана').length,
    }), [rows])

    return (
        <div className="aw-page">
            <Breadcrumbs current="Переходы спортсменов" />
            <PageHeader title="Заявки на переход спортсменов" />

            <div className="aw-metrics">
                <MetricCard tone="blue" icon={MetricIcons.clipboard()} value={metrics.total} label="Всего заявок" />
                <MetricCard tone="amber" icon={MetricIcons.search()} value={metrics.inProgress} label="В работе" />
                <MetricCard tone="green" icon={MetricIcons.active()} value={metrics.completed} label="Оформлено" />
                <MetricCard icon={MetricIcons.rejected()} value={metrics.rejected} label="Отклонено / отозвано" />
            </div>

            <div className="aw-filters">
                <div className="aw-filters__search">
                    <span className="aw-filters__search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder="Поиск по ФИО спортсмена или номеру..." value={search} onChange={e => setSearch(e.target.value)} />
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
                            <th>Спортсмен</th>
                            <th>Вид спорта</th>
                            <th>Старый клуб</th>
                            <th>Новый клуб</th>
                            <th>Подана</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && filtered.length === 0 && <TableLoader cols={8} />}
                        {!loading && filtered.length === 0 && (
                            <tr><td colSpan={8} className="aw-table__empty">Заявки не найдены</td></tr>
                        )}
                        {filtered.map(a => (
                            <tr key={a.id}>
                                <td><span className="aw-appno">{a.appNo}</span></td>
                                <td>
                                    <span className="aw-person__name">{a.athleteName}</span>
                                </td>
                                <td>{a.sport || '—'}</td>
                                <td style={{ fontSize: 13, color: '#475569' }}>{a.oldClub || '—'}</td>
                                <td style={{ fontSize: 13, fontWeight: 600 }}>{a.newClub || '—'}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{fmt(a.submitDate)}</td>
                                <td><Badge variant={statusVariant(a.status)}>{a.status}</Badge></td>
                                <td><button className="aw-btn aw-btn--primary" onClick={() => navigate(`/transfer-applications/${a.id}`)}>Открыть</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
