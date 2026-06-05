import { useState, useMemo } from 'react'
import PublicHero from '../components/PublicHero'
import { ANNOUNCEMENTS_PUB, ANNOUNCEMENT_TYPES } from './publicContent'
import './publicPages.css'
import './ppRich.css'

const TYPE_DOT = { vacancy: '#2563eb', tender: '#b45309', rent: '#16a34a' }

/* outline-иконки вместо эмодзи */
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
const TYPE_ICON = {
    vacancy: <svg {...base}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20" /></svg>,
    tender: <svg {...base}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>,
    rent: <svg {...base}><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" /><path d="M9 11h.01M15 11h.01" /></svg>,
}

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PublicAnnouncements() {
    const [type, setType] = useState('all')

    const filtered = useMemo(() => ANNOUNCEMENTS_PUB.filter(a => type === 'all' || a.type === type), [type])

    return (
        <div className="pub-section">
            <PublicHero title="Объявления" description="Вакансии, тендеры и аренда спортивного имущества ГАФКиС." variant="gold" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-chips" style={{ marginBottom: 28 }}>
                    {Object.entries(ANNOUNCEMENT_TYPES).map(([k, label]) => (
                        <button key={k} className={`pp-chip${type === k ? ' pp-chip--active' : ''}`} onClick={() => setType(k)}>
                            {label} <span className="pp-chip__count">{k === 'all' ? ANNOUNCEMENTS_PUB.length : ANNOUNCEMENTS_PUB.filter(a => a.type === k).length}</span>
                        </button>
                    ))}
                </div>

                <div className="pd-list">
                    {filtered.map(a => (
                        <a key={a.id} className="pub-card pd-card" href="#">
                            <span className="pd-card__ic">{TYPE_ICON[a.type]}</span>
                            <div className="pd-card__body">
                                <div className="pd-card__meta">
                                    <span className="ann-type"><i style={{ background: TYPE_DOT[a.type] }} />{a.typeLabel}</span>
                                    <span>опубликовано {fmtDate(a.date)}</span>
                                    {a.deadline !== '-' && <span className="pd-card__num">· приём до {fmtDate(a.deadline)}</span>}
                                </div>
                                <h3 className="pd-card__title">{a.title}</h3>
                                <div className="pd-card__sub">{a.detail}</div>
                            </div>
                            <span className="pd-card__go">Подробнее →</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}
