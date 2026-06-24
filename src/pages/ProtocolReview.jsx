import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { protocolsApi } from '../api/esport'
import Breadcrumbs from '../components/Breadcrumbs'
import './ApplicationReview.css'

const ACTIONS = {
    'На проверке':  { label: 'Взять на проверку', cls: 'ar-btn--outline' },
    'Опубликован':  { label: 'Опубликовать протокол', cls: 'ar-btn--green' },
    'На доработке': { label: 'Вернуть на доработку', cls: 'ar-btn--orange', needReason: true },
    'Отклонён':     { label: 'Отклонить', cls: 'ar-btn--red', needReason: true },
    'Отозван':      { label: 'Отозвать', cls: 'ar-btn--outline' },
}

const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'
const medalColor = (m) => m === 'Золото' ? '#d4af37' : m === 'Серебро' ? '#9ca3af' : m === 'Бронза' ? '#cd7f32' : '#94a3b8'

export default function ProtocolReview() {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()

    const [app, setApp] = useState(null)
    const [conclusion, setConclusion] = useState('')
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        let alive = true
        protocolsApi.get(id)
            .then(a => { if (alive) setApp(a) })
            .catch(() => { if (alive) toast('Не удалось загрузить протокол') })
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
            await protocolsApi.changeStatus(app.id, target, conclusion.trim() || undefined)
            toast(target === 'Опубликован' ? 'Протокол опубликован, результаты официальны' : `Статус изменён: ${target}`)
            setTimeout(() => navigate('/protocol-submissions'), 1200)
        } catch (e) {
            toast(e.message || 'Не удалось изменить статус')
            setBusy(false)
        }
    }

    if (!app) {
        return (
            <div className="ar-page">
                <Breadcrumbs current="Рассмотрение протокола" />
                <div style={{ padding: 40, color: '#64748b' }}>Загрузка…</div>
            </div>
        )
    }

    return (
        <div className="ar-page">
            <Breadcrumbs current={`Протокол: ${app.appNo}`} />

            <div className="ar-header">
                <div>
                    <h1 className="ar-header__title">{app.eventName}</h1>
                    <div className="ar-header__badges">
                        <span className="aw-badge aw-badge--yellow">{app.status}</span>
                        <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>{app.appNo}</span>
                    </div>
                </div>
                <div className="ar-header__actions">
                    <button className="ar-btn ar-btn--outline" onClick={() => navigate('/protocol-submissions')}>Назад к списку</button>
                </div>
            </div>

            <div className="ar-split">
                <div className="ar-pane">
                    <div className="ar-pane-header">Протокол и результаты</div>
                    <div className="ar-pane-content">
                        <div className="ar-info-grid">
                            <div className="ar-info-item"><div className="ar-info-item__label">Федерация</div><div className="ar-info-item__value">{app.federationName}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Вид спорта</div><div className="ar-info-item__value">{app.sport || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Соревнование</div><div className="ar-info-item__value">{app.eventName}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Дата</div><div className="ar-info-item__value">{fmt(app.eventDate)}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Уровень</div><div className="ar-info-item__value">{app.level || '—'}</div></div>
                            <div className="ar-info-item"><div className="ar-info-item__label">Город</div><div className="ar-info-item__value">{app.city || '—'}</div></div>
                        </div>

                        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '20px 0 10px', color: '#1a1a1a' }}>
                            Результаты ({app.results?.length || 0})
                        </h3>
                        <table className="aw-table" style={{ fontSize: 13 }}>
                            <thead>
                                <tr><th>Спортсмен</th><th>Дисциплина</th><th>Место</th><th>Медаль</th></tr>
                            </thead>
                            <tbody>
                                {(app.results || []).length === 0 && (
                                    <tr><td colSpan={4} className="aw-table__empty">Результаты не указаны</td></tr>
                                )}
                                {(app.results || []).map(r => (
                                    <tr key={r.id}>
                                        <td style={{ fontWeight: 500 }}>{r.athleteName}</td>
                                        <td>{r.discipline || '—'}</td>
                                        <td>{r.place ?? '—'}</td>
                                        <td>{r.medalType
                                            ? <span style={{ color: medalColor(r.medalType), fontWeight: 700 }}>{r.medalType}</span>
                                            : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

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
                    <div className="ar-pane-header">Решение по протоколу</div>
                    <div className="ar-pane-content">
                        <p style={{ fontSize: 13, color: '#64748b', marginTop: 0 }}>
                            Протокол загружен федерацией. После проверки специалист публикует — результаты становятся официальными.
                        </p>
                    </div>
                    <div className="ar-decision-panel">
                        <textarea
                            className="ar-decision-textarea"
                            rows={3}
                            placeholder="Заключение / Причина (обязательно при доработке и отклонении)"
                            value={conclusion}
                            onChange={e => setConclusion(e.target.value)}
                        />
                        <div className="ar-decision-actions">
                            {transitions.length === 0 ? (
                                <span style={{ color: '#64748b', fontSize: 14 }}>Протокол в финальном статусе: <b>{app.status}</b></span>
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
