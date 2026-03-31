import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import RegionModal, { getRegionHint } from './RegionModal'

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

/* ── Animated counter hook ── */
function useAnimatedCounter(target, duration = 1800) {
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
                    const eased = 1 - Math.pow(1 - progress, 3)
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

/* ══════════════════════════════════════
   DATA
   ══════════════════════════════════════ */

const quickLinks = [
    { img: '/icons/athletes.png', labelKey: 'public.quickAthletes', descKey: 'public.quickAthletesDesc', to: '/public/athletes', color: '#e63946', glow: '99,102,241' },
    { img: '/icons/coaches.png', labelKey: 'public.quickCoaches', descKey: 'public.quickCoachesDesc', to: '/public/coaches', color: '#2a9d8f', glow: '34,197,94' },
    { img: '/icons/judges.png', labelKey: 'public.quickJudges', descKey: 'public.quickJudgesDesc', to: '/public/judges', color: '#e9c46a', glow: '245,158,11' },
    { img: '/icons/events.png', labelKey: 'public.quickEvents', descKey: 'public.quickEventsDesc', to: '/public/events', color: '#457b9d', glow: '59,130,246' },
    { img: '/icons/organizations.png', labelKey: 'public.quickOrganizations', descKey: 'public.quickOrganizationsDesc', to: '/public/organizations', color: '#6c757d', glow: '100,116,139' },
    { img: '/icons/services.png', labelKey: 'public.quickGovServices', descKey: 'public.quickGovServicesDesc', to: '/public/services', color: '#d62828', glow: '239,68,68' },
    { img: '/icons/facilities.png', labelKey: 'public.quickFacilities', descKey: 'public.quickFacilitiesDesc', to: '/public/facilities', color: '#14b8a6', glow: '20,184,166' },
    { img: '/icons/qr-verify.png', labelKey: 'public.quickVerify', descKey: 'public.quickVerifyDesc', to: '/public/verify', color: '#7c3aed', glow: '168,85,247' },
]

const govServices = [
    { titleKey: 'public.govTrainerReg', termKey: 'public.govTrainerRegTerm', to: '/public/trainer-registration',
      svg: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="12" height="18" rx="2"/><line x1="7" y1="8" x2="11" y2="8"/><line x1="7" y1="11" x2="11" y2="11"/><line x1="7" y1="14" x2="10" y2="14"/><circle cx="18" cy="10" r="3"/><path d="M18 13v3"/><path d="M16.5 7.5L18 6"/></svg>,
      accent: '#e63946' },
    { titleKey: 'public.govAwardRank', termKey: 'public.govAwardRankTerm', to: '/public/award-application',
      svg: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5"/><polygon points="12,2 13.5,6.5 18,7 14.5,10 15.5,14.5 12,12 8.5,14.5 9.5,10 6,7 10.5,6.5" fill="rgba(255,215,0,0.3)" stroke="#FFD700" strokeWidth="0.8"/><path d="M8 14l-2 8h12l-2-8"/><line x1="10" y1="18" x2="14" y2="18"/></svg>,
      accent: '#f59e0b' },
    { titleKey: 'public.govJudgeCategory', termKey: 'public.govJudgeCategoryTerm', to: '#',
      svg: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z"/><path d="M4 4l4-2h8l4 2"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="12" x2="14" y2="12"/><circle cx="12" cy="17" r="2" fill="rgba(52,199,89,0.3)" stroke="#34C759"/><path d="M11 17l1 1 2-2" stroke="#34C759" strokeWidth="1.2"/></svg>,
      accent: '#34c759' },
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

const newsItems = [
    { id: 1, date: '10 марта 2026', title: 'Кыргызские боксёры завоевали 5 медалей на чемпионате Азии', desc: 'Сборная КР по боксу успешно выступила на чемпионате Азии в Ташкенте, привезя 2 золота и 3 бронзы.', img: '/news/boxing_medals.png' },
    { id: 2, date: '5 марта 2026', title: 'ГАФКиС запустил систему АИС eSport для цифровизации спорта', desc: 'Автоматизированная информационная система управления спортом доступна для всех участников спортивной отрасли.', img: '/news/digital_platform.png' },
    { id: 3, date: '1 марта 2026', title: 'Утверждён календарный план мероприятий на 2026 год', desc: 'Кабинет Министров утвердил план проведения 48 спортивных мероприятий республиканского и международного уровня.', img: '/news/sports_calendar.png' },
]

function splitDate(d, monthsShort) {
    const dt = new Date(d)
    return { day: dt.getDate(), month: monthsShort[dt.getMonth()] }
}

function fmt(d) { return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) }

/* ══════════════════════════════════════
   SUBCOMPONENTS
   ══════════════════════════════════════ */

const heroStyles = {
    inner: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '60px 24px 50px',
    },
    title: {
        fontSize: 22, fontWeight: 500, color: '#fff', margin: '0 0 12px',
        letterSpacing: 0.3, fontStyle: 'italic', lineHeight: 1.5,
        textShadow: '0 2px 16px rgba(0,0,0,0.4)',
        maxWidth: 560,
    },
    sub: {
        fontSize: 28, fontWeight: 600, color: '#fff', margin: '0 0 36px',
        maxWidth: 600, lineHeight: 1.45, letterSpacing: -0.3,
        textShadow: '0 2px 16px rgba(0,0,0,0.4)',
    },
    counters: {
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
        width: '100%', maxWidth: 800, margin: '32px auto 0',
    },
    counterItem: {
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: 16, padding: 20, textAlign: 'center',
    },
    counterVal: {
        display: 'block', fontSize: '2.5rem', fontWeight: 800, color: '#fff',
    },
    counterLbl: {
        display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginTop: 4,
    },
}

function AnimCounter({ target, label }) {
    const [val, ref] = useAnimatedCounter(target)
    return (
        <div ref={ref} style={heroStyles.counterItem}>
            <span style={heroStyles.counterVal}>{val.toLocaleString('ru-RU')}</span>
            <span style={heroStyles.counterLbl}>{label}</span>
        </div>
    )
}

/* ══════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════ */

export default function PublicHome() {
    const { t } = useTranslation()
    const [accessible, setAccessible] = useState(false)
    const [verifyInput, setVerifyInput] = useState('')
    const [verifyResult, setVerifyResult] = useState(null)
    const [verifyPhase, setVerifyPhase] = useState('idle')
    const [verifyStatusText, setVerifyStatusText] = useState('')
    const [showConfetti, setShowConfetti] = useState(false)
    const [selectedRegion, setSelectedRegion] = useState(null)
    const [hoveredRegion, setHoveredRegion] = useState(null)

    const parallax = useParallax()
    const heroRef = useRef(null)
    const glowRef = useRef(null)

    const handleHeroMouseMove = useCallback((e) => {
        if (!glowRef.current || !heroRef.current) return
        const rect = heroRef.current.getBoundingClientRect()
        glowRef.current.style.left = (e.clientX - rect.left) + 'px'
        glowRef.current.style.top = (e.clientY - rect.top) + 'px'
    }, [])

    const handleHeroMouseLeave = useCallback(() => {
        if (glowRef.current) glowRef.current.style.opacity = '0'
    }, [])

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
                setShowConfetti(true)
                setVerifyResult({
                    number: verifyInput.trim(),
                    type: 'Удостоверение спортивного звания',
                    holder: 'Асанов Бакыт Маратович',
                    issued: '15.01.2026',
                    sport: 'Бокс',
                    status: 'Действительно',
                })
                setTimeout(() => setShowConfetti(false), 2000)
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
        <div className={accessible ? 'a11y-mode' : ''}>

            {/* ═══ 1. HERO (Parallax + Gradient + Cursor Glow) ═══ */}
            <section
                ref={heroRef}
                className="hero-section"
                style={accessible ? { background: '#333' } : {}}
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={handleHeroMouseLeave}
            >
                <div className="hero-bg" />
                <div className="hero-gradient-overlay" />
                <div ref={glowRef} className="hero-cursor-glow" />

                <div className="pub-container" style={heroStyles.inner}>
                    <h1 style={heroStyles.title}>{t('public.heroTitle')}</h1>
                    <p style={heroStyles.sub}>{t('public.heroSub')}</p>

                    <div style={heroStyles.counters}>
                        <AnimCounter target={3847} label={t('public.counterAthletes')} />
                        <AnimCounter target={247} label={t('public.counterCoaches')} />
                        <AnimCounter target={186} label={t('public.counterJudges')} />
                        <AnimCounter target={48} label={t('public.counterEvents')} />
                    </div>
                </div>
            </section>

            {/* ═══ 2. QUICK ACCESS (legacy qa-card, ~15% smaller) ═══ */}
            <section ref={revealQuick} className="scroll-reveal" style={{ padding: '48px 0', background: 'var(--theme-bg-layer2, var(--theme-bg-card))' }}>
                <div className="pub-container">
                    <h2 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.3px', color: 'var(--theme-text-main)', margin: 0 }}>{t('public.quickTitle')}</h2>
                    <p style={{ fontSize: 14, color: 'var(--theme-text-secondary)', margin: '4px 0 24px' }}>{t('public.quickSubtitle')}</p>
                    <div className="qa-grid">
                        {quickLinks.map((q, i) => (
                            <Link key={q.to} to={q.to} className={`qa-card stagger-item${i === 0 ? ' qa-first' : ''}`}
                                  style={{ '--glow': q.glow, '--i': i }}>
                                <span className="qa-arrow">→</span>
                                <div className="qa-icon-wrap qa-icon-wrap--3d">
                                    <img src={q.img} alt="" className="qa-3d-icon" />
                                </div>
                                <div className="qa-label">{t(q.labelKey)}</div>
                                <div className="qa-desc">{t(q.descKey)}</div>
                            </Link>
                        ))}
                    </div>
                </div>
                <style>{`
                    .qa-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 12px;
                    }
                    .qa-card {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        padding: 20px 17px;
                        background: rgba(255,255,255,0.7);
                        -webkit-backdrop-filter: blur(12px);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(255,255,255,0.5);
                        border-radius: 14px;
                        text-decoration: none;
                        cursor: pointer;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.03);
                        transition: all 0.25s ease;
                        overflow: hidden;
                    }
                    .qa-card::after {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -60%;
                        width: 40%;
                        height: 200%;
                        background: linear-gradient(
                            105deg,
                            transparent 30%,
                            rgba(255,255,255,0.5) 45%,
                            rgba(255,255,255,0.8) 50%,
                            rgba(255,255,255,0.5) 55%,
                            transparent 70%
                        );
                        transform: skewX(-20deg);
                        opacity: 0;
                        transition: opacity 0.2s ease;
                        pointer-events: none;
                        z-index: 2;
                    }
                    .qa-card:hover::after {
                        opacity: 1;
                        animation: qaShimmerSweep 0.75s ease forwards;
                    }
                    @keyframes qaShimmerSweep {
                        0%   { left: -60%; opacity: 1; }
                        100% { left: 130%; opacity: 0; }
                    }
                    .qa-first {
                        box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 6px 16px rgba(0,0,0,0.04), 0 14px 36px rgba(0,0,0,0.04);
                    }
                    .qa-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.06), 0 20px 48px rgba(0,0,0,0.06), 0 12px 40px rgba(var(--glow), 0.12);
                    }
                    .qa-first:hover {
                        box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.06), 0 20px 48px rgba(0,0,0,0.06), 0 12px 40px rgba(var(--glow), 0.15);
                    }
                    .qa-icon-wrap {
                        width: 40px;
                        height: 40px;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 13px;
                    }
                    .qa-icon-wrap--3d {
                        width: 68px;
                        height: 68px;
                        background: none;
                        border-radius: 0;
                    }
                    .qa-3d-icon {
                        width: 68px;
                        height: 68px;
                        object-fit: contain;
                        border-radius: 17px;
                        transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                        filter: drop-shadow(0 4px 12px rgba(0,0,0,0.08));
                    }
                    .qa-card:hover .qa-3d-icon {
                        transform: scale(1.12) rotate(-3deg);
                        filter: drop-shadow(0 8px 20px rgba(0,0,0,0.12));
                    }
                    .qa-label {
                        font-size: 14px;
                        font-weight: 600;
                        color: #1D1D1F;
                        letter-spacing: -0.2px;
                    }
                    .qa-desc {
                        font-size: 11px;
                        font-weight: 400;
                        color: #86868B;
                        letter-spacing: 0.2px;
                        margin-top: 4px;
                    }
                    .qa-arrow {
                        position: absolute;
                        top: 14px;
                        right: 14px;
                        font-size: 12px;
                        color: #C7C7CC;
                        transition: color 0.2s;
                    }
                    .qa-card:hover .qa-arrow {
                        color: #1D1D1F;
                    }
                    @supports not (backdrop-filter: blur(12px)) {
                        .qa-card { background: #fff; }
                    }
                    @media (max-width: 1200px) {
                        .qa-grid { grid-template-columns: repeat(3, 1fr); }
                    }
                    @media (max-width: 768px) {
                        .qa-grid { grid-template-columns: repeat(2, 1fr); }
                    }
                    @media (max-width: 480px) {
                        .qa-grid { grid-template-columns: 1fr; }
                    }
                `}</style>
            </section>

            {/* ═══════════════════════════════════
                3. GOV SERVICES — Dark glass section
               ═══════════════════════════════════ */}
            <section ref={revealGov} className="ph-section ph-section--dark scroll-reveal">
                <div className="pub-container">
                    <div className="ph-sec-head">
                        <h2 className="ph-sec-title ph-sec-title--light">{t('public.services')}</h2>
                    </div>
                    <div className="ph-gov-grid">
                        {govServices.map((g, i) => (
                            <div key={g.titleKey} className="ph-gov-card stagger-item" style={{ '--i': i }}>
                                <div className="ph-gov-card__icon" style={{ '--glow': g.accent }}>
                                    {g.svg}
                                </div>
                                <h3 className="ph-gov-card__title">{t(g.titleKey)}</h3>
                                <p className="ph-gov-card__term">{t(g.termKey)}</p>
                                <Link to={g.to} className="ph-gov-card__btn">{t('public.govApply')}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════
                4. EVENTS — Timeline style
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
                                <div key={i} className="ph-timeline__item stagger-item" style={{ '--i': i }}>
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
                5. REGIONS — Photo cards, light bg
               ═══════════════════════════════════ */}
            <section ref={revealRegions} className="ph-section ph-section--white scroll-reveal">
                <div className="pub-container">
                    <div className="ph-sec-head">
                        <h2 className="ph-sec-title">{t('public.regionsTitle')}</h2>
                    </div>
                    <div className="ph-regions-grid">
                        {regions.map((r, i) => (
                            <div
                                key={r.key}
                                className="ph-region-card stagger-item"
                                style={{ '--i': i }}
                                onMouseEnter={() => setHoveredRegion(r.key)}
                                onMouseLeave={() => setHoveredRegion(null)}
                                onClick={() => setSelectedRegion({ ...r, name: r.key })}
                            >
                                <div
                                    className="ph-region-card__img"
                                    style={{ backgroundImage: `url(${r.img})` }}
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
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════
                6. NEWS — Asymmetric layout, dark bg
               ═══════════════════════════════════ */}
            <section ref={revealNews} className="ph-section ph-section--dark scroll-reveal">
                <div className="pub-container">
                    <div className="ph-sec-head ph-sec-head--row">
                        <h2 className="ph-sec-title ph-sec-title--light">{t('public.newsTitle')}</h2>
                        <Link to="/public/news" className="ph-sec-link ph-sec-link--light">{t('public.newsAll')} &#8250;</Link>
                    </div>
                    <div className="ph-news-layout">
                        {/* Featured (first) */}
                        {newsItems[0] && (
                            <div className="ph-news-featured stagger-item" style={{ '--i': 0 }}>
                                <div className="ph-news-featured__img-wrap">
                                    <img src={newsItems[0].img} alt={newsItems[0].title} className="ph-news-featured__img" />
                                </div>
                                <div className="ph-news-featured__body">
                                    <span className="ph-news-featured__date">{newsItems[0].date}</span>
                                    <h3 className="ph-news-featured__title">{newsItems[0].title}</h3>
                                    <p className="ph-news-featured__desc">{newsItems[0].desc}</p>
                                    <span className="ph-news-featured__link">{t('public.readMore')} &#8250;</span>
                                </div>
                            </div>
                        )}
                        {/* Side stack */}
                        <div className="ph-news-side">
                            {newsItems.slice(1).map((n, i) => (
                                <div key={n.id} className="ph-news-small stagger-item" style={{ '--i': i + 1 }}>
                                    <div className="ph-news-small__img-wrap">
                                        <img src={n.img} alt={n.title} className="ph-news-small__img" />
                                    </div>
                                    <div className="ph-news-small__body">
                                        <span className="ph-news-small__date">{n.date}</span>
                                        <h4 className="ph-news-small__title">{n.title}</h4>
                                        <span className="ph-news-small__link">{t('public.readMore')} &#8250;</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════
                7. VERIFY DOCUMENT — Light, minimal
               ═══════════════════════════════════ */}
            <section ref={revealVerify} className="ph-section ph-section--gray scroll-reveal">
                <div className="pub-container">
                    <div className="ph-verify">
                        {/* Confetti */}
                        {showConfetti && (
                            <div className="vf-confetti-wrap">
                                {Array.from({ length: 25 }).map((_, i) => (
                                    <div key={i} className="vf-confetti" style={{
                                        left: `${4 + Math.random() * 92}%`,
                                        animationDelay: `${Math.random() * 0.6}s`,
                                        animationDuration: `${1.2 + Math.random() * 0.8}s`,
                                        background: ['#e63946','#457b9d','#f4a261','#e63946','#457b9d','#f4a261'][i % 6],
                                        width: `${4 + Math.random() * 5}px`,
                                        height: `${4 + Math.random() * 5}px`,
                                        borderRadius: Math.random() > 0.5 ? '50%' : '1px',
                                        transform: `rotate(${Math.random()*360}deg)`,
                                    }} />
                                ))}
                            </div>
                        )}

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
                                    placeholder={t('public.verifyPlaceholder')}
                                    value={verifyInput}
                                    onChange={e => { setVerifyInput(e.target.value); if (verifyPhase !== 'scanning') { setVerifyResult(null); setVerifyPhase('idle') } }}
                                    onKeyDown={e => e.key === 'Enter' && handleVerify()}
                                    disabled={verifyPhase === 'scanning'}
                                />
                                <button className={`ph-verify__btn${verifyPhase === 'scanning' ? ' scanning' : ''}`}
                                    onClick={handleVerify} disabled={verifyPhase === 'scanning'}>
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
                                <button className="ph-verify__reset" onClick={handleVerifyReset}>{t('public.verifyCheckAnother')}</button>
                            </div>
                        )}

                        {verifyPhase === 'error' && (
                            <div className="ph-verify__result ph-verify__result--err">
                                <p className="ph-verify__err-title">{t('public.verifyDocNotFound')}</p>
                                <p className="ph-verify__err-hint">{t('public.verifyDocNotFoundHint')}</p>
                                <button className="ph-verify__reset" onClick={handleVerifyReset}>{t('public.verifyTryAgain')}</button>
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
