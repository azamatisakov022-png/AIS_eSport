import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { judgeAppsApi } from '../api/esport'
import { MetricIcons } from '../components/CabinetIcons'
import Breadcrumbs from '../components/Breadcrumbs'
import './AwardApplications.css'

const COLORS = ['#2563EB', '#059669', '#7c3aed', '#d97706', '#e11d48', '#0d9488']
const getColor = (id) => COLORS[id % COLORS.length]
const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'
const initials = (name) => { const p = (name || '').split(' '); return (p[0]?.[0] || '') + (p[1]?.[0] || '') }

const STATUSES = [
    'Подана', 'Проверка документов', 'На доработке', 'Аттестация', 'Рассмотрение комиссией',
    'Согласование Агентства', 'Передано в международную федерацию', 'Присвоено', 'Выдано удостоверение',
    'Записано', 'Отклонена', 'Отозвана',
]

const TERMINAL = ['Выдано удостоверение', 'Записано', 'Отклонена', 'Отозвана']
const IN_PROGRESS = ['Проверка документов', 'Аттестация', 'Рассмотрение комиссией', 'Согласование Агентства', 'Передано в международную федерацию', 'Присвоено']

function badgeClass(status) {
    const map = {
        'Подана': 'aw-badge--blue',
        'Проверка документов': 'aw-badge--blue',
        'Передано в международную федерацию': 'aw-badge--blue',
        'На доработке': 'aw-badge--orange',
        'Аттестация': 'aw-badge--yellow',
        'Рассмотрение комиссией': 'aw-badge--yellow',
        'Согласование Агентства': 'aw-badge--yellow',
        'Присвоено': 'aw-badge--green',
        'Выдано удостоверение': 'aw-badge--green',
        'Записано': 'aw-badge--green',
        'Отклонена': 'aw-badge--red',
        'Отозвана': 'aw-badge--gray',
    }
    return map[status] || 'aw-badge--gray'
}

export default function JudgeApplications() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [rows, setRows] = useState([])
    const [search, setSearch] = useState('')
    const [statusF, setStatusF] = useState('all')

    useEffect(() => {
        let alive = true
        judgeAppsApi.list({ size: 200 })
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
        expiring: rows.filter(a => a.remainingDays != null && a.remainingDays <= 5 && a.remainingDays > 0 && !TERMINAL.includes(a.status)).length,
        issued: rows.filter(a => a.status === 'Выдано удостоверение' || a.status === 'Записано').length,
        rejected: rows.filter(a => a.status === 'Отклонена').length,
    }), [rows])

    return (
        <div className="aw-page">
            <Breadcrumbs current="Заявки на судейские категории" />
            <div className="aw-header">
                <h1 className="aw-header__title">Заявки на присвоение судейских категорий</h1>
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
                <div className="aw-metric aw-metric--red">
                    <div className="aw-metric__icon">{MetricIcons.clock()}</div>
                    <div className="aw-metric__body"><span className="aw-metric__value">{metrics.expiring}</span><span className="aw-metric__label">Истекает срок</span></div>
                </div>
                <div className="aw-metric aw-metric--green">
                    <div className="aw-metric__icon">{MetricIcons.active()}</div>
                    <div className="aw-metric__body"><span className="aw-metric__value">{metrics.issued}</span><span className="aw-metric__label">Выдано</span></div>
                </div>
                <div className="aw-metric aw-metric--gray">
                    <div className="aw-metric__icon">{MetricIcons.rejected()}</div>
                    <div className="aw-metric__body"><span className="aw-metric__value">{metrics.rejected}</span><span className="aw-metric__label">Отказано</span></div>
                </div>
            </div>

            <div className="aw-filters">
                <div className="aw-filters__search">
                    <span className="aw-filters__search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder="Поиск по ФИО или номеру заявки..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="aw-filters__select" value={statusF} onChange={e => setStatusF(e.target.value)}>
                    <option value="all">{t('common.allStatuses', 'Все статусы')}</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="aw-table-wrap">
                <table className="aw-table">
                    <thead>
                        <tr>
                            <th>№ заявки</th>
                            <th>ФИО заявителя</th>
                            <th>Категория</th>
                            <th>Вид спорта</th>
                            <th>Кто присваивает</th>
                            <th>Подана</th>
                            <th>Осталось</th>
                            <th>Комплектность</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={10} className="aw-table__empty">Заявки не найдены</td></tr>
                        )}
                        {filtered.map(a => {
                            const term = TERMINAL.includes(a.status)
                            const rd = a.remainingDays
                            const daysClass = rd == null ? '' : rd <= 5 ? 'aw-days--danger' : rd <= 10 ? 'aw-days--warn' : 'aw-days--ok'
                            return (
                                <tr key={a.id}>
                                    <td><span className="aw-appno">{a.appNo}</span></td>
                                    <td>
                                        <div className="aw-person">
                                            <div className="aw-avatar" style={{ background: getColor(a.id) }}>{initials(a.applicantName)}</div>
                                            <span className="aw-person__name">{a.applicantName}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600, fontSize: 13 }}>{a.requestedCategory}</td>
                                    <td>{a.sport || '—'}</td>
                                    <td style={{ fontSize: 12, color: '#475569', maxWidth: 220 }}>{a.assignedBy || '—'}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{fmt(a.submitDate)}</td>
                                    <td>
                                        {!term && rd != null
                                            ? <span className={`aw-days ${daysClass}`}>{rd > 0 ? `${rd} дн.` : 'просрочено'}</span>
                                            : <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>}
                                    </td>
                                    <td>
                                        <span className={`aw-completeness ${a.docsUploaded === a.docsTotal ? 'aw-completeness--full' : 'aw-completeness--partial'}`}>
                                            {a.docsUploaded}/{a.docsTotal}
                                        </span>
                                    </td>
                                    <td><span className={`aw-badge ${badgeClass(a.status)}`}>{a.status}</span></td>
                                    <td><button className="aw-btn aw-btn--primary" onClick={() => navigate(`/judge-applications/${a.id}`)}>Открыть</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
