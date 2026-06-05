import { useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import PublicHero, { PublicHeroCounter } from '../components/PublicHero'
import { useAnimatedCounter } from '../useDesignEffects'
import { PUBLIC_NEWS } from './publicContent'
import './publicPages.css'

const CATS = ['all', 'sport', 'gov', 'events']
const CAT_LABELS = { all: 'Все', sport: 'Спорт', gov: 'ГАФКиС', events: 'Мероприятия' }

/* Брендовая градиент-обложка по категории, когда у новости нет реального
   фото (n.photo). Никаких случайных стоковых картинок. */
const NEWS_COVER_GRADIENT = {
    sport: 'linear-gradient(150deg, #1d3557 0%, #0f1b2d 100%)',
    gov: 'linear-gradient(150deg, #2a4d7a 0%, #1d3557 100%)',
    events: 'linear-gradient(150deg, #c5303c 0%, #8c1f2a 100%)',
}
const coverGradient = (n) => NEWS_COVER_GRADIENT[n.cat] || NEWS_COVER_GRADIENT.sport

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function PublicNewsList() {
    const [cat, setCat] = useState('all')
    const [q, setQ] = useState('')
    const [year, setYear] = useState('all')

    const years = useMemo(
        () => Array.from(new Set(PUBLIC_NEWS.map(n => n.date.slice(0, 4)))).sort().reverse(),
        []
    )

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase()
        return PUBLIC_NEWS.filter(n =>
            (cat === 'all' || n.cat === cat) &&
            (year === 'all' || n.date.startsWith(year)) &&
            (!ql || n.title.toLowerCase().includes(ql) || n.excerpt.toLowerCase().includes(ql))
        )
    }, [cat, q, year])

    const isUnfiltered = cat === 'all' && year === 'all' && !q.trim()
    const cntNews = useAnimatedCounter(PUBLIC_NEWS.length)
    const cntYears = useAnimatedCounter(years.length)

    return (
        <div className="pub-section">
            <PublicHero
                title="Новости"
                description="Последние новости ГАФКиС и спортивной жизни Кыргызстана. Архив по годам."
                variant="blue"
                layoutMode="abstract"
            >
                <PublicHeroCounter animRef={cntNews.ref} value={cntNews.value} label="публикаций" />
                <PublicHeroCounter animRef={cntYears.ref} value={cntYears.value} label="лет архива" />
            </PublicHero>

            <div className="pub-container pn-toolbar-wrap">
                <div className="pn-toolbar">
                    <input
                        className="pp-search pn-toolbar__search"
                        placeholder="Поиск по новостям…"
                        value={q}
                        onChange={e => setQ(e.target.value)}
                    />
                    <div className="pp-chips">
                        {CATS.map(c => (
                            <button
                                key={c}
                                className={`pp-chip${cat === c ? ' pp-chip--active' : ''}`}
                                onClick={() => setCat(c)}
                            >
                                {CAT_LABELS[c]}
                            </button>
                        ))}
                    </div>
                    {/* Архив по годам - требование Распоряжения №59-р */}
                    <span className="pn-toolbar__sep" aria-hidden />
                    <div className="pp-chips">
                        <button
                            className={`pp-chip${year === 'all' ? ' pp-chip--active' : ''}`}
                            onClick={() => setYear('all')}
                        >Все годы</button>
                        {years.map(y => (
                            <button
                                key={y}
                                className={`pp-chip${year === y ? ' pp-chip--active' : ''}`}
                                onClick={() => setYear(y)}
                            >
                                {y} <span className="pp-chip__count">{PUBLIC_NEWS.filter(n => n.date.startsWith(y)).length}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pn-subhead">
                    <h2 className="pn-subhead__title">
                        {isUnfiltered ? 'Все материалы' : `Найдено: ${filtered.length}`}
                    </h2>
                </div>

                {filtered.length > 0 ? (
                    <div className="pn-grid">
                        {filtered.map(n => (
                            <Link key={n.id} to={`/public/news/${n.id}`} className="pn-card">
                                <div className="pn-card__img-wrap">
                                    {n.photo
                                        ? <img className="pn-card__img" src={n.photo} alt="" loading="lazy" />
                                        : <span className="pn-card__cover" style={{ background: coverGradient(n) }}>{n.cover}</span>
                                    }
                                </div>
                                <div className="pn-card__meta">
                                    <span className="pn-cat">{n.catLabel}</span>
                                    <span className="pn-dot" />
                                    <span className="pn-date">{fmtDate(n.date)}</span>
                                </div>
                                <h3 className="pn-card__title">{n.title}</h3>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="pn-empty">
                        Новостей по выбранным фильтрам не найдено. Снимите фильтр или измените поисковый запрос.
                    </div>
                )}
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
                    <div className="pn-empty">
                        Новость не найдена.{' '}
                        <Link to="/public/news" style={{ color: 'var(--pub-navy)' }}>Вернуться к новостям</Link>
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
                    <div className="pp-article__photo">
                        {news.photo
                            ? <img src={news.photo} alt="" />
                            : <span className="pp-article__cover" style={{ background: coverGradient(news) }}>{news.cover}</span>
                        }
                    </div>
                    <div className="pp-article__meta">
                        <span className="pn-cat">{news.catLabel}</span>
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
                        <div className="pn-grid">
                            {related.map(n => (
                                <Link key={n.id} to={`/public/news/${n.id}`} className="pn-card">
                                    <div className="pn-card__img-wrap">
                                        {n.photo
                                            ? <img className="pn-card__img" src={n.photo} alt="" loading="lazy" />
                                            : <span className="pn-card__cover" style={{ background: coverGradient(n) }}>{n.cover}</span>
                                        }
                                    </div>
                                    <div className="pn-card__meta">
                                        <span className="pn-cat">{n.catLabel}</span>
                                        <span className="pn-dot" />
                                        <span className="pn-date">{fmtDate(n.date)}</span>
                                    </div>
                                    <h3 className="pn-card__title">{n.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
