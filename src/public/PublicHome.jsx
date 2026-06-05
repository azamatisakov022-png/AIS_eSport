import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import RegionModal, { getRegionHint } from './RegionModal'
import {
    IconAthletes, IconCoaches, IconJudges, IconEvents,
    IconOrganizations, IconServices, IconFacilities, IconQrVerify,
    IconUserPlus, IconTrophy, IconShieldCheck,
} from './icons'
import {
    PUBLIC_NEWS,
    HOME_HERO,
} from './pages/publicContent'
import './pages/publicPages.css'

/** Помощник для фотографий - placeholder picsum по seed-у id+категория. */
/* Брендовая градиент-обложка по категории (когда нет реального фото) */
const NEWS_COVER_GRADIENT = {
    sport: 'linear-gradient(150deg, #1d3557 0%, #0f1b2d 100%)',
    gov: 'linear-gradient(150deg, #2a4d7a 0%, #1d3557 100%)',
    events: 'linear-gradient(150deg, #c5303c 0%, #8c1f2a 100%)',
}
const fmtNewsDate = (iso) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

/* ══════════════════════════════════════
   HOOKS
   ══════════════════════════════════════ */

/* ── Scroll-reveal (IntersectionObserver) ── */
function useScrollReveal(threshold = 0.15) {
    const ref = useRef(null)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); observer.unobserve(el) } },
            { threshold }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [threshold])
    return ref
}

/* ── Parallax hook ── */
function useParallax() {
    const [offset, setOffset] = useState(0)
    useEffect(() => {
        const onScroll = () => setOffset(window.scrollY)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])
    return offset
}

/* Анимированный счётчик удалён в Фазе 1 - для статистики госагентства
   count-up читался как «стартап-метрика», что не соответствует контексту.
   Числа отображаются статично через StatItem ниже. */

/* ══════════════════════════════════════
   DATA
   ══════════════════════════════════════ */

/* Editorial Scoreboard: count/unit/tag - данные; labelKey - i18n.
   hero - навы-якорь 2×2, wide - широкая плитка 2×1. */
const quickLinks = [
    { Icon: IconAthletes, labelKey: 'public.quickAthletes', tag: 'AIS-01', count: '3 847', unit: 'профилей в реестре', to: '/public/athletes', hero: true },
    { Icon: IconCoaches, labelKey: 'public.quickCoaches', tag: 'AIS-02', count: '247', unit: 'специалистов', to: '/public/coaches' },
    { Icon: IconJudges, labelKey: 'public.quickJudges', tag: 'AIS-03', count: '186', unit: 'аттестованных', to: '/public/judges' },
    { Icon: IconEvents, labelKey: 'public.quickEvents', tag: 'AIS-04', count: '48', unit: 'в плане 2026', to: '/public/events' },
    { Icon: IconOrganizations, labelKey: 'public.quickOrganizations', tag: 'AIS-05', count: '74', unit: 'федерации и клубы', to: '/public/organizations' },
    { Icon: IconServices, labelKey: 'public.quickGovServices', tag: 'AIS-06', count: '12', unit: 'онлайн-сервисов', to: '/public/services' },
    { Icon: IconFacilities, labelKey: 'public.quickFacilities', tag: 'AIS-07', count: '156', unit: 'по всей республике', to: '/public/facilities' },
    { Icon: IconQrVerify, labelKey: 'public.quickVerify', tag: 'AIS-08', count: 'QR', unit: 'верификация по коду', to: '/public/verify', wide: true },
]

const govServices = [
    { titleKey: 'public.govTrainerReg', termKey: 'public.govTrainerRegTerm', to: '/public/trainer-registration', Icon: IconUserPlus,
      idx: '01', desc: 'Включение специалиста в национальный реестр тренеров Кыргызской Республики.', fee: 'Бесплатно' },
    { titleKey: 'public.govAwardRank', termKey: 'public.govAwardRankTerm', to: '/public/award-application', Icon: IconTrophy,
      idx: '02', desc: 'КМС, Мастер спорта, МСМК, Заслуженный мастер спорта по результатам соревнований.', fee: 'Бесплатно' },
    { titleKey: 'public.govJudgeCategory', termKey: 'public.govJudgeCategoryTerm', to: '#', Icon: IconShieldCheck,
      idx: '03', desc: 'Аттестация спортивных судей: национальная и международная квалификация.', fee: 'Бесплатно' },
]

const upcomingEvents = [
    { date: '2026-03-25', title: 'Чемпионат КР по боксу', place: 'г. Бишкек, Дворец спорта', typeLabel: 'Чемпионат КР', sport: 'Бокс' },
    { date: '2026-04-10', title: 'Международный турнир «Шёлковый путь» - Дзюдо', place: 'г. Бишкек, СК «Кожомкул»', typeLabel: 'Международные', sport: 'Дзюдо' },
    { date: '2026-04-18', title: 'Первенство КР по борьбе среди юниоров', place: 'г. Ош, СК «Ак-Буура»', typeLabel: 'Первенство КР', sport: 'Борьба' },
]

const regions = [
    { key: 'Бишкек',       nameKey: 'public.regionBishkek',     athletes: 1245, coaches: 98, orgs: 28, img: '/regions/bishkek.png' },
    { key: 'Ош',            nameKey: 'public.regionOsh',         athletes: 620,  coaches: 42, orgs: 15, img: '/regions/osh.png' },
    { key: 'Чуйская обл.', nameKey: 'public.regionChuy',        athletes: 480,  coaches: 35, orgs: 12, img: '/regions/chuy.png' },
    { key: 'Иссык-Куль',   nameKey: 'public.regionIssykKul',    athletes: 310,  coaches: 22, orgs: 8,  img: '/regions/issykkul.png' },
    { key: 'Нарын',         nameKey: 'public.regionNaryn',       athletes: 195,  coaches: 14, orgs: 5,  img: '/regions/naryn.png' },
    { key: 'Джалал-Абад',   nameKey: 'public.regionJalalAbad',   athletes: 380,  coaches: 18, orgs: 10, img: '/regions/jalalabad.png' },
    { key: 'Баткен',        nameKey: 'public.regionBatken',      athletes: 210,  coaches: 10, orgs: 4,  img: '/regions/batken.png' },
    { key: 'Талас',          nameKey: 'public.regionTalas',       athletes: 175,  coaches: 8,  orgs: 3,  img: '/regions/talas.png' },
    { key: 'Ош (обл.)',     nameKey: 'public.regionOshOblast',   athletes: 232,  coaches: 12, orgs: 6,  img: '/regions/osh_oblast.png' },
]

function splitDate(d, monthsShort) {
    const dt = new Date(d)
    return { day: dt.getDate(), month: monthsShort[dt.getMonth()] }
}

function fmt(d) { return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) }

/* ══════════════════════════════════════
   SUBCOMPONENTS
   ══════════════════════════════════════ */

/* heroStyles удалены в Phase 7 - заменены на CSS-классы .ph-hero__*
   (full-bleed фотография + overlay + stats-strip снизу). */

function StatItem({ value, label }) {
    return (
        <div className="ph-hero__stat">
            <span className="ph-hero__stat-val">{value.toLocaleString('ru-RU')}</span>
            <span className="ph-hero__stat-lbl">{label}</span>
        </div>
    )
}

/* ══════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════ */

export default function PublicHome() {
    const { t } = useTranslation()
    const [verifyInput, setVerifyInput] = useState('')
    const [verifyResult, setVerifyResult] = useState(null)
    const [verifyPhase, setVerifyPhase] = useState('idle')
    const [verifyStatusText, setVerifyStatusText] = useState('')
    const [selectedRegion, setSelectedRegion] = useState(null)
    const [hoveredRegion, setHoveredRegion] = useState(null)

    const parallax = useParallax()
    const heroRef = useRef(null)

    const revealQuick = useScrollReveal(0.1)
    const revealGov = useScrollReveal(0.1)
    const revealEvents = useScrollReveal(0.1)
    const revealRegions = useScrollReveal(0.1)
    const revealNews = useScrollReveal(0.1)
    const revealVerify = useScrollReveal(0.1)

    const monthsShort = t('public.monthsShort', { returnObjects: true })

    const handleVerify = () => {
        if (!verifyInput.trim() || verifyPhase === 'scanning') return
        setVerifyResult(null)
        setVerifyPhase('scanning')
        setVerifyStatusText(t('public.verifySearching'))

        setTimeout(() => setVerifyStatusText(t('public.verifyChecking')), 500)
        setTimeout(() => setVerifyStatusText(t('public.verifyVerifying')), 1000)

        const isError = verifyInput.trim().toLowerCase().startsWith('err')

        setTimeout(() => {
            if (isError) {
                setVerifyPhase('error')
                setVerifyResult(null)
            } else {
                setVerifyPhase('success')
                setVerifyResult({
                    number: verifyInput.trim(),
                    type: 'Удостоверение спортивного звания',
                    holder: 'Асанов Бакыт Маратович',
                    issued: '15.01.2026',
                    sport: 'Бокс',
                    status: 'Действительно',
                })
            }
        }, 1500)
    }

    const handleVerifyReset = () => {
        setVerifyPhase('idle')
        setVerifyResult(null)
        setVerifyInput('')
        setVerifyStatusText('')
    }

    return (
        <div>

            {/* ═══ 1. HERO - Editorial Cover with magazine-style treatment ═══ */}
            <section ref={heroRef} className="ph-hero">
                <img
                    className="ph-hero__img"
                    src={HOME_HERO.photo}
                    onError={(e) => { e.currentTarget.src = HOME_HERO.photoFallback }}
                    alt=""
                    loading="eager"
                />
                <div className="ph-hero__duotone" />
                <div className="ph-hero__shade" />
                <div className="ph-hero__grain" />
                <div className="ph-hero__accent" />
                <div className="pub-container ph-hero__inner">
                    <span className="ph-hero__eyebrow">{HOME_HERO.eyebrow}</span>
                    <h1 className="ph-hero__title">{HOME_HERO.title}</h1>
                    <p className="ph-hero__sub">{HOME_HERO.sub}</p>
                </div>
                <div className="ph-hero__stats">
                    <div className="pub-container ph-hero__stats-inner">
                        <StatItem value={3847} label={t('public.counterAthletes')} />
                        <StatItem value={247} label={t('public.counterCoaches')} />
                        <StatItem value={186} label={t('public.counterJudges')} />
                        <StatItem value={48} label={t('public.counterEvents')} />
                    </div>
                </div>
            </section>

            {/* ═══ 2. QUICK ACCESS - Editorial Scoreboard ═══ */}
            <section ref={revealQuick} className="ph-quick scroll-reveal">
                <div className="ph-quick__bg" aria-hidden />
                <div className="pub-container">
                    <div className="ph-shead">
                        <div className="ph-shead__left">
                            <span className="ph-kicker"><i />{t('public.quickKicker')}</span>
                            <h2 className="ph-shead__title">{t('public.quickTitle')}</h2>
                        </div>
                        <p className="ph-shead__note">{t('public.quickNote')}</p>
                    </div>
                    <div className="ph-board">
                        {quickLinks.map((q) => (
                            <Link
                                key={q.to}
                                to={q.to}
                                className={`ph-tile${q.hero ? ' ph-tile--hero' : ''}${q.wide ? ' ph-tile--wide' : ''}`}
                            >
                                <span className="ph-tile__corner" aria-hidden />
                                <div className="ph-tile__top">
                                    <span className="ph-tile__icon"><q.Icon /></span>
                                    <span className="ph-tile__tag">{q.tag}</span>
                                </div>
                                <div className="ph-tile__data">
                                    <span className="ph-tile__count">{q.count}</span>
                                    <span className="ph-tile__label">{t(q.labelKey)}</span>
                                    <span className="ph-tile__unit">{q.unit}</span>
                                </div>
                                <span className="ph-tile__go" aria-hidden>
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ 3. GOV SERVICES - Official Dossier (dark) ═══ */}
            <section ref={revealGov} className="ph-gov2 scroll-reveal">
                <div className="ph-gov2__glow" aria-hidden />
                <div className="ph-gov2__lines" aria-hidden />
                <div className="pub-container">
                    <div className="ph-shead ph-shead--dark">
                        <div className="ph-shead__left">
                            <span className="ph-kicker ph-kicker--light"><i />{t('public.govKicker')}</span>
                            <h2 className="ph-shead__title ph-shead__title--light">{t('public.services')}</h2>
                        </div>
                        <p className="ph-shead__note ph-shead__note--light">{t('public.govNote')}</p>
                    </div>
                    <div className="ph-svc-grid">
                        {govServices.map((g) => (
                            <article key={g.titleKey} className="ph-svc">
                                <div className="ph-svc__head">
                                    <span className="ph-svc__idx">{g.idx}</span>
                                    <span className="ph-svc__icon"><g.Icon /></span>
                                </div>
                                <h3 className="ph-svc__title">{t(g.titleKey)}</h3>
                                <p className="ph-svc__desc">{g.desc}</p>
                                <div className="ph-svc__meta">
                                    <span className="ph-svc__meta-item">
                                        <em>{t(g.termKey)}</em><i>срок</i>
                                    </span>
                                    <span className="ph-svc__meta-sep" />
                                    <span className="ph-svc__meta-item">
                                        <em>{g.fee}</em><i>госпошлина</i>
                                    </span>
                                </div>
                                <Link to={g.to} className="ph-svc__cta">
                                    {t('public.govApply')}
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════
                4. EVENTS - Timeline style
               ═══════════════════════════════════ */}
            <section ref={revealEvents} className="ph-section ph-section--gray scroll-reveal">
                <div className="pub-container">
                    <div className="ph-sec-head ph-sec-head--row">
                        <h2 className="ph-sec-title">{t('public.eventsTitle')}</h2>
                        <Link to="/public/events" className="ph-sec-link">{t('public.eventsAll')} &#8250;</Link>
                    </div>
                    <div className="ph-timeline">
                        {upcomingEvents.map((ev, i) => {
                            const d = splitDate(ev.date, monthsShort)
                            return (
                                <div key={i} className="ph-timeline__item">
                                    <div className="ph-timeline__dot" />
                                    <div className="ph-timeline__date">
                                        <span className="ph-timeline__day">{d.day}</span>
                                        <span className="ph-timeline__month">{d.month}</span>
                                    </div>
                                    <div className="ph-timeline__body">
                                        <div className="ph-timeline__badges">
                                            <span className="ph-badge ph-badge--type">{ev.typeLabel}</span>
                                            <span className="ph-badge ph-badge--sport">{ev.sport}</span>
                                        </div>
                                        <h3 className="ph-timeline__title">{ev.title}</h3>
                                        <p className="ph-timeline__place">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                            {ev.place}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════
                5. REGIONS - Фото-карточки областей (карта в своём разделе)
               ═══════════════════════════════════ */}
            <section ref={revealRegions} className="ph-section ph-section--white scroll-reveal">
                <div className="pub-container">
                    <div className="ph-sec-head">
                        <h2 className="ph-sec-title">{t('public.regionsTitle')}</h2>
                        <span className="ph-sec-sub">Спортсмены и тренеры по регионам Кыргызстана</span>
                    </div>
                    <div className="ph-regions-grid">
                        {regions.map((r) => (
                            <button
                                type="button"
                                key={r.key}
                                className="ph-region-card"
                                onMouseEnter={() => setHoveredRegion(r.key)}
                                onMouseLeave={() => setHoveredRegion(null)}
                                onFocus={() => setHoveredRegion(r.key)}
                                onBlur={() => setHoveredRegion(null)}
                                onClick={() => setSelectedRegion({ ...r, name: r.key })}
                                aria-label={`${t(r.nameKey)} — ${t('public.regionMore')}`}
                            >
                                <div
                                    className="ph-region-card__img"
                                    style={{ backgroundImage: `url(${r.img})` }}
                                    aria-hidden="true"
                                />
                                <div className={`ph-region-card__overlay${hoveredRegion === r.key ? ' hovered' : ''}`}>
                                    <span className="ph-region-card__name">{t(r.nameKey)}</span>
                                    <span className="ph-region-card__stats">
                                        {r.athletes.toLocaleString('ru-RU')} {t('public.athletesCount')}
                                        <span className="ph-region-card__dot"> · </span>
                                        {r.coaches} {t('public.coachesCount')}
                                    </span>
                                    {hoveredRegion === r.key && (
                                        <span className="ph-region-card__hint">{getRegionHint(r.key)}</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>


            {/* ═══════════════════════════════════
                6. NEWS - Editorial 4-card grid (как на /public/news)
               ═══════════════════════════════════ */}
            <section ref={revealNews} className="ph-section ph-section--gray scroll-reveal">
                <div className="pub-container">
                    <div className="ph-sec-head">
                        <h2 className="ph-sec-title">{t('public.newsTitle')}</h2>
                        <Link to="/public/news" className="ph-sec-link">
                            {t('public.newsAll')}
                            <span aria-hidden>→</span>
                        </Link>
                    </div>
                    <div className="pn-grid">
                        {PUBLIC_NEWS.slice(0, 4).map(n => (
                            <Link key={n.id} to={`/public/news/${n.id}`} className="pn-card">
                                <div className="pn-card__img-wrap">
                                    {n.photo
                                        ? <img className="pn-card__img" src={n.photo} alt="" loading="lazy" />
                                        : <span className="pn-card__cover" style={{ background: NEWS_COVER_GRADIENT[n.cat] || NEWS_COVER_GRADIENT.sport }}>{n.cover}</span>
                                    }
                                </div>
                                <div className="pn-card__meta">
                                    <span className="pn-cat">{n.catLabel}</span>
                                    <span className="pn-dot" />
                                    <span className="pn-date">{fmtNewsDate(n.date)}</span>
                                </div>
                                <h3 className="pn-card__title">{n.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════
                7. VERIFY DOCUMENT - Light, minimal
               ═══════════════════════════════════ */}
            <section ref={revealVerify} className="ph-section ph-section--gray scroll-reveal">
                <div className="pub-container">
                    <div className="ph-verify">
                        {/* QR icon */}
                        <div className={`ph-verify__icon ${verifyPhase}`}>
                            <svg className="ph-verify__ring" viewBox="0 0 80 80" width="80" height="80">
                                <circle cx="40" cy="40" r="36" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                                <circle className="ph-verify__ring-progress" cx="40" cy="40" r="36" fill="none"
                                    stroke={verifyPhase === 'success' ? '#22c55e' : verifyPhase === 'error' ? '#e63946' : '#457b9d'}
                                    strokeWidth="2.5" strokeLinecap="round"
                                    strokeDasharray="226" strokeDashoffset={verifyPhase === 'idle' ? '226' : '0'}
                                />
                            </svg>
                            <div className={`ph-verify__icon-inner ${verifyPhase}`}>
                                {verifyPhase === 'success' ? (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                ) : verifyPhase === 'error' ? (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e63946" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                ) : (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                                )}
                            </div>
                        </div>

                        <h2 className="ph-verify__title">{t('public.verifyTitle')}</h2>
                        <p className="ph-verify__sub">{t('public.verifySub')}</p>

                        {(verifyPhase === 'idle' || verifyPhase === 'scanning') && (
                            <div className="ph-verify__row">
                                <input
                                    className="ph-verify__input"
                                    type="text"
                                    placeholder={t('public.verifyPlaceholder')}
                                    aria-label={t('public.verifyInputLabel')}
                                    value={verifyInput}
                                    onChange={e => { setVerifyInput(e.target.value); if (verifyPhase !== 'scanning') { setVerifyResult(null); setVerifyPhase('idle') } }}
                                    onKeyDown={e => e.key === 'Enter' && handleVerify()}
                                    disabled={verifyPhase === 'scanning'}
                                />
                                <button
                                    type="button"
                                    className={`ph-verify__btn${verifyPhase === 'scanning' ? ' scanning' : ''}`}
                                    onClick={handleVerify}
                                    disabled={verifyPhase === 'scanning' || !verifyInput.trim()}>
                                    {verifyPhase === 'scanning' ? (
                                        <><span className="ph-verify__spinner" /> {t('public.verifyScanning')}</>
                                    ) : t('public.verifyBtn')}
                                </button>
                            </div>
                        )}

                        {verifyPhase === 'scanning' && (
                            <div className="ph-verify__status">{verifyStatusText}</div>
                        )}

                        {verifyPhase === 'idle' && (
                            <p className="ph-verify__hint">{t('public.verifyHint')}</p>
                        )}

                        {verifyPhase === 'success' && verifyResult && (
                            <div className="ph-verify__result ph-verify__result--ok">
                                <div className="ph-verify__result-header">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                    {t('public.verifyDocAuthentic')}
                                </div>
                                <div className="ph-verify__result-rows">
                                    <div className="ph-verify__result-row"><span>{t('public.verifyFullName')}</span><strong>{verifyResult.holder}</strong></div>
                                    <div className="ph-verify__result-row"><span>{t('public.verifyDocNumber')}</span><strong>{verifyResult.number}</strong></div>
                                    <div className="ph-verify__result-row"><span>{t('public.verifyDocType')}</span><strong>{verifyResult.type}</strong></div>
                                    <div className="ph-verify__result-row"><span>{t('public.verifyIssuedDate')}</span><strong>{verifyResult.issued}</strong></div>
                                    <div className="ph-verify__result-row"><span>{t('public.verifySport')}</span><strong>{verifyResult.sport}</strong></div>
                                    <div className="ph-verify__result-row ph-verify__result-row--last"><span>{t('public.verifyStatus')}</span><strong style={{ color: '#22c55e' }}>{verifyResult.status}</strong></div>
                                </div>
                                <button type="button" className="ph-verify__reset" onClick={handleVerifyReset}>{t('public.verifyCheckAnother')}</button>
                            </div>
                        )}

                        {verifyPhase === 'error' && (
                            <div className="ph-verify__result ph-verify__result--err">
                                <p className="ph-verify__err-title">{t('public.verifyDocNotFound')}</p>
                                <p className="ph-verify__err-hint">{t('public.verifyDocNotFoundHint')}</p>
                                <button type="button" className="ph-verify__reset" onClick={handleVerifyReset}>{t('public.verifyTryAgain')}</button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Region Modal ── */}
            {selectedRegion && createPortal(
                <RegionModal region={selectedRegion} onClose={() => setSelectedRegion(null)} />,
                document.body
            )}
        </div>
    )
}
