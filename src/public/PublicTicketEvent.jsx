import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import FauxQR from './tickets/FauxQR'
import {
    getTicketEvent, fmtPrice, fmtDate, PAYMENT_METHODS, ticketImage,
    eventPrice, eventAvailable,
} from './tickets/ticketsData'
import './tickets/tickets.css'

const STEPS = ['Билеты', 'Оплата', 'Билет']

export default function PublicTicketEvent() {
    const { id } = useParams()
    const event = getTicketEvent(id)

    const [step, setStep] = useState(0)
    const [qty, setQty] = useState(1)
    const [email, setEmail] = useState('')
    const [pay, setPay] = useState('card')
    const [paying, setPaying] = useState(false)
    const [ticketNo, setTicketNo] = useState('')

    if (!event) {
        return (
            <div className="pub-section"><div className="pub-container">
                <p className="tk-empty">Мероприятие не найдено. <Link to="/public/tickets">Вернуться к билетам</Link></p>
            </div></div>
        )
    }

    const price = eventPrice(event)
    const available = eventAvailable(event)
    const maxQty = Math.min(8, Math.max(1, available))
    const total = price * qty
    const img = ticketImage(event)

    const goPay = () => setStep(1)
    const canCheckout = /\S+@\S+\.\S+/.test(email.trim())

    const submitPayment = (e) => {
        e.preventDefault()
        if (!canCheckout || paying) return
        setPaying(true)
        setTimeout(() => {
            const no = `КР-${event.id}-${Date.now().toString().slice(-6)}`
            setTicketNo(no)
            setPaying(false)
            setStep(2)
        }, 1600)
    }

    return (
        <div className="pub-section">
            <div className="pub-container">
                <Link to="/public/tickets" className="tk-back">← Все билеты</Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', margin: '12px 0 24px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, fontSize: 14, color: '#9A3412' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z" /></svg>
                    <span><b>Раздел в разработке.</b> Онлайн-оплата билетов будет доступна на следующем этапе. Ниже — демонстрационный вид покупки.</span>
                </div>

                {/* Event header */}
                <div className="tk-event-head">
                    <div className="tk-event-head__poster">
                        {img ? <img src={img} alt="" loading="lazy" /> : null}
                        <span className="tk-event-head__poster-sport">{event.sport}</span>
                    </div>
                    <div>
                        <h1 className="tk-event-head__title">{event.title}</h1>
                        <div className="tk-event-head__meta">
                            <span>{fmtDate(event.date)}, {event.time}</span>
                            <span>{event.venue}, {event.city}</span>
                            <span>{event.sport}</span>
                        </div>
                    </div>
                </div>

                {/* Stepper */}
                <ol className="tk-steps" aria-label="Шаги покупки">
                    {STEPS.map((s, i) => (
                        <li key={s} className={`tk-step${i === step ? ' is-active' : ''}${i < step ? ' is-done' : ''}`}>
                            <span className="tk-step__num">{i < step ? '✓' : i + 1}</span>
                            <span className="tk-step__label">{s}</span>
                        </li>
                    ))}
                </ol>

                {/* ── STEP 1: PHOTO HERO (входной билет, свободная рассадка) ── */}
                {step === 0 && (
                    <div className="tk-buy">
                        <div className="tk-buy__photo">
                            {img && <img src={img} alt="" />}
                            <span className="tk-buy__tag">{event.sport}</span>
                        </div>
                        <div className="tk-buy__panel">
                            <span className="tk-buy__eyebrow">ВХОДНОЙ БИЛЕТ · СВОБОДНАЯ РАССАДКА</span>
                            <h2 className="tk-buy__title">{event.title}</h2>
                            <div className="tk-buy__meta">{fmtDate(event.date)}, {event.time} · {event.venue}</div>

                            <div className="tk-buy__pricerow">
                                <div className="tk-buy__price">{fmtPrice(price)}<i> / билет</i></div>
                                <div className="tk-qty__ctrl">
                                    <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Меньше">−</button>
                                    <strong>{qty}</strong>
                                    <button type="button" onClick={() => setQty(q => Math.min(maxQty, q + 1))} aria-label="Больше">+</button>
                                </div>
                            </div>

                            <div className="tk-buy__total">
                                <span>Итого за {qty}</span>
                                <strong>{fmtPrice(total)}</strong>
                            </div>

                            <button type="button" className="tk-btn tk-btn--primary" onClick={goPay}>
                                Продолжить
                            </button>

                            <p className="tk-buy__note">
                                Места не нумерованы - рассадка свободная, в порядке прибытия. Электронный билет с QR-кодом придёт на email сразу после оплаты.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: CHECKOUT ── */}
                {step === 1 && (
                    <form className="tk-checkout" onSubmit={submitPayment}>
                        <div className="tk-checkout__form">
                            <h3>Куда отправить билет</h3>
                            <label className="tk-field">
                                <span>Email</span>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@mail.kg" required />
                            </label>
                            <p className="tk-field__hint">Электронный билет с QR-кодом придёт на эту почту сразу после оплаты.</p>

                            <h3 style={{ marginTop: 20 }}>Способ оплаты</h3>
                            <div className="tk-pay">
                                {PAYMENT_METHODS.map(pm => (
                                    <label key={pm.id} className={`tk-pay__opt${pay === pm.id ? ' is-active' : ''}`}>
                                        <input type="radio" name="pay" value={pm.id} checked={pay === pm.id} onChange={() => setPay(pm.id)} />
                                        <span className="tk-pay__name">{pm.name}</span>
                                        <span className="tk-pay__hint">{pm.hint}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <aside className="tk-summary">
                            <h3>Ваш заказ</h3>
                            <div className="tk-summary__row"><span>Мероприятие</span><b>{event.title}</b></div>
                            <div className="tk-summary__row"><span>Билет</span><b>Входной, свободная рассадка</b></div>
                            <div className="tk-summary__row"><span>Билетов</span><b>{qty} × {fmtPrice(price)}</b></div>
                            <div className="tk-summary__total"><span>К оплате</span><strong>{fmtPrice(total)}</strong></div>
                            <button type="submit" className="tk-btn tk-btn--primary" disabled={!canCheckout || paying}>
                                {paying ? 'Обработка платежа…' : `Оплатить ${fmtPrice(total)}`}
                            </button>
                            <button type="button" className="tk-btn tk-btn--ghost" onClick={() => setStep(0)} disabled={paying}>Назад</button>
                            <p className="tk-summary__note">Демонстрационная оплата. Реальная интеграция с платёжными системами - на этапе внедрения.</p>
                        </aside>
                    </form>
                )}

                {/* ── STEP 3: TICKET ── */}
                {step === 2 && (
                    <div className="tk-result">
                        <div className="tk-success">
                            <span className="tk-success__icon">✓</span>
                            <h2>Оплата прошла успешно</h2>
                            <p>Электронный билет отправлен на {email}</p>
                        </div>

                        <div className="tk-ticket">
                            <div className="tk-ticket__main">
                                <div className="tk-ticket__sport">{event.sport}</div>
                                <h3 className="tk-ticket__title">{event.title}</h3>
                                <div className="tk-ticket__rows">
                                    <div><span>Дата</span><b>{fmtDate(event.date)}, {event.time}</b></div>
                                    <div><span>Место</span><b>{event.venue}</b></div>
                                    <div><span>Рассадка</span><b>Свободная</b></div>
                                    <div><span>Билетов</span><b>{qty}</b></div>
                                    <div><span>Покупатель</span><b>{email}</b></div>
                                    <div><span>Сумма</span><b>{fmtPrice(total)}</b></div>
                                </div>
                                <div className="tk-ticket__no">Билет № {ticketNo}</div>
                            </div>
                            <div className="tk-ticket__stub">
                                <FauxQR value={ticketNo} size={132} />
                                <span className="tk-ticket__qrhint">Предъявите QR на входе</span>
                            </div>
                        </div>

                        <div className="tk-result__actions">
                            <button type="button" className="tk-btn tk-btn--primary" onClick={() => window.print()}>Скачать / печать билета</button>
                            <Link to="/public/tickets" className="tk-btn tk-btn--ghost">Купить ещё билеты</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
