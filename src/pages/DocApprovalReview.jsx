import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, StatusDot } from '../components/ui'
import { loadApprovals, saveApprovals, DOC_TYPES, routeFor, statusOf, today, loadActingRole, saveActingRole } from '../cabinet/approvalStore'
import { loadDelegation, isDelegated, signerInfo } from '../cabinet/signerStore'
import ApprovalRoleSwitcher from './ApprovalRoleSwitcher'
import './registries.css'

/* Служебный портал: рассмотрение заявления (тарификация / план комплектования).
   Полноценная страница в контенте. Лист визирования показывает каждого участника
   маршрута (роль + ФИО): кто уже подтвердил и когда, кто рассматривает сейчас.
   Демо: кнопка «Подтвердить» действует от имени текущего рассматривающего. */

const DOC_COLUMNS = {
    tarif: ['Тренер', 'Вид спорта', 'Ставка', 'Нагрузка, ч/нед', 'Учеников'],
    plan: ['Вид спорта', 'Группа', 'Мест', 'Тренер'],
}

export default function DocApprovalReview({ type }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()
    const [docs, setDocs] = useState(loadApprovals)
    const [acting, setActing] = useState(loadActingRole)
    const meta = DOC_TYPES[type]
    const doc = docs.find(d => d.type === type && String(d.id) === String(id))

    const setActingRole = (r) => { setActing(r); saveActingRole(r) }

    if (!doc) {
        return (
            <div className="reg">
                <Breadcrumbs current={meta.label} />
                <PageHeader title="Заявление не найдено" subtitle="Возможно, оно было удалено" />
                <Button onClick={() => navigate(meta.listPath)}>К списку</Button>
            </div>
        )
    }

    const route = routeFor(type)
    const st = statusOf(doc)
    const current = doc.step < route.length ? route[doc.step] : null
    const persist = (next) => { setDocs(next); saveApprovals(next) }

    // Замещение: если конечный подписант (директор) недоступен — на его шаге действует зам.
    const deleg = loadDelegation()
    const stepDelegated = (r) => {
        if (!r) return null
        const sig = signerInfo(r.role)
        return sig && isDelegated(deleg, r.role) ? sig : null
    }
    const curDeleg = stepDelegated(current)

    const approve = () => {
        const next = docs.map(d => d.id === doc.id
            ? { ...d, step: d.step + 1, visas: [...(d.visas || []), today()] }
            : d)
        persist(next)
        const upd = next.find(d => d.id === doc.id)
        toast(upd.step >= route.length
            ? `${doc.num}: утверждено — ${route[route.length - 1].role}`
            : `Подтверждено: ${current.role}. Далее — ${route[upd.step].role}`)
    }

    const sendBack = () => {
        persist(docs.map(d => d.id === doc.id ? { ...d, returned: true, step: 0, visas: [] } : d))
        toast(`${doc.num}: возвращён спортшколе на доработку`)
    }

    return (
        <div className="reg">
            <Breadcrumbs current={`${meta.label} · ${doc.num}`} />
            <PageHeader
                title={`${doc.num} — ${meta.label.toLowerCase()}`}
                subtitle={`${doc.school} · ${doc.region} · ${doc.year} год · подан ${doc.submittedAt}`}
                actions={<Button onClick={() => navigate(meta.listPath)}>К списку</Button>}
            />

            <ApprovalRoleSwitcher value={acting} onChange={setActingRole} />

            <div style={{ marginBottom: 18 }}><StatusDot tone={st.tone}>{st.label}</StatusDot></div>

            <div style={sx.grid}>
                {/* Содержимое документа */}
                <div style={sx.card}>
                    <div style={sx.cardTitle}>Содержимое документа</div>
                    <table className="reg-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>{DOC_COLUMNS[type].map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {doc.rows.map((r, i) => (
                                <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Лист визирования */}
                <div style={sx.card}>
                    <div style={sx.cardTitle}>Лист визирования</div>
                    <table className="reg-table" style={{ width: '100%' }}>
                        <thead>
                            <tr><th style={{ width: 34 }}>№</th><th>Роль</th><th>Исполнитель</th><th>Уровень</th><th>Отметка</th></tr>
                        </thead>
                        <tbody>
                            {route.map((r, i) => {
                                const done = i < doc.step
                                const cur = i === doc.step && !doc.returned && doc.step < route.length
                                return (
                                    <tr key={i} style={cur ? { background: 'var(--bg-panel)' } : undefined}>
                                        <td>{i + 1}</td>
                                        <td style={{ fontWeight: cur ? 700 : 500 }}>
                                            {r.role}
                                            {r.deputy && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>{r.deputy}</div>}
                                        </td>
                                        <td>
                                            {stepDelegated(r) ? (
                                                <>
                                                    <span style={{ color: '#b45309' }}>{stepDelegated(r).deputyName}</span>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>за {r.name}</div>
                                                </>
                                            ) : r.name}
                                        </td>
                                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.level}</td>
                                        <td>
                                            {done && <StatusDot tone="green">Подтверждено {doc.visas?.[i] || ''}</StatusDot>}
                                            {cur && <StatusDot tone="amber">На рассмотрении</StatusDot>}
                                            {!done && !cur && <StatusDot tone="gray">Ожидает</StatusDot>}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {current && !doc.returned && doc.step < 2 && (
                        <div style={sx.actionBox}>
                            <StatusDot tone="amber">Документ на стороне спортшколы — ожидается: {current.role}</StatusDot>
                        </div>
                    )}
                    {current && !doc.returned && doc.step >= 2 && (
                        <div style={sx.actionBox}>
                            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 10 }}>
                                Сейчас рассматривает: <b>{current.role}</b> — {current.name}
                                {curDeleg && (
                                    <div style={{ marginTop: 6, color: '#b45309' }}>
                                        Руководитель недоступен — подписывает <b>{curDeleg.deputy}</b> ({curDeleg.deputyName}){deleg[current.role]?.reason ? `, основание: ${deleg[current.role].reason}` : ''}.
                                    </div>
                                )}
                            </div>
                            {(acting === 'any' || acting === current.role) ? (
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    <Button variant="primary" onClick={approve}>Подтвердить — {current.role}</Button>
                                    <Button onClick={sendBack}>Вернуть на доработку</Button>
                                </div>
                            ) : (
                                <div style={{
                                    fontSize: 12.5, color: 'var(--text-secondary)', background: 'var(--bg-panel)',
                                    border: '1px solid var(--border-color)', borderRadius: 8, padding: '10px 12px', lineHeight: 1.5,
                                }}>
                                    Вы вошли как <b>{acting}</b> — сейчас не ваша очередь.
                                    Подтвердить этот шаг может только <b>{current.role}</b>.
                                </div>
                            )}
                        </div>
                    )}
                    {doc.returned && (
                        <div style={{ ...sx.actionBox, borderColor: '#fecaca' }}>
                            <StatusDot tone="red">Возвращён спортшколе — ожидается повторная подача</StatusDot>
                        </div>
                    )}
                    {doc.step >= route.length && (
                        <div style={{ ...sx.actionBox, borderColor: '#bbf7d0' }}>
                            <StatusDot tone="green">Документ утверждён директором ГАФКиС {doc.visas?.[route.length - 1] || ''}</StatusDot>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const sx = {
    grid: { display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(420px, 1.2fr)', gap: 16, alignItems: 'start' },
    card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 18px' },
    cardTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 },
    actionBox: { marginTop: 14, border: '1px solid var(--border-color)', borderRadius: 10, padding: '12px 14px', background: 'var(--bg-primary)' },
}
