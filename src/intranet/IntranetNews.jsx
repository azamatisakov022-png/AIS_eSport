import { useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { NEWS } from './data/intranetData'
import './intranet.css'

const CATEGORIES = ['all', 'system', 'events', 'hr', 'digital', 'awards']
const CAT_LABELS = { all: 'Все', system: 'Система', events: 'Мероприятия', hr: 'HR', digital: 'Цифровизация', awards: 'Награды' }

const CAT_ICON = {
    system: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    events: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    hr: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    digital: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    awards: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/></svg>,
}

function fmtDate(iso) {
    const d = new Date(iso)
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function IntranetNewsList() {
    const [cat, setCat] = useState('all')
    const [q, setQ] = useState('')

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase()
        return NEWS.filter(n => (cat === 'all' || n.category === cat) &&
            (!ql || n.title.toLowerCase().includes(ql) || n.excerpt.toLowerCase().includes(ql)))
    }, [cat, q])

    return (
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">Новости для сотрудников</h1>
                    <p className="intra-page-head__sub">Внутренняя лента: события, изменения, объявления руководства.</p>
                </div>
                <input className="intra-search" placeholder="Поиск по новостям…" value={q} onChange={e => setQ(e.target.value)} />
            </div>

            <div className="intra-chips">
                {CATEGORIES.map(c => (
                    <button key={c} className={`intra-chip${cat === c ? ' intra-chip--active' : ''}`} onClick={() => setCat(c)}>
                        {CAT_LABELS[c]} <span className="intra-chip__count">{c === 'all' ? NEWS.length : NEWS.filter(n => n.category === c).length}</span>
                    </button>
                ))}
            </div>

            <div className="intra-news-grid">
                {filtered.map(n => (
                    <Link key={n.id} to={`/intranet/news/${n.id}`} className="intra-news-card">
                        <div className="intra-news-card__cover">{CAT_ICON[n.category] || CAT_ICON.system}</div>
                        <div className="intra-news-card__body">
                            <div className="intra-news-card__meta">
                                <span className="intra-news-card__cat">{n.categoryLabel}</span>
                                <span>{fmtDate(n.date)}</span>
                            </div>
                            <h3 className="intra-news-card__title">{n.title}</h3>
                            <p className="intra-news-card__excerpt">{n.excerpt}</p>
                            <div className="intra-news-card__author">{n.author}</div>
                        </div>
                    </Link>
                ))}
                {filtered.length === 0 && (
                    <div className="intra-soon" style={{ gridColumn: '1 / -1' }}>
                        <div className="intra-soon__icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                        <h2 className="intra-soon__title">Ничего не найдено</h2>
                        <p className="intra-soon__sub">Попробуйте изменить поисковый запрос или категорию.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export function IntranetNewsDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const news = NEWS.find(n => n.id === Number(id))

    if (!news) {
        return (
            <div className="intra">
                <div className="intra-soon">
                    <div className="intra-soon__icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg></div>
                    <h2 className="intra-soon__title">Новость не найдена</h2>
                    <p className="intra-soon__sub"><Link to="/intranet/news">Вернуться к ленте</Link></p>
                </div>
            </div>
        )
    }

    const related = NEWS.filter(n => n.id !== news.id && n.category === news.category).slice(0, 3)

    return (
        <div className="intra">
            <button className="intra-back" onClick={() => navigate('/intranet/news')}>← Все новости</button>

            <article className="intra-article">
                <div className="intra-article__cover">{CAT_ICON[news.category] || CAT_ICON.system}</div>
                <div className="intra-article__meta">
                    <span className="intra-news-card__cat">{news.categoryLabel}</span>
                    <span>{fmtDate(news.date)}</span>
                    <span>· {news.author}</span>
                </div>
                <h1 className="intra-article__title">{news.title}</h1>
                <p className="intra-article__lead">{news.excerpt}</p>
                <div className="intra-article__body">{news.body}</div>
            </article>

            {related.length > 0 && (
                <>
                    <h2 className="intra-section-title">Похожие новости</h2>
                    <div className="intra-news-grid">
                        {related.map(n => (
                            <Link key={n.id} to={`/intranet/news/${n.id}`} className="intra-news-card">
                                <div className="intra-news-card__cover">{CAT_ICON[n.category] || CAT_ICON.system}</div>
                                <div className="intra-news-card__body">
                                    <div className="intra-news-card__meta">
                                        <span className="intra-news-card__cat">{n.categoryLabel}</span>
                                        <span>{fmtDate(n.date)}</span>
                                    </div>
                                    <h3 className="intra-news-card__title">{n.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
