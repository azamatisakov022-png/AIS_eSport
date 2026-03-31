import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EVENTS_DATA } from './PublicEvents'

const TYPES = {
    international: { label: 'Международные', icon: '🌍', color: '#F59E0B' },
    championship:  { label: 'Чемпионат КР',  icon: '🏆', color: '#1a1a1a' },
    premier:       { label: 'Первенство КР',  icon: '🥇', color: '#7C3AED' },
    spartakiad:    { label: 'Спартакиада',     icon: '⚽', color: '#16A34A' },
    tournament:    { label: 'Респ. турнир',    icon: '🏅', color: '#0EA5E9' },
    other:         { label: 'Иное',            icon: '📋', color: '#9ca3af' },
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
    { place: 1, medal: '🥇', name: 'Асанов Бакыт', region: 'Бишкек', result: '1-е место' },
    { place: 2, medal: '🥈', name: 'Джумабаев Эрлан', region: 'Ош', result: '2-е место' },
    { place: 3, medal: '🥉', name: 'Бейшеналиев Данияр', region: 'Нарын', result: '3-е место' },
    { place: 3, medal: '🥉', name: 'Ормонов Алмаз', region: 'Чуй', result: '3-е место' },
    { place: 5, medal: '',   name: 'Турдалиев Марат', region: 'Ош', result: '5-е место' },
    { place: 5, medal: '',   name: 'Кулматова Айгерим', region: 'Бишкек', result: '5-е место' },
]

const DOCS = [
    { name: 'Положение о соревновании', icon: '📄', type: 'PDF' },
    { name: 'Протокол результатов', icon: '📋', type: 'PDF' },
    { name: 'Приказ о проведении', icon: '📑', type: 'PDF' },
]

export default function PublicEventDetail() {
    const { t } = useTranslation()
    const { id } = useParams()
    const event = EVENTS_DATA.find(e => e.id === parseInt(id))

    if (!event) {
        return (
            <div className="pub-section">
                <div className="pub-container" style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
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
                            {tp.icon} {tp.label}
                        </span>
                        {status === 'upcoming' && <span style={d.statusUpcoming}>Предстоящее</span>}
                        {status === 'live' && <span style={d.statusLive}>Идёт сейчас</span>}
                        {status === 'finished' && <span style={d.statusFinished}>Завершено</span>}
                    </div>
                    <h1 style={d.title}>{event.title}</h1>
                    <div style={d.metaRow}>
                        <span>📅 {fmt(event.start)}{event.start !== event.end ? ` - ${fmt(event.end)}` : ''}</span>
                        <span>📍 {event.city}, {event.venue}</span>
                        <span>🏅 {event.sport}</span>
                        <span>👥 {event.age}</span>
                    </div>
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
                                            <td style={{ ...d.td, fontSize: 24 }}>{r.medal}</td>
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
                                <span style={{ fontSize: 20 }}>{doc.icon}</span>
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
