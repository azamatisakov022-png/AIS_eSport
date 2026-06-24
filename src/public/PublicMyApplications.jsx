import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { awardsApi, judgeAppsApi, trainerAppsApi } from '../api/esport'

// Человекочитаемые подписи статусов тренерских заявок (на бэке — коды)
const TRAINER_LABELS = {
    submitted: 'Подана',
    review: 'На рассмотрении',
    revision: 'Требует доработки',
    registered: 'Зарегистрирован',
    rejected: 'Отказано',
    annulled: 'Аннулировано',
}

// Классификация статуса для цвета: done / rejected / progress
const DONE = ['Присвоено', 'Выдано удостоверение', 'Записано', 'Зарегистрирован']
const NEGATIVE = ['Отклонена', 'Отказано', 'Отозвана', 'Аннулировано']
function stateClass(label) {
    if (DONE.includes(label)) return 'done'
    if (NEGATIVE.includes(label)) return 'neg'
    return 'progress'
}

const SERVICES = {
    award: { name: 'Звание / разряд', color: '#2563EB' },
    judge: { name: 'Судейская категория', color: '#7C3AED' },
    trainer: { name: 'Свидетельство тренера', color: '#16a34a' },
}

const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'

export default function PublicMyApplications() {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [q, setQ] = useState('')

    useEffect(() => {
        let alive = true
        Promise.allSettled([
            awardsApi.list({ size: 100 }),
            judgeAppsApi.list({ size: 100 }),
            trainerAppsApi.list({ size: 100 }),
        ]).then(([aw, jd, tr]) => {
            if (!alive) return
            const out = []
            if (aw.status === 'fulfilled') {
                for (const a of aw.value.items) out.push({
                    key: 'A' + a.id, service: 'award', appNo: a.appNo, applicant: a.applicantName,
                    subject: a.award, sport: a.sport, date: a.submitDate, label: a.status,
                })
            }
            if (jd.status === 'fulfilled') {
                for (const a of jd.value.items) out.push({
                    key: 'J' + a.id, service: 'judge', appNo: a.appNo, applicant: a.applicantName,
                    subject: a.requestedCategory, sport: a.sport, date: a.submitDate, label: a.status,
                })
            }
            if (tr.status === 'fulfilled') {
                for (const a of tr.value.items) out.push({
                    key: 'T' + a.id, service: 'trainer', appNo: a.appNo, applicant: a.applicantName,
                    subject: a.certNumber ? `Свидетельство ${a.certNumber}` : 'Свидетельство тренера',
                    sport: a.sport, date: a.submitDate, label: TRAINER_LABELS[a.status] || a.status,
                })
            }
            if (aw.status === 'rejected' && jd.status === 'rejected' && tr.status === 'rejected') setError(true)
            out.sort((x, y) => (y.date || '').localeCompare(x.date || ''))
            setRows(out)
            setLoading(false)
        })
        return () => { alive = false }
    }, [])

    const filtered = useMemo(() => {
        if (!q.trim()) return rows
        const s = q.trim().toLowerCase()
        return rows.filter(r => (r.applicant || '').toLowerCase().includes(s) || (r.appNo || '').toLowerCase().includes(s))
    }, [rows, q])

    return (
        <div className="pub-section" style={{ width: '100%', overflowY: 'auto' }}>
            <div className="pub-container" style={{ padding: '28px 24px' }}>
                <h1 style={st.title}>Мои заявления</h1>
                <p style={st.sub}>
                    Статусы поданных заявлений на присвоение звания, судейской категории и свидетельства тренера —
                    в одном месте. Найдите свои по ФИО или номеру заявки.
                </p>

                <input
                    style={st.search}
                    placeholder="Поиск по ФИО заявителя или номеру заявки…"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                />

                {loading ? (
                    <div style={st.empty}>Загрузка…</div>
                ) : error ? (
                    <div style={st.empty}>Не удалось загрузить заявления. Попробуйте позже.</div>
                ) : filtered.length === 0 ? (
                    <div style={st.empty}>Заявлений не найдено.</div>
                ) : (
                    <div style={st.list}>
                        {filtered.map(r => {
                            const svc = SERVICES[r.service]
                            const cls = stateClass(r.label)
                            return (
                                <div key={r.key} style={st.card}>
                                    <div style={{ ...st.svcBar, background: svc.color }} />
                                    <div style={st.cardMain}>
                                        <div style={st.cardTop}>
                                            <span style={{ ...st.svcTag, color: svc.color, background: `${svc.color}14` }}>{svc.name}</span>
                                            <span style={st.appNo}>{r.appNo}</span>
                                        </div>
                                        <div style={st.subject}>{r.subject}{r.sport ? ` · ${r.sport}` : ''}</div>
                                        <div style={st.meta}>{r.applicant} · подано {fmt(r.date)}</div>
                                    </div>
                                    <span style={{ ...st.badge, ...BADGE[cls] }}>{r.label}</span>
                                </div>
                            )
                        })}
                    </div>
                )}

                <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <Link to="/public/cabinet" style={st.linkBtn}>← В кабинет</Link>
                    <Link to="/public/award-application" style={st.linkGhost}>Подать на звание</Link>
                    <Link to="/public/judge-category" style={st.linkGhost}>Подать на судейскую категорию</Link>
                    <Link to="/public/trainer-registration" style={st.linkGhost}>Свидетельство тренера</Link>
                </div>
            </div>
        </div>
    )
}

const BADGE = {
    progress: { background: '#dbeafe', color: '#1d4ed8' },
    done: { background: '#dcfce7', color: '#15803d' },
    neg: { background: '#fee2e2', color: '#b91c1c' },
}

const st = {
    title: { fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' },
    sub: { fontSize: 14, color: 'var(--text-muted)', margin: '0 0 18px', lineHeight: 1.6, maxWidth: 720 },
    search: {
        width: '100%', maxWidth: 520, padding: '11px 16px', fontSize: 14,
        border: '1px solid var(--border-color)', borderRadius: 12, marginBottom: 20,
        background: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box', outline: 'none',
    },
    list: { display: 'flex', flexDirection: 'column', gap: 12 },
    card: {
        display: 'flex', alignItems: 'stretch', background: 'var(--bg-card)',
        border: '1px solid var(--border-color)', borderRadius: 14, overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
    },
    svcBar: { width: 5, flexShrink: 0 },
    cardMain: { flex: 1, padding: '14px 18px', minWidth: 0 },
    cardTop: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' },
    svcTag: { fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 20 },
    appNo: { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' },
    subject: { fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 },
    meta: { fontSize: 13, color: 'var(--text-muted)' },
    badge: {
        alignSelf: 'center', margin: '0 18px', padding: '5px 14px', borderRadius: 20,
        fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
    },
    empty: {
        padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14,
    },
    linkBtn: {
        padding: '10px 20px', background: 'var(--pub-navy, #1a1a1a)', color: '#fff',
        borderRadius: 20, textDecoration: 'none', fontSize: 14, fontWeight: 700,
    },
    linkGhost: {
        padding: '10px 20px', background: 'var(--bg-panel)', color: 'var(--text-primary)',
        border: '1px solid var(--border-color)', borderRadius: 20, textDecoration: 'none', fontSize: 14, fontWeight: 600,
    },
}
