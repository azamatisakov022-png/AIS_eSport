import { useState } from 'react'
import PublicHero from '../components/PublicHero'
import './publicPages.css'

/* Демо-обращения для отслеживания статуса */
const SAMPLE_APPEALS = [
    { no: 'ОБ-2026-00428', topic: 'Запрос о расписании секций', date: '2026-05-20', status: 'Рассмотрено', badge: 'pp-badge--green' },
    { no: 'ОБ-2026-00451', topic: 'Жалоба на состояние стадиона', date: '2026-05-26', status: 'На рассмотрении', badge: 'pp-badge--amber' },
    { no: 'ОБ-2026-00467', topic: 'Предложение о новом виде спорта', date: '2026-05-29', status: 'Зарегистрировано', badge: 'pp-badge--blue' },
]

export default function PublicReception() {
    const [sent, setSent] = useState(false)
    const [appealNo, setAppealNo] = useState('')
    const [track, setTrack] = useState(null)

    const submit = (e) => {
        e.preventDefault()
        setSent(true)
    }

    const doTrack = (e) => {
        e.preventDefault()
        const found = SAMPLE_APPEALS.find(a => a.no.toLowerCase() === appealNo.trim().toLowerCase())
        setTrack(found || 'notfound')
    }

    return (
        <div className="pub-section">
            <PublicHero title="Интернет-приёмная граждан" description="Подача онлайн-обращений и отслеживание статуса их рассмотрения." variant="indigo" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-cols">
                    <div>
                        <div className="pp-block">
                            <h2 className="pp-block__title">Подать обращение</h2>
                            {sent ? (
                                <div className="pp-success">
                                    <strong>Обращение зарегистрировано · № ОБ-2026-00482</strong>
                                    Срок рассмотрения — до 14 рабочих дней. Статус можно отследить по номеру обращения.
                                </div>
                            ) : (
                                <form className="pp-form" onSubmit={submit}>
                                    <div className="pp-field">
                                        <label>ФИО</label>
                                        <input required placeholder="Фамилия Имя Отчество" />
                                    </div>
                                    <div className="pp-field">
                                        <label>Контакт (телефон или e-mail)</label>
                                        <input required placeholder="+996 ... или e-mail" />
                                    </div>
                                    <div className="pp-field">
                                        <label>Категория обращения</label>
                                        <select>
                                            <option>Вопрос</option>
                                            <option>Жалоба</option>
                                            <option>Предложение</option>
                                            <option>Благодарность</option>
                                        </select>
                                    </div>
                                    <div className="pp-field">
                                        <label>Текст обращения</label>
                                        <textarea required placeholder="Опишите ваше обращение" />
                                    </div>
                                    <button type="submit" className="pp-form__submit">Отправить</button>
                                    <p className="pp-form__note">Обращения рассматриваются в соответствии с Законом КР «О порядке рассмотрения обращений граждан». Срок — до 14 рабочих дней.</p>
                                </form>
                            )}
                        </div>
                    </div>

                    <aside>
                        <div className="pp-sidebar-card">
                            <h3 className="pp-sidebar-card__title">Отследить обращение</h3>
                            <form onSubmit={doTrack}>
                                <div className="pp-field">
                                    <input value={appealNo} onChange={e => setAppealNo(e.target.value)} placeholder="№ ОБ-2026-XXXXX" />
                                </div>
                                <button type="submit" className="pp-form__submit" style={{ width: '100%', padding: '11px' }}>Проверить статус</button>
                            </form>

                            {track === 'notfound' && (
                                <p className="pp-form__note">Обращение с таким номером не найдено. Попробуйте, например: ОБ-2026-00428</p>
                            )}
                            {track && track !== 'notfound' && (
                                <div style={{ marginTop: 16 }}>
                                    <div className="pp-contact"><span className="pp-contact__label">Номер</span><span className="pp-contact__val">{track.no}</span></div>
                                    <div className="pp-contact"><span className="pp-contact__label">Тема</span><span className="pp-contact__val">{track.topic}</span></div>
                                    <div className="pp-contact"><span className="pp-contact__label">Дата</span><span className="pp-contact__val">{new Date(track.date).toLocaleDateString('ru-RU')}</span></div>
                                    <div className="pp-contact"><span className="pp-contact__label">Статус</span><span className="pp-contact__val"><span className={`pp-badge ${track.badge}`}>{track.status}</span></span></div>
                                </div>
                            )}
                        </div>

                        <div className="pp-sidebar-card" style={{ marginTop: 16 }}>
                            <h3 className="pp-sidebar-card__title">Примеры для проверки</h3>
                            {SAMPLE_APPEALS.map(a => (
                                <div key={a.no} className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}>
                                    <span className="pp-contact__val" style={{ fontWeight: 600 }}>{a.no}</span>
                                    <span className="pp-contact__label">{a.topic}</span>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
