import { useState, useMemo } from 'react'
import { TEMPLATES } from './data/intranetData'
import './intranet.css'

const CATS = ['all', 'app', 'report', 'memo', 'purchase', 'sport']
const CAT_LABELS = { all: 'Все', app: 'Заявления', report: 'Отчёты', memo: 'Служебные', purchase: 'Закупки', sport: 'Спорт' }
const FORMAT_BADGE = { docx: { color: '#1a73e8', bg: '#e8f0fe' }, xlsx: { color: '#0f9d58', bg: '#e6f4ea' }, pdf: { color: '#d93025', bg: '#fce8e6' } }

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function IntranetTemplates() {
    const [cat, setCat] = useState('all')
    const [q, setQ] = useState('')

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase()
        return TEMPLATES.filter(t => (cat === 'all' || t.cat === cat) &&
            (!ql || t.title.toLowerCase().includes(ql)))
    }, [cat, q])

    return (
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">Шаблоны документов</h1>
                    <p className="intra-page-head__sub">Готовые формы заявлений, отчётов, служебных записок.</p>
                </div>
                <input className="intra-search" placeholder="Поиск по шаблонам…" value={q} onChange={e => setQ(e.target.value)} />
            </div>

            <div className="intra-chips">
                {CATS.map(c => (
                    <button key={c} className={`intra-chip${cat === c ? ' intra-chip--active' : ''}`} onClick={() => setCat(c)}>
                        {CAT_LABELS[c]} <span className="intra-chip__count">{c === 'all' ? TEMPLATES.length : TEMPLATES.filter(t => t.cat === c).length}</span>
                    </button>
                ))}
            </div>

            <div className="intra-tmpl-grid">
                {filtered.map(t => {
                    const badge = FORMAT_BADGE[t.format] || { color: '#666', bg: '#f0f0f0' }
                    return (
                        <div key={t.id} className="intra-tmpl">
                            <div className="intra-tmpl__icon" style={{ background: badge.bg, color: badge.color }}>
                                {t.format.toUpperCase()}
                            </div>
                            <div className="intra-tmpl__body">
                                <h3 className="intra-tmpl__title">{t.title}</h3>
                                <div className="intra-tmpl__meta">
                                    <span>{t.catLabel}</span>
                                    <span>·</span>
                                    <span>{t.size}</span>
                                    <span>·</span>
                                    <span>обн. {fmtDate(t.updated)}</span>
                                </div>
                            </div>
                            <button className="intra-doc__action">Скачать</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
