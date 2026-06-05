import { Link } from 'react-router-dom'
import PublicHero from '../components/PublicHero'
import { GOV_SERVICES } from './publicContent'
import { GOV_ICON } from './govServiceIcons'
import './publicPages.css'
import './ppRich.css'

export default function PublicServices() {
    return (
        <div className="pub-section">
            <PublicHero title="Государственные услуги" description="Онлайн-услуги ГАФКиС в сфере спорта: заявления, сертификаты, звания. Подача через личный кабинет." variant="blue" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-grid pp-grid--2" style={{ gap: 12 }}>
                    {GOV_SERVICES.map(s => (
                        <Link key={s.id} to={s.link} className="pub-card pd-card">
                            <span className="pd-card__ic pp-row__icon--nv">{GOV_ICON[s.ic]}</span>
                            <div className="pd-card__body">
                                <h3 className="pd-card__title">{s.title}</h3>
                                <div className="pd-card__meta">
                                    <span className="gs-term">{s.term}</span>
                                    <span className={`gs-cost${s.cost === 'По тарифу' ? ' is-paid' : ''}`}>{s.cost}</span>
                                </div>
                            </div>
                            <span className="pd-card__go">Оформить →</span>
                        </Link>
                    ))}
                </div>

                <p className="pp-form__note">Услуги оказываются в соответствии со стандартами государственных услуг. Для подачи заявления требуется авторизация через личный кабинет (СМЭВ «Түндүк» ЕСИ).</p>
            </div>
        </div>
    )
}
