import { useState, useMemo } from 'react'
import PublicHero from '../components/PublicHero'
import { ANNOUNCEMENTS_PUB, ANNOUNCEMENT_TYPES } from './publicContent'
import './publicPages.css'

const TYPE_ICON = { vacancy: '💼', tender: '📑', rent: '🏟️' }
const TYPE_BADGE = { vacancy: 'pp-badge--blue', tender: 'pp-badge--amber', rent: 'pp-badge--green' }

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

                <div className="pp-list">
                    {filtered.map(a => (
                        <div key={a.id} className="pp-row">
                            <div className="pp-row__icon">{TYPE_ICON[a.type]}</div>
                            <div className="pp-row__body">
                                <div className="pp-row__meta">
                                    <span className={`pp-badge ${TYPE_BADGE[a.type]}`}>{a.typeLabel}</span>
                                    <span>опубликовано {fmtDate(a.date)}</span>
                                    {a.deadline !== '—' && <span>· приём до {fmtDate(a.deadline)}</span>}
                                </div>
                                <h3 className="pp-row__title">{a.title}</h3>
                                <div className="pp-row__desc">{a.detail}</div>
                            </div>
                            <button className="pp-row__action">Подробнее</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
