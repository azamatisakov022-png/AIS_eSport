import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { awardsApi } from '../api/esport'
import Breadcrumbs from '../components/Breadcrumbs'
import './ApplicationReview.css'

// Подписи и стиль кнопок для каждого целевого статуса (зеркало статусной машины бэкенда)
const ACTIONS = {
    'Проверка комплектности':   { label: 'Взять на проверку', cls: 'ar-btn--outline' },
    'На рассмотрении':          { label: 'Документы приняты — на рассмотрение', cls: 'ar-btn--green' },
    'На доработке':             { label: 'Вернуть на доработку', cls: 'ar-btn--orange', needReason: true },
    'Одобрено':                 { label: 'Одобрить', cls: 'ar-btn--green' },
    'Ожидание решения Кабмина': { label: 'Передать в Кабинет Министров', cls: 'ar-btn--green' },
    'Приказ подписан':          { label: 'Подписать приказ (директор, ЭЦП)', cls: 'ar-btn--green' },
    'Присвоено':                { label: 'Звание присвоено', cls: 'ar-btn--green' },
    'Отклонена':                { label: 'Отказать (директор)', cls: 'ar-btn--red', needReason: true },
    'Отозвана':                 { label: 'Отозвать', cls: 'ar-btn--outline' },
}

// Hardcoded mock data to simulate DB
const MOCK = [
    { id: 1,  appNo: 'AW-20260225-094512', name: 'Асанов Бакыт Маратович',         award: 'МС КР',    sport: 'Дзюдо',            submitDate: '2026-02-25', status: 'На рассмотрении', docsUploaded: 8, docsTotal: 8 },
    { id: 2,  appNo: 'AW-20260301-112033', name: 'Кулматова Айгерим Сагынбековна',  award: 'КМС',      sport: 'Лёгкая атлетика',  submitDate: '2026-03-01', status: 'Подана',           docsUploaded: 3, docsTotal: 3 },
    { id: 3,  appNo: 'AW-20260210-083045', name: 'Джумабаев Эрлан Калыкович',       award: 'ЗМС КР',   sport: 'Бокс',             submitDate: '2026-02-10', status: 'На рассмотрении', docsUploaded: 8, docsTotal: 8 },
]

function awardGroup(award) {
    if (!award) return 'C'
    const u = award.toUpperCase()
    if (u.includes('КМС') || u.includes('КАНДИДАТ')) return 'B'
    if (u.includes('ЗАСЛУЖЕНН') || u.includes('ЗМС') || u.includes('ЗТ')
        || u.includes('МСМК') || u.includes('МАСТЕР СПОРТА') || u.includes('МС КР')
        || u.includes('МСВЕТ')) return 'A'
    return 'C'
}

const BASE_DOCS = ['Копия паспорта', '2 фотографии 3х4', 'Протокол соревнований']
const HIGH_DOCS = ['Представление от организации', 'Ходатайство федерации', 'Выписка из протокола', 'Заключение Дирекции', 'Справка об отсутствии судимости']
const TRAINER_DOCS = ['Копия трудовой книжки', 'Список спортсменов', 'Списки групп за 4 года']

function getDocList(award) {
    const g = awardGroup(award)
    let docs = [...BASE_DOCS]
    if (g === 'A') docs = [...docs, ...HIGH_DOCS]
    if (award === 'ЗТ КР') docs = [...docs, ...TRAINER_DOCS]
    return docs
}

function fmt(dateStr) { return new Date(dateStr).toLocaleDateString('ru-RU') }

// Generic Document placeholder image (to simulate document preview)
const DOC_PLACEHOLDER = "https://placehold.co/600x800/e2e8f0/475569?text=PDF+Document"

export default function ApplicationReview() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const toast = useToast()

    const [activeDoc, setActiveDoc] = useState(null)
    const [conclusion, setConclusion] = useState('')
    const [busy, setBusy] = useState(false)
    const [app, setApp] = useState(() => MOCK.find(a => a.id === Number(id)) || MOCK[0])

    // Загрузка заявки из бэкенда (с фолбэком на демо-данные)
    useEffect(() => {
        let alive = true
        awardsApi.get(id)
            .then(a => {
                if (!alive) return
                setApp({
                    id: a.id,
                    appNo: a.appNo,
                    name: a.applicantName || a.athleteName || '—',
                    award: a.award,
                    sport: a.sport || '—',
                    submitDate: a.submitDate,
                    status: a.status,
                    docsUploaded: a.docsUploaded ?? 0,
                    docsTotal: a.docsTotal ?? 0,
                    group: a.awardGroup,
                    routingLevel: a.routingLevel,
                    routingBody: a.routingBody,
                    track: a.track,
                    trackLabel: a.trackLabel,
                    nextStatuses: a.nextStatuses || [],
                    athleteName: a.athleteName,
                    history: a.history || [],
                    _live: true,
                })
            })
            .catch(() => { /* остаёмся на демо-данных */ })
        return () => { alive = false }
    }, [id])

    const group = awardGroup(app.award)
    const docs = getDocList(app.award)
    const transitions = app.nextStatuses || []

    const handleAction = async (target) => {
        const cfg = ACTIONS[target] || {}
        if (cfg.needReason && !conclusion.trim()) {
            toast('Пожалуйста, укажите причину в поле «Заключение / Причина»')
            return
        }
        if (!app._live) {
            toast('Демо-режим: бэкенд недоступен, действие не сохранено')
            setTimeout(() => navigate('/award-applications'), 1200)
            return
        }
        setBusy(true)
        try {
            await awardsApi.changeStatus(app.id, target, conclusion.trim() || undefined)
            toast(target === 'Присвоено'
                ? 'Звание присвоено — внесено в карточку спортсмена в реестре'
                : `Статус изменён: ${target}`)
            setTimeout(() => navigate('/award-applications'), 1200)
        } catch (e) {
            toast(e.message || 'Не удалось изменить статус')
            setBusy(false)
        }
    }

    return (
        <div className="ar-page">
            <Breadcrumbs current={`Ревью: ${app.appNo}`} />
            
            <div className="ar-header">
                <div>
                    <h1 className="ar-header__title">{t('awardApplications.drawerTabs.application')} {app.appNo}</h1>
                    <div className="ar-header__badges">
                        <span className="aw-badge aw-badge--yellow">{app.status}</span>
                        <span className={`aw-group aw-group--${group.toLowerCase()}`}>{t(`awardApplications.groups.${group}`)}</span>
                    </div>
                </div>
                <div className="ar-header__actions">
                    <button className="ar-btn ar-btn--outline" onClick={() => navigate('/award-applications')}>
                        {t('common.cancel')}
                    </button>
                    <button className="ar-btn ar-btn--outline" onClick={() => toast('Открыт чат с заявителем')}>
                        💬 Написать заявителю
                    </button>
                </div>
            </div>

            <div className="ar-split">
                {/* Left Pane: Information & Documents */}
                <div className="ar-pane">
                    <div className="ar-pane-header">
                        Информация о заявке
                    </div>
                    <div className="ar-pane-content">
                        <div className="ar-info-grid">
                            <div className="ar-info-item">
                                <div className="ar-info-item__label">{t('common.name')}</div>
                                <div className="ar-info-item__value">{app.name}</div>
                            </div>
                            <div className="ar-info-item">
                                <div className="ar-info-item__label">{t('awardApplications.drawer.requestedRank')}</div>
                                <div className="ar-info-item__value">{app.award}</div>
                            </div>
                            <div className="ar-info-item">
                                <div className="ar-info-item__label">{t('fields.sport')}</div>
                                <div className="ar-info-item__value">{app.sport}</div>
                            </div>
                            <div className="ar-info-item">
                                <div className="ar-info-item__label">{t('awardApplications.drawer.submitDate')}</div>
                                <div className="ar-info-item__value">{fmt(app.submitDate)}</div>
                            </div>
                        </div>

                        {app.routingLevel && (
                            <div style={{ marginTop: 20, padding: '14px 16px', background: '#f1f5f9', borderRadius: 10, borderLeft: '3px solid #2563EB' }}>
                                <div className="ar-info-item__label">Маршрут присвоения</div>
                                <div className="ar-info-item__value" style={{ fontWeight: 700 }}>{app.routingLevel}</div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{app.routingBody}</div>
                                {app.trackLabel && (
                                    <div style={{ fontSize: 12, color: '#2563EB', marginTop: 6, fontWeight: 600 }}>
                                        Порядок: {app.trackLabel}
                                    </div>
                                )}
                            </div>
                        )}

                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px', color: '#1a1a1a' }}>Приложенные документы ({app.docsUploaded}/{app.docsTotal})</h3>
                        <div className="ar-doc-list">
                            {docs.map((doc, i) => {
                                const ok = i < app.docsUploaded
                                const isActive = activeDoc === doc
                                return (
                                    <div 
                                        key={doc} 
                                        className={`ar-doc-card ${ok ? 'ar-doc-card--ok' : 'ar-doc-card--no'} ${isActive ? 'ar-doc-card--active' : ''}`}
                                        onClick={() => ok && setActiveDoc(doc)}
                                    >
                                        <div>
                                            <div className="ar-doc-card__name">{doc}</div>
                                            <div className="ar-doc-card__meta">{ok ? 'Загружено • 1.2 MB' : 'Не загружено'}</div>
                                        </div>
                                        {ok && <span style={{ color: isActive ? '#2563EB' : '#86868b' }}>👁️</span>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Pane: Document Viewer & Decision */}
                <div className="ar-pane ar-pane--right">
                    <div className="ar-pane-header">
                        <span>Просмотр документа</span>
                        {activeDoc && (
                            <button className="ar-btn ar-btn--outline" style={{ padding: '6px 12px', fontSize: 13 }}>
                                📥 Скачать
                            </button>
                        )}
                    </div>
                    
                    <div className="ar-pane-content" style={{ padding: 16, background: '#e2e8f0' }}>
                        {activeDoc ? (
                            <div className="ar-viewer-wrapper">
                                <img src={DOC_PLACEHOLDER} alt="Document View" className="ar-viewer-img" />
                            </div>
                        ) : (
                            <div className="ar-viewer-placeholder">
                                <span>📄</span>
                                <p>Выберите документ из списка слева для просмотра</p>
                            </div>
                        )}
                    </div>

                    <div className="ar-decision-panel">
                        <textarea
                            className="ar-decision-textarea"
                            rows={3}
                            placeholder="Заключение / Причина (обязательно при доработке или отказе)"
                            value={conclusion}
                            onChange={(e) => setConclusion(e.target.value)}
                        />
                        <div className="ar-decision-actions">
                            {transitions.length === 0 ? (
                                <span style={{ color: '#64748b', fontSize: 14 }}>
                                    Заявка в финальном статусе: <b>{app.status}</b>
                                </span>
                            ) : transitions.map(tr => {
                                const cfg = ACTIONS[tr] || { label: tr, cls: 'ar-btn--outline' }
                                return (
                                    <button
                                        key={tr}
                                        className={`ar-btn ${cfg.cls}`}
                                        disabled={busy}
                                        onClick={() => handleAction(tr)}
                                    >
                                        {cfg.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
