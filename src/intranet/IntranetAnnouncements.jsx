import { useState, useMemo } from 'react'
import { ANNOUNCEMENTS } from './data/intranetData'
import './intranet.css'

const TAGS = ['all', 'hr', 'it', 'mgmt']
const TAG_LABELS = { all: 'Все', hr: 'Отдел кадров', it: 'ИТ-служба', mgmt: 'Руководство' }

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function IntranetAnnouncements() {
    const [tag, setTag] = useState('all')

    const filtered = useMemo(() =>
        ANNOUNCEMENTS.filter(a => tag === 'all' || a.tag === tag),
        [tag])

    return (
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">Объявления</h1>
                    <p className="intra-page-head__sub">Сообщения от отдела кадров, ИТ-службы и руководства ГАФКиС.</p>
                </div>
            </div>

            <div className="intra-chips">
                {TAGS.map(t => (
                    <button key={t} className={`intra-chip${tag === t ? ' intra-chip--active' : ''}`} onClick={() => setTag(t)}>
                        {TAG_LABELS[t]} <span className="intra-chip__count">{t === 'all' ? ANNOUNCEMENTS.length : ANNOUNCEMENTS.filter(a => a.tag === t).length}</span>
                    </button>
                ))}
            </div>

            <div className="intra-ann-list">
                {filtered.map(a => (
                    <article key={a.id} className={`intra-ann-card${a.priority === 'high' ? ' intra-ann-card--high' : ''}`}>
                        <div className="intra-ann-card__head">
                            <span className={`intra-ann-item__tag intra-ann-tag--${a.tag}`}>{a.tagLabel}</span>
                            {a.priority === 'high' && <span className="intra-ann-card__priority">Важно</span>}
                            <span className="intra-ann-card__date">{fmtDate(a.date)}</span>
                        </div>
                        <h3 className="intra-ann-card__title">{a.title}</h3>
                        <p className="intra-ann-card__body">{a.body}</p>
                        <div className="intra-ann-card__author">- {a.author}</div>
                    </article>
                ))}
            </div>
        </div>
    )
}
