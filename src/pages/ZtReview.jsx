import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, StatusDot } from '../components/ui'
import ApprovalRoleSwitcher from './ApprovalRoleSwitcher'
import { loadZt, saveZt, ZT_ROUTE, ZT_ROLES, ZT_DOCS, ztStatus, loadZtActing, saveZtActing, ztToday } from '../cabinet/ztStore'
import { loadDelegation, isDelegated, signerInfo } from '../cabinet/signerStore'
import './registries.css'

/* Рассмотрение заявления на «Заслуженный тренер» — данные тренера, пакет документов,
   список подготовленных спортсменов с регалиями, лист визирования, приказ, значок. */

export default function ZtReview() {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()
    const [list, setList] = useState(loadZt)
    const [acting, setActing] = useState(loadZtActing)
    const z = list.find(x => String(x.id) === String(id))
    const setActingRole = (r) => { setActing(r); saveZtActing(r) }

    if (!z) {
        return <div className="reg"><Breadcrumbs current="ЗТ" /><PageHeader title="Заявление не найдено" /><Button onClick={() => navigate('/zt')}>К списку</Button></div>
    }

    const route = ZT_ROUTE
    const st = ztStatus(z)
    const current = z.step < route.length ? route[z.step] : null
    const persist = (n) => { setList(n); saveZt(n) }
    const deleg = loadDelegation()
    const stepDelegated = (r) => { if (!r) return null; const sig = signerInfo(r.role); return sig && isDelegated(deleg, r.role) ? sig : null }

    const approve = () => {
        const next = list.map(x => {
            if (x.id !== z.id) return x
            const step = x.step + 1
            const done = step >= route.length
            return { ...x, step, visas: [...(x.visas || []), ztToday()], badgeIssued: done ? true : x.badgeIssued }
        })
        persist(next)
        const upd = next.find(x => x.id === z.id)
        toast(upd.step >= route.length ? `${z.num}: звание «Заслуженный тренер» присвоено, значок выдан` : `Подтверждено: ${current.role}. Далее — ${route[upd.step].role}`)
    }
    const sendBack = () => { persist(list.map(x => x.id === z.id ? { ...x, returned: true, step: 1, visas: x.visas?.slice(0, 1) || [] } : x)); toast(`${z.num}: возвращён на доработку`) }

    return (
        <div className="reg">
            <Breadcrumbs current={`${z.num} · Заслуженный тренер`} />
            <PageHeader
                title={`${z.num} — Заслуженный тренер КР`}
                subtitle={`${z.coach} · ${z.sport} · стаж ${z.experience} лет · ${z.region} · подан ${z.submittedAt}`}
                actions={<Button onClick={() => navigate('/zt')}>К списку</Button>}
            />

            <ApprovalRoleSwitcher value={acting} onChange={setActingRole} roles={ZT_ROLES} />

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                <StatusDot tone={st.tone}>{st.label}</StatusDot>
                {z.order && <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Приказ: <b style={{ fontFamily: 'monospace' }}>{z.order}</b></span>}
                {z.badgeIssued && <StatusDot tone="green">Значок ЗТ выдан</StatusDot>}
            </div>

            <div style={sx.grid}>
                {/* Данные + документы + ученики */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={sx.card}>
                        <div style={sx.cardTitle}>Данные тренера</div>
                        <table className="reg-table" style={{ width: '100%' }}>
                            <tbody>
                                <tr><td style={sx.k}>ФИО</td><td>{z.coach} <span style={sx.esi}>✓ ЕСИ</span></td></tr>
                                <tr><td style={sx.k}>ИНН</td><td style={{ fontFamily: 'monospace' }}>{z.inn}</td></tr>
                                <tr><td style={sx.k}>Вид спорта</td><td>{z.sport}</td></tr>
                                <tr><td style={sx.k}>Федерация</td><td>{z.federation}</td></tr>
                                <tr><td style={sx.k}>Стаж</td><td>{z.experience} лет {z.experience >= 25 ? '' : '(меньше 25 — проверить критерии ЕСК)'}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={sx.card}>
                        <div style={sx.cardTitle}>Пакет документов</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {ZT_DOCS.map(d => (
                                <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: z.docs[d.key] ? '#16a34a' : '#dc2626', flex: 'none' }} />
                                    <span>{d.label}</span>
                                    {z.docs[d.key] && <button className="reg-btn" onClick={() => toast(`Просмотр: ${d.label}`)}>Открыть</button>}
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Паспорт — из ЕСИ (копия не требуется). Согласие на ПД дано при регистрации.</div>
                    </div>

                    <div style={sx.card}>
                        <div style={sx.cardTitle}>Подготовленные спортсмены ({z.students.length})</div>
                        <table className="reg-table" style={{ width: '100%' }}>
                            <thead><tr><th>Спортсмен</th><th>Регалии (из реестра)</th></tr></thead>
                            <tbody>
                                {z.students.map((s, i) => (
                                    <tr key={i}><td>{s.name}</td><td><b>{s.rank}</b></td></tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                            Список заверен печатью организации. Регалии подтягиваются из реестра спортсменов. Критерий ЕСК: {'>'} 10 мастеров спорта (либо подготовка призёров ОИ/ЧМ/Азиады).
                        </div>
                    </div>
                </div>

                {/* Лист визирования */}
                <div style={sx.card}>
                    <div style={sx.cardTitle}>Лист визирования</div>
                    <table className="reg-table" style={{ width: '100%' }}>
                        <thead><tr><th style={{ width: 30 }}>№</th><th>Роль</th><th>Исполнитель</th><th>Отметка</th></tr></thead>
                        <tbody>
                            {route.map((r, i) => {
                                const done = i < z.step
                                const cur = i === z.step && !z.returned && z.step < route.length
                                const dg = stepDelegated(r)
                                return (
                                    <tr key={i} style={cur ? { background: 'var(--bg-panel)' } : undefined}>
                                        <td>{i + 1}</td>
                                        <td style={{ fontWeight: cur ? 700 : 500 }}>{r.role}<div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>{r.level}</div></td>
                                        <td>{dg ? <><span style={{ color: '#b45309' }}>{dg.deputyName}</span><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>за {r.name}</div></> : (i === 0 ? z.coach : r.name)}</td>
                                        <td>
                                            {done && <StatusDot tone="green">{i === 0 ? 'Подал' : 'Подтв.'} {z.visas?.[i] || ''}</StatusDot>}
                                            {cur && <StatusDot tone="amber">На рассмотрении</StatusDot>}
                                            {!done && !cur && <StatusDot tone="gray">Ожидает</StatusDot>}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {current && !z.returned && (
                        <div style={sx.actionBox}>
                            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 10 }}>
                                Сейчас рассматривает: <b>{current.role}</b> — {stepDelegated(current) ? `${stepDelegated(current).deputyName} (за ${current.name})` : current.name}
                            </div>
                            {(acting === 'any' || acting === current.role) ? (
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    <Button variant="primary" onClick={approve}>Подтвердить — {current.role}</Button>
                                    <Button onClick={sendBack}>Вернуть на доработку</Button>
                                </div>
                            ) : (
                                <div style={sx.gate}>Вы вошли как <b>{acting}</b> — сейчас не ваша очередь. Подтвердить может только <b>{current.role}</b>.</div>
                            )}
                        </div>
                    )}
                    {z.returned && <div style={{ ...sx.actionBox, borderColor: '#fecaca' }}><StatusDot tone="red">Возвращён на доработку</StatusDot></div>}
                    {z.step >= route.length && <div style={{ ...sx.actionBox, borderColor: '#bbf7d0' }}><StatusDot tone="green">«Заслуженный тренер КР» присвоено. Значок выдан.</StatusDot></div>}
                </div>
            </div>
        </div>
    )
}

const sx = {
    grid: { display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(400px, 1.1fr)', gap: 16, alignItems: 'start' },
    card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 18px' },
    cardTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 },
    k: { color: 'var(--text-muted)', width: 130 },
    esi: { fontSize: 11, fontWeight: 700, color: '#166534', background: '#dcfce7', borderRadius: 10, padding: '2px 8px', marginLeft: 6 },
    actionBox: { marginTop: 14, border: '1px solid var(--border-color)', borderRadius: 10, padding: '12px 14px', background: 'var(--bg-primary)' },
    gate: { fontSize: 12.5, color: 'var(--text-secondary)', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '10px 12px', lineHeight: 1.5 },
}
