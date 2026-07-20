import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { loadApprovals, saveApprovals, DOC_TYPES, routeFor, statusOf, today } from './approvalStore'

/* ЛК спортшколы: заявление одного типа — «Тарификация тренеров» или «План комплектования»
   (процессы УРФКиМС, 16.07.2026). Электронная форма заполняется вручную построчно,
   затем документ идёт по маршруту визирования; ход виден в листе визирования. */

const MY_SCHOOL = 'СДЮСШ «Олимп»'
const MY_REGION = 'Чуйская область'

const FORM_META = {
    tarif: {
        columns: ['Тренер (ФИО)', 'Вид спорта', 'Ставка', 'Нагрузка, ч/нед', 'Учеников'],
        emptyRow: ['', '', '', '', ''],
        starter: [
            ['Иванов Сергей Петрович', 'Дзюдо', '1.0', '18', '14'],
            ['Касымова Айгуль Талантовна', 'Лёгкая атлетика', '1.0', '16', '12'],
        ],
        filledBy: 'бухгалтер спортшколы',
    },
    plan: {
        columns: ['Вид спорта', 'Группа', 'Мест', 'Тренер'],
        emptyRow: ['', '', '', ''],
        starter: [
            ['Дзюдо', 'НП-1', '15', 'Иванов С.П.'],
            ['Лёгкая атлетика', 'НП-1', '16', 'Касымова А.Т.'],
        ],
        filledBy: 'заместитель директора спортшколы',
    },
}

export default function SchoolDoc({ type }) {
    const toast = useToast()
    const meta = DOC_TYPES[type]
    const form = FORM_META[type]
    const route = routeFor(type)
    const [docs, setDocs] = useState(loadApprovals)
    const [draft, setDraft] = useState(null) // rows массив или null
    const [expanded, setExpanded] = useState(null)

    const mine = docs.filter(d => d.type === type && d.school === MY_SCHOOL)
    const persist = (next) => { setDocs(next); saveApprovals(next) }

    const setCell = (ri, ci, v) => setDraft(draft.map((r, i) => i === ri ? r.map((c, j) => j === ci ? v : c) : r))

    const submit = () => {
        const rows = draft.filter(r => r.some(c => c.trim()))
        if (!rows.length) { toast('Заполните хотя бы одну строку'); return }
        const count = docs.filter(d => d.type === type).length + 1
        const doc = {
            id: Date.now(),
            num: `${meta.prefix}-2026-${String(count).padStart(3, '0')}`,
            type, school: MY_SCHOOL, region: MY_REGION, year: 2026,
            step: 1, returned: false, submittedAt: today(),
            visas: [today()], rows,
        }
        persist([doc, ...docs])
        setDraft(null)
        setExpanded(doc.id)
        toast(`Заявление отправлено — ожидает подтверждения директора школы`)
    }

    const confirmDirector = (doc) => {
        persist(docs.map(d => d.id === doc.id ? { ...d, step: 2, returned: false, visas: [...(d.visas || []), today()] } : d))
        toast('Подтверждено директором школы — документ ушёл в областное управление')
    }

    const resubmit = (doc) => {
        persist(docs.map(d => d.id === doc.id ? { ...d, returned: false, step: 1, visas: [today()] } : d))
        toast('Заявление отправлено повторно')
    }

    return (
        <div>
            <h1 style={s.title}>{meta.label}</h1>
            <div style={s.note}>
                Заполняет: <b>{form.filledBy}</b>. Маршрут: спортшкола → областное управление → Центральный аппарат ГАФКиС → директор (при отсутствии — заместитель).
            </div>

            {!draft && (
                <button style={s.primaryBtn} onClick={() => setDraft(form.starter.map(r => [...r]))}>
                    Новое заявление · 2026
                </button>
            )}

            {/* Электронная форма: строки вводятся вручную */}
            {draft && (
                <div style={s.card}>
                    <div style={s.cardTitle}>Новое заявление — {meta.label.toLowerCase()} · 2026</div>
                    <table style={s.table}>
                        <thead>
                            <tr>{form.columns.map(h => <th key={h} style={s.th}>{h}</th>)}<th style={{ ...s.th, width: 36 }}></th></tr>
                        </thead>
                        <tbody>
                            {draft.map((row, ri) => (
                                <tr key={ri}>
                                    {row.map((cell, ci) => (
                                        <td key={ci} style={s.tdInput}>
                                            <input style={s.cellInput} value={cell} onChange={e => setCell(ri, ci, e.target.value)} />
                                        </td>
                                    ))}
                                    <td style={s.tdInput}>
                                        <button style={s.rowX} title="Удалить строку" onClick={() => setDraft(draft.filter((_, i) => i !== ri))}>✕</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button style={s.ghostBtn} onClick={() => setDraft([...draft, [...form.emptyRow]])}>+ Добавить строку</button>
                    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                        <button style={s.primaryBtn} onClick={submit}>Отправить на согласование</button>
                        <button style={s.ghostBtn} onClick={() => setDraft(null)}>Отмена</button>
                    </div>
                </div>
            )}

            <div style={{ marginTop: 20 }}>
                {mine.length === 0 && !draft && <div style={s.emptyBig}>Заявлений пока нет</div>}
                {mine.map(d => {
                    const st = statusOf(d)
                    return (
                        <div key={d.id} style={s.card}>
                            <div style={s.cardHead} onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                                <div>
                                    <div style={s.docNum}>{d.num} · {d.year}</div>
                                    <div style={s.docSub}>Подан: {d.submittedAt} · строк: {d.rows.length}</div>
                                </div>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5 }}>
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: st.tone === 'green' ? '#16a34a' : st.tone === 'red' ? '#dc2626' : '#d97706' }} />
                                    {st.label}
                                </span>
                            </div>
                            {expanded === d.id && (
                                <div style={{ marginTop: 12 }}>
                                    {/* Лист визирования */}
                                    <table style={s.table}>
                                        <thead>
                                            <tr><th style={{ ...s.th, width: 30 }}>№</th><th style={s.th}>Роль</th><th style={s.th}>Исполнитель</th><th style={s.th}>Отметка</th></tr>
                                        </thead>
                                        <tbody>
                                            {routeFor(d.type).map((r, i) => {
                                                const done = i < d.step
                                                const cur = i === d.step && !d.returned && d.step < routeFor(d.type).length
                                                return (
                                                    <tr key={i} style={cur ? { background: 'var(--bg-panel)' } : undefined}>
                                                        <td style={s.td}>{i + 1}</td>
                                                        <td style={{ ...s.td, fontWeight: cur ? 700 : 400 }}>{r.role}</td>
                                                        <td style={s.td}>{r.name}</td>
                                                        <td style={s.td}>
                                                            {done ? `Подтверждено ${d.visas?.[i] || ''}` : cur ? 'На рассмотрении' : 'Ожидает'}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                    {d.step === 1 && !d.returned && (
                                        <button style={{ ...s.primaryBtn, marginTop: 12 }} onClick={() => confirmDirector(d)}>
                                            Подтвердить — директор спортшколы
                                        </button>
                                    )}
                                    {d.returned && (
                                        <div style={s.returnedNote}>
                                            Возвращён на доработку.
                                            <button style={{ ...s.ghostBtn, marginLeft: 10 }} onClick={() => resubmit(d)}>Отправить повторно</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const s = {
    title: { fontSize: 24, fontWeight: 300, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: -0.3 },
    note: {
        background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '3px solid #2B5EA7',
        borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.55,
    },
    card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 20px', marginBottom: 12 },
    cardTitle: { fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 },
    cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', cursor: 'pointer' },
    docNum: { fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)' },
    docSub: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 12.5, marginBottom: 10 },
    th: { textAlign: 'left', padding: '8px 10px', background: 'var(--bg-panel)', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11.5 },
    td: { padding: '8px 10px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' },
    tdInput: { padding: '4px 4px', borderBottom: '1px solid var(--border-color)' },
    cellInput: {
        width: '100%', padding: '7px 9px', borderRadius: 6, border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 12.5, fontFamily: 'inherit', boxSizing: 'border-box',
    },
    rowX: { border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 },
    returnedNote: { marginTop: 12, fontSize: 13, color: '#991b1b', background: 'var(--bg-primary)', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px' },
    emptyBig: { fontSize: 13.5, color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px dashed var(--border-color)', borderRadius: 12, padding: 24, textAlign: 'center' },
    primaryBtn: {
        padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        background: 'linear-gradient(135deg, #1B3A6B, #2B5EA7)', color: '#fff', fontSize: 13.5, fontWeight: 700,
    },
    ghostBtn: {
        padding: '9px 14px', borderRadius: 9, border: '1px solid var(--border-color)', cursor: 'pointer', fontFamily: 'inherit',
        background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
    },
}
