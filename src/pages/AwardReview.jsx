import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, StatusDot } from '../components/ui'
import ApprovalRoleSwitcher from './ApprovalRoleSwitcher'
import { loadAwards, saveAwards, AWARD_LEVELS, AWARD_ROLES, awardRoute, awardStatus, loadAwardActing, saveAwardActing, awToday } from '../cabinet/awardsStore'
import { loadDelegation, isDelegated, signerInfo } from '../cabinet/signerStore'
import './registries.css'

/* Рассмотрение заявления на звание/разряд — полноценная страница.
   Лист визирования по ролям с ФИО и датами; приказ; замещение подписи;
   на присвоении — значок (для званий) и запись в реестр спортсмена. Срок 30 кал. дней. */

const SLA_DAYS = 30

export default function AwardReview() {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()
    const [awards, setAwards] = useState(loadAwards)
    const [acting, setActing] = useState(loadAwardActing)
    const a = awards.find(x => String(x.id) === String(id))
    const setActingRole = (r) => { setActing(r); saveAwardActing(r) }

    if (!a) {
        return (
            <div className="reg">
                <Breadcrumbs current="Звание" />
                <PageHeader title="Заявление не найдено" />
                <Button onClick={() => navigate('/awards')}>К списку</Button>
            </div>
        )
    }

    const lvl = AWARD_LEVELS[a.level]
    const route = awardRoute(a)
    const st = awardStatus(a)
    const current = a.step < route.length ? route[a.step] : null
    const persist = (next) => { setAwards(next); saveAwards(next) }

    const deleg = loadDelegation()
    const stepDelegated = (r) => { if (!r) return null; const sig = signerInfo(r.role); return sig && isDelegated(deleg, r.role) ? sig : null }

    // просрочка
    const daysUsed = Math.ceil((new Date() - new Date(a.submittedAt)) / 86400000)
    const overdue = a.step < route.length && daysUsed > SLA_DAYS

    const approve = () => {
        const next = awards.map(x => {
            if (x.id !== a.id) return x
            const step = x.step + 1
            const done = step >= route.length
            return { ...x, step, visas: [...(x.visas || []), awToday()], badgeIssued: done && lvl.badge ? true : x.badgeIssued }
        })
        persist(next)
        const upd = next.find(x => x.id === a.id)
        toast(upd.step >= route.length
            ? `${a.num}: звание «${a.title}» присвоено${lvl.badge ? ', значок выдан (журнал)' : ''}`
            : `Подтверждено: ${current.role}. Далее — ${route[upd.step].role}`)
    }
    const sendBack = () => { persist(awards.map(x => x.id === a.id ? { ...x, returned: true, step: 1, visas: x.visas?.slice(0, 1) || [] } : x)); toast(`${a.num}: возвращён на доработку`) }

    return (
        <div className="reg">
            <Breadcrumbs current={`${a.num} · ${a.title}`} />
            <PageHeader
                title={`${a.num} — присвоение «${a.title}»`}
                subtitle={`${a.athlete} · ${a.sport} · ${a.region} · подан ${a.submittedAt}`}
                actions={<Button onClick={() => navigate('/awards')}>К списку</Button>}
            />

            <ApprovalRoleSwitcher value={acting} onChange={setActingRole} roles={AWARD_ROLES} />

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                <StatusDot tone={st.tone}>{st.label}</StatusDot>
                {a.step < route.length && <StatusDot tone={overdue ? 'red' : 'gray'}>{overdue ? `Просрочено (${daysUsed} дн. из ${SLA_DAYS})` : `Срок: ${daysUsed} из ${SLA_DAYS} кал. дней`}</StatusDot>}
                {a.order && <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Приказ: <b style={{ fontFamily: 'monospace' }}>{a.order}</b></span>}
                {a.badgeIssued && <StatusDot tone="green">Значок выдан (журнал, повторно не выдаётся)</StatusDot>}
            </div>

            <div style={sx.grid}>
                <div style={sx.card}>
                    <div style={sx.cardTitle}>Данные заявления</div>
                    <table className="reg-table" style={{ width: '100%' }}>
                        <tbody>
                            <tr><td style={sx.k}>Спортсмен</td><td>{a.athlete}</td></tr>
                            <tr><td style={sx.k}>ИНН</td><td style={{ fontFamily: 'monospace' }}>{a.inn}</td></tr>
                            <tr><td style={sx.k}>Вид спорта</td><td>{a.sport}</td></tr>
                            <tr><td style={sx.k}>Дисциплина</td><td>{a.discipline}</td></tr>
                            <tr><td style={sx.k}>Звание</td><td><b>{a.title}</b> ({lvl.label})</td></tr>
                            <tr><td style={sx.k}>Результат (протокол)</td><td>{a.competition}</td></tr>
                            <tr><td style={sx.k}>Спортшкола</td><td>{a.school}</td></tr>
                            <tr><td style={sx.k}>Тренер</td><td>{a.coach}</td></tr>
                        </tbody>
                    </table>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
                        Протокол соревнований — бумажная копия с печатью федерации (автозачёт из АИС не допускается).
                    </div>
                </div>

                <div style={sx.card}>
                    <div style={sx.cardTitle}>Лист визирования</div>
                    <table className="reg-table" style={{ width: '100%' }}>
                        <thead><tr><th style={{ width: 30 }}>№</th><th>Роль</th><th>Исполнитель</th><th>Отметка</th></tr></thead>
                        <tbody>
                            {route.map((r, i) => {
                                const done = i < a.step
                                const cur = i === a.step && !a.returned && a.step < route.length
                                const dg = stepDelegated(r)
                                return (
                                    <tr key={i} style={cur ? { background: 'var(--bg-panel)' } : undefined}>
                                        <td>{i + 1}</td>
                                        <td style={{ fontWeight: cur ? 700 : 500 }}>{r.role}<div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>{r.level}</div></td>
                                        <td>{dg ? <><span style={{ color: '#b45309' }}>{dg.deputyName}</span><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>за {r.name}</div></> : (i === 0 ? a.coach : r.name)}</td>
                                        <td>
                                            {done && <StatusDot tone="green">{i === 0 ? 'Подал' : 'Подтв.'} {a.visas?.[i] || ''}</StatusDot>}
                                            {cur && <StatusDot tone="amber">На рассмотрении</StatusDot>}
                                            {!done && !cur && <StatusDot tone="gray">Ожидает</StatusDot>}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {current && !a.returned && (
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
                    {a.returned && <div style={{ ...sx.actionBox, borderColor: '#fecaca' }}><StatusDot tone="red">Возвращён на доработку — ожидается повторная подача</StatusDot></div>}
                    {a.step >= route.length && <div style={{ ...sx.actionBox, borderColor: '#bbf7d0' }}><StatusDot tone="green">Звание «{a.title}» присвоено. Отражено в ЛК спортсмена.</StatusDot></div>}
                </div>
            </div>
        </div>
    )
}

const sx = {
    grid: { display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(420px, 1.2fr)', gap: 16, alignItems: 'start' },
    card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 18px' },
    cardTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 },
    k: { color: 'var(--text-muted)', width: 150 },
    actionBox: { marginTop: 14, border: '1px solid var(--border-color)', borderRadius: 10, padding: '12px 14px', background: 'var(--bg-primary)' },
    gate: { fontSize: 12.5, color: 'var(--text-secondary)', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '10px 12px', lineHeight: 1.5 },
}
