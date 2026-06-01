import { Link } from 'react-router-dom'
import PublicHero from '../components/PublicHero'
import { GOV_SERVICES } from './publicContent'
import './publicPages.css'

export default function PublicServices() {
    return (
        <div className="pub-section">
            <PublicHero title="Государственные услуги" description="Онлайн-услуги ГАФКиС в сфере спорта: заявления, сертификаты, звания. Подача через личный кабинет." variant="blue" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-grid pp-grid--2">
                    {GOV_SERVICES.map(s => (
                        <Link key={s.id} to={s.link} className="pp-row" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="pp-row__icon">{s.icon}</div>
                            <div className="pp-row__body">
                                <h3 className="pp-row__title">{s.title}</h3>
                                <div className="pp-row__meta">
                                    <span className="pp-badge pp-badge--gray">⏱ {s.term}</span>
                                    <span className="pp-badge pp-badge--green">{s.cost}</span>
                                </div>
                            </div>
                            <span className="pp-row__action pp-row__action--primary">Оформить</span>
                        </Link>
                    ))}
                </div>

                <p className="pp-form__note">Услуги оказываются в соответствии со стандартами государственных услуг. Для подачи заявления требуется авторизация через личный кабинет (СМЭВ «Түндүк» ЕСИ).</p>
            </div>
        </div>
    )
}
