import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { transferApi } from '../api/esport'
import { MetricIcons } from '../components/CabinetIcons'
import Breadcrumbs from '../components/Breadcrumbs'
import './AwardApplications.css'

const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'

const STATUSES = ['Подана', 'Подтверждён старым клубом', 'Подтверждён новым клубом', 'Подтверждён федерацией', 'Переход оформлен', 'Отклонена', 'Отозвана']
const TERMINAL = ['Переход оформлен', 'Отклонена', 'Отозвана']
const IN_PROGRESS = ['Подана', 'Подтверждён старым клубом', 'Подтверждён новым клубом', 'Подтверждён федерацией']

function badgeClass(status) {
    const map = {
        'Подана': 'aw-badge--blue',
        'Подтверждён старым клубом': 'aw-badge--blue',
        'Подтверждён новым клубом': 'aw-badge--yellow',
        'Подтверждён федерацией': 'aw-badge--yellow',
        'Переход оформлен': 'aw-badge--green',
        'Отклонена': 'aw-badge--red',
        'Отозвана': 'aw-badge--gray',
    }
    return map[status] || 'aw-badge--gray'
}

export default function TransferApplications() {
    const navigate = useNavigate()
    const [rows, setRows] = useState([])
    const [search, setSearch] = useState('')
    const [statusF, setStatusF] = useState('all')

    useEffect(() => {
        let alive = true
        transferApi.list({ size: 200 })
            .then(({ items }) => { if (alive) setRows(items) })
            .catch(() => { /* бэкенд недоступен */ })
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
            <div className="aw-header">
                <h1 className="aw-header__title">Заявки на переход спортсменов</h1>
            </div>

            <div className="aw-metrics">
                <div className="aw-metric aw-metric--blue">
                    <div className="aw-metric__icon">{MetricIcons.clipboard()}</div>
                    <div className="aw-metric__body"><span className="aw-metric__value">{metrics.total}</span><span className="aw-metric__label">Всего заявок</span></div>
                </div>
                <div className="aw-metric aw-metric--yellow">
                    <div className="aw-metric__icon">{MetricIcons.search()}</div>
                    <div className="aw-metric__body"><span className="aw-metric__value">{metrics.inProgress}</span><span className="aw-metric__label">В работе</span></div>
                </div>
                <div className="aw-metric aw-metric--green">
                    <div className="aw-metric__icon">{MetricIcons.active()}</div>
                    <div className="aw-metric__body"><span className="aw-metric__value">{metrics.completed}</span><span className="aw-metric__label">Оформлено</span></div>
                </div>
                <div className="aw-metric aw-metric--gray">
                    <div className="aw-metric__icon">{MetricIcons.rejected()}</div>
                    <div className="aw-metric__body"><span className="aw-metric__value">{metrics.rejected}</span><span className="aw-metric__label">Отклонено / отозвано</span></div>
                </div>
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
                        {filtered.length === 0 && (
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
                                <td><span className={`aw-badge ${badgeClass(a.status)}`}>{a.status}</span></td>
                                <td><button className="aw-btn aw-btn--primary" onClick={() => navigate(`/transfer-applications/${a.id}`)}>Открыть</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
