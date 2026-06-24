import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { accreditationApi } from '../api/esport'
import Breadcrumbs from '../components/Breadcrumbs'
import './ApplicationReview.css'

// Подписи и стиль кнопок (зеркало AccreditationWorkflow)
const ACTIONS = {
    'Проверка документов':    { label: 'Взять на проверку', cls: 'ar-btn--outline' },
    'Аккредитована':          { label: 'Аккредитовать', cls: 'ar-btn--green' },
    'На доработке':           { label: 'Вернуть на доработку', cls: 'ar-btn--orange', needReason: true },
    'Приостановлена':         { label: 'Приостановить', cls: 'ar-btn--orange', needReason: true },
    'Аккредитация отозвана':  { label: 'Отозвать аккредитацию', cls: 'ar-btn--red', needReason: true },
    'Отклонена':              { label: 'Отказать', cls: 'ar-btn--red', needReason: true },
    'Отозвана':               { label: 'Отозвать заявку', cls: 'ar-btn--outline' },
}

const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'

export default function AccreditationApplicationReview() {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()

    const [app, setApp] = useState(null)
    const [conclusion, setConclusion] = useState('')
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        let alive = true
        accreditationApi.get(id)
            .then(a => { if (alive) setApp(a) })
            .catch(() => { if (alive) toast('Не удалось загрузить заявку') })
        return () => { alive = false }
    }, [id, toast])

    const transitions = app?.nextStatuses || []

    const label = (tr) => {
        if (tr === 'Аккредитована' && app?.status === 'Приостановлена') return 'Возобновить аккредитацию'
        return (ACTIONS[tr] || {}).label || tr
    }

    const handleAction = async (target) => {
        const cfg = ACTIONS[target] || {}
        if (cfg.needReason && !conclusion.trim()) {
            toast('Пожалуйста, укажите причину в поле «Заключение / Причина»')
            return
        }
        setBusy(true)
        try {
            await accreditationApi.changeStatus(app.id, target, conclusion.trim() || undefined)
            const msg = target === 'Аккредитована' ? (app.status === 'Приостановлена' ? 'Аккредитация возобновлена' : 'Федерация аккредитована')
                : target === 'Приостановлена' ? 'Действие аккредитации приостановлено'
                : target === 'Аккредитация отозвана' ? 'Аккредитация отозвана'
                : `Статус изменён: ${target}`
            toast(msg)
            setTimeout(() => navigate('/accreditation-applications'), 1200)
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
                    <h1 className="ar-header__title">{app.federationName}</h1>
                    <div className="ar-header__badges">
                        <span className="aw-badge aw-badge--yellow">{app.status}</span>
                        <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>{app.appNo}</span>
                    </div>
                </div>
                <div className="ar-header__actions">
                    <button className="ar-btn ar-btn--outline" onClick={() => navigate('/accreditation-applications')}>Назад к списку</button>
                </div>
            </div>

            <div className="ar-split">
                <div className="ar-pane">
                    <div className="ar-pane-header">Сведения о федерации</div>
                    <div className="ar-pane-content">
                        <div className="ar-info-grid">
                            <div className="ar-info-item"><div className="ar-info-item__label">Федерация</div><div className="ar-info-item__value">{app.federationName}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Вид спорта</div><div className="ar-info-item__value">{app.sport || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">ИНН</div><div className="ar-info-item__value" style={{ fontFamily: 'monospace' }}>{app.inn || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Руководитель</div><div className="ar-info-item__value">{app.headName || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Телефон</div><div className="ar-info-item__value">{app.phone || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Email</div><div className="ar-info-item__value">{app.email || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Дата подачи</div><div className="ar-info-item__value">{fmt(app.submitDate)}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Комплектность</div><div className="ar-info-item__value">{app.docsUploaded}/{app.docsTotal}</div></div>
                        </div>

                        {app.accreditationNumber && (
                            <div style={{ marginTop: 20, padding: '14px 16px', background: '#f0fdf4', borderRadius: 10, borderLeft: '3px solid #16a34a' }}>
                                <div className="ar-info-item__label">Свидетельство об аккредитации</div>
                                <div className="ar-info-item__value" style={{ fontWeight: 700 }}>{app.accreditationNumber}</div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>действует до {fmt(app.accreditationEnd)}</div>
                            </div>
                        )}

                        {app.status === 'Приостановлена' && app.suspensionReason && (
                            <div style={{ marginTop: 12, padding: '14px 16px', background: '#fffbeb', borderRadius: 10, borderLeft: '3px solid #d97706' }}>
                                <div className="ar-info-item__label">Основание приостановки</div>
                                <div style={{ fontSize: 13, color: '#92400e', marginTop: 4 }}>{app.suspensionReason}</div>
                                <div style={{ fontSize: 12, color: '#92400e', marginTop: 6 }}>
                                    Федерация не пользуется правами аккредитованной: не представляет вид спорта в госорганах,
                                    ограничена в господдержке, не выдвигает кандидатов.
                                </div>
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
                            Срок рассмотрения — 14 рабочих дней. Приостановка/отзыв требуют указания основания.
                        </p>
                    </div>
                    <div className="ar-decision-panel">
                        <textarea
                            className="ar-decision-textarea"
                            rows={3}
                            placeholder="Заключение / Основание (обязательно при доработке, приостановке, отказе и отзыве)"
                            value={conclusion}
                            onChange={e => setConclusion(e.target.value)}
                        />
                        <div className="ar-decision-actions">
                            {transitions.length === 0 ? (
                                <span style={{ color: '#64748b', fontSize: 14 }}>Заявка в финальном статусе: <b>{app.status}</b></span>
                            ) : transitions.map(tr => {
                                const cfg = ACTIONS[tr] || { cls: 'ar-btn--outline' }
                                return (
                                    <button key={tr} className={`ar-btn ${cfg.cls}`} disabled={busy} onClick={() => handleAction(tr)}>
                                        {label(tr)}
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
