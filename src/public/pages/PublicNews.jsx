import { useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import PublicHero, { PublicHeroCounter } from '../components/PublicHero'
import { useAnimatedCounter } from '../useDesignEffects'
import { PUBLIC_NEWS } from './publicContent'
import './publicPages.css'

const CATS = ['all', 'sport', 'gov', 'events']
const CAT_LABELS = { all: 'Все', sport: 'Спорт', gov: 'ГАФКиС', events: 'Мероприятия' }

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function PublicNewsList() {
    const [cat, setCat] = useState('all')
    const [q, setQ] = useState('')
    const [year, setYear] = useState('all')

    const years = useMemo(() => Array.from(new Set(PUBLIC_NEWS.map(n => n.date.slice(0, 4)))).sort().reverse(), [])

    const cntNews = useAnimatedCounter(PUBLIC_NEWS.length)
    const cntYears = useAnimatedCounter(years.length)

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase()
        return PUBLIC_NEWS.filter(n =>
            (cat === 'all' || n.cat === cat) &&
            (year === 'all' || n.date.startsWith(year)) &&
            (!ql || n.title.toLowerCase().includes(ql) || n.excerpt.toLowerCase().includes(ql))
        )
    }, [cat, q, year])

    return (
        <div className="pub-section">
            <PublicHero title="Новости" description="Последние новости ГАФКиС и спортивной жизни Кыргызстана. Архив новостей по годам." variant="blue" layoutMode="abstract">
                <PublicHeroCounter animRef={cntNews.ref} value={cntNews.value} label="публикаций" />
                <PublicHeroCounter animRef={cntYears.ref} value={cntYears.value} label="лет архива" />
            </PublicHero>

            <div className="pub-container pp-wrap">
                <div className="pp-toolbar">
                    <input className="pp-search" placeholder="Поиск по новостям…" value={q} onChange={e => setQ(e.target.value)} />
                    <div className="pp-chips">
                        {CATS.map(c => (
                            <button key={c} className={`pp-chip${cat === c ? ' pp-chip--active' : ''}`} onClick={() => setCat(c)}>
                                {CAT_LABELS[c]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Архив по годам (требование Распоряжения №59-р) */}
                <div className="pp-chips" style={{ marginBottom: 28 }}>
                    <span style={{ fontSize: 13, color: 'var(--theme-text-secondary)', alignSelf: 'center', marginRight: 4 }}>Архив:</span>
                    <button className={`pp-chip${year === 'all' ? ' pp-chip--active' : ''}`} onClick={() => setYear('all')}>Все годы</button>
                    {years.map(y => (
                        <button key={y} className={`pp-chip${year === y ? ' pp-chip--active' : ''}`} onClick={() => setYear(y)}>
                            {y} <span className="pp-chip__count">{PUBLIC_NEWS.filter(n => n.date.startsWith(y)).length}</span>
                        </button>
                    ))}
                </div>

                <div className="pp-grid">
                    {filtered.map(n => (
                        <Link key={n.id} to={`/public/news/${n.id}`} className="pp-news-card">
                            <div className="pp-news-card__cover">{n.cover}</div>
                            <div className="pp-news-card__body">
                                <div className="pp-news-card__meta">
                                    <span className="pp-tag">{n.catLabel}</span>
                                    <span>{fmtDate(n.date)}</span>
                                </div>
                                <h3 className="pp-news-card__title">{n.title}</h3>
                                <p className="pp-news-card__excerpt">{n.excerpt}</p>
                            </div>
                        </Link>
                    ))}
                    {filtered.length === 0 && (
                        <div className="pp-empty">
                            <div className="pp-empty__icon">🔍</div>
                            Новостей по выбранным фильтрам не найдено.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export function PublicNewsDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const news = PUBLIC_NEWS.find(n => n.id === Number(id))

    if (!news) {
        return (
            <div className="pub-section">
                <div className="pub-container pp-wrap" style={{ paddingTop: 40 }}>
                    <div className="pp-empty">
                        <div className="pp-empty__icon">📰</div>
                        Новость не найдена. <Link to="/public/news" style={{ color: 'var(--pub-navy)' }}>Вернуться к новостям</Link>
                    </div>
                </div>
            </div>
        )
    }

    const related = PUBLIC_NEWS.filter(n => n.id !== news.id && n.cat === news.cat).slice(0, 3)

    return (
        <div className="pub-section">
            <div className="pub-container pp-wrap" style={{ paddingTop: 32 }}>
                <button className="pp-back" onClick={() => navigate('/public/news')}>← Все новости</button>

                <article className="pp-article">
                    <div className="pp-article__cover">{news.cover}</div>
                    <div className="pp-article__meta">
                        <span className="pp-tag">{news.catLabel}</span>
                        <span>{fmtDate(news.date)}</span>
                    </div>
                    <h1 className="pp-article__title">{news.title}</h1>
                    <p className="pp-article__lead">{news.excerpt}</p>
                    <div className="pp-article__body">
                        {news.body.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                </article>

                {related.length > 0 && (
                    <div className="pp-block">
                        <h2 className="pp-block__title">Похожие новости</h2>
                        <div className="pp-grid">
                            {related.map(n => (
                                <Link key={n.id} to={`/public/news/${n.id}`} className="pp-news-card">
                                    <div className="pp-news-card__cover">{n.cover}</div>
                                    <div className="pp-news-card__body">
                                        <div className="pp-news-card__meta">
                                            <span className="pp-tag">{n.catLabel}</span>
                                            <span>{fmtDate(n.date)}</span>
                                        </div>
                                        <h3 className="pp-news-card__title">{n.title}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
