import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EVENTS_DATA } from './PublicEvents'
import { getTicketEvent } from './tickets/ticketsData'

const TYPES = {
    international: { label: 'Международные', color: '#F59E0B' },
    championship:  { label: 'Чемпионат КР',  color: '#1a1a1a' },
    premier:       { label: 'Первенство КР',  color: '#7C3AED' },
    spartakiad:    { label: 'Спартакиада',     color: '#16A34A' },
    tournament:    { label: 'Респ. турнир',    color: '#0EA5E9' },
    other:         { label: 'Иное',            color: '#9ca3af' },
}

const today = new Date()
today.setHours(0, 0, 0, 0)

function fmt(d) { return new Date(d).toLocaleDateString('ru-RU') }

function eventStatus(start, end) {
    const s = new Date(start); s.setHours(0,0,0,0)
    const e = new Date(end); e.setHours(23,59,59,999)
    if (today < s) return 'upcoming'
    if (today > e) return 'finished'
    return 'live'
}

/* Mock participants */
const PARTICIPANTS = [
    { name: 'Асанов Бакыт', region: 'Бишкек', rank: 'МС КР', weight: '73 кг' },
    { name: 'Кулматова Айгерим', region: 'Бишкек', rank: 'КМС', weight: '57 кг' },
    { name: 'Джумабаев Эрлан', region: 'Ош', rank: 'МСМК', weight: '81 кг' },
    { name: 'Бейшеналиев Данияр', region: 'Нарын', rank: 'МС КР', weight: '90 кг' },
    { name: 'Сатыбалдиева Мээрим', region: 'Бишкек', rank: 'МС КР', weight: '63 кг' },
    { name: 'Ормонов Алмаз', region: 'Чуй', rank: 'КМС', weight: '68 кг' },
    { name: 'Токтогулова Назира', region: 'Иссык-Куль', rank: 'I разряд', weight: '52 кг' },
    { name: 'Турдалиев Марат', region: 'Ош', rank: 'КМС', weight: '73 кг' },
]

/* Mock results */
const RESULTS = [
    { place: 1, name: 'Асанов Бакыт', region: 'Бишкек', result: '1-е место' },
    { place: 2, name: 'Джумабаев Эрлан', region: 'Ош', result: '2-е место' },
    { place: 3, name: 'Бейшеналиев Данияр', region: 'Нарын', result: '3-е место' },
    { place: 3, name: 'Ормонов Алмаз', region: 'Чуй', result: '3-е место' },
    { place: 5, name: 'Турдалиев Марат', region: 'Ош', result: '5-е место' },
    { place: 5, name: 'Кулматова Айгерим', region: 'Бишкек', result: '5-е место' },
]

const DOCS = [
    { name: 'Положение о соревновании', type: 'PDF' },
    { name: 'Протокол результатов', type: 'PDF' },
    { name: 'Приказ о проведении', type: 'PDF' },
]

export default function PublicEventDetail() {
    const { t } = useTranslation()
    const { id } = useParams()
    const event = EVENTS_DATA.find(e => e.id === parseInt(id))

    if (!event) {
        return (
            <div className="pub-section">
                <div className="pub-container" style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: '#94a3b8' }}><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                    <h2 style={{ fontSize: 22, color: '#1a1a1a', marginBottom: 8 }}>{t('public.eventNotFound')}</h2>
                    <p style={{ color: 'var(--theme-text-secondary)', marginBottom: 20 }}>Мероприятие с ID {id} отсутствует в системе.</p>
                    <Link to="/public/events" className="pub-login-btn">{t('public.backToEvents')}</Link>
                </div>
            </div>
        )
    }

    const tp = TYPES[event.type] || TYPES.other
    const status = eventStatus(event.start, event.end)
    const isFinished = status === 'finished'

    return (
        <div className="pub-section">
            <div className="pub-container">
                {/* Back link */}
                <Link to="/public/events" style={d.backLink}>{t('public.backToEvents')}</Link>

                {/* Header card */}
                <div style={{ ...d.headerCard, borderTopColor: tp.color }}>
                    <div style={d.headerTop}>
                        <span style={{ ...d.typeBadge, background: tp.color + '18', color: tp.color, borderColor: tp.color + '40' }}>
                            {tp.label}
                        </span>
                        {status === 'upcoming' && <span style={d.statusUpcoming}>Предстоящее</span>}
                        {status === 'live' && <span style={d.statusLive}>Идёт сейчас</span>}
                        {status === 'finished' && <span style={d.statusFinished}>Завершено</span>}
                    </div>
                    <h1 style={d.title}>{event.title}</h1>
                    <div style={d.metaRow}>
                        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-2px', marginRight: 5 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{fmt(event.start)}{event.start !== event.end ? ` - ${fmt(event.end)}` : ''}</span>
                        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-2px', marginRight: 5 }}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>{event.city}, {event.venue}</span>
                        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-2px', marginRight: 5 }}><circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/></svg>{event.sport}</span>
                        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-2px', marginRight: 5 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>{event.age}</span>
                    </div>
                    {getTicketEvent(event.id) && status !== 'finished' && (
                        <Link
                            to={`/public/tickets/${event.id}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '11px 22px', background: 'linear-gradient(135deg,#1B3A6B,#2563eb)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v2a2 2 0 0 1 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a2 2 0 0 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M13 5v14"/></svg> Купить билеты
                        </Link>
                    )}
                </div>

                {/* About */}
                <div style={d.section}>
                    <h2 style={d.sectionTitle}>{t('public.aboutEvent')}</h2>
                    <p style={d.desc}>{event.desc}</p>
                    <div style={d.infoGrid}>
                        <div style={d.infoItem}>
                            <div style={d.infoLabel}>{t('public.eventOrganizer')}</div>
                            <div style={d.infoValue}>{event.organizer}</div>
                        </div>
                        <div style={d.infoItem}>
                            <div style={d.infoLabel}>{t('public.eventChiefJudge')}</div>
                            <div style={d.infoValue}>{event.judge}</div>
                        </div>
                        <div style={d.infoItem}>
                            <div style={d.infoLabel}>{t('public.eventAgeGroup')}</div>
                            <div style={d.infoValue}>{event.age}</div>
                        </div>
                        <div style={d.infoItem}>
                            <div style={d.infoLabel}>{t('public.eventType')}</div>
                            <div style={d.infoValue}>{event.sport}</div>
                        </div>
                    </div>
                </div>

                {/* Participants */}
                <div style={d.section}>
                    <h2 style={d.sectionTitle}>{t('public.participants')}</h2>
                    <div style={d.tableWrap}>
                        <table style={d.table}>
                            <thead>
                                <tr>
                                    <th style={d.th}>№</th>
                                    <th style={d.th}>Спортсмен</th>
                                    <th style={d.th}>Регион</th>
                                    <th style={d.th}>Разряд / звание</th>
                                    <th style={d.th}>Вес. кат.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PARTICIPANTS.map((p, i) => (
                                    <tr key={i}>
                                        <td style={d.td}>{i + 1}</td>
                                        <td style={{ ...d.td, fontWeight: 700, color: '#1a1a1a' }}>{p.name}</td>
                                        <td style={d.td}>{p.region}</td>
                                        <td style={d.td}>{p.rank}</td>
                                        <td style={d.td}>{p.weight}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Results (if finished) */}
                {isFinished && (
                    <div style={d.section}>
                        <h2 style={d.sectionTitle}>Результаты</h2>
                        <div style={d.tableWrap}>
                            <table style={d.table}>
                                <thead>
                                    <tr>
                                        <th style={d.th}>Место</th>
                                        <th style={d.th}></th>
                                        <th style={d.th}>Спортсмен</th>
                                        <th style={d.th}>Регион</th>
                                        <th style={d.th}>Результат</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RESULTS.map((r, i) => (
                                        <tr key={i} style={r.place <= 3 ? { background: r.place === 1 ? '#fffbeb' : r.place === 2 ? '#f5f5f7' : '#fefce8' } : {}}>
                                            <td style={{ ...d.td, fontWeight: 800, fontSize: 16 }}>{r.place}</td>
                                            <td style={d.td}>{r.place <= 3 && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={r.place === 1 ? '#D4AF37' : r.place === 2 ? '#9AA0A6' : '#B08D57'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/></svg>}</td>
                                            <td style={{ ...d.td, fontWeight: 700, color: '#1a1a1a' }}>{r.name}</td>
                                            <td style={d.td}>{r.region}</td>
                                            <td style={d.td}>{r.result}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Documents */}
                <div style={d.section}>
                    <h2 style={d.sectionTitle}>{t('public.documents')}</h2>
                    <div style={d.docList}>
                        {DOCS.map(doc => (
                            <div key={doc.name} style={d.docItem}>
                                <span style={{ display: 'inline-flex', color: '#64748b' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{doc.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--theme-text-secondary)' }}>{doc.type}</div>
                                </div>
                                <button style={d.docBtn} onClick={() => alert(`Скачивание: ${doc.name}`)}>{t('public.download')}</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const d = {
    backLink: {
        display: 'inline-block', marginBottom: 20, fontSize: 14,
        color: 'var(--theme-text-main)', textDecoration: 'none', fontWeight: 500,
    },
    headerCard: {
        background: 'var(--theme-bg-card)', border: '1px solid var(--theme-border)', borderRadius: 16,
        padding: '28px 32px', marginBottom: 24, borderTop: '4px solid',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    headerTop: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 },
    typeBadge: {
        display: 'inline-block', padding: '4px 12px', borderRadius: 16,
        fontSize: 12, fontWeight: 800, border: '1px solid',
    },
    statusUpcoming: {
        display: 'inline-block', padding: '3px 12px', borderRadius: 16,
        fontSize: 12, fontWeight: 700, background: 'rgba(29, 78, 216, 0.15)', color: '#1d4ed8',
    },
    statusLive: {
        display: 'inline-block', padding: '3px 12px', borderRadius: 16,
        fontSize: 12, fontWeight: 700, background: 'rgba(220, 38, 38, 0.15)', color: '#dc2626',
    },
    statusFinished: {
        display: 'inline-block', padding: '3px 12px', borderRadius: 16,
        fontSize: 12, fontWeight: 700, background: 'rgba(107, 114, 128, 0.15)', color: '#6b7280',
    },
    title: { fontSize: 24, fontWeight: 800, color: 'var(--theme-text-main)', margin: '0 0 12px' },
    metaRow: { display: 'flex', gap: 24, fontSize: 14, color: 'var(--theme-text-secondary)', flexWrap: 'wrap' },

    section: {
        background: 'var(--theme-bg-card)', border: '1px solid var(--theme-border)', borderRadius: 16,
        padding: '24px 28px', marginBottom: 20,
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
    },
    sectionTitle: {
        fontSize: 18, fontWeight: 800, color: 'var(--theme-text-main)', margin: '0 0 16px',
        paddingBottom: 10, borderBottom: '2px solid var(--theme-border)',
    },
    desc: { fontSize: 14, color: 'var(--theme-text-secondary)', lineHeight: 1.7, margin: '0 0 20px' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    infoItem: {},
    infoLabel: { fontSize: 11, color: 'var(--theme-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
    infoValue: { fontSize: 14, fontWeight: 500, color: 'var(--theme-text-main)' },

    tableWrap: { overflow: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
        textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--theme-text-secondary)',
        borderBottom: '1px solid var(--theme-border)', whiteSpace: 'nowrap',
    },
    td: {
        padding: '10px 14px', fontSize: 13, color: 'var(--theme-text-secondary)',
        borderBottom: '1px solid var(--theme-border)', verticalAlign: 'middle',
    },

    docList: { display: 'flex', flexDirection: 'column', gap: 10 },
    docItem: {
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px', background: 'var(--theme-bg-panel)', border: '1px solid var(--theme-border)',
        borderRadius: 12,
    },
    docBtn: {
        padding: '6px 16px', background: 'var(--theme-text-main)', color: 'var(--theme-bg-base)',
        border: 'none', borderRadius: 12, fontSize: 12, fontWeight: 700,
        fontFamily: 'inherit', cursor: 'pointer',
    },
}
