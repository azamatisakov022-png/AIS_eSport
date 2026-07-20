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
    mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
}
const STEPS = ['Вход через ЕСИ', 'Сообщение', 'Готово']
const MINI = [['86', 'обращений принято'], ['64', 'рассмотрено'], ['9', 'мер принято']]

/* Демо-личность из ЕСИ Түндүк (в проде — реальная авторизация) */
const ESI_PERSON = { fio: 'Асанов Бекболот Асанович', inn: '20101199000123' }

export default function PublicAnticorruption() {
    const [step, setStep] = useState(0)
    const [esi, setEsi] = useState(null)
    const [form, setForm] = useState({ topic: '', desc: '' })
    const [sent, setSent] = useState(false)
    const phone = ANTICORRUPTION_HOTLINES[0]
    const others = ANTICORRUPTION_HOTLINES.slice(1)
    const cur = sent ? 2 : step

    const loginEsi = () => { setEsi(ESI_PERSON); setStep(1) }

    return (
        <div className="pub-section pp-rich">
            {/* Secure report hero — вход через ЕСИ обязателен, анонимной подачи нет */}
            <RichHero variant="slate" scan align="center">
                <span className="pac-lock">{I.lock}</span>
                <h1 className="pac-hero__h">Сообщить о коррупции</h1>
                <p className="pac-hero__sub">Обращение подаётся после входа через ЕСИ Түндүк. Анонимная подача не предусмотрена — заявитель идентифицируется. Защита заявителя гарантируется законом Кыргызской Республики.</p>
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
                                <strong>Обращение зарегистрировано</strong>
                                Код обращения: <b className="pp-mono">КР-АК-{(2600 + Math.floor((form.topic.length + form.desc.length) % 400)).toString()}</b>. Обращение направлено на официальную почту ГАФКиС и рассматривается в порядке, установленном Законом «О порядке рассмотрения обращений граждан». Ответ — в течение 14 рабочих дней на данные, указанные в вашем профиле ЕСИ.
                            </div>
                        ) : step === 0 ? (
                            <div className="pp-form">
                                <div className="pac-alert">Для подачи обращения требуется вход через ЕСИ Түндүк. Обращение приравнивается к обращению гражданина и не может быть анонимным.</div>
                                <button type="button" className="pp-btn pp-btn--navy" onClick={loginEsi} style={{ alignSelf: 'flex-start' }}>Войти через ЕСИ Түндүк</button>
                                <p className="pp-form__note">Персональные данные подтягиваются из ЕСИ и не запрашиваются повторно. Данные заявителя доступны только общему отделу ГАФКиС.</p>
                            </div>
                        ) : (
                            <form className="pp-form" onSubmit={e => { e.preventDefault(); if (form.topic.trim() && form.desc.trim()) setSent(true) }}>
                                <div className="pac-alert pac-alert--ok">{I.check} Выполнен вход: <b>{esi.fio}</b> · ИНН {esi.inn}</div>
                                <div className="pp-field"><label>Тема обращения</label><input required value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="Кратко опишите суть" /></div>
                                <div className="pp-field"><label>Описание</label><textarea required value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Что произошло, когда, какие подразделения затронуты" /></div>
                                <div className="pac-navrow">
                                    <button type="button" className="pp-btn pp-btn--ghost" onClick={() => { setEsi(null); setStep(0) }}>Выйти</button>
                                    <button type="submit" className="pp-btn pp-btn--navy">Отправить обращение</button>
                                </div>
                                <p className="pp-form__note">Обращение направляется на официальную почту ГАФКиС. Срок рассмотрения — 14 рабочих дней (Закон «О порядке рассмотрения обращений граждан»).</p>
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
                            <li>{I.lock} Вход через ЕСИ Түндүк</li>
                            <li>{I.mail} Обращение — на официальную почту ГАФКиС</li>
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
                    <p className="pp-block__sub">План мероприятий утверждается ежегодно, отчёты об исполнении публикуются ежеквартально.</p>
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

                <p className="pp-form__note" style={{ marginBottom: 4 }}>Официальный раздел «Противодействие коррупции» ГАФКиС — на портале <a href="https://egov.kg/kg/ministry/sport/3722" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pub-navy, #1F3A5F)', fontWeight: 600 }}>egov.kg</a>.</p>
                <p className="pp-form__note">Данные приведены в справочных целях. Статистика обращений — демонстрационная. Официальная отчётность публикуется в соответствии с законодательством Кыргызской Республики.</p>
            </div>
        </div>
    )
}
