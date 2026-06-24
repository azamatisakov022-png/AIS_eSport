import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { trainerAppsApi } from '../api/esport'
import { MetricIcons } from '../components/CabinetIcons'
import './TrainerApplications.css'
import Portal from '../components/Portal'
import Breadcrumbs from '../components/Breadcrumbs'

const STATUSES = {
    submitted:  { key: 'submitted',  labelKey: 'trainerApplications.statuses.submitted',    css: 'ta-badge--blue' },
    review:     { key: 'review',     labelKey: 'trainerApplications.statuses.underReview',   css: 'ta-badge--yellow' },
    revision:   { key: 'revision',   labelKey: 'trainerApplications.statuses.needsRevision', css: 'ta-badge--orange' },
    registered: { key: 'registered', labelKey: 'trainerApplications.statuses.registered',    css: 'ta-badge--green' },
    rejected:   { key: 'rejected',   labelKey: 'trainerApplications.statuses.rejected',      css: 'ta-badge--red' },
    annulled:   { key: 'annulled',   labelKey: 'trainerApplications.statuses.revoked',       css: 'ta-badge--gray' },
}

const DOC_LABEL_KEYS = [
    'trainerApplications.docLabels.passport',
    'trainerApplications.docLabels.diploma',
    'trainerApplications.docLabels.rank',
    'trainerApplications.docLabels.criminal',
    'trainerApplications.docLabels.data',
]

const MOCK = [
    { id: 'TR-20260301-091200', name: 'Асанов Бакыт Маратович',     date: '2026-03-01', sport: 'Дзюдо',             status: 'submitted',  docs: [1,1,1,1,1], phone: '+996 555 112233', email: 'asanov@mail.kg',     birth: '1985-04-12', tunduk: false },
    { id: 'TR-20260302-143015', name: 'Кулматова Айгерим Сагынбековна', date: '2026-03-02', sport: 'Лёгкая атлетика', status: 'review',     docs: [1,1,1,1,1], phone: '+996 700 445566', email: 'kulmatova@gmail.com', birth: '1990-08-22', tunduk: true },
    { id: 'TR-20260303-100500', name: 'Джумабаев Эрлан Калыкович',   date: '2026-03-03', sport: 'Бокс',              status: 'revision',   docs: [1,1,0,1,1], phone: '+996 777 889900', email: 'jumabaev@inbox.kg',  birth: '1988-01-30', tunduk: false },
    { id: 'TR-20260227-084530', name: 'Токтогулова Назира Асылбековна', date: '2026-02-27', sport: 'Плавание',       status: 'review',     docs: [1,1,1,1,1], phone: '+996 550 112244', email: 'toktogulova@mail.kg', birth: '1992-11-05', tunduk: true },
    { id: 'TR-20260220-110000', name: 'Бейшеналиев Данияр Кубатович', date: '2026-02-20', sport: 'Борьба',           status: 'registered', docs: [1,1,1,1,1], phone: '+996 700 998877', email: 'beish@mail.kg',      birth: '1982-06-18', tunduk: false, certNumber: 'СВ-КР-2026-00142' },
    { id: 'TR-20260225-093000', name: 'Абдылдаев Нурбек Турдумаматович', date: '2026-02-25', sport: 'Тхэквондо',   status: 'rejected',   docs: [1,0,0,1,1], phone: '+996 555 667788', email: 'abdyldaev@gmail.com', birth: '1995-03-08', tunduk: false },
    { id: 'TR-20260310-151000', name: 'Сатыбалдиева Мээрим Акжолтоевна', date: '2026-03-10', sport: 'Каратэ',      status: 'submitted',  docs: [1,1,1,1,1], phone: '+996 770 223344', email: 'satybald@mail.kg',   birth: '1993-09-14', tunduk: true },
    { id: 'TR-20260311-080000', name: 'Ормонов Алмаз Кайратович',    date: '2026-03-11', sport: 'Футбол',            status: 'submitted',  docs: [1,1,1,0,1], phone: '+996 500 556677', email: 'ormonov@inbox.kg',   birth: '1987-12-01', tunduk: false },
    { id: 'TR-20260215-120000', name: 'Жумагулов Тимур Эркинович',   date: '2026-02-15', sport: 'Шахматы',           status: 'annulled',   docs: [1,1,1,1,1], phone: '+996 555 998877', email: 'jumagulov@mail.kg',  birth: '1991-07-20', tunduk: false },
    { id: 'TR-20260308-140000', name: 'Касымова Жылдыз Болотбековна', date: '2026-03-08', sport: 'Гимнастика',       status: 'review',     docs: [1,1,1,1,1], phone: '+996 700 112299', email: 'kasymova@gmail.com', birth: '1994-02-28', tunduk: true },
]

const DEADLINE_DAYS = 15

function daysLeft(dateStr) {
    const submitted = new Date(dateStr)
    const deadline = new Date(submitted)
    deadline.setDate(deadline.getDate() + DEADLINE_DAYS)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('ru-RU')
}

function generateCertNumber() {
    const n = Math.floor(Math.random() * 90000) + 10000
    return `СВ-КР-2026-${String(n).padStart(5, '0')}`
}

export default function TrainerApplications() {
    const { t } = useTranslation()
    const toast = useToast()
    const [data, setData] = useState(MOCK)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [drawer, setDrawer] = useState(null) // index or null

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

    // Filtered data
    const filtered = useMemo(() => {
        return data.filter(app => {
            if (statusFilter !== 'all' && app.status !== statusFilter) return false
            if (search && !app.name.toLowerCase().includes(search.toLowerCase()) && !app.id.toLowerCase().includes(search.toLowerCase())) return false
            if (dateFrom && app.date < dateFrom) return false
            if (dateTo && app.date > dateTo) return false
            return true
        })
    }, [data, search, statusFilter, dateFrom, dateTo])

    // Metrics
    const metrics = useMemo(() => {
        const total = data.length
        const onReview = data.filter(a => a.status === 'review').length
        const expiring = data.filter(a => ['submitted', 'review', 'revision'].includes(a.status) && daysLeft(a.date) <= 3).length
        const registered = data.filter(a => a.status === 'registered').length
        return { total, onReview, expiring, registered }
    }, [data])

    const changeStatus = async (idx, newStatus) => {
        const app = data[idx]
        if (app?._id) {
            // Живой бэкенд: переход валидируется статусной машиной
            try {
                const updated = await trainerAppsApi.changeStatus(app._id, newStatus)
                setData(prev => prev.map((a, i) => i === idx
                    ? { ...a, status: updated.status, certNumber: updated.certNumber || a.certNumber, certEnd: updated.certEndDate || a.certEnd }
                    : a))
                toast(newStatus === 'registered' ? 'Свидетельство выдано (срок 3 года)' : 'Статус обновлён')
            } catch (e) {
                toast(e.message || 'Недопустимый переход статуса')
            }
            return
        }
        // Демо-режим (бэкенд недоступен)
        setData(prev => prev.map((a, i) => {
            if (i !== idx) return a
            const updated = { ...a, status: newStatus }
            if (newStatus === 'registered' && !updated.certNumber) updated.certNumber = generateCertNumber()
            return updated
        }))
    }

    const drawerApp = drawer !== null ? data[drawer] : null
    const drawerDays = drawerApp ? daysLeft(drawerApp.date) : null

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
                    {Object.values(STATUSES).map(s => (
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
                            const days = daysLeft(app.date)
                            const isActive = ['submitted', 'review', 'revision'].includes(app.status)
                            return (
                                <tr key={app.id}>
                                    <td className="ta-table__id">{app.id}</td>
                                    <td className="ta-table__name">{app.name}</td>
                                    <td>
                                        {formatDate(app.date)}
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
                                                <span key={i} className={`ta-doc-dot ${d ? 'ta-doc-dot--ok' : 'ta-doc-dot--no'}`} title={t(DOC_LABEL_KEYS[i])}>
                                                    {d ? <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} /> : <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`ta-badge ${STATUSES[app.status].css}`}>
                                            {t(STATUSES[app.status].labelKey)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="ta-actions">
                                            <button className="ta-btn ta-btn--primary" onClick={() => setDrawer(realIdx)}>
                                                {t('trainerApplications.review')}
                                            </button>
                                            <select
                                                className="ta-status-select"
                                                value={app.status}
                                                onChange={e => changeStatus(realIdx, e.target.value)}
                                            >
                                                {Object.values(STATUSES).map(s => (
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

            {/* Drawer overlay */}
            {drawer !== null && (
                <Portal>
                <div className="ta-drawer-overlay" onClick={() => setDrawer(null)}>
                    <div className="ta-drawer" onClick={e => e.stopPropagation()}>
                        <div className="ta-drawer__header">
                            <h2>{t('trainerApplications.drawerTitle', { id: drawerApp.id })}</h2>
                            <button className="ta-drawer__close" onClick={() => setDrawer(null)}>✕</button>
                        </div>

                        {/* Timer */}
                        <div className={`ta-drawer__timer ${drawerDays <= 3 ? 'ta-drawer__timer--danger' : drawerDays <= 7 ? 'ta-drawer__timer--warn' : ''}`}>
                            <span className="ta-drawer__timer-icon">⏰</span>
                            <div>
                                <strong>{drawerDays > 0 ? t('trainerApplications.timer.daysRemaining', { days: drawerDays }) : t('trainerApplications.timer.expired')}</strong>
                                <span> из {DEADLINE_DAYS} календарных дней</span>
                            </div>
                        </div>

                        {/* Status */}
                        <div style={{ marginBottom: 16 }}>
                            <span className={`ta-badge ${STATUSES[drawerApp.status].css}`}>
                                {t(STATUSES[drawerApp.status].labelKey)}
                            </span>
                            {drawerApp.certNumber && (
                                <span className="ta-cert-number">
                                    {t('trainerApplications.certificate')} {drawerApp.certNumber}
                                    {drawerApp.certEnd && <> · действует до {formatDate(drawerApp.certEnd)}</>}
                                </span>
                            )}
                        </div>

                        {/* Applicant info */}
                        <div className="ta-drawer__section">
                            <h3 className="ta-drawer__section-title">{t('trainerApplications.sections.applicantData')}</h3>
                            <table className="ta-drawer__info">
                                <tbody>
                                    <tr><td>{t('common.name')}</td><td>{drawerApp.name}</td></tr>
                                    <tr><td>{t('fields.birthDate')}</td><td>{formatDate(drawerApp.birth)}</td></tr>
                                    <tr><td>{t('fields.phone')}</td><td>{drawerApp.phone}</td></tr>
                                    <tr><td>{t('fields.email')}</td><td>{drawerApp.email}</td></tr>
                                    <tr><td>{t('fields.sport')}</td><td>{drawerApp.sport}</td></tr>
                                    <tr><td>{t('trainerApplications.table.submitDate')}</td><td>{formatDate(drawerApp.date)}</td></tr>
                                    <tr><td>{t('trainerApplications.passportViaTunduk')}</td><td>{drawerApp.tunduk ? 'Да' : 'Нет'}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Documents */}
                        <div className="ta-drawer__section">
                            <h3 className="ta-drawer__section-title">{t('trainerApplications.sections.uploadedDocs')}</h3>
                            <div className="ta-drawer__docs">
                                {DOC_LABEL_KEYS.map((labelKey, i) => (
                                    <div key={labelKey} className={`ta-drawer__doc ${drawerApp.docs[i] ? 'ta-drawer__doc--ok' : 'ta-drawer__doc--no'}`}>
                                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: drawerApp.docs[i] ? '#16a34a' : '#ef4444' }} />
                                        <span className="ta-drawer__doc-name">{t(labelKey)}</span>
                                        {drawerApp.docs[i] && (
                                            <button className="ta-btn ta-btn--small" onClick={() => toast(`${t('common.view')}: ${t(labelKey)}`)}>
                                                {t('common.view')}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="ta-drawer__actions">
                            <button
                                className="ta-btn ta-btn--green"
                                onClick={() => { changeStatus(drawer, 'registered'); }}
                            >
                                {t('trainerApplications.actions.register')}
                            </button>
                            <button
                                className="ta-btn ta-btn--orange"
                                onClick={() => changeStatus(drawer, 'revision')}
                            >
                                {t('trainerApplications.actions.requestRevision')}
                            </button>
                            <button
                                className="ta-btn ta-btn--red"
                                onClick={() => changeStatus(drawer, 'rejected')}
                            >
                                {t('trainerApplications.actions.reject')}
                            </button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}
        </div>
    )
}