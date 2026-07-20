import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import {
    loadReports, saveReports, reportStatus, periodLabel, sectionCount, rpToday,
    REPORT_SECTIONS, RANK_OPTIONS, MEDAL_OPTIONS, MY_ORG, emptySections,
} from './reportsStore'

/* ЛК подведомственной организации: ежемесячный отчёт в отдел СВД.
   4 раздела (звания, медали межд., мероприятия, УТС) — данные вводятся вручную. */

/* Текущий период по умолчанию — прошлый месяц (отчёт сдаётся за прошедший). */
function defaultPeriod() {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return d.toISOString().slice(0, 7)
}

export default function CabinetReports() {
    const toast = useToast()
    const [list, setList] = useState(loadReports)
    const [form, setForm] = useState(null)
    const [expanded, setExpanded] = useState(null)

    const mine = list.filter(r => r.org === MY_ORG.name)
    const persist = (n) => { setList(n); saveReports(n) }

    const start = () => setForm({ period: defaultPeriod(), note: '', ...emptySections() })

    const addRow = (key) => {
        const cols = REPORT_SECTIONS.find(s => s.key === key).cols
        const row = {}; cols.forEach(c => { row[c.key] = '' })
        setForm(f => ({ ...f, [key]: [...f[key], row] }))
    }
    const setCell = (key, i, col, val) => setForm(f => ({ ...f, [key]: f[key].map((r, j) => j === i ? { ...r, [col]: val } : r) }))
    const delRow = (key, i) => setForm(f => ({ ...f, [key]: f[key].filter((_, j) => j !== i) }))

    const submit = () => {
        const clean = {}
        let anyRow = false
        REPORT_SECTIONS.forEach(s => {
            const rows = form[s.key].filter(r => Object.values(r).some(v => String(v).trim()))
            clean[s.key] = rows
            if (rows.length) anyRow = true
        })
        if (!anyRow) { toast('Заполните хотя бы один раздел отчёта'); return }
        const samePeriod = mine.filter(r => r.period === form.period).length
        const seq = String(list.length + 1).padStart(3, '0')
        const doc = {
            id: Date.now(),
            num: `ОТЧ-${form.period}-${seq}`,
            org: MY_ORG.name, orgType: MY_ORG.type, region: MY_ORG.region,
            period: form.period, status: 'submitted', submittedAt: rpToday(),
            acceptedAt: '', reviewer: '', note: form.note.trim(),
            ...clean,
        }
        if (samePeriod) { toast(`За ${periodLabel(form.period)} отчёт уже подавался — будет добавлен повторный`) }
        persist([doc, ...list]); setForm(null); setExpanded(doc.id)
        toast(`Отчёт за ${periodLabel(form.period)} направлен в отдел СВД`)
    }

    return (
        <div>
            <h1 style={s.title}>Ежемесячный отчёт</h1>
            <div style={s.note}>
                Подведомственная организация ежемесячно направляет отчёт в отдел СВД ГАФКиС: присвоенные звания и разряды,
                медали на международных соревнованиях, проведённые мероприятия, учебно-тренировочные сборы (УТС).
                Отдел СВД принимает отчёты и формирует своды.
            </div>

            {!form && <button style={s.primaryBtn} onClick={start}>Новый отчёт</button>}

            {form && (
                <div style={s.card}>
                    <div style={s.cardTitle}>Новый отчёт · {MY_ORG.name}</div>
                    <div style={s.formGrid}>
                        <Field label="Отчётный период">
                            <input style={s.input} type="month" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} />
                        </Field>
                    </div>

                    {REPORT_SECTIONS.map(sec => (
                        <div key={sec.key} style={{ marginTop: 18 }}>
                            <div style={s.secHead}>{sec.label} <span style={s.secCount}>{form[sec.key].length}</span></div>
                            {form[sec.key].map((row, i) => (
                                <div key={i} style={s.rowWrap}>
                                    {sec.cols.map(col => (
                                        <div key={col.key} style={{ flex: col.flex, minWidth: 0 }}>
                                            {col.type === 'rank' ? (
                                                <select style={s.input} value={row[col.key]} onChange={e => setCell(sec.key, i, col.key, e.target.value)}>
                                                    <option value="">—</option>
                                                    {RANK_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            ) : col.type === 'medal' ? (
                                                <select style={s.input} value={row[col.key]} onChange={e => setCell(sec.key, i, col.key, e.target.value)}>
                                                    <option value="">—</option>
                                                    {MEDAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            ) : (
                                                <input style={s.input} type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                                                    placeholder={col.ph || col.label} value={row[col.key]}
                                                    onChange={e => setCell(sec.key, i, col.key, e.target.value)} />
                                            )}
                                        </div>
                                    ))}
                                    <button style={s.rowX} onClick={() => delRow(sec.key, i)} title="Удалить строку">✕</button>
                                </div>
                            ))}
                            <button style={s.ghostBtn} onClick={() => addRow(sec.key)}>+ Добавить строку</button>
                        </div>
                    ))}

                    <div style={{ marginTop: 18 }}>
                        <Field label="Примечание (необязательно)">
                            <textarea style={{ ...s.input, minHeight: 60, resize: 'vertical' }} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Комментарий к отчёту" />
                        </Field>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                        <button style={s.primaryBtn} onClick={submit}>Направить в отдел СВД</button>
                        <button style={s.ghostBtn} onClick={() => setForm(null)}>Отмена</button>
                    </div>
                </div>
            )}

            <div style={{ marginTop: 20 }}>
                {mine.length === 0 && !form && <div style={s.empty}>Отчётов пока нет</div>}
                {mine.map(r => {
                    const st = reportStatus(r)
                    return (
                        <div key={r.id} style={s.card}>
                            <div style={s.head} onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                                <div>
                                    <div style={s.docNum}>{r.num} · {periodLabel(r.period)}</div>
                                    <div style={s.docSub}>подан {r.submittedAt}</div>
                                </div>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5 }}>
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: st.tone === 'green' ? '#16a34a' : st.tone === 'red' ? '#dc2626' : '#d97706' }} />
                                    {st.label}
                                </span>
                            </div>
                            {expanded === r.id && (
                                <div style={{ marginTop: 12 }}>
                                    <div style={s.chips}>
                                        {REPORT_SECTIONS.map(sec => (
                                            <span key={sec.key} style={s.chip}>{sec.label.split(' (')[0]}: <b>{sectionCount(r, sec.key)}</b></span>
                                        ))}
                                    </div>
                                    {r.note && <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 10 }}>Примечание: {r.note}</div>}
                                    {r.status === 'accepted' && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Принят {r.acceptedAt} · {r.reviewer}</div>}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function Field({ label, children }) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{label}</label>{children}</div>
}

const s = {
    title: { fontSize: 24, fontWeight: 300, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: -0.3 },
    note: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '3px solid #2B5EA7', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.55 },
    card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 20px', marginBottom: 12 },
    cardTitle: { fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 },
    input: { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13.5, fontFamily: 'inherit', boxSizing: 'border-box' },
    secHead: { fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 },
    secCount: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-panel)', borderRadius: 10, padding: '1px 8px' },
    rowWrap: { display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' },
    rowX: { border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, flex: '0 0 auto' },
    head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', cursor: 'pointer' },
    docNum: { fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)' },
    docSub: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
    chips: { display: 'flex', gap: 8, flexWrap: 'wrap' },
    chip: { fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '4px 10px' },
    empty: { fontSize: 13.5, color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px dashed var(--border-color)', borderRadius: 12, padding: 24, textAlign: 'center' },
    primaryBtn: { padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: 'linear-gradient(135deg, #1B3A6B, #2B5EA7)', color: '#fff', fontSize: 13.5, fontWeight: 700 },
    ghostBtn: { padding: '9px 14px', borderRadius: 9, border: '1px solid var(--border-color)', cursor: 'pointer', fontFamily: 'inherit', background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 },
}
