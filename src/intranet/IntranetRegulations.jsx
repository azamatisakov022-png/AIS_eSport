import { useState, useMemo } from 'react'
import { REGULATIONS } from './data/intranetData'
import './intranet.css'

const CATS = ['all', 'order', 'regulation', 'instruction', 'methodics']
const CAT_LABELS = { all: 'Все', order: 'Приказы', regulation: 'Положения', instruction: 'Инструкции', methodics: 'Методики' }

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const CAT_ICON = { order: '📋', regulation: '📜', instruction: '📘', methodics: '🧭' }

export default function IntranetRegulations() {
    const [cat, setCat] = useState('all')
    const [q, setQ] = useState('')

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase()
        return REGULATIONS.filter(r => (cat === 'all' || r.cat === cat) &&
            (!ql || r.title.toLowerCase().includes(ql) || r.number.toLowerCase().includes(ql)))
    }, [cat, q])

    return (
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">Регламенты, инструкции, приказы</h1>
                    <p className="intra-page-head__sub">Внутренние нормативные документы ГАФКиС.</p>
                </div>
                <input className="intra-search" placeholder="Поиск по документам…" value={q} onChange={e => setQ(e.target.value)} />
            </div>

            <div className="intra-chips">
                {CATS.map(c => (
                    <button key={c} className={`intra-chip${cat === c ? ' intra-chip--active' : ''}`} onClick={() => setCat(c)}>
                        {CAT_LABELS[c]} <span className="intra-chip__count">{c === 'all' ? REGULATIONS.length : REGULATIONS.filter(r => r.cat === c).length}</span>
                    </button>
                ))}
            </div>

            <div className="intra-doc-list">
                {filtered.map(r => (
                    <div key={r.id} className="intra-doc">
                        <div className="intra-doc__icon">{CAT_ICON[r.cat] || '📄'}</div>
                        <div className="intra-doc__body">
                            <div className="intra-doc__meta">
                                <span className="intra-doc__cat">{r.catLabel}</span>
                                <span>{r.number}</span>
                                <span>от {fmtDate(r.date)}</span>
                            </div>
                            <h3 className="intra-doc__title">{r.title}</h3>
                            <div className="intra-doc__issuer">{r.issuer}</div>
                        </div>
                        <button className="intra-doc__action">Открыть</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
