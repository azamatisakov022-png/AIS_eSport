import { useState, useMemo } from 'react'
import { KNOWLEDGE } from './data/intranetData'
import './intranet.css'

const CATS = ['all', 'how-to', 'faq', 'methodics']
const CAT_LABELS = { all: 'Все', 'how-to': 'Инструкции', faq: 'FAQ', methodics: 'Методики' }

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function IntranetKnowledge() {
    const [cat, setCat] = useState('all')
    const [q, setQ] = useState('')

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase()
        return KNOWLEDGE.filter(k => (cat === 'all' || k.cat === cat) &&
            (!ql || k.title.toLowerCase().includes(ql) || k.excerpt.toLowerCase().includes(ql)))
    }, [cat, q])

    return (
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">База знаний</h1>
                    <p className="intra-page-head__sub">Методические материалы, FAQ, типовые процедуры.</p>
                </div>
                <input className="intra-search" placeholder="Поиск по базе знаний…" value={q} onChange={e => setQ(e.target.value)} />
            </div>

            <div className="intra-chips">
                {CATS.map(c => (
                    <button key={c} className={`intra-chip${cat === c ? ' intra-chip--active' : ''}`} onClick={() => setCat(c)}>
                        {CAT_LABELS[c]} <span className="intra-chip__count">{c === 'all' ? KNOWLEDGE.length : KNOWLEDGE.filter(k => k.cat === c).length}</span>
                    </button>
                ))}
            </div>

            <div className="intra-cards">
                {filtered.map(k => (
                    <article key={k.id} className="intra-card">
                        <div className="intra-doc__meta">
                            <span className="intra-doc__cat">{k.catLabel}</span>
                            <span>обновлено {fmtDate(k.updated)}</span>
                        </div>
                        <h3 className="intra-card__title">{k.title}</h3>
                        <p className="intra-card__desc">{k.excerpt}</p>
                        <div className="intra-card__sub">{k.author}</div>
                    </article>
                ))}
            </div>
        </div>
    )
}
