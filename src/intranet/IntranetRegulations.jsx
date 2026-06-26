import { useState, useMemo } from 'react'
import { REGULATIONS } from './data/intranetData'
import './intranet.css'

const CATS = ['all', 'order', 'regulation', 'instruction', 'methodics']
const CAT_LABELS = { all: 'Все', order: 'Приказы', regulation: 'Положения', instruction: 'Инструкции', methodics: 'Методики' }

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const docIcon = (children) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
)

const DEFAULT_ICON = docIcon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>)

const CAT_ICON = {
    order:       docIcon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>),
    regulation:  docIcon(<><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /></>),
    instruction: docIcon(<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>),
    methodics:   docIcon(<><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></>),
}

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
                        <div className="intra-doc__icon">{CAT_ICON[r.cat] || DEFAULT_ICON}</div>
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
