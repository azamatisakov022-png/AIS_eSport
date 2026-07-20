import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { loadSchedules, saveSchedules, WEEK_DAYS } from './scheduleStore'

/* ЛК спортшколы: годовое расписание тренеров (обязательное, УРФКиМС 16.07.2026).
   Заполняет школа; ГАФКиС видит график и проводит внезапные выездные проверки. */

const MY_SCHOOL = 'СДЮСШ «Олимп»'

export default function SchoolCoachSchedule() {
    const toast = useToast()
    const [all, setAll] = useState(loadSchedules)
    const [form, setForm] = useState(null) // {coachId, day, from, to, venue}

    const mine = all.filter(c => c.school === MY_SCHOOL)

    const persist = (next) => { setAll(next); saveSchedules(next) }

    const addItem = () => {
        if (!form.from || !form.to || !form.venue.trim()) { toast('Заполните время и объект'); return }
        const next = all.map(c => c.id === form.coachId
            ? { ...c, items: [...c.items, { day: form.day, from: form.from, to: form.to, venue: form.venue.trim() }] }
            : c)
        persist(next)
        setForm(null)
        toast('Занятие добавлено в расписание')
    }

    const removeItem = (coachId, idx) => {
        const next = all.map(c => c.id === coachId ? { ...c, items: c.items.filter((_, i) => i !== idx) } : c)
        persist(next)
        toast('Занятие удалено')
    }

    return (
        <div>
            <h1 style={s.title}>Расписание тренеров · 2026</h1>
            <div style={s.note}>
                Заполнение расписания обязательно для каждой спортшколы (требование ГАФКиС).
                По этому графику Управление проводит выездные проверки занятий.
            </div>

            {mine.map(c => (
                <div key={c.id} style={s.card}>
                    <div style={s.cardHead}>
                        <div>
                            <div style={s.coachName}>{c.coach}</div>
                            <div style={s.coachSub}>{c.sport}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--text-primary)' }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.cert ? '#16a34a' : '#dc2626', flex: 'none' }} />
                                {c.cert ? 'Свидетельство: есть' : 'Нет тренерского свидетельства'}
                            </span>
                            <button style={s.addBtn} onClick={() => setForm({ coachId: c.id, day: 'Пн', from: '', to: '', venue: '' })}>+ Занятие</button>
                        </div>
                    </div>
                    {c.items.length === 0 ? (
                        <div style={s.empty}>Расписание не заполнено — добавьте занятия</div>
                    ) : (
                        <div style={s.chips}>
                            {c.items.map((it, i) => (
                                <span key={i} style={s.chip}>
                                    <b style={{ marginRight: 6 }}>{it.day}</b> {it.from}–{it.to} · {it.venue}
                                    <button style={s.chipX} title="Удалить" onClick={() => removeItem(c.id, i)}>✕</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {form && (
                <>
                    <div style={s.overlay} onClick={() => setForm(null)} />
                    <div style={s.modal}>
                        <div style={s.modalTitle}>Новое занятие</div>
                        <div style={s.formRow}>
                            <label style={s.label}>День недели</label>
                            <select style={s.input} value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                                {WEEK_DAYS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <div style={{ ...s.formRow, flex: 1 }}>
                                <label style={s.label}>С</label>
                                <input style={s.input} type="time" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} />
                            </div>
                            <div style={{ ...s.formRow, flex: 1 }}>
                                <label style={s.label}>До</label>
                                <input style={s.input} type="time" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
                            </div>
                        </div>
                        <div style={s.formRow}>
                            <label style={s.label}>Спортзал / объект</label>
                            <input style={s.input} placeholder="Зал борьбы, ул. Спортивная 12" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                            <button style={s.primaryBtn} onClick={addItem}>Добавить</button>
                            <button style={s.ghostBtn} onClick={() => setForm(null)}>Отмена</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

const s = {
    title: { fontSize: 24, fontWeight: 300, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: -0.3 },
    note: {
        background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '3px solid #2B5EA7',
        borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5,
    },
    card: {
        background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14,
        padding: '18px 20px', marginBottom: 14,
    },
    cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 12 },
    coachName: { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' },
    coachSub: { fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 },
    addBtn: {
        border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-secondary)',
        borderRadius: 8, padding: '6px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    },
    empty: { fontSize: 13, color: '#9a3412', background: '#fff7ed', borderRadius: 8, padding: '10px 14px' },
    chips: { display: 'flex', flexWrap: 'wrap', gap: 8 },
    chip: {
        display: 'inline-flex', alignItems: 'center', fontSize: 12.5, color: 'var(--text-primary)',
        background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '6px 10px',
    },
    chipX: { border: 'none', background: 'transparent', color: 'var(--text-muted)', marginLeft: 8, cursor: 'pointer', fontSize: 11 },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 90 },
    modal: {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 91,
        width: 'min(440px, calc(100vw - 40px))', background: 'var(--bg-card)', borderRadius: 14,
        padding: '22px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    },
    modalTitle: { fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 },
    formRow: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 },
    label: { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' },
    input: {
        padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13.5, fontFamily: 'inherit',
    },
    primaryBtn: {
        flex: 1, padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        background: 'linear-gradient(135deg, #1B3A6B, #2B5EA7)', color: '#fff', fontSize: 13.5, fontWeight: 700,
    },
    ghostBtn: {
        padding: '10px 16px', borderRadius: 9, border: '1px solid var(--border-color)', cursor: 'pointer', fontFamily: 'inherit',
        background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: 13.5, fontWeight: 600,
    },
}
