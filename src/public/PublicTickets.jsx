import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { TICKET_EVENTS, sectorAvailable, fmtPrice, fmtDate } from './tickets/ticketsData'
import './tickets/tickets.css'

/** Ticket showcase — events with online sales. */
export default function PublicTickets() {
    const [sport, setSport] = useState('')
    const [city, setCity] = useState('')

    const sports = useMemo(() => [...new Set(TICKET_EVENTS.map(e => e.sport))], [])
    const cities = useMemo(() => [...new Set(TICKET_EVENTS.map(e => e.city))], [])

    const filtered = TICKET_EVENTS.filter(e =>
        (!sport || e.sport === sport) && (!city || e.city === city)
    )

    return (
        <div className="pub-section">
            <div className="pub-container">
                <div className="tk-head">
                    <h1 className="tk-head__title">🎟 Билеты на соревнования</h1>
                    <p className="tk-head__sub">Официальная продажа билетов на спортивные мероприятия Кыргызской Республики. Электронный билет с QR-кодом — покажите его на входе.</p>
                </div>

                <div className="tk-filters">
                    <select value={sport} onChange={e => setSport(e.target.value)} aria-label="Вид спорта">
                        <option value="">Все виды спорта</option>
                        {sports.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={city} onChange={e => setCity(e.target.value)} aria-label="Город">
                        <option value="">Все города</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {(sport || city) && (
                        <button type="button" className="tk-filters__reset" onClick={() => { setSport(''); setCity('') }}>Сбросить</button>
                    )}
                </div>

                <div className="tk-grid">
                    {filtered.map(ev => {
                        const minPrice = Math.min(...ev.sectors.map(s => s.price))
                        const totalAvail = ev.sectors.reduce((a, s) => a + sectorAvailable(s), 0)
                        const almostSold = totalAvail < 200
                        return (
                            <Link key={ev.id} to={`/public/tickets/${ev.id}`} className="tk-card">
                                <div className="tk-card__poster" style={{ '--accent': ev.sectors[0].color }}>
                                    <span className="tk-card__emoji">{ev.emoji}</span>
                                    <span className="tk-card__sport">{ev.sport}</span>
                                </div>
                                <div className="tk-card__body">
                                    <h3 className="tk-card__title">{ev.title}</h3>
                                    <div className="tk-card__meta">
                                        <span>📅 {fmtDate(ev.date)}, {ev.time}</span>
                                        <span>📍 {ev.venue}, {ev.city}</span>
                                    </div>
                                    <div className="tk-card__foot">
                                        <span className="tk-card__price">от {fmtPrice(minPrice)}</span>
                                        {almostSold
                                            ? <span className="tk-card__badge tk-card__badge--hot">Мало мест</span>
                                            : <span className="tk-card__badge">В продаже</span>}
                                    </div>
                                    <span className="tk-card__cta">Купить билеты →</span>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {filtered.length === 0 && (
                    <p className="tk-empty">По выбранным фильтрам мероприятий не найдено.</p>
                )}
            </div>
        </div>
    )
}
