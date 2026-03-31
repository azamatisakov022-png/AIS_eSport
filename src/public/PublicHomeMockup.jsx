import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import KyrgyzstanMap from '../components/KyrgyzstanMap'
import '../styles/mockup.css'

/* ── Demo data ── */
const newsItems = [
    { id: 1, date: '10 марта 2026', title: 'Кыргызские боксёры завоевали 5 медалей на чемпионате Азии', desc: 'Сборная КР по боксу успешно выступила на чемпионате Азии в Ташкенте.', icon: '', color: '#d40029' },
    { id: 2, date: '05 марта 2026', title: 'ГАФКиС запустил систему АИС eSport для цифровизации спорта', desc: 'Автоматизированная информационная система доступна для участников.', icon: '', color: '#0071e3' },
    { id: 3, date: '01 марта 2026', title: 'Утверждён календарный план мероприятий на 2026 год', desc: '48 спортивных мероприятий республиканского и международного уровня.', icon: '', color: '#34c759' },
    { id: 4, date: '25 февраля 2026', title: 'Новый спорткомплекс в Оше получил международный сертификат', desc: 'Объект соответствует стандартам FISU для проведения универсиад.', icon: '', color: '#af52de' },
]

const upcomingEvents = [
    { date: '2026-03-25', day: '25', month: 'Март', title: 'Чемпионат КР по боксу', place: 'г. Бишкек, Дворец спорта', type: 'Чемпионат КР', color: '#d40029', bgColor: 'rgba(212,0,41,0.08)' },
    { date: '2026-04-10', day: '10', month: 'Апрель', title: 'Международный турнир «Шёлковый путь» - дзюдо', place: 'г. Бишкек, СК «Кожомкул»', type: 'Международные', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)' },
    { date: '2026-04-18', day: '18', month: 'Апрель', title: 'Первенство КР по борьбе среди юниоров', place: 'г. Ош, СК «Ак-Буура»', type: 'Первенство КР', color: '#7c3aed', bgColor: 'rgba(124,58,237,0.08)' },
]

const athletes = [
    { name: 'Акжол Махмудов', sport: 'Вольная борьба', achievement: 'Олимпийский чемпион', gradient: 'linear-gradient(180deg, #2d0a0a 0%, #0a0a0a 100%)', icon: '' },
    { name: 'Айсулуу Тыныбекова', sport: 'Женская борьба', achievement: 'Чемпионка мира', gradient: 'linear-gradient(180deg, #0a0a2d 0%, #0a0a0a 100%)', icon: '' },
    { name: 'Атабек Азисбеков', sport: 'Бокс', achievement: 'Призёр Чемпионата Азии', gradient: 'linear-gradient(180deg, #1a0a2d 0%, #0a0a0a 100%)', icon: '' },
    { name: 'Мээрим Жуманазарова', sport: 'Дзюдо', achievement: 'Бронза Олимпийских Игр', gradient: 'linear-gradient(180deg, #0a2d0a 0%, #0a0a0a 100%)', icon: '' },
]

const govServices = [
    { icon: '', title: 'Присвоение спортивного звания', desc: 'Подача заявления онлайн, срок - 30 рабочих дней' },
    { icon: '', title: 'Сертификат тренера', desc: 'Регистрация и получение удостоверения' },
    { icon: '', title: 'Судейская категория', desc: 'Присвоение и подтверждение квалификации' },
    { icon: '', title: 'Проверка документа по QR', desc: 'Верификация подлинности за 2 секунды' },
]

/* ── Animated counter hook ── */
function useAnimatedCounter(target, duration = 2000) {
    const [val, setVal] = useState(0)
    const ref = useRef(null)
    const started = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true
                const start = performance.now()
                const step = (now) => {
                    const progress = Math.min((now - start) / duration, 1)
                    const eased = 1 - Math.pow(1 - progress, 4)
                    setVal(Math.round(eased * target))
                    if (progress < 1) requestAnimationFrame(step)
                }
                requestAnimationFrame(step)
            }
        }, { threshold: 0.3 })

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [target, duration])

    return [val, ref]
}

/* ── Scroll reveal hook ── */
function useScrollReveal() {
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed')
                    }
                })
            },
            { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
        )

        const elements = ref.current?.querySelectorAll('.m-reveal')
        elements?.forEach(el => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    return ref
}

/* ══════════════════════════════════════
   MAP DATA - city markers for homepage
   ══════════════════════════════════════ */
const mapCities = [
    { lat: 42.8746, lng: 74.5698, name: 'Бишкек', type: 'arena', typeName: '42 спортивных объекта', address: 'Дворец спорта им. Кожомкула' },
    { lat: 40.5283, lng: 72.7985, name: 'Ош', type: 'arena', typeName: '28 спортивных объектов', address: 'СК «Ак-Буура»' },
    { lat: 40.9332, lng: 73.0017, name: 'Джалал-Абад', type: 'arena', typeName: '18 спортивных объектов', address: 'Спорткомплекс облСФКиС' },
    { lat: 42.4907, lng: 78.3936, name: 'Каракол', type: 'arena', typeName: '15 спортивных объектов', address: 'Спорткомплекс «Иссык-Куль»' },
    { lat: 41.4287, lng: 76.0000, name: 'Нарын', type: 'stadium', typeName: '12 спортивных объектов', address: 'Спорткомплекс «Нарын»' },
    { lat: 42.5228, lng: 72.2426, name: 'Талас', type: 'stadium', typeName: '10 спортивных объектов', address: 'Спортзал «Манас»' },
    { lat: 40.0563, lng: 70.8194, name: 'Баткен', type: 'dyush', typeName: '14 спортивных объектов', address: 'Спортивная школа №1' },
    { lat: 42.7644, lng: 75.2896, name: 'Токмок', type: 'dyush', typeName: '8 спортивных объектов', address: 'Спортшкола олимп. резерва' },
]

/* ══════════════════════════════════════
   STAT COUNTER COMPONENT
   ══════════════════════════════════════ */
function StatCounter({ target, label }) {
    const [val, ref] = useAnimatedCounter(target)
    return (
        <div ref={ref} className="m-stats__item">
            <div className="m-stats__number">{val.toLocaleString('ru-RU')}</div>
            <div className="m-stats__label">{label}</div>
        </div>
    )
}

/* ══════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════ */
export default function PublicHomeMockup() {
    const { t, i18n } = useTranslation()
    const [scrolled, setScrolled] = useState(false)
    const pageRef = useScrollReveal()
    const lang = i18n.language
    const changeLang = (lng) => { i18n.changeLanguage(lng); localStorage.setItem('lang', lng) }

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div className="mockup-page" ref={pageRef}>

            {/* ═══ TOP GOVERNMENT BAR ═══ */}
            <div className={`m-topbar ${scrolled ? 'hidden' : ''}`}>
                <div className="m-topbar__inner">
                    <div className="m-topbar__links">
                        <a href="#">{t('public.mockupOpenData')}</a>
                        <a href="#">{t('public.mockupGovPortal')}</a>
                        <a href="#">{t('public.mockupEServices')}</a>
                    </div>
                    <div className="m-topbar__right">
                        <button className="m-topbar__a11y">{t('public.mockupA11y')}</button>
                        <span className="m-topbar__sep">|</span>
                        <div className="m-topbar__lang">
                            <button className={lang === 'ru' ? 'active' : ''} onClick={() => changeLang('ru')}>RU</button>
                            <span className="m-topbar__sep">/</span>
                            <button className={lang === 'kg' ? 'active' : ''} onClick={() => changeLang('kg')}>KG</button>
                            <span className="m-topbar__sep">/</span>
                            <button className={lang === 'en' ? 'active' : ''} onClick={() => changeLang('en')}>EN</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ STICKY NAV + MEGA MENU ═══ */}
            <nav className={`m-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="m-nav__inner">
                    <Link to="/public" className="m-nav__brand">
                        <img src="/logo.png" alt="ГАФКиС" className="m-nav__logo" onError={e => { e.target.style.display = 'none' }} />
                        <span className="m-nav__brand-text">{t('public.mockupAgencyShort')}</span>
                    </Link>

                    <ul className="m-nav__links">
                        {/* Direct link - Новости */}
                        <li className="m-nav__item">
                            <Link to="/public/news">{t('public.mockupNavNews')}</Link>
                        </li>

                        {/* Dropdown - О ГАФКиС */}
                        <li className="m-nav__item">
                            <button>
                                {t('public.mockupNavAbout')}
                                <svg className="m-nav__chevron" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                </svg>
                            </button>
                            <div className="m-nav__dropdown">
                                <Link to="/public/about">{t('public.mockupAbout')}</Link>
                                <Link to="/public/npa">{t('public.mockupNavNPA')}</Link>
                                <Link to="/public/budget">{t('public.mockupBudget')}</Link>
                                <Link to="/public/antidoping">{t('public.mockupAntidoping')}</Link>
                                <Link to="/public/anticorruption">{t('public.mockupAnticorruption')}</Link>
                            </div>
                        </li>

                        {/* Dropdown - Спорт */}
                        <li className="m-nav__item">
                            <button>
                                {t('public.mockupSport')}
                                <svg className="m-nav__chevron" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                </svg>
                            </button>
                            <div className="m-nav__dropdown">
                                <Link to="/public/athletes">{t('public.mockupNavAthletes')}</Link>
                                <Link to="/public/coaches">{t('public.mockupNavCoaches')}</Link>
                                <Link to="/public/judges">{t('public.mockupNavJudges')}</Link>
                                <Link to="/public/teams">{t('public.mockupTeams')}</Link>
                                <Link to="/public/sports">{t('public.mockupNavSports')}</Link>
                            </div>
                        </li>

                        {/* Dropdown - Мероприятия */}
                        <li className="m-nav__item">
                            <button>
                                {t('public.mockupEvents')}
                                <svg className="m-nav__chevron" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                </svg>
                            </button>
                            <div className="m-nav__dropdown">
                                <Link to="/public/calendar">{t('public.mockupCalendarPlan')}</Link>
                                <Link to="/public/events">{t('public.mockupEvents')}</Link>
                                <Link to="/public/announcements">{t('public.mockupAnnouncements')}</Link>
                            </div>
                        </li>

                        {/* Dropdown - Инфраструктура */}
                        <li className="m-nav__item">
                            <button>
                                {t('public.mockupInfrastructure')}
                                <svg className="m-nav__chevron" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                </svg>
                            </button>
                            <div className="m-nav__dropdown">
                                <Link to="/public/organizations">{t('public.mockupNavOrganizations')}</Link>
                                <Link to="/public/facilities">{t('public.mockupNavFacilities')}</Link>
                                <Link to="/public/schools">{t('public.mockupNavSchools')}</Link>
                            </div>
                        </li>

                        {/* Direct link - Госуслуги */}
                        <li className="m-nav__item">
                            <Link to="/public/services">{t('public.mockupNavServices')}</Link>
                        </li>
                    </ul>

                    <div className="m-nav__right">
                        <Link to="/public/login" className="m-nav__cabinet">{t('public.mockupCabinet')}</Link>
                    </div>
                </div>
            </nav>

            {/* ═══ HERO ═══ */}
            <section className="m-hero">
                <div className="m-hero__bg" />
                <div className="m-hero__bg-image" style={{ backgroundImage: 'url(/hero-kyrgyz.png)' }} />

                <div className="m-hero__content">
                    <div className="m-hero__badge m-reveal">
                        <span className="m-hero__badge-dot" />
                        {t('public.mockupAgency')}
                    </div>

                    <h1 className="m-hero__title m-reveal m-reveal-delay-1">
                        {t('public.mockupHeroLine1')}<br /><span>{t('public.mockupHeroLine2')}</span>
                    </h1>

                    <p className="m-hero__subtitle m-reveal m-reveal-delay-2">
                        {t('public.mockupHeroSub')}
                    </p>

                    <div className="m-hero__cta-row m-reveal m-reveal-delay-3">
                        <Link to="/public/login" className="m-hero__cta m-hero__cta--primary">
                            {t('public.mockupCabinet')}
                        </Link>
                        <a href="#events" className="m-hero__cta m-hero__cta--secondary">
                            {t('public.mockupCalendar')}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="m-hero__scroll">
                    {t('public.mockupScroll')}
                    <div className="m-hero__scroll-line" />
                </div>
            </section>

            {/* ═══ STATISTICS ═══ */}
            <section className="m-stats">
                <div className="m-container">
                    <h2 className="m-stats__title m-reveal">{t('public.mockupStatsTitle')}</h2>
                    <p className="m-stats__sub m-reveal m-reveal-delay-1">{t('public.mockupStatsSub')}</p>
                    <div className="m-stats__grid m-reveal m-reveal-delay-2">
                        <StatCounter target={3847} label={t('public.mockupAthletes')} />
                        <StatCounter target={247} label={t('public.mockupCoaches')} />
                        <StatCounter target={156} label={t('public.mockupFacilitiesLabel')} />
                        <StatCounter target={84} label={t('public.mockupMedals')} />
                    </div>
                </div>
            </section>

            {/* ═══ NEWS ═══ */}
            <section className="m-news" id="news">
                <div className="m-container">
                    <div className="m-section-header m-reveal">
                        <h2 className="m-section-title">{t('public.mockupNewsTitle')}</h2>
                        <Link to="/public/news" className="m-section-link">
                            {t('public.mockupNewsAll')}
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </Link>
                    </div>
                    <div className="m-news__grid">
                        {newsItems.map((n, i) => (
                            <div key={n.id} className={`m-news__card m-reveal m-reveal-delay-${i + 1}`}>
                                <div className="m-news__card-image-placeholder" style={{ background: `linear-gradient(135deg, ${n.color}15 0%, ${n.color}08 100%)` }}>
                                    <span>{n.icon}</span>
                                </div>
                                <div className="m-news__card-body">
                                    <div className="m-news__card-date">{n.date}</div>
                                    <h3 className="m-news__card-title">{n.title}</h3>
                                    <p className="m-news__card-desc">{n.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ EVENTS ═══ */}
            <section className="m-events" id="events">
                <div className="m-container">
                    <div className="m-section-header m-reveal">
                        <h2 className="m-section-title">{t('public.mockupEventsTitle')}</h2>
                        <Link to="/public/events" className="m-section-link">
                            {t('public.mockupEventsAll')}
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </Link>
                    </div>
                    <div className="m-events__grid">
                        {upcomingEvents.map((ev, i) => (
                            <div key={i} className={`m-events__card m-reveal m-reveal-delay-${i + 1}`}>
                                <div className="m-events__card-accent" style={{ background: ev.color }} />
                                <div className="m-events__card-date-block">
                                    <span className="m-events__card-day">{ev.day}</span>
                                    <span className="m-events__card-month">{ev.month}</span>
                                </div>
                                <div className="m-events__card-type" style={{ background: ev.bgColor, color: ev.color }}>{ev.type}</div>
                                <h3 className="m-events__card-title">{ev.title}</h3>
                                <div className="m-events__card-place">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" opacity="0.5" />
                                    </svg>
                                    {ev.place}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ ATHLETES SHOWCASE ═══ */}
            <section className="m-athletes" id="about">
                <div className="m-container">
                    <div className="m-athletes__header m-reveal">
                        <h2 className="m-athletes__title">{t('public.mockupAthletesTitle')}</h2>
                        <p className="m-athletes__sub">{t('public.mockupAthletesSub')}</p>
                    </div>
                    <div className="m-athletes__grid">
                        {athletes.map((a, i) => (
                            <div key={i} className={`m-athletes__card m-reveal m-reveal-delay-${i + 1}`}>
                                <div className="m-athletes__card-bg" style={{ background: a.gradient }}>
                                    <span>{a.icon}</span>
                                </div>
                                <div className="m-athletes__card-info">
                                    <div className="m-athletes__card-sport">{a.sport}</div>
                                    <div className="m-athletes__card-name">{a.name}</div>
                                    <div className="m-athletes__card-achievement">{a.achievement}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ GOV SERVICES ═══ */}
            <section className="m-services" id="services">
                <div className="m-container">
                    <div className="m-section-header m-reveal" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
                        <h2 className="m-section-title">{t('public.mockupServicesTitle')}</h2>
                        <p style={{ fontSize: 18, color: '#6e6e73', fontWeight: 400 }}>{t('public.mockupServicesSub')}</p>
                    </div>
                    <div className="m-services__grid" style={{ marginTop: 60 }}>
                        {govServices.map((s, i) => (
                            <div key={i} className={`m-services__card m-reveal m-reveal-delay-${i + 1}`}>
                                <span className="m-services__card-icon">{s.icon}</span>
                                <div className="m-services__card-title">{s.title}</div>
                                <div className="m-services__card-desc">{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ MAP PREVIEW - SVG MAP OF KYRGYZSTAN ═══ */}
            <section className="m-map" id="facilities">
                <div className="m-container">
                    <div className="m-section-header m-reveal" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8, marginBottom: 48 }}>
                        <h2 className="m-section-title">{t('public.mockupMapTitle')}</h2>
                        <p style={{ fontSize: 18, color: '#6e6e73', fontWeight: 400 }}>{t('public.mockupMapSub')}</p>
                    </div>
                    <div className="m-map__wrapper m-reveal m-reveal-delay-1">
                        <KyrgyzstanMap markers={mapCities} height={450} showLegend={true} />
                        <div className="m-map__stat-bar">
                            <div className="m-map__stat">
                                <div className="m-map__stat-value">156</div>
                                <div className="m-map__stat-label">{t('public.mockupSportFacilities')}</div>
                            </div>
                            <div className="m-map__stat">
                                <div className="m-map__stat-value">7</div>
                                <div className="m-map__stat-label">{t('public.mockupRegionalCenters')}</div>
                            </div>
                            <div className="m-map__stat">
                                <div className="m-map__stat-value">28</div>
                                <div className="m-map__stat-label">{t('public.mockupSportSchools')}</div>
                            </div>
                            <div className="m-map__stat">
                                <div className="m-map__stat-value">12</div>
                                <div className="m-map__stat-label">{t('public.mockupSportPalaces')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ VERIFY DOCUMENT ═══ */}
            <section className="m-verify">
                <div className="m-container">
                    <div className="m-verify__content m-reveal">
                        <h2 className="m-verify__title">{t('public.mockupVerifyTitle')}</h2>
                        <p className="m-verify__sub">{t('public.mockupVerifySub')}</p>
                        <div className="m-verify__input-row">
                            <input
                                className="m-verify__input"
                                placeholder={t('public.mockupVerifyPlaceholder')}
                                readOnly
                            />
                            <button className="m-verify__btn">{t('public.mockupVerifyBtn')}</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="m-footer">
                <div className="m-container">
                    <div className="m-footer__grid">
                        <div>
                            <span className="m-footer__brand-name">{t('public.mockupAgencyShort')}</span>
                            <span className="m-footer__brand-desc">
                                {t('public.mockupAgency')}. {t('public.mockupFooterDesc')}
                            </span>
                            <div className="m-footer__social">
                                <a href="#" title="Facebook">📘</a>
                                <a href="#" title="Instagram">📷</a>
                                <a href="#" title="YouTube">▶️</a>
                                <a href="#" title="Telegram">✈️</a>
                            </div>
                        </div>

                        <div>
                            <div className="m-footer__col-title">{t('public.mockupNavigation')}</div>
                            <div className="m-footer__links">
                                <a href="#">{t('public.mockupHome')}</a>
                                <a href="#">{t('public.mockupNavNews')}</a>
                                <a href="#">{t('public.mockupAbout')}</a>
                                <a href="#">{t('public.mockupCalendar')}</a>
                                <a href="#">{t('public.mockupSitemap')}</a>
                            </div>
                        </div>

                        <div>
                            <div className="m-footer__col-title">{t('public.mockupPortals')}</div>
                            <div className="m-footer__links">
                                <a href="#">{t('public.mockupGovPortal')}</a>
                                <a href="#">{t('public.mockupOpenDataPortal')}</a>
                                <a href="#">{t('public.mockupElectronicServices')}</a>
                                <a href="#">{t('public.mockupTunduk')}</a>
                            </div>
                        </div>

                        <div>
                            <div className="m-footer__col-title">{t('public.mockupContacts')}</div>
                            <div className="m-footer__links">
                                <a href="#">г. Бишкек, ул. Токтогула, 125</a>
                                <a href="tel:+996312623412">+996 (312) 62-34-12</a>
                                <a href="mailto:info@sport.gov.kg">info@sport.gov.kg</a>
                            </div>
                        </div>
                    </div>

                    <div className="m-footer__bottom">
                        <span>{t('public.mockupCopyright')}</span>
                        <span>{t('public.mockupVersion')}</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
