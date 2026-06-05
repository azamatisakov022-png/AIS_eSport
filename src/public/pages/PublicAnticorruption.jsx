import { useState } from 'react'
import RichHero from '../components/RichHero'
import { ANTICORRUPTION_HOTLINES, ANTICORRUPTION_DOCS } from './publicContent'
import './publicPages.css'
import './ppRich.css'

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const I = {
    lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>,
    phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.4 7.6-8 9-4.6-1.4-8-4-8-9V6z" /></svg>,
    doc: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>,
    key: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="4.5" /><path d="m10.5 12.5 9-9M16 4l3 3M14 6l3 3" /></svg>,
}
const STEPS = ['Сообщение', 'Контакт', 'Готово']
const MINI = [['86', 'обращений принято'], ['64', 'рассмотрено'], ['9', 'мер принято']]

export default function PublicAnticorruption() {
    const [step, setStep] = useState(0)
    const [form, setForm] = useState({ topic: '', desc: '', contact: '' })
    const [sent, setSent] = useState(false)
    const phone = ANTICORRUPTION_HOTLINES[0]
    const others = ANTICORRUPTION_HOTLINES.slice(1)
    const cur = sent ? 2 : step

    return (
        <div className="pub-section pp-rich">
            {/* Secure report hero - flush, в стиле дома, со скан-анимацией */}
            <RichHero variant="slate" scan align="center">
                <span className="pac-lock">{I.lock}</span>
                <h1 className="pac-hero__h">Защищённый канал сообщения</h1>
                <p className="pac-hero__sub">Соединение защищено. Сообщить о коррупционном правонарушении можно анонимно, конфиденциально или открыто - режим выбираете вы.</p>
            </RichHero>

            <div className="pub-container pp-wrap">
                <div className="pac-body">
                    <div className="pac-form">
                        <ol className="pac-steps">
                            {STEPS.map((s, i) => (
                                <li key={i} className={`pac-step${i === cur ? ' is-active' : ''}${i < cur ? ' is-done' : ''}`}>
                                    <span className="pac-step__n">{i < cur ? '✓' : i + 1}</span><span>{s}</span>
                                </li>
                            ))}
                        </ol>

                        {sent ? (
                            <div className="pp-success">
                                <strong>Обращение принято</strong>
                                Ваше сообщение зарегистрировано. Код обращения: <b className="pp-mono">КР-АК-{(2600 + Math.floor((form.topic.length + form.desc.length) % 400)).toString()}</b>. При указании контактов с вами свяжутся.
                            </div>
                        ) : step === 0 ? (
                            <form className="pp-form" onSubmit={e => { e.preventDefault(); if (form.topic.trim() && form.desc.trim()) setStep(1) }}>
                                <div className="pac-alert">Режим: <b>анонимно</b> · личные данные не запрашиваются</div>
                                <div className="pp-field"><label>Тема обращения</label><input required value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="Кратко опишите суть" /></div>
                                <div className="pp-field"><label>Описание</label><textarea required value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Что произошло, когда, какие подразделения затронуты" /></div>
                                <div className="pac-navrow">
                                    <span />
                                    <button type="submit" className="pp-btn pp-btn--navy">Далее</button>
                                </div>
                            </form>
                        ) : (
                            <form className="pp-form" onSubmit={e => { e.preventDefault(); setSent(true) }}>
                                <div className="pac-alert">Контакт указывать необязательно. Без него обращение останется анонимным.</div>
                                <div className="pp-field"><label>Контакт для обратной связи (необязательно)</label><input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="Телефон или e-mail" /></div>
                                <div className="pac-navrow">
                                    <button type="button" className="pp-btn pp-btn--ghost" onClick={() => setStep(0)}>Назад</button>
                                    <button type="submit" className="pp-btn pp-btn--navy">Отправить обращение</button>
                                </div>
                                <p className="pp-form__note">Гарантируется конфиденциальность в соответствии с законодательством КР.</p>
                            </form>
                        )}
                    </div>

                    <aside className="pac-trust">
                        <div className="pac-trust__phone">
                            <span className="pac-pic">{I.phone}</span>
                            <b><a href={phone.href}>{phone.val}</a></b>
                            <span>{phone.label}</span>
                        </div>
                        <ul className="pac-guar">
                            <li>{I.shield} Защита заявителя по закону</li>
                            <li>{I.lock} Анонимность сохраняется</li>
                            <li>{I.key} Код обращения для обратной связи</li>
                        </ul>
                        {others.length > 0 && (
                            <div className="pp-sidebar-card" style={{ padding: '14px 16px' }}>
                                {others.map((h, i) => (
                                    <div key={i} className="pp-contact" style={{ flexDirection: 'column', gap: 2 }}>
                                        <span className="pp-contact__label">{h.label}</span>
                                        <span className="pp-contact__val"><a href={h.href}>{h.val}</a></span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="pac-mini">
                            {MINI.map(([n, l], i) => <div key={i} className="pac-mini__c"><b>{n}</b><span>{l}</span></div>)}
                        </div>
                    </aside>
                </div>

                <div className="pp-block">
                    <h2 className="pp-block__title">Документы и отчёты</h2>
                    <div className="pd-list">
                        {ANTICORRUPTION_DOCS.map((d, i) => (
                            <a key={i} className="pub-card pd-card" href="#">
                                <span className="pd-card__ic">{I.doc}</span>
                                <div className="pd-card__body">
                                    <h3 className="pd-card__title">{d.title}</h3>
                                    <div className="pd-card__sub">{fmtDate(d.date)}</div>
                                </div>
                                <span className="pd-card__go">Открыть →</span>
                            </a>
                        ))}
                    </div>
                </div>

                <p className="pp-form__note">Данные приведены в справочных целях. Статистика обращений - демонстрационная. Официальная отчётность публикуется в соответствии с законодательством Кыргызской Республики.</p>
            </div>
        </div>
    )
}
