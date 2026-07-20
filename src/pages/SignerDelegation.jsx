import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, StatusDot } from '../components/ui'
import { SIGNERS, loadDelegation, saveDelegation, isDelegated } from '../cabinet/signerStore'
import './registries.css'

/* Экран отдела кадров / админа: замещение права подписи.
   Отдел кадров по приказам отмечает, доступен ли конечный подписант; когда нет —
   заявки на финальном шаге маршрутов уходят заместителю. */

export default function SignerDelegation() {
    const toast = useToast()
    const [state, setState] = useState(loadDelegation)

    const persist = (next) => { setState(next); saveDelegation(next) }
    const upd = (role, patch) => persist({ ...state, [role]: { ...state[role], ...patch } })

    const toggle = (role, on) => {
        upd(role, { unavailable: on })
        toast(on ? 'Руководитель отмечен недоступным — подпись переходит заместителю' : 'Руководитель снова доступен')
    }

    return (
        <div className="reg">
            <Breadcrumbs current="Замещение подписи" />
            <PageHeader
                title="Замещение права подписи"
                subtitle="Отдел кадров отмечает по приказам, когда руководитель недоступен — тогда заявки подписывает заместитель"
            />

            <div style={{ display: 'grid', gap: 14 }}>
                {SIGNERS.map(s => {
                    const d = state[s.role] || {}
                    const active = isDelegated(state, s.role)
                    return (
                        <div key={s.role} style={sx.card}>
                            <div style={sx.head}>
                                <div>
                                    <div style={sx.role}>{s.role}</div>
                                    <div style={sx.name}>{s.name}</div>
                                </div>
                                <StatusDot tone={active ? 'amber' : 'green'}>
                                    {active ? `Замещает: ${s.deputy}` : 'Доступен, подписывает лично'}
                                </StatusDot>
                            </div>

                            <div style={sx.row}>
                                <label style={sx.toggleWrap}>
                                    <input type="checkbox" checked={!!d.unavailable} onChange={e => toggle(s.role, e.target.checked)} />
                                    <span>Руководитель недоступен — передать подпись заместителю ({s.deputyName})</span>
                                </label>
                            </div>

                            {d.unavailable && (
                                <div style={sx.form}>
                                    <div style={sx.field}>
                                        <label style={sx.label}>Период с</label>
                                        <input style={sx.input} type="date" value={d.from || ''} onChange={e => upd(s.role, { from: e.target.value })} />
                                    </div>
                                    <div style={sx.field}>
                                        <label style={sx.label}>по</label>
                                        <input style={sx.input} type="date" value={d.to || ''} onChange={e => upd(s.role, { to: e.target.value })} />
                                    </div>
                                    <div style={{ ...sx.field, flex: '1 1 260px' }}>
                                        <label style={sx.label}>Основание (приказ / причина)</label>
                                        <input style={sx.input} placeholder="Приказ №… / отпуск, командировка" value={d.reason || ''} onChange={e => upd(s.role, { reason: e.target.value })} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <div style={{ marginTop: 16, fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Настройка действует на все маршруты согласования (тарификация, план комплектования, звания, заслуженный тренер):
                на финальном шаге вместо руководителя подтверждает заместитель, что фиксируется в листе визирования.
            </div>
        </div>
    )
}

const sx = {
    card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 20px' },
    head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 12 },
    role: { fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' },
    name: { fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 },
    row: { marginBottom: 6 },
    toggleWrap: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-primary)', cursor: 'pointer' },
    form: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)' },
    field: { display: 'flex', flexDirection: 'column', gap: 6 },
    label: { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' },
    input: { padding: '8px 11px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit' },
}
