import { useState, Fragment } from 'react'
import { useToast } from '../context/ToastContext'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, StatusDot } from '../components/ui'
import './registries.css'

/* Служебный портал: календарные планы региональных управлений (УРФКиМС, 16.07.2026).
   Защита плана проходит ТОЛЬКО ОЧНО (вне АИС). После защиты сотрудник регионального
   управления вносит утверждённый план в электронную форму — мероприятия построчно;
   план доступен Центральному аппарату. */

const EMPTY_EVENT = ['', '', '', '']
const EVENT_COLUMNS = ['Мероприятие', 'Дата (месяц)', 'Место проведения', 'Вид спорта']

const SEED = [
    {
        region: 'Главное управление (Бишкек)', year: 2026, by: 'Сатыбалдиев К.Ж.', date: '2026-01-20',
        events: [
            ['Чемпионат города по дзюдо', 'Март', 'Дворец спорта им. Кожомкулова', 'Дзюдо'],
            ['Кубок Президента КР', 'Май', 'Стадион «Спартак»', 'Лёгкая атлетика'],
            ['Первенство города среди юношей', 'Сентябрь', 'УОР Бишкек', 'Бокс'],
        ],
    },
    {
        region: 'Чуйская область', year: 2026, by: 'Осмонова Г.А.', date: '2026-01-27',
        events: [
            ['Первенство области по борьбе', 'Апрель', 'ДЮСШ Токмок', 'Борьба'],
            ['Спартакиада школьников', 'Июнь', 'Кара-Балта', 'Многоборье'],
        ],
    },
    {
        region: 'Ошская область', year: 2026, by: 'Турдалиев М.С.', date: '2026-02-03',
        events: [
            ['Чемпионат области', 'Март', 'Стадион г. Ош', 'Футбол'],
            ['Турнир памяти К. Датки', 'Октябрь', 'Стадион г. Ош', 'Борьба'],
        ],
    },
    { region: 'Иссык-Кульская область', year: 2026, by: null, date: null, events: null },
    {
        region: 'Джалал-Абадская область', year: 2026, by: 'Жумабеков Э.К.', date: '2026-02-10',
        events: [['Первенство области среди ДЮСШ', 'Май', 'Стадион Джалал-Абад', 'Лёгкая атлетика']],
    },
    { region: 'Нарынская область', year: 2026, by: null, date: null, events: null },
    { region: 'Таласская область', year: 2026, by: null, date: null, events: null },
    { region: 'Баткенская область', year: 2026, by: 'Кадырова А.М.', date: '2026-02-14', events: [['Областная спартакиада', 'Апрель', 'ДЮСШ Баткен', 'Многоборье']] },
]

export default function CalendarPlans() {
    const toast = useToast()
    const [plans, setPlans] = useState(SEED)
    const [expanded, setExpanded] = useState(null)
    const [form, setForm] = useState(null) // { region, rows }

    const uploaded = plans.filter(p => p.events).length

    const openForm = () => {
        const firstEmpty = plans.find(p => !p.events)?.region || plans[0].region
        setForm({ region: firstEmpty, rows: [[...EMPTY_EVENT], [...EMPTY_EVENT]] })
    }

    const setCell = (ri, ci, v) => setForm({ ...form, rows: form.rows.map((r, i) => i === ri ? r.map((c, j) => j === ci ? v : c) : r) })

    const save = () => {
        const rows = form.rows.filter(r => r.some(c => c.trim()))
        if (!rows.length) { toast('Внесите хотя бы одно мероприятие'); return }
        setPlans(plans.map(p => p.region === form.region
            ? { ...p, events: rows, by: 'Сотрудник рег. управления', date: new Date().toISOString().slice(0, 10) }
            : p))
        setForm(null)
        toast(`Календарный план внесён: ${form.region}`)
    }

    return (
        <div className="reg">
            <Breadcrumbs current="Календарные планы" />
            <PageHeader
                title="Календарные планы регионов"
                subtitle={`Внесено: ${uploaded} из ${plans.length} · 2026 год`}
                actions={<Button variant="primary" onClick={openForm}>Внести план</Button>}
            />

            <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '3px solid #c88a2d',
                borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5,
            }}>
                Защита календарного плана проходит <b>очно</b> в ГАФКиС — онлайн-подачи и онлайн-защиты нет.
                После успешной защиты сотрудник регионального управления вносит утверждённый план в электронную форму;
                план доступен сотрудникам Центрального аппарата.
            </div>

            <div className="reg-table-wrap">
                <table className="reg-table">
                    <thead>
                        <tr>
                            <th>Региональное управление</th>
                            <th>Год</th>
                            <th>Мероприятий</th>
                            <th>Внёс</th>
                            <th>Дата внесения</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map(p => (
                            <Fragment key={p.region}>
                                <tr style={p.events ? { cursor: 'pointer' } : undefined} onClick={() => p.events && setExpanded(expanded === p.region ? null : p.region)}>
                                    <td style={{ fontWeight: 600 }}>{p.region}</td>
                                    <td>{p.year}</td>
                                    <td>{p.events ? p.events.length : '—'}</td>
                                    <td>{p.by || '—'}</td>
                                    <td>{p.date || '—'}</td>
                                    <td>
                                        {p.events
                                            ? <StatusDot tone="green">Утверждён (очная защита)</StatusDot>
                                            : <StatusDot tone="gray">Не внесён</StatusDot>}
                                    </td>
                                </tr>
                                {expanded === p.region && p.events && (
                                    <tr>
                                        <td colSpan={6} style={{ background: 'var(--bg-panel)', padding: '12px 18px' }}>
                                            <table className="reg-table" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>{EVENT_COLUMNS.map(h => <th key={h}>{h}</th>)}</tr>
                                                </thead>
                                                <tbody>
                                                    {p.events.map((ev, i) => (
                                                        <tr key={i}>{ev.map((c, j) => <td key={j}>{c}</td>)}</tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {form && (
                <>
                    <div style={st.overlay} onClick={() => setForm(null)} />
                    <div style={st.modal}>
                        <div style={st.modalTitle}>Внесение утверждённого календарного плана · 2026</div>
                        <div style={st.formRow}>
                            <label style={st.label}>Региональное управление</label>
                            <select style={st.input} value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}>
                                {plans.map(p => <option key={p.region}>{p.region}</option>)}
                            </select>
                        </div>
                        <div style={{ ...st.label, marginBottom: 6 }}>Мероприятия плана (вносятся вручную)</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>{EVENT_COLUMNS.map(h => <th key={h} style={st.th}>{h}</th>)}<th style={{ ...st.th, width: 32 }}></th></tr>
                            </thead>
                            <tbody>
                                {form.rows.map((row, ri) => (
                                    <tr key={ri}>
                                        {row.map((cell, ci) => (
                                            <td key={ci} style={{ padding: 3 }}>
                                                <input style={st.cellInput} value={cell} onChange={e => setCell(ri, ci, e.target.value)} />
                                            </td>
                                        ))}
                                        <td style={{ padding: 3 }}>
                                            <button style={st.rowX} title="Удалить" onClick={() => setForm({ ...form, rows: form.rows.filter((_, i) => i !== ri) })}>✕</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button style={st.ghost} onClick={() => setForm({ ...form, rows: [...form.rows, [...EMPTY_EVENT]] })}>+ Добавить мероприятие</button>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', margin: '10px 0 14px' }}>
                            Вносится только план, прошедший очную защиту в ГАФКиС.
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <Button variant="primary" onClick={save}>Сохранить план</Button>
                            <Button onClick={() => setForm(null)}>Отмена</Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

const st = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 90 },
    modal: {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 91,
        width: 'min(720px, calc(100vw - 40px))', background: 'var(--bg-card)', borderRadius: 14,
        padding: '22px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', maxHeight: '85vh', overflowY: 'auto',
    },
    modalTitle: { fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 },
    formRow: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 },
    label: { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' },
    input: {
        padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13.5, fontFamily: 'inherit',
    },
    th: { textAlign: 'left', padding: '7px 9px', background: 'var(--bg-panel)', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11.5 },
    cellInput: {
        width: '100%', padding: '7px 9px', borderRadius: 6, border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 12.5, fontFamily: 'inherit', boxSizing: 'border-box',
    },
    rowX: { border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 },
    ghost: {
        marginTop: 8, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)', cursor: 'pointer',
        background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
    },
}
