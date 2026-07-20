import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { trainerAppsApi } from '../api/esport'
import { MetricIcons } from '../components/CabinetIcons'
import './TrainerApplications.css'
import Breadcrumbs from '../components/Breadcrumbs'
import {
    TRAINER_MOCK, TRAINER_STATUSES, TRAINER_DOC_LABEL_KEYS,
    trainerDaysLeft, formatDateRu, generateCertNumber,
} from './trainerAppsData'

/* Реестр заявок на тренерское свидетельство. Рассмотрение заявки —
   на отдельной странице /trainer-applications/:id (не в боковой панели). */

export default function TrainerApplications() {
    const { t } = useTranslation()
    const toast = useToast()
    const navigate = useNavigate()
    const [data, setData] = useState(TRAINER_MOCK)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')

    // Загрузка заявок из бэкенда (с фолбэком на демо-данные)
    useEffect(() => {
        let alive = true
        trainerAppsApi.list({ size: 200 })
            .then(({ items }) => {
                if (!alive || !items.length) return
                setData(items.map(a => ({
                    _id: a.id,
                    id: a.appNo,
                    name: a.applicantName,
                    date: a.submitDate,
                    sport: a.sport || '',
                    status: a.status,
                    docs: Array.from({ length: a.docsTotal || 0 }, (_, i) => i < a.docsUploaded ? 1 : 0),
                    phone: a.phone || '',
                    email: a.email || '',
                    birth: a.birthDate || null,
                    tunduk: !!a.tundukVerified,
                    certNumber: a.certNumber || null,
                    certEnd: a.certEndDate || null,
                })))
            })
            .catch(() => { /* остаёмся на демо-данных */ })
        return () => { alive = false }
    }, [])

    const filtered = useMemo(() => {
        return data.filter(app => {
            if (statusFilter !== 'all' && app.status !== statusFilter) return false
            if (search && !app.name.toLowerCase().includes(search.toLowerCase()) && !app.id.toLowerCase().includes(search.toLowerCase())) return false
            if (dateFrom && app.date < dateFrom) return false
            if (dateTo && app.date > dateTo) return false
            return true
        })
    }, [data, search, statusFilter, dateFrom, dateTo])

    const metrics = useMemo(() => {
        const total = data.length
        const onReview = data.filter(a => a.status === 'review').length
        const expiring = data.filter(a => ['submitted', 'review', 'revision'].includes(a.status) && trainerDaysLeft(a.date) <= 3).length
        const registered = data.filter(a => a.status === 'registered').length
        return { total, onReview, expiring, registered }
    }, [data])

    const changeStatus = async (idx, newStatus, reason) => {
        const app = data[idx]
        if (app?._id) {
            let r = reason
            if (newStatus === 'rejected' && !r) {
                r = window.prompt('Укажите причину отказа:')
                if (!r || !r.trim()) { toast('Отказ отменён: причина не указана'); return }
            }
            try {
                const updated = await trainerAppsApi.changeStatus(app._id, newStatus, r)
                setData(prev => prev.map((a, i) => i === idx
                    ? { ...a, status: updated.status, certNumber: updated.certNumber || a.certNumber, certEnd: updated.certEndDate || a.certEnd }
                    : a))
                toast(newStatus === 'registered' ? 'Свидетельство выдано (бессрочно)' : 'Статус обновлён')
            } catch (e) {
                toast(e.message || 'Недопустимый переход статуса')
            }
            return
        }
        setData(prev => prev.map((a, i) => {
            if (i !== idx) return a
            const updated = { ...a, status: newStatus }
            if (newStatus === 'registered' && !updated.certNumber) updated.certNumber = generateCertNumber()
            return updated
        }))
    }

    return (
        <div className="ta-page">
            <Breadcrumbs current={t('trainerApplications.registryTitle')} />
            <h1 className="ta-page__title">{t('trainerApplications.registryTitle')}</h1>

            {/* Metrics */}
            <div className="ta-metrics">
                <div className="ta-metric ta-metric--blue">
                    <div className="ta-metric__icon">{MetricIcons.clipboard()}</div>
                    <div className="ta-metric__body">
                        <span className="ta-metric__value">{metrics.total}</span>
                        <span className="ta-metric__label">{t('trainerApplications.metricsTotal')}</span>
                    </div>
                </div>
                <div className="ta-metric ta-metric--yellow">
                    <div className="ta-metric__icon">{MetricIcons.search()}</div>
                    <div className="ta-metric__body">
                        <span className="ta-metric__value">{metrics.onReview}</span>
                        <span className="ta-metric__label">{t('trainerApplications.metricsUnderReview')}</span>
                    </div>
                </div>
                <div className="ta-metric ta-metric--red">
                    <div className="ta-metric__icon">{MetricIcons.clock()}</div>
                    <div className="ta-metric__body">
                        <span className="ta-metric__value">{metrics.expiring}</span>
                        <span className="ta-metric__label">{t('trainerApplications.metricsExpiring')}</span>
                    </div>
                </div>
                <div className="ta-metric ta-metric--green">
                    <div className="ta-metric__icon">{MetricIcons.active()}</div>
                    <div className="ta-metric__body">
                        <span className="ta-metric__value">{metrics.registered}</span>
                        <span className="ta-metric__label">{t('trainerApplications.metricsRegistered')}</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="ta-filters">
                <div className="ta-filters__search">
                    <span className="ta-filters__search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input
                        type="text"
                        placeholder="Поиск по ФИО или номеру..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select className="ta-filters__select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="all">{t('common.allStatuses')}</option>
                    {Object.values(TRAINER_STATUSES).map(s => (
                        <option key={s.key} value={s.key}>{t(s.labelKey)}</option>
                    ))}
                </select>
                <input type="date" className="ta-filters__date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="Дата от" />
                <input type="date" className="ta-filters__date" value={dateTo} onChange={e => setDateTo(e.target.value)} title="Дата до" />
            </div>

            {/* Table */}
            <div className="ta-table-wrap">
                <table className="ta-table">
                    <thead>
                        <tr>
                            <th>{t('trainerApplications.table.appNumber')}</th>
                            <th>{t('trainerApplications.table.trainerName')}</th>
                            <th>{t('trainerApplications.table.submitDate')}</th>
                            <th>{t('fields.sport')}</th>
                            <th>{t('trainerApplications.table.completeness')}</th>
                            <th>{t('common.status')}</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} className="ta-table__empty">Заявки не найдены</td></tr>
                        )}
                        {filtered.map(app => {
                            const realIdx = data.indexOf(app)
                            const days = trainerDaysLeft(app.date)
                            const isActive = ['submitted', 'review', 'revision'].includes(app.status)
                            return (
                                <tr key={app.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/trainer-applications/${app.id}`)}>
                                    <td className="ta-table__id">{app.id}</td>
                                    <td className="ta-table__name">{app.name}</td>
                                    <td>
                                        {formatDateRu(app.date)}
                                        {isActive && (
                                            <span className={`ta-days ${days <= 3 ? 'ta-days--danger' : days <= 7 ? 'ta-days--warn' : ''}`}>
                                                {days > 0 ? `${days} ${t('common.daysShort')}` : t('trainerApplications.overdue')}
                                            </span>
                                        )}
                                    </td>
                                    <td>{app.sport}</td>
                                    <td>
                                        <div className="ta-docs-icons">
                                            {app.docs.map((d, i) => (
                                                <span key={i} className={`ta-doc-dot ${d ? 'ta-doc-dot--ok' : 'ta-doc-dot--no'}`} title={t(TRAINER_DOC_LABEL_KEYS[i])}>
                                                    {d ? <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} /> : <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`ta-badge ${TRAINER_STATUSES[app.status].css}`}>
                                            {t(TRAINER_STATUSES[app.status].labelKey)}
                                        </span>
                                    </td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <div className="ta-actions">
                                            <button className="ta-btn ta-btn--primary" onClick={() => navigate(`/trainer-applications/${app.id}`)}>
                                                {t('trainerApplications.review')}
                                            </button>
                                            <select
                                                className="ta-status-select"
                                                value={app.status}
                                                onChange={e => changeStatus(realIdx, e.target.value)}
                                            >
                                                {Object.values(TRAINER_STATUSES).map(s => (
                                                    <option key={s.key} value={s.key}>{t(s.labelKey)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
