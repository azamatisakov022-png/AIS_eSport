import { useState } from 'react'
import PublicHero from '../components/PublicHero'
import { ANTIDOPING_SUBSTANCES, ANTIDOPING_NEWS } from './publicContent'
import './publicPages.css'

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PublicAntidoping() {
    const [tueSent, setTueSent] = useState(false)

    return (
        <div className="pub-section">
            <PublicHero title="Антидопинговая деятельность" description="Политика, процедуры и контроль антидопинговой деятельности. Список запрещённых субстанций и запрос на терапевтическое использование." variant="emerald" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-cols">
                    <div>
                        <div className="pp-block">
                            <h2 className="pp-block__title">Запрещённые субстанции и методы</h2>
                            <p className="pp-block__sub">Актуальный список на 2026 год в соответствии со стандартом WADA.</p>
                            <div className="pp-list">
                                {ANTIDOPING_SUBSTANCES.map((s, i) => (
                                    <div key={i} className="pp-row">
                                        <div className="pp-row__icon">🧪</div>
                                        <div className="pp-row__body">
                                            <h3 className="pp-row__title">{s.cat}</h3>
                                            <div className="pp-row__desc">{s.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pp-block">
                            <h2 className="pp-block__title">Запрос на терапевтическое использование (TUE)</h2>
                            {tueSent ? (
                                <div className="pp-success">
                                    <strong>Запрос отправлен</strong>
                                    Ваш запрос на терапевтическое использование принят. Антидопинговая комиссия рассмотрит его в течение 21 дня.
                                </div>
                            ) : (
                                <form className="pp-form" onSubmit={e => { e.preventDefault(); setTueSent(true) }}>
                                    <div className="pp-field">
                                        <label>ФИО спортсмена</label>
                                        <input required placeholder="Фамилия Имя Отчество" />
                                    </div>
                                    <div className="pp-field">
                                        <label>Вид спорта</label>
                                        <input required placeholder="Например: лёгкая атлетика" />
                                    </div>
                                    <div className="pp-field">
                                        <label>Субстанция / метод</label>
                                        <input required placeholder="Наименование препарата" />
                                    </div>
                                    <div className="pp-field">
                                        <label>Медицинское обоснование</label>
                                        <textarea required placeholder="Диагноз и обоснование необходимости применения" />
                                    </div>
                                    <button type="submit" className="pp-form__submit">Отправить запрос</button>
                                    <p className="pp-form__note">К запросу необходимо приложить медицинскую документацию. Рассмотрение — до 21 дня.</p>
                                </form>
                            )}
                        </div>
                    </div>

                    <aside>
                        <div className="pp-sidebar-card">
                            <h3 className="pp-sidebar-card__title">Пресс-релизы</h3>
                            {ANTIDOPING_NEWS.map((n, i) => (
                                <div key={i} className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}>
                                    <span className="pp-contact__label">{fmtDate(n.date)}</span>
                                    <span className="pp-contact__val">{n.title}</span>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
