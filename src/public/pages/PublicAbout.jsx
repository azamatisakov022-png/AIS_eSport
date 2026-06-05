import PublicHero, { PublicHeroCounter } from '../components/PublicHero'
import {
    ABOUT_LEADERSHIP,
    ABOUT_DEPARTMENTS,
    ABOUT_CONTACTS,
    ABOUT_HERO,
    ABOUT_STATS,
    ABOUT_ACTIVITIES,
} from './publicContent'
import './publicPages.css'

/* outline-иконки направлений (по порядку ABOUT_DEPARTMENTS) */
const ib = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
const DEPT_ICON = [
    <svg {...ib}><path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6M9 12h.01M15 12h.01" /></svg>,
    <svg {...ib}><path d="M7 4h10v4a5 5 0 0 1-10 0z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3M9 16h6M8 20h8M12 13v3" /></svg>,
    <svg {...ib}><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>,
    <svg {...ib}><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-5" /></svg>,
]

export default function PublicAbout() {
    return (
        <div className="pub-section">
            <PublicHero
                title={ABOUT_HERO.eyebrow}
                description={ABOUT_HERO.lead}
                variant="slate"
                layoutMode="abstract"
            >
                {ABOUT_STATS.map(s => (
                    <PublicHeroCounter key={s.label} value={s.value} label={s.label} />
                ))}
            </PublicHero>

            <div className="pub-container pp-wrap">
                <section className="pa-sec">
                    <div className="pa-sec__head">
                        <span className="pa-sec__eyebrow pa-sec__eyebrow--accent">Направления</span>
                        <h2 className="pa-sec__title">Что мы делаем</h2>
                    </div>
                    <div className="pa-activities">
                        {ABOUT_ACTIVITIES.map(a => (
                            <article key={a.n} className="pa-activity">
                                <span className="pa-activity__n">{a.n}</span>
                                <h3 className="pa-activity__title">{a.title}</h3>
                                <p className="pa-activity__desc">{a.desc}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="pa-sec">
                    <div className="pa-sec__head">
                        <span className="pa-sec__eyebrow">Команда</span>
                        <h2 className="pa-sec__title">Руководство</h2>
                    </div>
                    <div className="pa-leaders">
                        {ABOUT_LEADERSHIP.map(l => (
                            <article key={l.name} className="pa-leader">
                                <div className="pa-leader__avatar">{l.avatar}</div>
                                <div className="pa-leader__txt">
                                    <div className="pa-leader__pos">{l.pos}</div>
                                    <div className="pa-leader__name">{l.name}</div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="pa-sec">
                    <div className="pa-sec__head">
                        <span className="pa-sec__eyebrow">Организация</span>
                        <h2 className="pa-sec__title">Структура</h2>
                    </div>
                    <div className="pa-tree">
                        <div className="pa-tree__root">
                            <span className="pa-tree__abbr">ГАФКиС</span>
                            <span className="pa-tree__full">Государственное агентство физической культуры и спорта КР</span>
                        </div>
                        <div className="pa-tree__stem" />
                        <div className="pa-tree__branches">
                            {ABOUT_DEPARTMENTS.map((d, i) => (
                                <div key={d.title} className="pa-tree__col">
                                    <div className="pa-tree__node">
                                        <span className="pa-tree__ic">{DEPT_ICON[i]}</span>
                                        <b className="pa-tree__name">{d.title}</b>
                                        <span className="pa-tree__cnt">{d.items.length}</span>
                                    </div>
                                    <ul className="pa-tree__units">
                                        {d.items.map(it => <li key={it}>{it}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="pa-sec">
                    <div className="pa-sec__head">
                        <span className="pa-sec__eyebrow">Связь</span>
                        <h2 className="pa-sec__title">Контакты</h2>
                    </div>
                    <div className="pa-contacts">
                        {ABOUT_CONTACTS.map(c => (
                            <div key={c.label} className="pa-contact">
                                <span className="pa-contact__label">{c.label}</span>
                                <span className="pa-contact__val">
                                    {c.href ? <a href={c.href}>{c.val}</a> : c.val}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
