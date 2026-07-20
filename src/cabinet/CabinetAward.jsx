import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import EsiPassportField from '../components/EsiPassportField'
import { SPORTS } from '../pages/sportsData'
import { loadAwards, saveAwards, AWARD_LEVELS, awardRoute, awardStatus, awToday } from './awardsStore'

/* ЛК тренера/спортшколы: подача заявления на присвоение звания/разряда спортсмену.
   Разряды — спортшкола, КМС — область, МС/МСМК/ЗМС — полный маршрут (ГАФКиС). */

const MY_COACH = 'Иванов С.П.'
const MY_SCHOOL = 'СДЮСШ «Олимп»'
const MY_REGION = 'Чуйская область'

export default function CabinetAward() {
    const toast = useToast()
    const [awards, setAwards] = useState(loadAwards)
    const [form, setForm] = useState(null)
    const [expanded, setExpanded] = useState(null)

    const mine = awards.filter(a => a.coach === MY_COACH || a.school === MY_SCHOOL)
    const persist = (n) => { setAwards(n); saveAwards(n) }

    const startForm = () => setForm({ level: 'title', title: 'МС', esi: null, athlete: '', inn: '', sport: 'Дзюдо', discipline: '', competition: '' })

    const submit = () => {
        if (!form.athlete.trim() || !form.competition.trim()) { toast('Заполните спортсмена и результат (протокол)'); return }
        const count = awards.length + 1
        const doc = {
            id: Date.now(),
            num: `ЗВ-2026-${String(count).padStart(3, '0')}`,
            level: form.level, title: form.title,
            athlete: form.athlete.trim(), inn: form.inn || (form.esi && form.esi.inn) || '',
            sport: form.sport, discipline: form.discipline.trim(), competition: form.competition.trim(),
            region: MY_REGION, school: MY_SCHOOL, coach: MY_COACH,
            step: 1, returned: false, submittedAt: awToday(), visas: [awToday()], order: '', badgeIssued: false,
        }
        persist([doc, ...awards]); setForm(null); setExpanded(doc.id)
        toast(`Заявление на «${form.title}» подано — маршрут: ${AWARD_LEVELS[form.level].by}`)
    }

    return (
        <div>
            <h1 style={s.title}>Заявления на звания и разряды</h1>
            <div style={s.note}>
                Тренер подаёт за спортсмена. Разряды — присваивает спортшкола, КМС — областное управление,
                МС/МСМК/ЗМС — ГАФКиС по полному маршруту (федерация → Дирекция → ЦА). Протокол соревнований — бумажная копия с печатью.
            </div>

            {!form && <button style={s.primaryBtn} onClick={startForm}>Новое заявление</button>}

            {form && (
                <div style={s.card}>
                    <div style={s.cardTitle}>Новое заявление</div>
                    <EsiPassportField value={form.esi} onChange={(d) => setForm({ ...form, esi: d, athlete: d ? `${d.lastName} ${d.firstName} ${d.middleName}` : form.athlete, inn: d ? d.inn : form.inn })} />
                    <div style={s.formGrid}>
                        <Field label="Уровень / звание">
                            <select style={s.input} value={form.level} onChange={e => { const lv = e.target.value; setForm({ ...form, level: lv, title: AWARD_LEVELS[lv].order[0] }) }}>
                                {Object.entries(AWARD_LEVELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                        </Field>
                        <Field label="Конкретное звание/разряд">
                            <select style={s.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}>
                                {AWARD_LEVELS[form.level].order.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </Field>
                        <Field label="Спортсмен (ФИО)">
                            <input style={s.input} value={form.athlete} onChange={e => setForm({ ...form, athlete: e.target.value })} placeholder="из ЕСИ или вручную" />
                        </Field>
                        <Field label="Вид спорта">
                            <select style={s.input} value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })}>
                                {SPORTS.map(sp => <option key={sp.no + sp.name} value={sp.name}>{sp.name}</option>)}
                            </select>
                        </Field>
                        <Field label="Дисциплина">
                            <input style={s.input} value={form.discipline} onChange={e => setForm({ ...form, discipline: e.target.value })} placeholder="напр. весовые категории" />
                        </Field>
                        <Field label="Результат (протокол соревнований)" wide>
                            <input style={s.input} value={form.competition} onChange={e => setForm({ ...form, competition: e.target.value })} placeholder="Чемпионат КР 2026, 1 место" />
                        </Field>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                        <button style={s.primaryBtn} onClick={submit}>Подать заявление</button>
                        <button style={s.ghostBtn} onClick={() => setForm(null)}>Отмена</button>
                    </div>
                </div>
            )}

            <div style={{ marginTop: 20 }}>
                {mine.length === 0 && !form && <div style={s.empty}>Заявлений пока нет</div>}
                {mine.map(a => {
                    const st = awardStatus(a); const route = awardRoute(a)
                    return (
                        <div key={a.id} style={s.card}>
                            <div style={s.head} onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                                <div>
                                    <div style={s.docNum}>{a.num} · {a.title} · {a.athlete}</div>
                                    <div style={s.docSub}>{a.sport} · подан {a.submittedAt}</div>
                                </div>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5 }}>
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: st.tone === 'green' ? '#16a34a' : st.tone === 'red' ? '#dc2626' : '#d97706' }} />
                                    {st.label}
                                </span>
                            </div>
                            {expanded === a.id && (
                                <table style={s.table}>
                                    <thead><tr><th style={s.th}>№</th><th style={s.th}>Роль</th><th style={s.th}>Отметка</th></tr></thead>
                                    <tbody>
                                        {route.map((r, i) => (
                                            <tr key={i}>
                                                <td style={s.td}>{i + 1}</td>
                                                <td style={{ ...s.td, fontWeight: i === a.step && !a.returned ? 700 : 400 }}>{r.role}</td>
                                                <td style={s.td}>{i < a.step ? `✓ ${a.visas?.[i] || ''}` : (i === a.step && !a.returned ? 'на рассмотрении' : 'ожидает')}</td>
                                            </tr>
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

function Field({ label, wide, children }) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: wide ? '1 / -1' : undefined }}><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{label}</label>{children}</div>
}

const s = {
    title: { fontSize: 24, fontWeight: 300, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: -0.3 },
    note: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '3px solid #2B5EA7', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.55 },
    card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 20px', marginBottom: 12 },
    cardTitle: { fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 14 },
    input: { padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13.5, fontFamily: 'inherit' },
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
