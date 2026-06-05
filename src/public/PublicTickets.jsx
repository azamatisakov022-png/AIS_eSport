import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { TICKET_EVENTS, fmtPrice, ticketImage, eventPrice, eventAvailable } from './tickets/ticketsData'
import './tickets/tickets.css'

function passDate(iso) {
    try { return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
    catch { return iso }
}

/* Штрих-код: вертикальные полосы переменной ширины по seed */
function Barcode({ seed = 'KR', height = 40 }) {
    let s = 0; for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0
    const bars = []; let x = 0
    for (let i = 0; i < 60 && x < 240; i++) {
        s = (s * 1103515245 + 12345) >>> 0
        const w = 1 + (s % 4), gap = 1 + ((s >> 3) % 3)
        bars.push(<rect key={i} x={x} y="0" width={w} height={height} fill="currentColor" />)
        x += w + gap
    }
    return <svg className="tkw__barcode" viewBox={`0 0 ${x} ${height}`} height={height} preserveAspectRatio="none" aria-hidden>{bars}</svg>
}

/** Билеты — список в стиле Apple Wallet pass. */
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
                    <h1 className="tk-head__title">Билеты на соревнования</h1>
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

                <div className="tkw-grid">
                    {filtered.map(ev => {
                        const price = eventPrice(ev)
                        // «Мало мест» - если свободных мест в зале осталось мало
                        const almostSold = eventAvailable(ev) < 200
                        const img = ticketImage(ev)
                        const serial = `KR-${ev.id}-${ev.date.slice(8, 10)}${ev.date.slice(5, 7)}`
                        return (
                            <Link key={ev.id} to={`/public/tickets/${ev.id}`} className="tkw">
                                {/* Header band — strip-фото (Apple Wallet eventTicket) */}
                                <div className="tkw__band">
                                    {img && <img className="tkw__band-img" src={img} alt="" loading="lazy" />}
                                    <div className="tkw__band-shade" />
                                    <div className="tkw__band-top">
                                        <span className="tkw__org">АИС&nbsp;eSport</span>
                                        <span className="tkw__sport">{ev.sport}</span>
                                    </div>
                                    {almostSold && <span className="tkw__hot">Мало мест</span>}
                                </div>

                                {/* Primary field */}
                                <h3 className="tkw__title">{ev.title}</h3>

                                {/* Secondary fields */}
                                <div className="tkw__fields">
                                    <div className="tkw__f"><span>ДАТА</span><b>{passDate(ev.date)}</b></div>
                                    <div className="tkw__f"><span>ВРЕМЯ</span><b>{ev.time}</b></div>
                                    <div className="tkw__f"><span>ГОРОД</span><b>{ev.city}</b></div>
                                    <div className="tkw__f"><span>ЦЕНА</span><b>{fmtPrice(price)}</b></div>
                                </div>
                                <div className="tkw__venue">{ev.venue}</div>

                                {/* Perforation + barcode */}
                                <div className="tkw__perf" aria-hidden>
                                    <span className="tkw__notch tkw__notch--l" />
                                    <span className="tkw__notch tkw__notch--r" />
                                </div>
                                <div className="tkw__bar">
                                    <Barcode seed={serial} height={42} />
                                    <span className="tkw__serial">{serial}</span>
                                </div>

                                <span className="tkw__btn">Купить билет</span>
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
