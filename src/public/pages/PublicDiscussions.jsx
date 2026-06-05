import { useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import PublicHero, { PublicHeroCounter } from '../components/PublicHero'
import { useAnimatedCounter } from '../useDesignEffects'
import { DISCUSSIONS } from './publicContent'
import './publicPages.css'

const fmt = (iso) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

const IconChat = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
)
const IconDownload = () => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
)

export function PublicDiscussionsList() {
    const [status, setStatus] = useState('all')

    const cntActive = useAnimatedCounter(DISCUSSIONS.filter(d => d.status === 'active').length)
    const cntTotal = useAnimatedCounter(DISCUSSIONS.length)

    const filtered = useMemo(() => DISCUSSIONS.filter(d => status === 'all' || d.status === status), [status])

    return (
        <div className="pub-section">
            <PublicHero title="Общественные обсуждения" description="Проекты документов ГАФКиС, вынесенные на общественное обсуждение. Каждый гражданин может оставить предложение." variant="emerald" layoutMode="abstract">
                <PublicHeroCounter animRef={cntActive.ref} value={cntActive.value} label="активных" />
                <PublicHeroCounter animRef={cntTotal.ref} value={cntTotal.value} label="всего" />
            </PublicHero>

            <div className="pub-container pp-wrap">
                <div className="pp-chips" style={{ marginBottom: 28 }}>
                    {[['all', 'Все'], ['active', 'Активные'], ['closed', 'Завершённые']].map(([k, label]) => (
                        <button key={k} className={`pp-chip${status === k ? ' pp-chip--active' : ''}`} onClick={() => setStatus(k)}>
                            {label} <span className="pp-chip__count">{k === 'all' ? DISCUSSIONS.length : DISCUSSIONS.filter(d => d.status === k).length}</span>
                        </button>
                    ))}
                </div>

                <div className="pd-list">
                    {filtered.map(d => (
                        <Link key={d.id} to={`/public/discussions/${d.id}`} className="pub-card pd-card">
                            <span className="pd-card__ic"><IconChat /></span>
                            <div className="pd-card__body">
                                <div className="pd-card__meta">
                                    <span>Опубликовано {fmt(d.published)}</span>
                                    <span className="pd-card__num">· {d.comments} предложений</span>
                                </div>
                                <h3 className="pd-card__title">{d.title}</h3>
                                <div className="pd-card__sub">
                                    {d.status === 'active' ? `Приём предложений до ${fmt(d.deadline)}` : 'Обсуждение завершено'}
                                </div>
                            </div>
                            <span className="pd-card__go">Открыть →</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function PublicDiscussionDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const d = DISCUSSIONS.find(x => x.id === Number(id))
    const [comment, setComment] = useState('')
    const [sent, setSent] = useState(false)

    if (!d) {
        return (
            <div className="pub-section">
                <div className="pub-container pp-wrap" style={{ paddingTop: 40 }}>
                    <div className="pp-empty">Обсуждение не найдено. <Link to="/public/discussions" style={{ color: 'var(--pub-navy)' }}>Ко всем</Link></div>
                </div>
            </div>
        )
    }

    return (
        <div className="pub-section">
            <div className="pub-container pp-wrap" style={{ paddingTop: 32 }}>
                <button className="pp-back" onClick={() => navigate('/public/discussions')}>← Все обсуждения</button>

                <article className="pp-article">
                    <div className="pp-article__meta">
                        <span>Опубликовано {fmt(d.published)}</span>
                        <span>· {d.comments} предложений</span>
                        <span>· {d.status === 'active' ? `приём до ${fmt(d.deadline)}` : 'завершено'}</span>
                    </div>
                    <h1 className="pp-article__title">{d.title}</h1>
                    <p className="pp-article__lead">{d.summary}</p>
                    <div className="pp-article__body">
                        <p><strong>Приём предложений:</strong> {d.status === 'active' ? `до ${fmt(d.deadline)}` : `завершён ${fmt(d.deadline)}`}</p>
                        <p>С полным текстом проекта документа можно ознакомиться по ссылке. Все поступившие предложения рассматриваются рабочей группой ГАФКиС, итоги публикуются после завершения обсуждения.</p>
                        <button className="pd-dl"><IconDownload /> Скачать проект документа</button>
                    </div>
                </article>

                {d.status === 'active' ? (
                    sent ? (
                        <div className="pp-success">
                            <strong>Предложение принято</strong>
                            Спасибо! Ваше предложение зарегистрировано и будет рассмотрено рабочей группой.
                        </div>
                    ) : (
                        <div className="pp-form" style={{ maxWidth: 720 }}>
                            <h2 className="pp-block__title" style={{ marginTop: 0 }}>Оставить предложение</h2>
                            <div className="pp-field"><label>Ваше имя</label><input placeholder="ФИО (необязательно)" /></div>
                            <div className="pp-field"><label>Предложение / замечание *</label><textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Опишите ваше предложение к проекту документа" /></div>
                            <button className="pp-form__submit" disabled={!comment.trim()} style={{ opacity: comment.trim() ? 1 : 0.4, cursor: comment.trim() ? 'pointer' : 'not-allowed' }} onClick={() => setSent(true)}>
                                Отправить предложение
                            </button>
                            <p className="pp-form__note">Предложения принимаются в соответствии с порядком проведения общественных обсуждений проектов НПА.</p>
                        </div>
                    )
                ) : (
                    <div className="pp-info" style={{ maxWidth: 720 }}>
                        <h3 className="pp-info__title">Обсуждение завершено</h3>
                        <p>Приём предложений по данному проекту закрыт {fmt(d.deadline)}. По итогам обсуждения учтены поступившие замечания, итоговая редакция документа утверждена.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
