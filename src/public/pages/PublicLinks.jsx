import PublicHero from '../components/PublicHero'
import { LINKS } from './publicContent'
import './publicPages.css'

/* outline-иконки вместо эмодзи */
const ICON = {
    gov: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" /></svg>,
    intl: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>,
    national: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h12v3a6 6 0 0 1-12 0z" /><path d="M18 5h3v2a3 3 0 0 1-3 3M6 5H3v2a3 3 0 0 0 3 3M9 16h6M8 20h8M12 13v3" /></svg>,
}
const LinkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8" /></svg>
)

export default function PublicLinks() {
    return (
        <div className="pub-section">
            <PublicHero title="Полезные ссылки" description="Ссылки на веб-сайты других государственных учреждений, международных спортивных организаций и национальных федераций." variant="blue" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                {Object.entries(LINKS).map(([key, section]) => (
                    <div key={key} className="pp-block">
                        <h2 className="pp-block__title pl-h">
                            <span className="pl-h__ic">{ICON[key]}</span>{section.label}
                        </h2>
                        <div className="pl-grid">
                            {section.items.map((l, i) => (
                                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="pub-card pl-link">
                                    <span className="pl-link__icon"><LinkIcon /></span>
                                    <span className="pl-link__body">
                                        <span className="pl-link__name">{l.name}</span>
                                        <span className="pl-link__desc">{l.desc}</span>
                                    </span>
                                    <span className="pl-link__go">Перейти ↗</span>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
