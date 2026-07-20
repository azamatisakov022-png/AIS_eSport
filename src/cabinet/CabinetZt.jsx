import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import EsiPassportField from '../components/EsiPassportField'
import { SPORTS } from '../pages/sportsData'
import { loadZt, saveZt, ZT_ROUTE, ZT_DOCS, ztStatus, ztToday } from './ztStore'

/* ЛК тренера: подача на звание «Заслуженный тренер КР». Пакет документов, стаж,
   список подготовленных спортсменов с регалиями. Паспорт — из ЕСИ. */

const MY_COACH = 'Иванов Сергей Петрович'
const RANKS = ['III разряд', 'II разряд', 'I разряд', 'КМС', 'МС', 'МСМК', 'ЗМС']

export default function CabinetZt() {
    const toast = useToast()
    const [list, setList] = useState(loadZt)
    const [form, setForm] = useState(null)
    const [expanded, setExpanded] = useState(null)

    const mine = list.filter(z => z.coach === MY_COACH)
    const persist = (n) => { setList(n); saveZt(n) }

    const start = () => setForm({
        esi: null, inn: '', sport: 'Дзюдо', federation: '', experience: '',
        docs: { photo: false, labor: false, noCriminal: false, certificate: false, students: false },
        students: [{ name: '', rank: 'МС' }],
    })

    const submit = () => {
        if (!form.esi) { toast('Подтяните паспорт из ЕСИ'); return }
        if (!form.experience) { toast('Укажите стаж'); return }
        const students = form.students.filter(s => s.name.trim())
        if (!students.length) { toast('Добавьте хотя бы одного подготовленного спортсмена'); return }
        const count = list.length + 1
        const doc = {
            id: Date.now(), num: `ЗТ-2026-${String(count).padStart(3, '0')}`,
            coach: `${form.esi.lastName} ${form.esi.firstName} ${form.esi.middleName}`, inn: form.esi.inn,
            sport: form.sport, region: 'Чуйская область', federation: form.federation.trim() || `Федерация (${form.sport})`,
            experience: Number(form.experience), students,
            docs: { ...form.docs, students: true },
            step: 1, returned: false, submittedAt: ztToday(), visas: [ztToday()], order: '', badgeIssued: false,
        }
        persist([doc, ...list]); setForm(null); setExpanded(doc.id)
        toast('Заявление на «Заслуженный тренер» подано в федерацию')
    }

    const setStudent = (i, patch) => setForm({ ...form, students: form.students.map((s, j) => j === i ? { ...s, ...patch } : s) })

    return (
        <div>
            <h1 style={s.title}>Заслуженный тренер</h1>
            <div style={s.note}>
                Подача на звание «Заслуженный тренер КР». Маршрут: федерация → Дирекция по видам спорта → ЦА ГАФКиС → директор.
                Критерий ЕСК: стаж {'>'} 25 лет и {'>'} 10 подготовленных мастеров спорта (либо призёры ОИ/ЧМ/Азиады).
            </div>

            {!form && <button style={s.primaryBtn} onClick={start}>Новое заявление</button>}

            {form && (
                <div style={s.card}>
                    <div style={s.cardTitle}>Новое заявление · Заслуженный тренер</div>
                    <EsiPassportField value={form.esi} onChange={(d) => setForm({ ...form, esi: d, inn: d ? d.inn : '' })} />

                    <div style={s.formGrid}>
                        <Field label="Вид спорта">
                            <select style={s.input} value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })}>
                                {SPORTS.map(sp => <option key={sp.no + sp.name} value={sp.name}>{sp.name}</option>)}
                            </select>
                        </Field>
                        <Field label="Федерация">
                            <input style={s.input} value={form.federation} onChange={e => setForm({ ...form, federation: e.target.value })} placeholder="Федерация дзюдо КР" />
                        </Field>
                        <Field label="Тренерский стаж, лет">
                            <input style={s.input} type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="27" />
                        </Field>
                    </div>

                    <div style={{ ...s.cardTitle, marginTop: 16, fontSize: 13 }}>Пакет документов</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {ZT_DOCS.filter(d => d.key !== 'students').map(d => (
                            <label key={d.key} style={s.check}>
                                <input type="checkbox" checked={!!form.docs[d.key]} onChange={e => setForm({ ...form, docs: { ...form.docs, [d.key]: e.target.checked } })} />
                                <span>{d.label}</span>
                            </label>
                        ))}
                    </div>

                    <div style={{ ...s.cardTitle, marginTop: 16, fontSize: 13 }}>Подготовленные спортсмены (список заверяется печатью организации)</div>
                    {form.students.map((st, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                            <input style={{ ...s.input, flex: '1 1 260px' }} placeholder="ФИО спортсмена" value={st.name} onChange={e => setStudent(i, { name: e.target.value })} />
                            <select style={{ ...s.input, flex: '0 0 130px' }} value={st.rank} onChange={e => setStudent(i, { rank: e.target.value })}>
                                {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <button style={s.rowX} onClick={() => setForm({ ...form, students: form.students.filter((_, j) => j !== i) })}>✕</button>
                        </div>
                    ))}
                    <button style={s.ghostBtn} onClick={() => setForm({ ...form, students: [...form.students, { name: '', rank: 'МС' }] })}>+ Добавить спортсмена</button>

                    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                        <button style={s.primaryBtn} onClick={submit}>Подать заявление</button>
                        <button style={s.ghostBtn} onClick={() => setForm(null)}>Отмена</button>
                    </div>
                </div>
            )}

            <div style={{ marginTop: 20 }}>
                {mine.length === 0 && !form && <div style={s.empty}>Заявлений пока нет</div>}
                {mine.map(z => {
                    const st = ztStatus(z)
                    return (
                        <div key={z.id} style={s.card}>
                            <div style={s.head} onClick={() => setExpanded(expanded === z.id ? null : z.id)}>
                                <div>
                                    <div style={s.docNum}>{z.num} · {z.sport}</div>
                                    <div style={s.docSub}>подан {z.submittedAt} · спортсменов: {z.students.length}</div>
                                </div>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5 }}>
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: st.tone === 'green' ? '#16a34a' : st.tone === 'red' ? '#dc2626' : '#d97706' }} />
                                    {st.label}
                                </span>
                            </div>
                            {expanded === z.id && (
                                <table style={s.table}>
                                    <thead><tr><th style={s.th}>№</th><th style={s.th}>Роль</th><th style={s.th}>Отметка</th></tr></thead>
                                    <tbody>
                                        {ZT_ROUTE.map((r, i) => (
                                            <tr key={i}><td style={s.td}>{i + 1}</td><td style={{ ...s.td, fontWeight: i === z.step && !z.returned ? 700 : 400 }}>{r.role}</td><td style={s.td}>{i < z.step ? `✓ ${z.visas?.[i] || ''}` : (i === z.step && !z.returned ? 'на рассмотрении' : 'ожидает')}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
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
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 14 },
    input: { padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13.5, fontFamily: 'inherit', boxSizing: 'border-box' },
    check: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer' },
    rowX: { border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 },
    head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', cursor: 'pointer' },
    docNum: { fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)' },
    docSub: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 12.5, marginTop: 12 },
    th: { textAlign: 'left', padding: '7px 9px', background: 'var(--bg-panel)', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11.5 },
    td: { padding: '7px 9px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' },
    empty: { fontSize: 13.5, color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px dashed var(--border-color)', borderRadius: 12, padding: 24, textAlign: 'center' },
    primaryBtn: { padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: 'linear-gradient(135deg, #1B3A6B, #2B5EA7)', color: '#fff', fontSize: 13.5, fontWeight: 700 },
    ghostBtn: { padding: '9px 14px', borderRadius: 9, border: '1px solid var(--border-color)', cursor: 'pointer', fontFamily: 'inherit', background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 },
}
