import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ArenaScheme from './tickets/ArenaScheme'
import FauxQR from './tickets/FauxQR'
import { getTicketEvent, sectorAvailable, fmtPrice, fmtDate, PAYMENT_METHODS } from './tickets/ticketsData'
import './tickets/tickets.css'

const STEPS = ['Выбор мест', 'Оплата', 'Билет']

export default function PublicTicketEvent() {
    const { id } = useParams()
    const event = getTicketEvent(id)

    const [step, setStep] = useState(0)
    const [sectorId, setSectorId] = useState(null)
    const [qty, setQty] = useState(1)
    const [buyer, setBuyer] = useState({ name: '', phone: '', email: '' })
    const [pay, setPay] = useState('elcart')
    const [paying, setPaying] = useState(false)
    const [ticketNo, setTicketNo] = useState('')

    if (!event) {
        return (
            <div className="pub-section"><div className="pub-container">
                <p className="tk-empty">Мероприятие не найдено. <Link to="/public/tickets">Вернуться к билетам</Link></p>
            </div></div>
        )
    }

    const sector = event.sectors.find(s => s.id === sectorId) || null
    const maxQty = sector ? Math.min(8, sectorAvailable(sector)) : 1
    const total = sector ? sector.price * qty : 0

    const goPay = () => { if (sector) setStep(1) }
    const canCheckout = buyer.name.trim() && buyer.phone.trim() && buyer.email.trim()

    const submitPayment = (e) => {
        e.preventDefault()
        if (!canCheckout || paying) return
        setPaying(true)
        // Imitate payment processing
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

                {/* Event header */}
                <div className="tk-event-head">
                    <div className="tk-event-head__poster" style={{ '--accent': event.sectors[0].color }}>
                        <span>{event.emoji}</span>
                    </div>
                    <div>
                        <h1 className="tk-event-head__title">{event.title}</h1>
                        <div className="tk-event-head__meta">
                            <span>📅 {fmtDate(event.date)}, {event.time}</span>
                            <span>📍 {event.venue}, {event.city}</span>
                            <span>🏅 {event.sport}</span>
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

                {/* ── STEP 1: SELECT ── */}
                {step === 0 && (
                    <div className="tk-select">
                        <ArenaScheme
                            schemeType={event.schemeType}
                            sectors={event.sectors}
                            selectedId={sectorId}
                            onSelect={setSectorId}
                        />

                        <aside className="tk-sidebar">
                            <h3>Сектора</h3>
                            <ul className="tk-sector-list">
                                {event.sectors.map(s => {
                                    const avail = sectorAvailable(s)
                                    const soldOut = avail === 0
                                    return (
                                        <li key={s.id}>
                                            <button
                                                type="button"
                                                className={`tk-sector${sectorId === s.id ? ' is-active' : ''}${soldOut ? ' is-soldout' : ''}`}
                                                onClick={() => !soldOut && setSectorId(s.id)}
                                                disabled={soldOut}
                                            >
                                                <span className="tk-sector__dot" style={{ background: s.color }} />
                                                <span className="tk-sector__name">{s.name}</span>
                                                <span className="tk-sector__price">{soldOut ? 'Нет мест' : fmtPrice(s.price)}</span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>

                            {sector && (
                                <div className="tk-qty">
                                    <span>Количество</span>
                                    <div className="tk-qty__ctrl">
                                        <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Меньше">−</button>
                                        <strong>{qty}</strong>
                                        <button type="button" onClick={() => setQty(q => Math.min(maxQty, q + 1))} aria-label="Больше">+</button>
                                    </div>
                                    <small>Свободно: {sectorAvailable(sector)}</small>
                                </div>
                            )}

                            <div className="tk-total">
                                <span>Итого</span>
                                <strong>{fmtPrice(total)}</strong>
                            </div>
                            <button type="button" className="tk-btn tk-btn--primary" disabled={!sector} onClick={goPay}>
                                Продолжить
                            </button>
                        </aside>
                    </div>
                )}

                {/* ── STEP 2: CHECKOUT ── */}
                {step === 1 && sector && (
                    <form className="tk-checkout" onSubmit={submitPayment}>
                        <div className="tk-checkout__form">
                            <h3>Данные покупателя</h3>
                            <label className="tk-field">
                                <span>ФИО</span>
                                <input type="text" value={buyer.name} onChange={e => setBuyer(b => ({ ...b, name: e.target.value }))} placeholder="Иванов Иван" required />
                            </label>
                            <label className="tk-field">
                                <span>Телефон</span>
                                <input type="tel" value={buyer.phone} onChange={e => setBuyer(b => ({ ...b, phone: e.target.value }))} placeholder="+996 700 00 00 00" required />
                            </label>
                            <label className="tk-field">
                                <span>Email (для электронного билета)</span>
                                <input type="email" value={buyer.email} onChange={e => setBuyer(b => ({ ...b, email: e.target.value }))} placeholder="example@mail.kg" required />
                            </label>

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
                            <div className="tk-summary__row"><span>Сектор</span><b>{sector.name}</b></div>
                            <div className="tk-summary__row"><span>Билетов</span><b>{qty} × {fmtPrice(sector.price)}</b></div>
                            <div className="tk-summary__total"><span>К оплате</span><strong>{fmtPrice(total)}</strong></div>
                            <button type="submit" className="tk-btn tk-btn--primary" disabled={!canCheckout || paying}>
                                {paying ? 'Обработка платежа…' : `Оплатить ${fmtPrice(total)}`}
                            </button>
                            <button type="button" className="tk-btn tk-btn--ghost" onClick={() => setStep(0)} disabled={paying}>Назад</button>
                            <p className="tk-summary__note">Демонстрационная оплата. Реальная интеграция с платёжными системами — на этапе внедрения.</p>
                        </aside>
                    </form>
                )}

                {/* ── STEP 3: TICKET ── */}
                {step === 2 && sector && (
                    <div className="tk-result">
                        <div className="tk-success">
                            <span className="tk-success__icon">✓</span>
                            <h2>Оплата прошла успешно</h2>
                            <p>Электронный билет отправлен на {buyer.email}</p>
                        </div>

                        <div className="tk-ticket">
                            <div className="tk-ticket__main">
                                <div className="tk-ticket__sport">{event.emoji} {event.sport}</div>
                                <h3 className="tk-ticket__title">{event.title}</h3>
                                <div className="tk-ticket__rows">
                                    <div><span>Дата</span><b>{fmtDate(event.date)}, {event.time}</b></div>
                                    <div><span>Место</span><b>{event.venue}</b></div>
                                    <div><span>Сектор</span><b>{sector.name}</b></div>
                                    <div><span>Билетов</span><b>{qty}</b></div>
                                    <div><span>Покупатель</span><b>{buyer.name}</b></div>
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
                            <Link to="/public/verify" className="tk-btn tk-btn--ghost">Проверить подлинность</Link>
                            <Link to="/public/tickets" className="tk-btn tk-btn--ghost">Купить ещё билеты</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
