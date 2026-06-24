import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { notificationsApi } from '../api/esport'

const SERVICE_COLOR = {
    'Звание/разряд': '#2563EB',
    'Судейская категория': '#7C3AED',
    'Свидетельство тренера': '#16a34a',
    'Восстановление документа': '#d97706',
    'Аккредитация федерации': '#0ea5e9',
    'Переход в другой клуб': '#0d9488',
}

const DONE = ['Присвоено', 'Выдано удостоверение', 'Записано', 'Зарегистрирован', 'Выдан дубликат', 'Переход оформлен', 'Аккредитована']
const NEG = ['Отклонена', 'Отказано', 'Отозвана', 'Аннулировано', 'Аккредитация отозвана', 'Приостановлена']
const badge = (s) => DONE.includes(s) ? B.done : NEG.includes(s) ? B.neg : B.progress

const fmt = (d) => {
    if (!d) return '—'
    const x = new Date(d)
    return x.toLocaleDateString('ru-RU') + ' ' + x.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export default function PublicNotifications() {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        let alive = true
        notificationsApi.list({ size: 80 })
            .then(({ items }) => { if (alive) { setRows(items); setLoading(false) } })
            .catch(() => { if (alive) { setError(true); setLoading(false) } })
        return () => { alive = false }
    }, [])

    return (
        <div className="pub-section" style={{ width: '100%', overflowY: 'auto' }}>
            <div className="pub-container" style={{ padding: '28px 24px' }}>
                <h1 style={st.title}>Уведомления</h1>
                <p style={st.sub}>
                    Уведомления о смене статуса ваших заявлений. Доставка — на электронную почту,
                    указанную в заявлении (СМС не используются).
                </p>

                {loading ? (
                    <div style={st.empty}>Загрузка…</div>
                ) : error ? (
                    <div style={st.empty}>Не удалось загрузить уведомления.</div>
                ) : rows.length === 0 ? (
                    <div style={st.empty}>Уведомлений пока нет.</div>
                ) : (
                    <div style={st.list}>
                        {rows.map(n => {
                            const color = SERVICE_COLOR[n.serviceType] || '#64748b'
                            return (
                                <div key={n.id} style={st.card}>
                                    <div style={st.body}>
                                        <div style={st.top}>
                                            <span style={{ ...st.svc, color, background: `${color}14` }}>{n.serviceType}</span>
                                            <span style={st.appNo}>{n.appNo}</span>
                                            <span style={{ ...st.badge, ...badge(n.status) }}>{n.status}</span>
                                        </div>
                                        <div style={st.msg}>{n.message}</div>
                                        <div style={st.meta}>
                                            {n.recipientEmail
                                                ? <>отправлено на <b>{n.recipientEmail}</b></>
                                                : <>уведомление в кабинете</>}
                                            {' · '}{fmt(n.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                    <Link to="/public/cabinet" style={st.back}>← В кабинет</Link>
                    <Link to="/public/cabinet/applications" style={st.ghost}>Мои заявления</Link>
                </div>
            </div>
        </div>
    )
}

const B = {
    progress: { background: '#dbeafe', color: '#1d4ed8' },
    done: { background: '#dcfce7', color: '#15803d' },
    neg: { background: '#fee2e2', color: '#b91c1c' },
}

const st = {
    title: { fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' },
    sub: { fontSize: 14, color: 'var(--text-muted)', margin: '0 0 18px', lineHeight: 1.6, maxWidth: 720 },
    list: { display: 'flex', flexDirection: 'column', gap: 10 },
    card: {
        display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
    },
    body: { flex: 1, padding: '12px 16px', minWidth: 0 },
    top: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' },
    svc: { fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 20 },
    appNo: { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' },
    badge: { fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 20, marginLeft: 'auto' },
    msg: { fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 },
    meta: { fontSize: 12, color: 'var(--text-muted)' },
    empty: { padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 },
    back: { padding: '10px 20px', background: 'var(--pub-navy, #1a1a1a)', color: '#fff', borderRadius: 20, textDecoration: 'none', fontSize: 14, fontWeight: 700 },
    ghost: { padding: '10px 20px', background: 'var(--bg-panel)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 20, textDecoration: 'none', fontSize: 14, fontWeight: 600 },
}
