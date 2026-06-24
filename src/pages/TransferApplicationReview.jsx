import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { transferApi } from '../api/esport'
import Breadcrumbs from '../components/Breadcrumbs'
import './ApplicationReview.css'

const ACTIONS = {
    'Подтверждён старым клубом': { label: 'Подтвердить (старый клуб)', cls: 'ar-btn--green' },
    'Подтверждён новым клубом':  { label: 'Подтвердить (новый клуб)', cls: 'ar-btn--green' },
    'Подтверждён федерацией':    { label: 'Подтвердить (федерация)', cls: 'ar-btn--green' },
    'Переход оформлен':          { label: 'Оформить переход', cls: 'ar-btn--green' },
    'Отклонена':                 { label: 'Отклонить', cls: 'ar-btn--red', needReason: true },
    'Отозвана':                  { label: 'Отозвать', cls: 'ar-btn--outline' },
}

// Порядок этапов для визуальной цепочки подтверждений
const ORDER = ['Подана', 'Подтверждён старым клубом', 'Подтверждён новым клубом', 'Подтверждён федерацией', 'Переход оформлен']
const CHAIN = [
    { key: 1, label: 'Старый клуб' },
    { key: 2, label: 'Новый клуб' },
    { key: 3, label: 'Федерация' },
]
const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'

export default function TransferApplicationReview() {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()

    const [app, setApp] = useState(null)
    const [conclusion, setConclusion] = useState('')
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        let alive = true
        transferApi.get(id)
            .then(a => { if (alive) setApp(a) })
            .catch(() => { if (alive) toast('Не удалось загрузить заявку') })
        return () => { alive = false }
    }, [id, toast])

    const transitions = app?.nextStatuses || []
    const stageIdx = app ? ORDER.indexOf(app.status) : -1

    const handleAction = async (target) => {
        const cfg = ACTIONS[target] || {}
        if (cfg.needReason && !conclusion.trim()) {
            toast('Пожалуйста, укажите причину в поле «Заключение / Причина»')
            return
        }
        setBusy(true)
        try {
            await transferApi.changeStatus(app.id, target, conclusion.trim() || undefined)
            toast(target === 'Переход оформлен' ? 'Переход оформлен — клуб спортсмена обновлён в реестре' : `Статус изменён: ${target}`)
            setTimeout(() => navigate('/transfer-applications'), 1200)
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
                    <h1 className="ar-header__title">{app.athleteName}</h1>
                    <div className="ar-header__badges">
                        <span className="aw-badge aw-badge--yellow">{app.status}</span>
                        <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>{app.appNo}</span>
                    </div>
                </div>
                <div className="ar-header__actions">
                    <button className="ar-btn ar-btn--outline" onClick={() => navigate('/transfer-applications')}>Назад к списку</button>
                </div>
            </div>

            <div className="ar-split">
                <div className="ar-pane">
                    <div className="ar-pane-header">Сведения о переходе</div>
                    <div className="ar-pane-content">
                        {/* Цепочка подтверждений */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                            {CHAIN.map(c => {
                                const done = stageIdx >= c.key
                                return (
                                    <div key={c.key} style={{ flex: 1, textAlign: 'center', padding: '12px 6px', borderRadius: 10, background: done ? '#dcfce7' : '#f1f5f9', border: `1px solid ${done ? '#86efac' : '#e2e8f0'}` }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: done ? '#15803d' : '#94a3b8', marginBottom: 4 }}>{done ? 'Подтверждено' : 'Ожидание'}</div>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: done ? '#15803d' : '#64748b' }}>{c.label}</div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="ar-info-grid">
                            <div className="ar-info-item"><div className="ar-info-item__label">Спортсмен</div><div className="ar-info-item__value">{app.athleteName}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Вид спорта</div><div className="ar-info-item__value">{app.sport || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Старый клуб</div><div className="ar-info-item__value">{app.oldClub || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Новый клуб</div><div className="ar-info-item__value" style={{ fontWeight: 700 }}>{app.newClub || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Регион</div><div className="ar-info-item__value">{app.region || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Дата подачи</div><div className="ar-info-item__value">{fmt(app.submitDate)}</div></div>
                            <div className="ar-info-item ar-info-item--full"><div className="ar-info-item__label">Причина перехода</div><div className="ar-info-item__value">{app.reason || '—'}</div></div>
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

                <div className="ar-pane ar-pane--right">
                    <div className="ar-pane-header">Решение по заявке</div>
                    <div className="ar-pane-content">
                        <p style={{ fontSize: 13, color: '#64748b', marginTop: 0 }}>
                            Переход подтверждают по очереди: старый клуб → новый клуб → федерация. После этого специалист оформляет переход.
                        </p>
                    </div>
                    <div className="ar-decision-panel">
                        <textarea
                            className="ar-decision-textarea"
                            rows={3}
                            placeholder="Заключение / Причина (обязательно при отклонении)"
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
