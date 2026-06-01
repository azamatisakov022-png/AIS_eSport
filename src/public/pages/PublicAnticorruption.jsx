import { useState } from 'react'
import PublicHero from '../components/PublicHero'
import { ANTICORRUPTION_HOTLINES, ANTICORRUPTION_DOCS } from './publicContent'
import './publicPages.css'

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PublicAnticorruption() {
    const [sent, setSent] = useState(false)

    return (
        <div className="pub-section">
            <PublicHero title="Антикоррупционные меры" description="Противодействие коррупции, каналы обратной связи и отчёты. Сообщите о коррупционном правонарушении." variant="slate" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-cols">
                    <div>
                        <div className="pp-block">
                            <h2 className="pp-block__title">Сообщить о коррупционном правонарушении</h2>
                            {sent ? (
                                <div className="pp-success">
                                    <strong>Обращение принято</strong>
                                    Ваше сообщение зарегистрировано и будет рассмотрено в установленном порядке. При указании контактов с вами свяжутся.
                                </div>
                            ) : (
                                <form className="pp-form" onSubmit={e => { e.preventDefault(); setSent(true) }}>
                                    <div className="pp-field">
                                        <label>Тема обращения</label>
                                        <input required placeholder="Кратко опишите суть" />
                                    </div>
                                    <div className="pp-field">
                                        <label>Описание</label>
                                        <textarea required placeholder="Подробно опишите факт коррупционного правонарушения" />
                                    </div>
                                    <div className="pp-field">
                                        <label>Контакт для обратной связи (необязательно)</label>
                                        <input placeholder="Телефон или e-mail" />
                                    </div>
                                    <button type="submit" className="pp-form__submit">Отправить обращение</button>
                                    <p className="pp-form__note">Возможно анонимное обращение. Гарантируется конфиденциальность в соответствии с законодательством КР.</p>
                                </form>
                            )}
                        </div>

                        <div className="pp-block">
                            <h2 className="pp-block__title">Документы и отчёты</h2>
                            <div className="pp-list">
                                {ANTICORRUPTION_DOCS.map((d, i) => (
                                    <div key={i} className="pp-row">
                                        <div className="pp-row__icon">🛡️</div>
                                        <div className="pp-row__body">
                                            <h3 className="pp-row__title">{d.title}</h3>
                                            <div className="pp-row__meta"><span>{fmtDate(d.date)}</span></div>
                                        </div>
                                        <button className="pp-row__action">Открыть</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside>
                        <div className="pp-sidebar-card">
                            <h3 className="pp-sidebar-card__title">Телефоны доверия</h3>
                            {ANTICORRUPTION_HOTLINES.map((h, i) => (
                                <div key={i} className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}>
                                    <span className="pp-contact__label">{h.label}</span>
                                    <span className="pp-contact__val"><a href={h.href}>{h.val}</a></span>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
