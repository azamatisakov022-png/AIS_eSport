import PublicHero from '../components/PublicHero'
import { LINKS } from './publicContent'
import './publicPages.css'

const SECTION_ICON = { gov: '🏛️', intl: '🌐', national: '🏅' }

export default function PublicLinks() {
    return (
        <div className="pub-section">
            <PublicHero title="Полезные ссылки" description="Ссылки на веб-сайты других государственных учреждений, международных спортивных организаций и национальных федераций." variant="blue" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                {Object.entries(LINKS).map(([key, section]) => (
                    <div key={key} className="pp-block">
                        <h2 className="pp-block__title">{SECTION_ICON[key]} {section.label}</h2>
                        <div className="pp-grid pp-grid--2">
                            {section.items.map((l, i) => (
                                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="pp-row" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="pp-row__icon">🔗</div>
                                    <div className="pp-row__body">
                                        <h3 className="pp-row__title">{l.name}</h3>
                                        <div className="pp-row__desc">{l.desc}</div>
                                    </div>
                                    <span className="pp-row__action">Перейти ↗</span>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
