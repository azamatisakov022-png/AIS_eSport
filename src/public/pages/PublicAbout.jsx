import PublicHero from '../components/PublicHero'
import { ABOUT_LEADERSHIP, ABOUT_DEPARTMENTS, ABOUT_CONTACTS } from './publicContent'
import './publicPages.css'

export default function PublicAbout() {
    return (
        <div className="pub-section">
            <PublicHero title="О ГАФКиС" description="Государственное агентство физической культуры и спорта — уполномоченный орган, реализующий государственную политику в сфере спорта Кыргызской Республики." variant="slate" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-block">
                    <div className="pp-info">
                        <h2 className="pp-info__title">О деятельности</h2>
                        <p>ГАФКиС осуществляет функции по реализации государственной политики в области физической культуры, спорта и массового спорта в Кыргызской Республике. В структуре агентства функционируют центральный аппарат, подведомственные учреждения, региональные управления, спортивные школы и федерации по видам спорта.</p>
                        <p>Основные направления: развитие массового спорта, подготовка спортивного резерва, поддержка спорта высших достижений, антидопинговая деятельность и цифровизация отрасли.</p>
                    </div>
                </div>

                <div className="pp-block">
                    <h2 className="pp-block__title">Руководство</h2>
                    <div className="pp-org-grid">
                        {ABOUT_LEADERSHIP.map((l, i) => (
                            <div key={i} className="pp-leader">
                                <div className="pp-leader__avatar">{l.avatar}</div>
                                <div>
                                    <p className="pp-leader__name">{l.name}</p>
                                    <span className="pp-leader__pos">{l.pos}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pp-block">
                    <h2 className="pp-block__title">Структура</h2>
                    <div className="pp-grid">
                        {ABOUT_DEPARTMENTS.map((d, i) => (
                            <div key={i} className="pp-info">
                                <h3 className="pp-info__title">{d.title}</h3>
                                <ul>{d.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pp-block">
                    <h2 className="pp-block__title">Контакты</h2>
                    <div className="pp-info" style={{ maxWidth: 560 }}>
                        {ABOUT_CONTACTS.map((c, i) => (
                            <div key={i} className="pp-contact">
                                <span className="pp-contact__label">{c.label}</span>
                                <span className="pp-contact__val">
                                    {c.href ? <a href={c.href}>{c.val}</a> : c.val}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
