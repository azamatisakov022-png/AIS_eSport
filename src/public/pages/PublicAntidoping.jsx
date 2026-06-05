import { useState } from 'react'
import RichHero from '../components/RichHero'
import { ANTIDOPING_SUBSTANCES, ANTIDOPING_NEWS } from './publicContent'
import './publicPages.css'
import './ppRich.css'

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const I = {
    chat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>,
    mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
    lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>,
    flask: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" /><path d="M7 15h10" /></svg>,
}

const CHANNELS = [
    { ic: 'chat', t: 'Анонимная форма', d: 'Без указания личных данных' },
    { ic: 'phone', t: '+996 (312) 62-34-99', d: 'Горячая линия, будни 9:00-18:00' },
    { ic: 'mail', t: 'cleansport@gafkis.gov.kg', d: 'Конфиденциальное обращение' },
]
const STATS = [['142', 'обращения за год'], ['38', 'расследований'], ['11', 'санкций']]
const FAQ = [
    { q: 'Что считается нарушением антидопинговых правил?', a: 'Это не только обнаружение запрещённой субстанции, но и отказ от теста, уклонение от сдачи проб, фальсификация, манипуляции и ряд других нарушений в соответствии с Кодексом WADA.' },
    { q: 'Как проверить, разрешён ли мой препарат?', a: 'Сверьтесь с актуальным запрещённым списком ниже. При сомнениях оформите запрос на терапевтическое использование (TUE) до начала приёма.' },
    { q: 'Что будет после обращения?', a: 'Обращение регистрируется, проверяется антидопинговой комиссией и при подтверждении передаётся на расследование. Конфиденциальность и защита заявителя гарантируются.' },
]

function Accordion({ items }) {
    const [open, setOpen] = useState(0)
    return (
        <div className="pp-acc">
            {items.map((it, i) => (
                <div key={i} className="pp-acc__i">
                    <button className="pp-acc__q" onClick={() => setOpen(open === i ? -1 : i)}><span>{it.q}</span><i>{open === i ? '−' : '+'}</i></button>
                    {open === i && <p className="pp-acc__a">{it.a}</p>}
                </div>
            ))}
        </div>
    )
}

export default function PublicAntidoping() {
    const [tueSent, setTueSent] = useState(false)

    return (
        <div className="pub-section pp-rich">
            {/* Reporting-first hero (Protect Your Sport) - flush, в стиле дома */}
            <RichHero variant="emerald">
                <span className="pad-eyebrow"><i />PROTECT YOUR SPORT</span>
                <h1 className="pad-hero__h">Чтобы остановить допинг,<br />нужна команда</h1>
                <p className="pad-hero__sub">Заметили подозрительное - сообщите. Анонимно и конфиденциально. Защита заявителя гарантирована.</p>
                <div className="pad-channels">
                    {CHANNELS.map((c, i) => (
                        <a key={i} className="pad-ch" href="#">
                            <span className="pad-ch__ic">{I[c.ic]}</span>
                            <b>{c.t}</b><span>{c.d}</span>
                        </a>
                    ))}
                </div>
                <div className="pad-conf">{I.lock} Соединение защищено · анонимность сохраняется</div>
            </RichHero>

            <div className="pub-container pp-wrap">
                <div className="pad-stats">
                    {STATS.map(([n, l], i) => <div key={i} className="pad-stat"><b>{n}</b><span>{l}</span></div>)}
                </div>

                <div className="pp-block">
                    <h2 className="pp-block__title">Что считается нарушением</h2>
                    <Accordion items={FAQ} />
                </div>

                {/* Существующий функционал: список субстанций + TUE + пресс-релизы */}
                <div className="pp-cols">
                    <div>
                        <div className="pp-block">
                            <h2 className="pp-block__title">Запрещённые субстанции и методы</h2>
                            <p className="pp-block__sub">Актуальный список на 2026 год в соответствии со стандартом WADA.</p>
                            <div className="pp-list">
                                {ANTIDOPING_SUBSTANCES.map((s, i) => (
                                    <div key={i} className="pp-row">
                                        <div className="pp-row__icon pp-row__icon--nv">{I.flask}</div>
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
                                    <div className="pp-field"><label>ФИО спортсмена</label><input required placeholder="Фамилия Имя Отчество" /></div>
                                    <div className="pp-field"><label>Вид спорта</label><input required placeholder="Например: лёгкая атлетика" /></div>
                                    <div className="pp-field"><label>Субстанция / метод</label><input required placeholder="Наименование препарата" /></div>
                                    <div className="pp-field"><label>Медицинское обоснование</label><textarea required placeholder="Диагноз и обоснование необходимости применения" /></div>
                                    <button type="submit" className="pp-form__submit">Отправить запрос</button>
                                    <p className="pp-form__note">К запросу необходимо приложить медицинскую документацию. Рассмотрение - до 21 дня.</p>
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
