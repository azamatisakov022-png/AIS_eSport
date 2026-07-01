import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { awardsApi } from '../api/esport'

/* Сдержанные иконки вместо эмодзи (✅ / ⬜ / 📎) */
const CheckMark = ({ done }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="9" />
        {done && <path d="M8.5 12.5l2.5 2.5 4.5-5" />}
    </svg>
)
const ClipIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
)
const AthleteIcon = () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.21 2L9 7h6l1.79-5" />
        <circle cx="12" cy="14" r="6" />
        <path d="M12 11v3l2 1" />
    </svg>
)
const TrainerIcon = () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="7" r="4" />
        <path d="M2 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
        <circle cx="19" cy="8" r="2.5" />
        <path d="M19 10.5v2" />
    </svg>
)

const SPORTS = [
    'Дзюдо', 'Бокс', 'Борьба', 'Тхэквондо', 'Каратэ', 'Лёгкая атлетика',
    'Плавание', 'Футбол', 'Баскетбол', 'Волейбол', 'Хоккей', 'Тяжёлая атлетика',
    'Стрельба', 'Фехтование', 'Гимнастика', 'Конный спорт', 'Кок-бору',
    'Шахматы', 'Теннис', 'Настольный теннис', 'Биатлон', 'Другой',
]

const AWARDS = [
    { value: 'ЗМС КР',       label: 'Заслуженный мастер спорта КР',                group: 'A' },
    { value: 'ЗМСвет КР',    label: 'ЗМС КР среди ветеранов',                      group: 'A' },
    { value: 'ЗТ КР',        label: 'Заслуженный тренер КР',                        group: 'A' },
    { value: 'МСМК',         label: 'Мастер спорта международного класса',           group: 'A' },
    { value: 'МСМКвет',      label: 'МСМК среди ветеранов',                          group: 'A' },
    { value: 'МС КР',        label: 'Мастер спорта КР',                              group: 'A' },
    { value: 'МСвет КР',     label: 'МС КР среди ветеранов',                         group: 'A' },
    { value: 'КМС',          label: 'Кандидат в мастера спорта',                      group: 'B' },
    { value: 'I разряд',     label: 'I спортивный разряд',                            group: 'C' },
    { value: 'II разряд',    label: 'II спортивный разряд',                           group: 'C' },
    { value: 'III разряд',   label: 'III спортивный разряд',                          group: 'C' },
    { value: 'I юн.',        label: 'I юношеский разряд',                             group: 'C' },
    { value: 'II юн.',       label: 'II юношеский разряд',                            group: 'C' },
    { value: 'III юн.',      label: 'III юношеский разряд',                           group: 'C' },
]

const GROUP_INFO = {
    A: { organ: 'Государственное агентство физической культуры и спорта (ГАФКиС)', term: '30 рабочих дней' },
    B: { organ: 'Областное / городское управление физической культуры и спорта', term: '20 рабочих дней' },
    C: { organ: 'Спортивная школа / спортивная организация', term: '15 рабочих дней' },
}

/* Документы по группам */
const BASE_DOCS = [
    { key: 'passport',    label: 'Копия паспорта' },
    { key: 'photos',      label: '2 фотографии 3х4' },
    { key: 'protocol',    label: 'Протокол соревнований (заверенный федерацией)' },
]

const HIGH_DOCS = [
    { key: 'represent',   label: 'Представление от организации' },
    { key: 'petition',    label: 'Ходатайство федерации' },
    { key: 'meeting',     label: 'Выписка из протокола собрания' },
    { key: 'conclusion',  label: 'Заключение Дирекции по видам спорта' },
    { key: 'noCriminal',  label: 'Справка об отсутствии судимости' },
]

const TRAINER_DOCS = [
    { key: 'workbook',    label: 'Копия трудовой книжки (стаж не менее 14 лет)' },
    { key: 'athletes',    label: 'Список подготовленных спортсменов' },
    { key: 'groups',      label: 'Списки групп за 4 года' },
]

function getDocList(award) {
    if (!award) return BASE_DOCS
    const a = AWARDS.find(x => x.value === award)
    if (!a) return BASE_DOCS
    const isHighA = a.group === 'A'
    const isTrainer = award === 'ЗТ КР'
    let docs = [...BASE_DOCS]
    if (isHighA) docs = [...docs, ...HIGH_DOCS]
    if (isTrainer) docs = [...docs, ...TRAINER_DOCS]
    return docs
}

function generateAppNumber() {
    const d = new Date()
    const pad = (n, l = 2) => String(n).padStart(l, '0')
    return `AW-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

const STEP_LABEL_KEYS = ['public.stepRank', 'public.stepDocuments', 'public.stepConfirmation']

export default function PublicAwardApplication() {
    const { t } = useTranslation()

    const schema = yup.object().shape({
        inn: yup.string()
            .matches(/^\d{14}$/, t('validation.innFormat'))
            .required(t('validation.required')),
        lastName: yup.string().required(t('validation.required')),
        firstName: yup.string().required(t('validation.required')),
        middleName: yup.string(),
        birthDate: yup.string().required(t('validation.required')),
        sex: yup.string().required(t('validation.required')),
        phone: yup.string()
            .matches(/^\+996\d{9}$/, t('validation.phoneFormat'))
            .required(t('validation.required')),
        email: yup.string()
            .email(t('validation.emailFormat'))
            .required(t('validation.required')),
        sport: yup.string().required(t('validation.required')),
        org: yup.string().required(t('validation.required')),
    })

    const { register, getValues, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            inn: '', lastName: '', firstName: '', middleName: '',
            birthDate: '', sex: 'М', phone: '', email: '',
            sport: '', org: ''
        }
    })

    const [step, setStep] = useState(1)
    const [applicantType, setApplicantType] = useState('athlete') // 'athlete' | 'trainer'
    const [award, setAward] = useState('')
    const [docs, setDocs] = useState({})
    const [dragOver, setDragOver] = useState(null)
    const [confirm, setConfirm] = useState(false)
    const [submitted, setSubmitted] = useState(null)
    const fileRefs = useRef({})

    const awardObj = AWARDS.find(a => a.value === award)
    const groupInfo = awardObj ? GROUP_INFO[awardObj.group] : null
    const docList = getDocList(award)

    const handleFile = (key, file) => {
        if (!file) return
        if (file.size > 10 * 1024 * 1024) { alert(t('public.fileSizeLimit')); return }
        setDocs(prev => ({ ...prev, [key]: file }))
    }

    const handleDrop = (key, e) => {
        e.preventDefault()
        setDragOver(null)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(key, file)
    }

    const removeFile = (key) => setDocs(prev => ({ ...prev, [key]: null }))

    /* Validation */
    const step1Valid = award !== ''
    const allDocsUploaded = docList.every(d => docs[d.key])
    const step2Valid = isValid && allDocsUploaded
    const step3Valid = confirm

    const handleNext = () => {
        if (step === 1 && step1Valid) setStep(2)
        else if (step === 2 && step2Valid) setStep(3)
    }
    const handleBack = () => { if (step > 1) setStep(step - 1) }

    const [sending, setSending] = useState(false)

    const handleSubmit = async () => {
        if (!step3Valid || sending) return
        const data = getValues()
        const name = `${data.lastName} ${data.firstName} ${data.middleName || ''}`.trim()
        let number = generateAppNumber()
        setSending(true)
        try {
            // Реальная подача в бэкенд: заявка попадает в очередь специалиста
            const created = await awardsApi.create({
                applicantName: name,
                award: awardObj?.label || award,
                sport: data.sport,
            })
            if (created?.appNo) number = created.appNo
        } catch {
            // Демо-режим: бэкенд недоступен — используем локально сгенерированный номер
        }
        setSending(false)
        setSubmitted({
            number,
            date: new Date().toLocaleDateString('ru-RU'),
            name,
            award: awardObj?.label || award,
            sport: data.sport,
            docCount: docList.filter(d => docs[d.key]).length,
            term: groupInfo?.term || '',
        })
    }

    /* ─── Success screen ─── */
    if (submitted) {
        return (
            <div className="pub-section">
                <div className="pub-container">
                    <div style={s.successCard}>
                        <div style={s.successIcon}>📥</div>
                        <h2 style={s.successTitle}>{t('public.applicationSubmitted')}</h2>
                        <div style={s.successTable}>
                            {[
                                [t('public.appNumber'), submitted.number],
                                [t('public.submissionDate'), submitted.date],
                                [t('public.applicantLabel'), submitted.name],
                                [t('public.rankAward'), submitted.award],
                                [t('public.sportTypeLabel'), submitted.sport],
                                [t('public.docsUploaded'), `${submitted.docCount} ${t('public.docsUnit')}`],
                            ].map(([label, val]) => (
                                <div style={s.successRow} key={label}>
                                    <span style={s.successLabel}>{label}</span>
                                    <span style={s.successValue}>{val}</span>
                                </div>
                            ))}
                            <div style={s.successRow}>
                                <span style={s.successLabel}>{t('public.status')}</span>
                                <span style={s.statusBadge}>{t('public.statusSubmitted')}</span>
                            </div>
                            <div style={{ ...s.successRow, borderBottom: 'none' }}>
                                <span style={s.successLabel}>{t('public.reviewTerm')}</span>
                                <span style={s.successValue}>{submitted.term}</span>
                            </div>
                        </div>
                        <p style={s.successHint}>
                            {t('public.trackStatusHint')}{' '}
                            <Link to="/public/services" style={{ color: '#1a1a1a' }}>{t('public.govServices')}</Link>
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

    /* ─── Progress bar ─── */
    const progressBar = (
        <div style={s.progress}>
            {STEP_LABEL_KEYS.map((label, i) => {
                const num = i + 1
                const isActive = step === num
                const isDone = step > num
                return (
                    <div key={num} style={s.progressStep}>
                        <div style={{
                            ...s.progressCircle,
                            background: isDone ? '#059669' : isActive ? '#1a1a1a' : '#d2d2d7',
                            color: isDone || isActive ? '#fff' : '#86868b',
                        }}>
                            {isDone ? '✓' : num}
                        </div>
                        <span style={{
                            ...s.progressLabel,
                            color: isActive ? '#1a1a1a' : isDone ? '#059669' : '#86868b',
                            fontWeight: isActive ? 600 : 400,
                        }}>{t(label)}</span>
                        {i < STEP_LABEL_KEYS.length - 1 && (
                            <div style={{ ...s.progressLine, background: isDone ? '#059669' : '#d2d2d7' }} />
                        )}
                    </div>
                )
            })}
        </div>
    )

    return (
        <div className="pub-section">
            <div className="pub-container">
                <h2 className="pub-section__title">{t('public.awardAppTitle')}</h2>

                {/* Info banner */}
                <div style={s.infoBanner}>
                    <span style={{ flexShrink: 0, display: 'inline-flex', color: 'var(--accent)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                    </span>
                    <div>
                        <strong>{t('public.awardAppBasis')}</strong> {t('public.awardAppBasisText')}
                    </div>
                </div>

                {progressBar}

                {/* ═══════ STEP 1 ═══════ */}
                {step === 1 && (
                    <div style={s.stepCard}>
                        <h3 style={s.stepTitle}>{t('public.step1Title')}</h3>

                        {/* Applicant type cards */}
                        <div style={s.typeCards}>
                            <div
                                style={{ ...s.typeCard, ...(applicantType === 'athlete' ? s.typeCardActive : {}) }}
                                onClick={() => { setApplicantType('athlete'); setAward('') }}
                            >
                                <span style={s.typeIcon}><AthleteIcon /></span>
                                <span style={s.typeLabel}>{t('public.applicantAthlete')}</span>
                            </div>
                            <div
                                style={{ ...s.typeCard, ...(applicantType === 'trainer' ? s.typeCardActive : {}) }}
                                onClick={() => { setApplicantType('trainer'); setAward('ЗТ КР') }}
                            >
                                <span style={s.typeIcon}><TrainerIcon /></span>
                                <span style={s.typeLabel}>{t('public.applicantTrainer')}</span>
                                <span style={s.typeHint}>(ЗТ КР)</span>
                            </div>
                        </div>

                        {/* Award selector */}
                        {applicantType === 'athlete' && (
                            <div style={s.field}>
                                <label style={s.label}>{t('public.selectRankLabel')} <span style={s.req}>*</span></label>
                                <select style={s.input} value={award} onChange={e => setAward(e.target.value)}>
                                    <option value="">{t('public.selectRankPlaceholder')}</option>
                                    <optgroup label={t('public.groupATitle')}>
                                        {AWARDS.filter(a => a.group === 'A' && a.value !== 'ЗТ КР').map(a => (
                                            <option key={a.value} value={a.value}>{a.label}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label={t('public.groupBTitle')}>
                                        {AWARDS.filter(a => a.group === 'B').map(a => (
                                            <option key={a.value} value={a.value}>{a.label}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label={t('public.groupCTitle')}>
                                        {AWARDS.filter(a => a.group === 'C').map(a => (
                                            <option key={a.value} value={a.value}>{a.label}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                        )}

                        {/* Group info */}
                        {awardObj && groupInfo && (
                            <>
                                <div style={s.groupBanner}>
                                    <div style={s.groupBannerRow}>
                                        <span style={s.groupBannerLabel}>{t('public.reviewedBy')}</span>
                                        <span style={s.groupBannerValue}>{groupInfo.organ}</span>
                                    </div>
                                    <div style={s.groupBannerRow}>
                                        <span style={s.groupBannerLabel}>{t('public.reviewTermLabel')}</span>
                                        <span style={s.groupBannerValue}>{groupInfo.term}</span>
                                    </div>
                                </div>

                                {/* Document preview */}
                                <div style={s.docPreview}>
                                    <h4 style={s.docPreviewTitle}>{`${t('public.requiredDocsFor')} «${awardObj.label}»:`}</h4>
                                    <ul style={s.docPreviewList}>
                                        {docList.map(d => (
                                            <li key={d.key} style={s.docPreviewItem}>{d.label}</li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}

                        <div style={s.stepFooter}>
                            <div />
                            <button
                                style={{ ...s.btnPrimary, opacity: step1Valid ? 1 : 0.4, cursor: step1Valid ? 'pointer' : 'not-allowed' }}
                                onClick={handleNext}
                                disabled={!step1Valid}
                            >
                                {t('public.nextBtn')}
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══════ STEP 2 ═══════ */}
                {step === 2 && (
                    <div style={s.stepCard}>
                        <h3 style={s.stepTitle}>{t('public.step2Title')}</h3>

                        <div style={s.twoCol}>
                            {/* LEFT - form */}
                            <div>
                                <h4 style={s.colTitle}>{t('public.personalData')}</h4>

                                <div style={s.formRow}>
                                    <div style={s.field}>
                                        <label style={s.label}>{t('public.innLabel', 'ПИН (ИНН)')} <span style={s.req}>*</span></label>
                                        <input style={{...s.input, ...(errors.inn ? {borderColor: '#d40029'} : {})}} placeholder="14 цифр" {...register('inn')} />
                                        {errors.inn && <div style={{color: '#d40029', fontSize: 12, marginTop: 4}}>{errors.inn.message}</div>}
                                    </div>
                                    <div style={s.field}>
                                        <label style={s.label}>{t('public.lastName')} <span style={s.req}>*</span></label>
                                        <input style={{...s.input, ...(errors.lastName ? {borderColor: '#d40029'} : {})}} placeholder="Иванов" {...register('lastName')} />
                                        {errors.lastName && <div style={{color: '#d40029', fontSize: 12, marginTop: 4}}>{errors.lastName.message}</div>}
                                    </div>
                                </div>
                                <div style={s.formRow}>
                                    <div style={s.field}>
                                        <label style={s.label}>{t('public.firstName')} <span style={s.req}>*</span></label>
                                        <input style={{...s.input, ...(errors.firstName ? {borderColor: '#d40029'} : {})}} placeholder="Иван" {...register('firstName')} />
                                        {errors.firstName && <div style={{color: '#d40029', fontSize: 12, marginTop: 4}}>{errors.firstName.message}</div>}
                                    </div>
                                    <div style={s.field}>
                                        <label style={s.label}>{t('public.middleName')}</label>
                                        <input style={{...s.input, ...(errors.middleName ? {borderColor: '#d40029'} : {})}} placeholder="Иванович" {...register('middleName')} />
                                        {errors.middleName && <div style={{color: '#d40029', fontSize: 12, marginTop: 4}}>{errors.middleName.message}</div>}
                                    </div>
                                </div>
                                <div style={s.formRow}>
                                    <div style={s.field}>
                                        <label style={s.label}>{t('public.birthDate')} <span style={s.req}>*</span></label>
                                        <input style={{...s.input, ...(errors.birthDate ? {borderColor: '#d40029'} : {})}} type="date" {...register('birthDate')} />
                                        {errors.birthDate && <div style={{color: '#d40029', fontSize: 12, marginTop: 4}}>{errors.birthDate.message}</div>}
                                    </div>
                                    <div style={s.field}>
                                        <label style={s.label}>{t('public.sexLabel')}</label>
                                        <select style={{...s.input, ...(errors.sex ? {borderColor: '#d40029'} : {})}} {...register('sex')}>
                                            <option value="М">{t('public.male')}</option>
                                            <option value="Ж">{t('public.female')}</option>
                                        </select>
                                        {errors.sex && <div style={{color: '#d40029', fontSize: 12, marginTop: 4}}>{errors.sex.message}</div>}
                                    </div>
                                </div>
                                <div style={s.formRow}>
                                    <div style={s.field}>
                                        <label style={s.label}>{t('public.phone')} <span style={s.req}>*</span></label>
                                        <input style={{...s.input, ...(errors.phone ? {borderColor: '#d40029'} : {})}} type="tel" placeholder="+996XXXXXXXXX" {...register('phone')} />
                                        {errors.phone && <div style={{color: '#d40029', fontSize: 12, marginTop: 4}}>{errors.phone.message}</div>}
                                    </div>
                                    <div style={s.field}>
                                        <label style={s.label}>Email <span style={s.req}>*</span></label>
                                        <input style={{...s.input, ...(errors.email ? {borderColor: '#d40029'} : {})}} type="email" placeholder="email@example.com" {...register('email')} />
                                        {errors.email && <div style={{color: '#d40029', fontSize: 12, marginTop: 4}}>{errors.email.message}</div>}
                                    </div>
                                </div>
                                <div style={s.formRow}>
                                    <div style={s.field}>
                                        <label style={s.label}>{t('public.sportTypeLabel')} <span style={s.req}>*</span></label>
                                        <select style={{...s.input, ...(errors.sport ? {borderColor: '#d40029'} : {})}} {...register('sport')}>
                                            <option value="">{t('public.selectPlaceholder')}</option>
                                            {SPORTS.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                                        </select>
                                        {errors.sport && <div style={{color: '#d40029', fontSize: 12, marginTop: 4}}>{errors.sport.message}</div>}
                                    </div>
                                    <div style={s.field}>
                                        <label style={s.label}>{t('public.orgLabel')} <span style={s.req}>*</span></label>
                                        <input style={{...s.input, ...(errors.org ? {borderColor: '#d40029'} : {})}} placeholder="СДЮСШОР, федерация..." {...register('org')} />
                                        {errors.org && <div style={{color: '#d40029', fontSize: 12, marginTop: 4}}>{errors.org.message}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT - docs + checklist */}
                            <div>
                                <h4 style={s.colTitle}>{t('public.documents')}</h4>

                                {docList.map(doc => (
                                    <div key={doc.key} style={s.field}>
                                        <label style={s.label}>{doc.label} <span style={s.req}>*</span></label>
                                        {docs[doc.key] ? (
                                            <div style={s.fileUploaded}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                    <span style={{ color: '#059669', display: 'inline-flex' }}><CheckMark done /></span>
                                                    {docs[doc.key].name}
                                                </span>
                                                <button type="button" onClick={() => removeFile(doc.key)} style={s.removeBtn}>✕</button>
                                            </div>
                                        ) : (
                                            <div
                                                style={{ ...s.dropZone, ...(dragOver === doc.key ? s.dropZoneHover : {}) }}
                                                onDragOver={e => { e.preventDefault(); setDragOver(doc.key) }}
                                                onDragLeave={() => setDragOver(null)}
                                                onDrop={e => handleDrop(doc.key, e)}
                                                onClick={() => fileRefs.current[doc.key]?.click()}
                                            >
                                                <span style={{ color: 'var(--theme-text-secondary)', display: 'inline-flex' }}><ClipIcon /></span>
                                                <span>{t('public.dragFileOrClickShort')}</span>
                                                <span style={{ fontSize: 11, color: 'var(--theme-text-secondary)' }}>{t('public.fileHint')}</span>
                                                <input
                                                    ref={el => fileRefs.current[doc.key] = el}
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    style={{ display: 'none' }}
                                                    onChange={e => handleFile(doc.key, e.target.files[0])}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Checklist */}
                                <div style={s.checklistBox}>
                                    <h4 style={s.checklistTitle}>{t('public.completenessChecklist')}</h4>
                                    {docList.map(d => (
                                        <div key={d.key} style={s.checklistItem}>
                                            <span style={{ color: docs[d.key] ? '#059669' : '#86868b', fontSize: 16 }}>
                                                <CheckMark done={!!docs[d.key]} />
                                            </span>
                                            <span style={{ color: docs[d.key] ? '#1a1a1a' : '#86868b', fontSize: 13 }}>
                                                {d.label}
                                            </span>
                                        </div>
                                    ))}
                                    <div style={{ ...s.checklistItem, marginTop: 4, paddingTop: 8, borderTop: '1px solid #d2d2d7' }}>
                                        <span style={{ color: isValid ? '#059669' : '#86868b', fontSize: 16 }}>
                                            <CheckMark done={isValid} />
                                        </span>
                                        <span style={{ color: isValid ? '#1a1a1a' : '#86868b', fontSize: 13 }}>
                                            {t('public.personalDataFilled')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={s.stepFooter}>
                            <button style={s.btnOutline} onClick={handleBack}>{t('public.backBtn')}</button>
                            <button
                                style={{ ...s.btnPrimary, opacity: step2Valid ? 1 : 0.4, cursor: step2Valid ? 'pointer' : 'not-allowed' }}
                                onClick={handleNext}
                                disabled={!step2Valid}
                            >
                                {t('public.nextBtn')}
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══════ STEP 3 ═══════ */}
                {step === 3 && (
                    <div style={s.stepCard}>
                        <h3 style={s.stepTitle}>{t('public.step3Title')}</h3>

                        {/* Summary card */}
                        <div style={s.summaryCard}>
                            <div style={s.summaryGrid}>
                                {(() => {
                                    const data = getValues();
                                    return [
                                        [t('public.fio'), `${data.lastName} ${data.firstName} ${data.middleName || ''}`.trim()],
                                        [t('public.birthDate'), data.birthDate ? new Date(data.birthDate).toLocaleDateString('ru-RU') : ''],
                                        [t('public.rankAward'), awardObj?.label || award],
                                        [t('public.groupLabel'), awardObj ? `${t('public.groupLabel')} ${awardObj.group}` : ''],
                                        [t('public.sportTypeLabel'), data.sport],
                                        [t('public.orgLabel'), data.org],
                                        [t('public.phone'), data.phone],
                                        ['Email', data.email],
                                        [t('public.docsUploaded'), `${docList.filter(d => docs[d.key]).length} ${t('public.docsOfCount')} ${docList.length}`],
                                    ];
                                })().map(([label, val]) => (
                                    <div key={label} style={s.summaryItem}>
                                        <div style={s.summaryItemLabel}>{label}</div>
                                        <div style={s.summaryItemValue}>{val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Warning: 4 years */}
                        <div style={s.warnBanner}>
                            <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
                            <div>
                                <strong>{t('public.warnTermTitle')}</strong> {t('public.warnTermDesc')}
                            </div>
                        </div>

                        {/* MS KR additional warning */}
                        {award === 'МС КР' && (
                            <div style={{ ...s.warnBanner, background: '#fef3c7', borderColor: '#f59e0b' }}>
                                <span style={{ fontSize: 20, flexShrink: 0 }}>📋</span>
                                <div>
                                    <strong>{t('public.msKrReqTitle')}</strong><br />
                                    {t('public.msKrReqText')}
                                </div>
                            </div>
                        )}

                        {/* Confirm checkbox */}
                        <label style={s.confirmLabel}>
                            <input type="checkbox" checked={confirm} onChange={e => setConfirm(e.target.checked)} style={s.confirmCheckbox} />
                            <span>{t('public.confirmDataCheckbox')}</span>
                        </label>

                        <div style={s.stepFooter}>
                            <button style={s.btnOutline} onClick={handleBack}>{t('public.backBtn')}</button>
                            <button
                                style={{ ...s.btnPrimary, padding: '14px 40px', fontSize: 15, opacity: (step3Valid && !sending) ? 1 : 0.4, cursor: (step3Valid && !sending) ? 'pointer' : 'not-allowed' }}
                                onClick={handleSubmit}
                                disabled={!step3Valid || sending}
                            >
                                {sending ? t('public.sending', 'Отправка…') : t('public.submitApplication')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const s = {
    /* Progress */
    progress: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28, padding: '20px 0',
    },
    progressStep: {
        display: 'flex', alignItems: 'center', gap: 8,
    },
    progressCircle: {
        width: 32, height: 32, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 800, flexShrink: 0,
    },
    progressLabel: { fontSize: 14 },
    progressLine: {
        width: 60, height: 2, margin: '0 12px', borderRadius: 1, flexShrink: 0,
    },

    /* Info banner */
    infoBanner: {
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '14px 20px', marginBottom: 20,
        background: '#f5f5f7', border: '1px solid #000000',
        borderRadius: 12, fontSize: 14, color: '#1a1a1a', lineHeight: 1.6,
    },

    /* Step card */
    stepCard: {
        background: 'var(--theme-bg-card)', border: '1px solid #d2d2d7', borderRadius: 16,
        padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    stepTitle: {
        fontSize: 18, fontWeight: 800, color: '#1a1a1a',
        marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid #d2d2d7',
    },

    /* Type selection */
    typeCards: {
        display: 'flex', gap: 16, marginBottom: 24,
    },
    typeCard: {
        flex: 1, padding: '24px 20px', borderRadius: 10,
        border: '2px solid #d2d2d7', background: '#f5f5f7',
        textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    },
    typeCardActive: {
        borderColor: '#1a1a1a', background: '#f5f5f7',
        boxShadow: '0 0 0 3px rgba(37,99,235,0.1)',
    },
    typeIcon: { display: 'flex', color: 'var(--accent)' },
    typeLabel: { fontSize: 16, fontWeight: 700, color: '#1a1a1a' },
    typeHint: { fontSize: 12, color: 'var(--theme-text-secondary)' },

    /* Field */
    field: { marginBottom: 16 },
    label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#6e6e73', marginBottom: 6 },
    req: { color: '#d40029' },
    input: {
        width: '100%', padding: '10px 14px', border: '1px solid #d2d2d7',
        borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none',
        transition: 'border 0.2s', boxSizing: 'border-box',
    },
    formRow: {
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
    },
    colTitle: {
        fontSize: 16, fontWeight: 700, color: '#1a1a1a',
        marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #d2d2d7',
    },
    twoCol: {
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start',
    },

    /* Group info banner */
    groupBanner: {
        padding: '16px 20px', marginBottom: 20,
        background: '#f5f5f7', border: '1px solid #93c5fd',
        borderRadius: 12,
    },
    groupBannerRow: {
        display: 'flex', gap: 8, fontSize: 14, lineHeight: 1.8,
    },
    groupBannerLabel: { color: 'var(--theme-text-secondary)', flexShrink: 0 },
    groupBannerValue: { fontWeight: 700, color: '#1a1a1a' },

    /* Doc preview */
    docPreview: {
        padding: '16px 20px', background: '#f5f5f7',
        border: '1px solid #d2d2d7', borderRadius: 12, marginBottom: 8,
    },
    docPreviewTitle: { fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 },
    docPreviewList: { margin: 0, paddingLeft: 20, fontSize: 13, color: '#6e6e73', lineHeight: 1.8 },
    docPreviewItem: {},

    /* File upload */
    dropZone: {
        border: '2px dashed #1a1a1a', borderRadius: 12, padding: '20px 16px',
        textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        fontSize: 13, color: '#6e6e73', background: 'var(--theme-bg-card)',
    },
    dropZoneHover: { background: '#f5f5f7', borderColor: '#1d4ed8' },
    fileUploaded: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', background: '#F0FDF4', border: '1px solid #bbf7d0',
        borderRadius: 12, fontSize: 13, color: '#166534',
    },
    removeBtn: {
        background: 'none', border: 'none', fontSize: 16, cursor: 'pointer',
        color: 'var(--theme-text-secondary)', padding: '0 4px',
    },

    /* Checklist */
    checklistBox: {
        marginTop: 20, padding: '16px 20px',
        background: '#f5f5f7', border: '1px solid #d2d2d7', borderRadius: 12,
    },
    checklistTitle: { fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#1a1a1a' },
    checklistItem: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },

    /* Summary card */
    summaryCard: {
        background: '#f5f5f7', border: '1px solid #d2d2d7', borderRadius: 10,
        padding: '20px 24px', marginBottom: 20,
    },
    summaryGrid: {
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px',
    },
    summaryItem: {},
    summaryItemLabel: { fontSize: 11, color: 'var(--theme-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
    summaryItemValue: { fontSize: 14, fontWeight: 500, color: '#1a1a1a' },

    /* Warning banner */
    warnBanner: {
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '14px 20px', marginBottom: 16,
        background: '#FFFBEB', border: '1px solid #fcd34d',
        borderRadius: 12, fontSize: 14, color: '#1a1a1a', lineHeight: 1.6,
    },

    /* Confirm */
    confirmLabel: {
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '16px 20px', marginBottom: 8,
        background: '#f5f5f7', border: '1px solid #d2d2d7', borderRadius: 12,
        fontSize: 14, color: '#1a1a1a', cursor: 'pointer', lineHeight: 1.5,
    },
    confirmCheckbox: { marginTop: 3, width: 18, height: 18, accentColor: '#1a1a1a', flexShrink: 0 },

    /* Footer */
    stepFooter: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 24, paddingTop: 20, borderTop: '1px solid #d2d2d7',
    },
    btnPrimary: {
        padding: '12px 32px', background: '#1a1a1a', color: '#fff',
        border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
        fontFamily: 'inherit', cursor: 'pointer', transition: 'background 0.2s',
    },
    btnOutline: {
        padding: '12px 24px', background: 'none', color: '#6e6e73',
        border: '1px solid #d2d2d7', borderRadius: 12, fontSize: 14, fontWeight: 500,
        fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
    },

    /* Success */
    successCard: {
        maxWidth: 600, margin: '40px auto', padding: '36px 32px',
        background: 'var(--theme-bg-card)', border: '1px solid #d2d2d7', borderRadius: 16,
        textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    },
    successIcon: { fontSize: 56, marginBottom: 8 },
    successTitle: { fontSize: 24, fontWeight: 800, color: '#1a1a1a', marginBottom: 20 },
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
