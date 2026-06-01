import { useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { NEWS } from './data/intranetData'
import './intranet.css'

const CATEGORIES = ['all', 'system', 'events', 'hr', 'digital', 'awards']
const CAT_LABELS = { all: 'Все', system: 'Система', events: 'Мероприятия', hr: 'HR', digital: 'Цифровизация', awards: 'Награды' }

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
                        <div className="intra-news-card__cover">{n.cover}</div>
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
                        <div className="intra-soon__icon">🔍</div>
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
                    <div className="intra-soon__icon">📰</div>
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
                <div className="intra-article__cover">{news.cover}</div>
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
                                <div className="intra-news-card__cover">{n.cover}</div>
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
