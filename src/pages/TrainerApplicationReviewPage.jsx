import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import Breadcrumbs from '../components/Breadcrumbs'
import { Button, StatusDot } from '../components/ui'
import {
    TRAINER_MOCK, TRAINER_STATUSES, TRAINER_DOC_LABEL_KEYS,
    TRAINER_DEADLINE_DAYS, trainerDaysLeft, formatDateRu, generateCertNumber,
} from './trainerAppsData'
import './TrainerApplications.css'

/* Рассмотрение заявки на тренерское свидетельство — полноценная страница в контенте
   (вместо бокового drawer). */

const STATUS_TONE = { submitted: 'blue', review: 'amber', revision: 'amber', registered: 'green', rejected: 'red', annulled: 'gray' }

export default function TrainerApplicationReviewPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const toast = useToast()
    const [app, setApp] = useState(() => {
        const found = TRAINER_MOCK.find(a => a.id === id)
        return found ? { ...found } : null
    })

    if (!app) {
        return (
            <div className="ta-page">
                <Breadcrumbs current="Заявка не найдена" />
                <h1 className="ta-page__title">Заявка {id} не найдена</h1>
                <Button onClick={() => navigate('/trainer-applications')}>К списку заявок</Button>
            </div>
        )
    }

    const days = trainerDaysLeft(app.date)
    const isActive = ['submitted', 'review', 'revision'].includes(app.status)

    const changeStatus = (newStatus) => {
        const upd = { ...app, status: newStatus }
        if (newStatus === 'registered' && !upd.certNumber) upd.certNumber = generateCertNumber()
        setApp(upd)
        toast(newStatus === 'registered' ? 'Свидетельство выдано (бессрочно)' : 'Статус обновлён')
    }

    return (
        <div className="ta-page">
            <Breadcrumbs current={`Заявка ${app.id}`} />
            <div style={sx.headRow}>
                <div>
                    <h1 className="ta-page__title" style={{ marginBottom: 6 }}>Заявка {app.id}</h1>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                        <StatusDot tone={STATUS_TONE[app.status] || 'gray'}>{t(TRAINER_STATUSES[app.status].labelKey)}</StatusDot>
                        {app.certNumber && (
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                Свидетельство <b style={{ fontFamily: 'monospace' }}>{app.certNumber}</b> · бессрочно
                            </span>
                        )}
                    </div>
                </div>
                <Button onClick={() => navigate('/trainer-applications')}>К списку заявок</Button>
            </div>

            {/* Срок рассмотрения */}
            {isActive && (
                <div style={{
                    ...sx.slaBox,
                    borderColor: days <= 0 ? '#fecaca' : days <= 3 ? '#fde68a' : 'var(--border-color)',
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={days <= 0 ? '#dc2626' : days <= 3 ? '#d97706' : 'var(--text-muted)'} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>
                    <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                        <b>{days > 0 ? `Осталось ${days} дн.` : 'Срок истёк'}</b>
                        <span style={{ color: 'var(--text-muted)' }}> из {TRAINER_DEADLINE_DAYS} календарных дней на рассмотрение</span>
                    </span>
                </div>
            )}

            <div style={sx.grid}>
                {/* Данные заявителя */}
                <div style={sx.card}>
                    <div style={sx.cardTitle}>{t('trainerApplications.sections.applicantData')}</div>
                    <table className="ta-drawer__info" style={{ width: '100%' }}>
                        <tbody>
                            <tr><td>{t('common.name')}</td><td>{app.name}</td></tr>
                            <tr><td>{t('fields.birthDate')}</td><td>{formatDateRu(app.birth)}</td></tr>
                            <tr><td>{t('fields.phone')}</td><td>{app.phone}</td></tr>
                            <tr><td>{t('fields.email')}</td><td>{app.email}</td></tr>
                            <tr><td>{t('fields.sport')}</td><td>{app.sport}</td></tr>
                            <tr><td>{t('trainerApplications.table.submitDate')}</td><td>{formatDateRu(app.date)}</td></tr>
                            <tr><td>{t('trainerApplications.passportViaTunduk')}</td><td>{app.tunduk ? 'Да' : 'Нет'}</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Документы + решение */}
                <div style={sx.card}>
                    <div style={sx.cardTitle}>{t('trainerApplications.sections.uploadedDocs')}</div>
                    <div className="ta-drawer__docs">
                        {TRAINER_DOC_LABEL_KEYS.map((labelKey, i) => (
                            <div key={labelKey} className={`ta-drawer__doc ${app.docs[i] ? 'ta-drawer__doc--ok' : 'ta-drawer__doc--no'}`}>
                                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: app.docs[i] ? '#16a34a' : '#ef4444' }} />
                                <span className="ta-drawer__doc-name">{t(labelKey)}</span>
                                {app.docs[i] === 1 && (
                                    <button className="ta-btn ta-btn--small" onClick={() => toast(`${t('common.view')}: ${t(labelKey)}`)}>
                                        {t('common.view')}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ ...sx.cardTitle, marginTop: 18 }}>Решение специалиста</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 10 }}>
                        Аттестационной комиссии нет — решение принимает специалист УРФКиМС (подтверждено 16.07.2026).
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button className="ta-btn ta-btn--green" onClick={() => changeStatus('registered')}>{t('trainerApplications.actions.register')}</button>
                        <button className="ta-btn ta-btn--orange" onClick={() => changeStatus('revision')}>{t('trainerApplications.actions.requestRevision')}</button>
                        <button className="ta-btn ta-btn--red" onClick={() => changeStatus('rejected')}>{t('trainerApplications.actions.reject')}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const sx = {
    headRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 14 },
    slaBox: {
        display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)',
        border: '1px solid var(--border-color)', borderRadius: 10, padding: '10px 14px', marginBottom: 16,
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, alignItems: 'start' },
    card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 20px' },
    cardTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 },
}
