import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { trainerAppsApi } from '../api/esport'

const SPORTS = [
    'Дзюдо', 'Бокс', 'Борьба', 'Тхэквондо', 'Каратэ', 'Лёгкая атлетика',
    'Плавание', 'Футбол', 'Баскетбол', 'Волейбол', 'Хоккей', 'Тяжёлая атлетика',
    'Стрельба', 'Фехтование', 'Гимнастика', 'Конный спорт', 'Кок-бору',
    'Шахматы', 'Теннис', 'Настольный теннис', 'Другой',
]

const DOC_FIELDS = [
    { key: 'passport', labelKey: 'public.docPassportLabel', hasTunduk: true, accept: '.pdf,.jpg,.jpeg,.png' },
    { key: 'diploma', labelKey: 'public.docDiplomaLabel', accept: '.pdf,.jpg,.jpeg,.png' },
    { key: 'sportRank', labelKey: 'public.docSportRankLabel', accept: '.pdf,.jpg,.jpeg,.png' },
    { key: 'noCriminal', labelKey: 'public.docNoCriminalLabel', accept: '.pdf,.jpg,.jpeg,.png' },
]

function generateAppNumber() {
    const d = new Date()
    const pad = (n, l = 2) => String(n).padStart(l, '0')
    return `TR-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

export default function PublicTrainerRegistration() {
    const { t } = useTranslation()

    const schema = yup.object().shape({
        inn: yup.string()
            .matches(/^\d{14}$/, t('validation.innFormat'))
            .required(t('validation.required')),
        lastName: yup.string().required(t('validation.required')),
        firstName: yup.string().required(t('validation.required')),
        middleName: yup.string(),
        birthDate: yup.string().required(t('validation.required')),
        phone: yup.string()
            .matches(/^\+996\d{9}$/, t('validation.phoneFormat'))
            .required(t('validation.required')),
        email: yup.string()
            .email(t('validation.emailFormat'))
            .required(t('validation.required')),
        sport: yup.string().required(t('validation.required')),
    })

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            inn: '', lastName: '', firstName: '', middleName: '',
            birthDate: '', phone: '', email: '', sport: ''
        }
    })

    const [docs, setDocs] = useState({
        passport: null, diploma: null, sportRank: null, noCriminal: null,
    })
    const [tunduk, setTunduk] = useState(false)
    const [dragOver, setDragOver] = useState(null)
    const [submitted, setSubmitted] = useState(null)
    const [sending, setSending] = useState(false)
    const fileRefs = useRef({})

    const handleFile = (key, file) => {
        if (!file) return
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            alert(t('public.fileSizeLimit'))
            return
        }
        setDocs(prev => ({ ...prev, [key]: file }))
    }

    const handleDrop = (key, e) => {
        e.preventDefault()
        setDragOver(null)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(key, file)
    }

    const removeFile = (key) => setDocs(prev => ({ ...prev, [key]: null }))

    const passportReady = tunduk || docs.passport !== null
    const allDocsReady = passportReady && docs.diploma && docs.sportRank && docs.noCriminal
    const canSubmit = allDocsReady && isValid

    const checklist = [
        { labelKey: 'public.docPassportLabel', done: passportReady },
        { labelKey: 'public.docDiplomaShort', done: !!docs.diploma },
        { labelKey: 'public.docSportRankShort', done: !!docs.sportRank },
        { labelKey: 'public.docNoCriminalLabel', done: !!docs.noCriminal },
        { labelKey: 'public.personalDataFilled', done: isValid },
    ]

    const onSubmit = async (data) => {
        if (!canSubmit || sending) return
        const name = `${data.lastName} ${data.firstName} ${data.middleName || ''}`.trim()
        let number = generateAppNumber()
        setSending(true)
        try {
            // Реальная подача в бэкенд: заявка попадает в очередь специалиста
            const created = await trainerAppsApi.create({
                applicantName: name,
                birthDate: data.birthDate || null,
                phone: data.phone,
                email: data.email,
                sport: data.sport,
            })
            if (created?.appNo) number = created.appNo
        } catch {
            // Демо-режим: бэкенд недоступен — локальный номер
        }
        setSending(false)
        setSubmitted({ number, date: new Date().toLocaleDateString('ru-RU'), name })
    }

    if (submitted) {
        return (
            <div className="pub-section">
                <div className="pub-container">
                    <div style={styles.successCard}>
                        <div style={styles.successIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                        <h2 style={styles.successTitle}>{t('public.applicationSubmitted')}</h2>
                        <div style={styles.successTable}>
                            <div style={styles.successRow}>
                                <span style={styles.successLabel}>{t('public.appNumber')}</span>
                                <span style={styles.successValue}>{submitted.number}</span>
                            </div>
                            <div style={styles.successRow}>
                                <span style={styles.successLabel}>{t('public.submissionDate')}</span>
                                <span style={styles.successValue}>{submitted.date}</span>
                            </div>
                            <div style={styles.successRow}>
                                <span style={styles.successLabel}>{t('public.applicantLabel')}</span>
                                <span style={styles.successValue}>{submitted.name}</span>
                            </div>
                            <div style={styles.successRow}>
                                <span style={styles.successLabel}>{t('public.status')}</span>
                                <span style={{ ...styles.statusBadge }}>{t('public.statusSubmitted')}</span>
                            </div>
                            <div style={styles.successRow}>
                                <span style={styles.successLabel}>{t('public.reviewTerm')}</span>
                                <span style={styles.successValue}>{t('public.reviewTerm15Days')}</span>
                            </div>
                        </div>
                        <p style={styles.successHint}>
                            {t('public.trackStatusHint')}{' '}
                            <Link to="/public/services" style={{ color: 'var(--pub-blue)' }}>{t('public.govServicesLink')}</Link>
                            {' '}{t('public.trackStatusSuffix')}
                        </p>
                        <Link to="/public" className="pub-login-btn" style={{ display: 'inline-block', marginTop: 16 }}>
                            {t('public.goHome')}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="pub-section">
            <div className="pub-container">
                {/* Page header */}
                <h2 className="pub-section__title">{t('public.trainerRegTitle')}</h2>

                {/* Info banner */}
                <div style={styles.infoBanner}>
                    <span style={styles.infoBannerIcon}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span>
                    <div>
                        <strong>{t('public.trainerRegInfoTerm')}</strong>
                        <br />
                        {t('public.trainerRegInfoBasis')}
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="pub-two-col" style={{ alignItems: 'start' }}>
                        {/* LEFT - Personal data */}
                        <div>
                            <h3 style={styles.colTitle}>{t('public.personalData')}</h3>

                            <div style={styles.field}>
                                <label style={styles.label}>{t('public.innLabel', 'ПИН (ИНН)')} <span style={styles.req}>*</span></label>
                                <input style={{...styles.input, ...(errors.inn ? {borderColor: '#d40029'} : {})}} placeholder="14 цифр" {...register('inn')} />
                                {errors.inn && <div style={styles.errorText}>{errors.inn.message}</div>}
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>{t('public.lastName')} <span style={styles.req}>*</span></label>
                                <input style={{...styles.input, ...(errors.lastName ? {borderColor: '#d40029'} : {})}} {...register('lastName')} />
                                {errors.lastName && <div style={styles.errorText}>{errors.lastName.message}</div>}
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>{t('public.firstName')} <span style={styles.req}>*</span></label>
                                <input style={{...styles.input, ...(errors.firstName ? {borderColor: '#d40029'} : {})}} {...register('firstName')} />
                                {errors.firstName && <div style={styles.errorText}>{errors.firstName.message}</div>}
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>{t('public.middleName')}</label>
                                <input style={{...styles.input, ...(errors.middleName ? {borderColor: '#d40029'} : {})}} {...register('middleName')} />
                                {errors.middleName && <div style={styles.errorText}>{errors.middleName.message}</div>}
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>{t('public.birthDate')} <span style={styles.req}>*</span></label>
                                <input style={{...styles.input, ...(errors.birthDate ? {borderColor: '#d40029'} : {})}} type="date" {...register('birthDate')} />
                                {errors.birthDate && <div style={styles.errorText}>{errors.birthDate.message}</div>}
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>{t('public.phone')} <span style={styles.req}>*</span></label>
                                <input style={{...styles.input, ...(errors.phone ? {borderColor: '#d40029'} : {})}} type="tel" placeholder="+996XXXXXXXXX" {...register('phone')} />
                                {errors.phone && <div style={styles.errorText}>{errors.phone.message}</div>}
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>{t('public.emailLabel')} <span style={styles.req}>*</span></label>
                                <input style={{...styles.input, ...(errors.email ? {borderColor: '#d40029'} : {})}} type="email" placeholder="email@example.com" {...register('email')} />
                                {errors.email && <div style={styles.errorText}>{errors.email.message}</div>}
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>{t('public.sportTypeLabel')} <span style={styles.req}>*</span></label>
                                <select style={{...styles.input, ...(errors.sport ? {borderColor: '#d40029'} : {})}} {...register('sport')}>
                                    <option value="">{t('public.selectSportPlaceholder')}</option>
                                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* RIGHT - Documents */}
                        <div>
                            <h3 style={styles.colTitle}>{t('public.documents')}</h3>

                            {DOC_FIELDS.map(doc => (
                                <div key={doc.key} style={styles.field}>
                                    <label style={styles.label}>
                                        {t(doc.labelKey)} <span style={styles.req}>*</span>
                                    </label>

                                    {doc.hasTunduk && (
                                        <label style={styles.tundukCheck}>
                                            <input
                                                type="checkbox"
                                                checked={tunduk}
                                                onChange={e => {
                                                    setTunduk(e.target.checked)
                                                    if (e.target.checked) setDocs(prev => ({ ...prev, passport: null }))
                                                }}
                                            />
                                            <span>{t('public.tundukGet')}</span>
                                        </label>
                                    )}

                                    {!(doc.hasTunduk && tunduk) ? (
                                        docs[doc.key] ? (
                                            <div style={styles.fileUploaded}>
                                                <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#16a34a', marginRight: 6 }} />{docs[doc.key].name}</span>
                                                <button type="button" onClick={() => removeFile(doc.key)} style={styles.removeBtn}>✕</button>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    ...styles.dropZone,
                                                    ...(dragOver === doc.key ? styles.dropZoneHover : {}),
                                                }}
                                                onDragOver={e => { e.preventDefault(); setDragOver(doc.key) }}
                                                onDragLeave={() => setDragOver(null)}
                                                onDrop={e => handleDrop(doc.key, e)}
                                                onClick={() => fileRefs.current[doc.key]?.click()}
                                            >
                                                <span style={styles.dropIcon}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></span>
                                                <span>{t('public.dragFileOrClick')}</span>
                                                <span style={styles.dropHint}>{t('public.fileHint')}</span>
                                                <input
                                                    ref={el => fileRefs.current[doc.key] = el}
                                                    type="file"
                                                    accept={doc.accept}
                                                    style={{ display: 'none' }}
                                                    onChange={e => handleFile(doc.key, e.target.files[0])}
                                                />
                                            </div>
                                        )
                                    ) : (
                                        <div style={styles.tundukActive}>
                                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#16a34a', marginRight: 6 }} />{t('public.tundukData')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Checklist */}
                    <div style={styles.checklistBox}>
                        <h3 style={styles.checklistTitle}>{t('public.completenessChecklist')}</h3>
                        <div style={styles.checklistGrid}>
                            {checklist.map(item => (
                                <div key={item.labelKey} style={styles.checklistItem}>
                                    <span style={{ color: item.done ? '#059669' : '#86868b', fontSize: 18 }}>
                                        {item.done ? <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} /> : <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#e5e5ea' }} />}
                                    </span>
                                    <span style={{ color: item.done ? 'var(--pub-text)' : 'var(--pub-text-muted)' }}>
                                        {t(item.labelKey)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <button
                            type="submit"
                            disabled={!canSubmit || sending}
                            className="pub-login-btn"
                            style={{
                                padding: '14px 48px',
                                fontSize: 16,
                                opacity: (canSubmit && !sending) ? 1 : 0.4,
                                cursor: (canSubmit && !sending) ? 'pointer' : 'not-allowed',
                            }}
                        >
                            {sending ? 'Отправка…' : t('public.submitApplication')}
                        </button>
                        {!canSubmit && (
                            <p style={{ marginTop: 8, fontSize: 12, color: 'var(--pub-text-muted)' }}>
                                {t('public.fillAllFieldsHint')}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

const styles = {
    infoBanner: {
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '16px 20px', marginBottom: 28,
        background: '#f5f5f7', border: '1px solid #000000',
        borderRadius: 12, fontSize: 14, color: '#1a1a1a', lineHeight: 1.6,
    },
    infoBannerIcon: { fontSize: 20, flexShrink: 0, marginTop: 2 },
    colTitle: {
        fontSize: 17, fontWeight: 700, color: 'var(--pub-text)',
        marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid var(--pub-border)',
    },
    field: { marginBottom: 16 },
    label: { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--pub-text-sec)', marginBottom: 6 },
    req: { color: '#d40029' },
    input: {
        width: '100%', padding: '10px 14px', border: '1px solid #d2d2d7',
        borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none',
        transition: 'border 0.2s', boxSizing: 'border-box',
    },
    dropZone: {
        border: '2px dashed #1a1a1a', borderRadius: 12, padding: '24px 16px',
        textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        fontSize: 13, color: '#6e6e73', background: 'var(--theme-bg-card)',
    },
    dropZoneHover: { background: '#f5f5f7', borderColor: '#1d4ed8' },
    dropIcon: { fontSize: 24 },
    dropHint: { fontSize: 11, color: 'var(--theme-text-secondary)' },
    fileUploaded: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px', background: '#F0FDF4', border: '1px solid #bbf7d0',
        borderRadius: 12, fontSize: 13, color: '#166534',
    },
    removeBtn: {
        background: 'none', border: 'none', fontSize: 16, cursor: 'pointer',
        color: 'var(--theme-text-secondary)', padding: '0 4px',
    },
    tundukCheck: {
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 13, color: '#6e6e73', marginBottom: 8, cursor: 'pointer',
    },
    tundukActive: {
        padding: '12px 14px', background: '#F0FDF4', border: '1px solid #bbf7d0',
        borderRadius: 12, fontSize: 13, color: '#166534',
    },
    errorText: {
        color: '#d40029',
        fontSize: 12,
        marginTop: 4,
    },
    checklistBox: {
        marginTop: 28, padding: '20px 24px',
        background: '#f5f5f7', border: '1px solid #d2d2d7', borderRadius: 10,
    },
    checklistTitle: { fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--pub-text)' },
    checklistGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' },
    checklistItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 },
    successCard: {
        maxWidth: 560, margin: '40px auto', padding: '36px 32px',
        background: 'var(--theme-bg-card)', border: '1px solid #d2d2d7', borderRadius: 16,
        textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    },
    successIcon: { fontSize: 56, marginBottom: 8 },
    successTitle: { fontSize: 24, fontWeight: 800, color: 'var(--pub-text)', marginBottom: 20 },
    successTable: {
        textAlign: 'left', background: '#f5f5f7', borderRadius: 12,
        padding: '16px 20px', marginBottom: 16,
    },
    successRow: {
        display: 'flex', justifyContent: 'space-between', padding: '8px 0',
        borderBottom: '1px solid #d2d2d7', fontSize: 14,
    },
    successLabel: { color: 'var(--theme-text-secondary)' },
    successValue: { fontWeight: 500, color: '#1a1a1a' },
    statusBadge: {
        display: 'inline-block', padding: '2px 12px', borderRadius: 16,
        background: '#dbeafe', color: '#1d4ed8', fontWeight: 700, fontSize: 13,
    },
    successHint: { fontSize: 13, color: '#6e6e73', lineHeight: 1.6 },
}
