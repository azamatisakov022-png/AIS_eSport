import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { restorationApi } from '../api/esport'
import Breadcrumbs from '../components/Breadcrumbs'
import './ApplicationReview.css'

// Подписи и стиль кнопок (зеркало RestorationWorkflow на бэкенде)
const ACTIONS = {
    'Проверка документов': { label: 'Взять на проверку', cls: 'ar-btn--outline' },
    'Приказ подписан':     { label: 'Подписать приказ (директор, ЭЦП)', cls: 'ar-btn--green' },
    'На доработке':        { label: 'Вернуть на доработку', cls: 'ar-btn--orange', needReason: true },
    'Выдан дубликат':      { label: 'Выдать дубликат', cls: 'ar-btn--green' },
    'Отклонена':           { label: 'Отказать', cls: 'ar-btn--red', needReason: true },
    'Отозвана':            { label: 'Отозвать', cls: 'ar-btn--outline' },
}

const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'

export default function RestorationApplicationReview() {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()

    const [app, setApp] = useState(null)
    const [conclusion, setConclusion] = useState('')
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        let alive = true
        restorationApi.get(id)
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
            await restorationApi.changeStatus(app.id, target, conclusion.trim() || undefined)
            toast(target === 'Выдан дубликат'
                ? 'Дубликат выдан, старый документ признан недействительным'
                : `Статус изменён: ${target}`)
            setTimeout(() => navigate('/restoration-applications'), 1200)
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
                    <button className="ar-btn ar-btn--outline" onClick={() => navigate('/restoration-applications')}>Назад к списку</button>
                </div>
            </div>

            <div className="ar-split">
                <div className="ar-pane">
                    <div className="ar-pane-header">Информация о заявке</div>
                    <div className="ar-pane-content">
                        <div className="ar-info-grid">
                            <div className="ar-info-item"><div className="ar-info-item__label">ФИО</div><div className="ar-info-item__value">{app.applicantName}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Тип документа</div><div className="ar-info-item__value">{app.docType}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Причина</div><div className="ar-info-item__value">{app.reason || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Номер утраченного</div><div className="ar-info-item__value" style={{ fontFamily: 'monospace' }}>{app.oldNumber || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Дата выдачи</div><div className="ar-info-item__value">{fmt(app.issueDate)}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Дата подачи</div><div className="ar-info-item__value">{fmt(app.submitDate)}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Телефон</div><div className="ar-info-item__value">{app.phone || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Комплектность</div><div className="ar-info-item__value">{app.docsUploaded}/{app.docsTotal}</div></div>
                        </div>

                        {(app.dupNumber || app.oldInvalidated) && (
                            <div style={{ marginTop: 20, padding: '14px 16px', background: '#f0fdf4', borderRadius: 10, borderLeft: '3px solid #16a34a' }}>
                                <div className="ar-info-item__label">Результат</div>
                                {app.dupNumber && <div className="ar-info-item__value" style={{ fontWeight: 700 }}>Дубликат {app.dupNumber}</div>}
                                {app.oldInvalidated && <div style={{ fontSize: 12, color: '#b91c1c', marginTop: 4, fontWeight: 600 }}>Старый документ {app.oldNumber || ''} признан недействительным</div>}
                            </div>
                        )}

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

                <div className="ar-pane ar-pane--right">
                    <div className="ar-pane-header">Решение по заявке</div>
                    <div className="ar-pane-content">
                        <p style={{ fontSize: 13, color: '#64748b', marginTop: 0 }}>
                            Дубликат выдаётся по приказу на основании заявления и справки об утере/порче.
                            Старый документ помечается недействительным.
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
