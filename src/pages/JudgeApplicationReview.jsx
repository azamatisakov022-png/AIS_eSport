import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { judgeAppsApi } from '../api/esport'
import Breadcrumbs from '../components/Breadcrumbs'
import './ApplicationReview.css'

// Подписи и стиль кнопок для каждого целевого статуса (зеркало JudgeWorkflow на бэкенде)
const ACTIONS = {
    'Проверка документов':                  { label: 'Взять на проверку', cls: 'ar-btn--outline' },
    'Аттестация':                           { label: 'Документы приняты — на аттестацию', cls: 'ar-btn--green' },
    'На доработке':                         { label: 'Вернуть на доработку', cls: 'ar-btn--orange', needReason: true },
    'Рассмотрение комиссией':               { label: 'На рассмотрение комиссией', cls: 'ar-btn--green' },
    'Согласование Агентства':               { label: 'Согласование Агентства', cls: 'ar-btn--green' },
    'Передано в международную федерацию':    { label: 'Передать в международную федерацию', cls: 'ar-btn--green' },
    'Присвоено':                            { label: 'Присвоить категорию', cls: 'ar-btn--green' },
    'Выдано удостоверение':                 { label: 'Выдать удостоверение', cls: 'ar-btn--green' },
    'Записано':                             { label: 'Записать (межд. федерация)', cls: 'ar-btn--green' },
    'Отклонена':                            { label: 'Отказать', cls: 'ar-btn--red', needReason: true },
    'Отозвана':                             { label: 'Отозвать', cls: 'ar-btn--outline' },
}

const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'

export default function JudgeApplicationReview() {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()

    const [app, setApp] = useState(null)
    const [conclusion, setConclusion] = useState('')
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        let alive = true
        judgeAppsApi.get(id)
            .then(a => { if (alive) setApp(a) })
            .catch(() => { if (alive) toast('Не удалось загрузить заявку') })
        return () => { alive = false }
    }, [id, toast])

    const transitions = app?.nextStatuses || []

    const handleAction = async (target) => {
        const cfg = ACTIONS[target] || {}
        if (cfg.needReason && !conclusion.trim()) {
            toast('Пожалуйста, укажите причину в поле «Заключение / Причина»')
            return
        }
        setBusy(true)
        try {
            await judgeAppsApi.changeStatus(app.id, target, conclusion.trim() || undefined)
            toast(target === 'Выдано удостоверение' || target === 'Записано'
                ? 'Категория присвоена — судья внесён в реестр'
                : `Статус изменён: ${target}`)
            setTimeout(() => navigate('/judge-applications'), 1200)
        } catch (e) {
            toast(e.message || 'Не удалось изменить статус')
            setBusy(false)
        }
    }

    if (!app) {
        return (
            <div className="ar-page">
                <Breadcrumbs current="Рассмотрение заявки" />
                <div style={{ padding: 40, color: '#64748b' }}>Загрузка…</div>
            </div>
        )
    }

    return (
        <div className="ar-page">
            <Breadcrumbs current={`Заявка: ${app.appNo}`} />

            <div className="ar-header">
                <div>
                    <h1 className="ar-header__title">Заявка {app.appNo}</h1>
                    <div className="ar-header__badges">
                        <span className="aw-badge aw-badge--yellow">{app.status}</span>
                    </div>
                </div>
                <div className="ar-header__actions">
                    <button className="ar-btn ar-btn--outline" onClick={() => navigate('/judge-applications')}>Назад к списку</button>
                </div>
            </div>

            <div className="ar-split">
                {/* Левая панель — данные заявки */}
                <div className="ar-pane">
                    <div className="ar-pane-header">Информация о заявке</div>
                    <div className="ar-pane-content">
                        <div className="ar-info-grid">
                            <div className="ar-info-item"><div className="ar-info-item__label">ФИО</div><div className="ar-info-item__value">{app.applicantName}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Запрашиваемая категория</div><div className="ar-info-item__value">{app.requestedCategory}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Текущая категория</div><div className="ar-info-item__value">{app.currentCategory || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Вид спорта</div><div className="ar-info-item__value">{app.sport || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Обслужено мероприятий</div><div className="ar-info-item__value">{app.eventsServed ?? '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Стаж судейства</div><div className="ar-info-item__value">{app.experienceYears != null ? `${app.experienceYears} лет` : '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Дата подачи</div><div className="ar-info-item__value">{fmt(app.submitDate)}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Комплектность</div><div className="ar-info-item__value">{app.docsUploaded}/{app.docsTotal}</div></div>
                        </div>

                        <div style={{ marginTop: 20, padding: '14px 16px', background: '#f1f5f9', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                            <div className="ar-info-item__label">Кто присваивает</div>
                            <div className="ar-info-item__value" style={{ fontWeight: 700 }}>{app.assignedBy}</div>
                            {app.trackLabel && <div style={{ fontSize: 12, color: '#2563EB', marginTop: 6, fontWeight: 600 }}>Порядок: {app.trackLabel}</div>}
                        </div>

                        {app.history && app.history.length > 0 && (
                            <>
                                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '22px 0 12px', color: '#1a1a1a' }}>История</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {app.history.map(h => (
                                        <div key={h.id} style={{ fontSize: 13, color: '#334155', borderLeft: '2px solid #cbd5e1', paddingLeft: 10 }}>
                                            {h.action}
                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{h.userName} · {fmt(h.createdAt)}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Правая панель — решение */}
                <div className="ar-pane ar-pane--right">
                    <div className="ar-pane-header">Решение по заявке</div>
                    <div className="ar-pane-content">
                        <p style={{ fontSize: 13, color: '#64748b', marginTop: 0 }}>
                            Доступные действия зависят от текущего этапа и трека категории.
                        </p>
                    </div>
                    <div className="ar-decision-panel">
                        <textarea
                            className="ar-decision-textarea"
                            rows={3}
                            placeholder="Заключение / Причина (обязательно при доработке или отказе)"
                            value={conclusion}
                            onChange={e => setConclusion(e.target.value)}
                        />
                        <div className="ar-decision-actions">
                            {transitions.length === 0 ? (
                                <span style={{ color: '#64748b', fontSize: 14 }}>Заявка в финальном статусе: <b>{app.status}</b></span>
                            ) : transitions.map(tr => {
                                const cfg = ACTIONS[tr] || { label: tr, cls: 'ar-btn--outline' }
                                return (
                                    <button key={tr} className={`ar-btn ${cfg.cls}`} disabled={busy} onClick={() => handleAction(tr)}>
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
