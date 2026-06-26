import { useState, useEffect, useCallback, useRef } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/public.css'
import PublicSpotlight from './components/PublicSpotlight'
import MobileDrawer from './components/MobileDrawer'
import MobileBottomNav from './components/MobileBottomNav'
import AiAssistant from '../components/AiAssistant/AiAssistant'
import AccessibilityBar from './components/AccessibilityBar'
import '../styles/accessibility.css'
import { recordVisit, getTotal } from './stats/visitTracker'
import './stats/stats.css'

/* Menu groups and breadcrumbs use translation keys - resolved in component */
const menuGroupsDef = [
    { labelKey: 'public.navNews', to: '/public/news' },
    {
        labelKey: 'public.navAbout',
        items: [
            { to: '/public/about', textKey: 'public.navAbout', descKey: 'public.navAboutDesc', icon: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3' },
            { to: '/public/npa', textKey: 'public.navNPA', descKey: 'public.navNPADesc', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
            { to: '/public/budget', textKey: 'public.navBudget', descKey: 'public.navBudgetDesc', icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
            { to: '/public/antidoping', textKey: 'public.navAntidoping', descKey: 'public.navAntidopingDesc', icon: 'M9 12l2 2 4-4 M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z' },
            { to: '/public/anticorruption', textKey: 'public.navAnticorruption', descKey: 'public.navAnticorruptionDesc', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
            { to: '/public/reception', textKey: 'public.navReception', descKey: 'public.navReceptionDesc', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
            { to: '/public/discussions', textKey: 'public.navDiscussions', descKey: 'public.navDiscussionsDesc', icon: 'M17 8h2a2 2 0 012 2v9a2 2 0 01-2 2H7l-4 3V5a2 2 0 012-2h7 M14 2v6h6' },
            { to: '/public/links', textKey: 'public.navLinks', descKey: 'public.navLinksDesc', icon: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71' },
        ],
    },
    {
        labelKey: 'public.navSport',
        items: [
            { to: '/public/athletes', textKey: 'public.breadcrumbAthletes', descKey: 'public.navAthletesDesc', icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 100 8 4 4 0 000-8z' },
            { to: '/public/coaches', textKey: 'public.breadcrumbCoaches', descKey: 'public.navCoachesDesc', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 3a4 4 0 100 8 4 4 0 000-8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75' },
            { to: '/public/judges', textKey: 'public.breadcrumbJudges', descKey: 'public.navJudgesDesc', icon: 'M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z M19 10v2a7 7 0 01-14 0v-2 M12 19v4 M8 23h8' },
            { to: '/public/teams', textKey: 'public.navTeams', descKey: 'public.navTeamsDesc', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M9 3a4 4 0 100 8 4 4 0 000-8z M16 3.13a4 4 0 010 7.75' },
            { to: '/public/sports', textKey: 'public.navSportTypes', descKey: 'public.navSportTypesDesc', icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
        ],
    },
    {
        labelKey: 'public.breadcrumbEvents',
        items: [
            { to: '/public/calendar', textKey: 'public.navCalendar', descKey: 'public.navCalendarDesc', icon: 'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18' },
            { to: '/public/events', textKey: 'public.breadcrumbEvents', descKey: 'public.navEventsDesc', icon: 'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z' },
            { to: '/public/tickets', textKey: 'public.navTickets', descKey: 'public.navTicketsDesc', icon: 'M3 7v2a2 2 0 010 6v2a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 010-6V7a2 2 0 00-2-2H5a2 2 0 00-2 2z M13 5v14' },
            { to: '/public/announcements', textKey: 'public.navAnnouncements', descKey: 'public.navAnnouncementsDesc', icon: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0' },
        ],
    },
    {
        labelKey: 'public.navInfrastructure',
        items: [
            { to: '/public/organizations', textKey: 'public.breadcrumbOrganizations', descKey: 'public.navOrganizationsDesc', icon: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11' },
            { to: '/public/facilities', textKey: 'public.breadcrumbFacilities', descKey: 'public.navFacilitiesDesc', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
            { to: '/public/schools', textKey: 'public.breadcrumbSchools', descKey: 'public.navSchoolsDesc', icon: 'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c0 1 2 3 6 3s6-2 6-3v-5' },
        ],
    },
    { labelKey: 'public.breadcrumbServices', to: '/public/services' },
]

const breadcrumbKeys = {
    '/public': 'public.breadcrumbHome',
    '/public/news': 'public.navNews',
    '/public/about': 'public.navAbout',
    '/public/npa': 'public.breadcrumbNPA',
    '/public/budget': 'public.navBudget',
    '/public/calendar': 'public.navCalendar',
    '/public/schools': 'public.breadcrumbSchools',
    '/public/athletes': 'public.breadcrumbAthletes',
    '/public/coaches': 'public.breadcrumbCoaches',
    '/public/teams': 'public.navTeams',
    '/public/judges': 'public.breadcrumbJudges',
    '/public/sports': 'public.navSportTypes',
    '/public/organizations': 'public.breadcrumbOrganizations',
    '/public/facilities': 'public.breadcrumbFacilities',
    '/public/announcements': 'public.navAnnouncements',
    '/public/services': 'public.breadcrumbServices',
    '/public/antidoping': 'public.navAntidoping',
    '/public/verify': 'public.breadcrumbVerify',
    '/public/cabinet': 'public.breadcrumbCabinet',
    '/public/anticorruption': 'public.navAnticorruption',
    '/public/reception': 'public.navReception',
    '/public/discussions': 'public.navDiscussions',
    '/public/links': 'public.navLinks',
    '/public/login': 'public.breadcrumbLogin',
    '/public/trainer-registration': 'public.breadcrumbTrainerReg',
    '/public/events': 'public.breadcrumbEvents',
    '/public/tickets': 'public.navTickets',
    '/public/award-application': 'public.breadcrumbAwardApp',
}

/* Chevron SVG for dropdown indicators */
function Chevron() {
    return (
        <svg className="pub-nav__chevron" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default function PublicLayout() {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const isAthleteProfile = location.pathname.match(/^\/public\/athletes\/\d+$/)
    const isEventDetail = location.pathname.match(/^\/public\/events\/\d+$/)
    const breadcrumbKey = breadcrumbKeys[location.pathname]
    const pageTitle = isAthleteProfile ? t('public.navAthleteProfile') : isEventDetail ? t('public.navEventDetail') : (breadcrumbKey ? t(breadcrumbKey) : null)
    const isHome = location.pathname === '/public'

    /* ── Sticky header + scroll progress + back-to-top ── */
    const [scrolled, setScrolled] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [showTop, setShowTop] = useState(false)
    const [pageKey, setPageKey] = useState(location.key)
    const [fadeIn, setFadeIn] = useState(true)

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 40)
            setShowTop(window.scrollY > 400)
            const h = document.documentElement.scrollHeight - window.innerHeight
            setScrollProgress(h > 0 ? (window.scrollY / h) * 100 : 0)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    /* Page transition on route change */
    useEffect(() => {
        setFadeIn(false)
        const t1 = setTimeout(() => { setPageKey(location.key); setFadeIn(true) }, 150)
        return () => clearTimeout(t1)
    }, [location.pathname])

    /* Visit tracking (Распоряжение №59-р) */
    const [visitTotal, setVisitTotal] = useState(0)
    useEffect(() => {
        setVisitTotal(recordVisit(location.pathname))
    }, [location.pathname])

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    /* Mobile drawer */
    const [menuOpen, setMenuOpen] = useState(false)
    const openMenu = useCallback(() => setMenuOpen(true), [])
    const closeMenu = useCallback(() => setMenuOpen(false), [])

    /* Dark mode */
    const [dark, setDark] = useState(() => localStorage.getItem('pub-dark') === '1')
    const toggleDark = useCallback(() => {
        setDark(d => {
            localStorage.setItem('pub-dark', d ? '0' : '1')
            return !d
        })
    }, [])

    /* Accessibility mode (GOST Р 52872) */
    const A11Y_DEFAULT = { on: false, font: 'normal', scheme: 'white', images: true }
    const [a11y, setA11yState] = useState(() => {
        try {
            const raw = localStorage.getItem('pub-a11y')
            if (raw) return { ...A11Y_DEFAULT, ...JSON.parse(raw) }
        } catch { /* ignore */ }
        return A11Y_DEFAULT
    })
    const updateA11y = useCallback((patch) => {
        setA11yState(prev => {
            const next = { ...prev, ...patch }
            localStorage.setItem('pub-a11y', JSON.stringify(next))
            return next
        })
    }, [])
    const enableA11y = useCallback(() => updateA11y({ on: true }), [updateA11y])
    const exitA11y = useCallback(() => updateA11y({ on: false }), [updateA11y])

    const a11yClasses = a11y.on
        ? ` a11y-on a11y-font-${a11y.font} a11y-scheme-${a11y.scheme}${a11y.images ? '' : ' a11y-noimg'}`
        : ''


    /* Ripple on button click.
       NB: inline style (а не только className) обязателен - React при ре-рендере
       кнопки с onClick-сменой состояния перетирает className и убирает .pub-ripple,
       а волна остаётся в DOM. Без position:relative+overflow:hidden на кнопке
       и без position:absolute на волне span становится обычным flex-элементом и
       растягивает кнопку (баг с year-чипами на /public/news). */
    const portalRef = useRef(null)
    useEffect(() => {
        const root = portalRef.current
        if (!root) return
        const handler = (e) => {
            const btn = e.target.closest('button, .pub-login-btn, [type="submit"]')
            if (!btn || !root.contains(btn)) return
            // inline style переживает React-ре-рендер (нет style prop в JSX)
            const prevPosition = btn.style.position
            const prevOverflow = btn.style.overflow
            if (!prevPosition) btn.style.position = 'relative'
            if (!prevOverflow) btn.style.overflow = 'hidden'
            btn.classList.add('pub-ripple')
            const rect = btn.getBoundingClientRect()
            const size = Math.max(rect.width, rect.height)
            const wave = document.createElement('span')
            wave.className = 'ripple-wave'
            wave.style.width = wave.style.height = `${size}px`
            wave.style.left = `${e.clientX - rect.left - size / 2}px`
            wave.style.top = `${e.clientY - rect.top - size / 2}px`
            btn.appendChild(wave)
            // Только волну удаляем. Inline-стили оставляем permanently -
            // position:relative/overflow:hidden идемпотентны, повторные клики
            // их не повредят, а попытка очистки конфликтует с React-ре-рендером.
            setTimeout(() => wave.remove(), 650)
        }
        root.addEventListener('click', handler)
        return () => root.removeEventListener('click', handler)
    }, [])

    return (
        <div ref={portalRef} className={`public-portal${dark ? ' dark-mode' : ''}${a11yClasses}`}>
            {/* Skip to main content (a11y) */}
            <a className="pub-skip-link" href="#main-content">{t('public.skipToContent')}</a>
            {/* Accessibility toolbar (GOST Р 52872) */}
            <AccessibilityBar settings={a11y} onChange={updateA11y} onExit={exitA11y} />
            {/* Scroll progress bar */}
            <div className="pub-scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
            {/* Top Government Bar */}
            <div className="pub-topbar">
                <div className="pub-container">
                    <div className="pub-topbar__inner">
                        <div className="pub-topbar__links">
                            <a href="#">{t('public.topBarOpenData')}</a>
                            <a href="#">{t('public.topBarPortal')}</a>
                            <a href="#">{t('public.topBarReception')}</a>
                        </div>
                        <div className="pub-topbar__right">
                            {!a11y.on && (
                                <button
                                    type="button"
                                    className="pub-a11y-link"
                                    onClick={enableA11y}
                                >
                                    <span aria-hidden="true" style={{ display: 'inline-flex', verticalAlign: 'middle' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg></span> {t('a11y.enable')}
                                </button>
                            )}
                            <button
                                type="button"
                                className="pub-dark-toggle"
                                onClick={toggleDark}
                                aria-label={dark ? t('public.themeLight') : t('public.themeDark')}
                                aria-pressed={dark}
                            >
                                <span aria-hidden="true" style={{ display: 'inline-flex' }}>{dark
                                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 3v1M12 20v1M5.6 5.6l.7.7M17.7 17.7l.7.7M3 12h1M20 12h1M5.6 18.4l.7-.7M17.7 6.3l.7-.7" /></svg>
                                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>}
                                </span>
                            </button>
                            {['ru', 'kg', 'en'].map(code => (
                                <button
                                    type="button"
                                    key={code}
                                    className={`pub-lang-btn${i18n.language === code ? ' active' : ''}`}
                                    onClick={() => i18n.changeLanguage(code)}
                                    aria-label={t('public.switchLanguage', { lang: code.toUpperCase() })}
                                    aria-current={i18n.language === code ? 'true' : undefined}
                                >
                                    {code.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Navigation with Mega-menu */}
            <nav className={`pub-nav${scrolled ? ' pub-nav--scrolled' : ''}`}>
                <div className="pub-container">
                    <div className="pub-nav__inner">
                        <Link to="/public" className="pub-nav__brand">
                            <img src="/logo.png" alt="ГАФКиС" className="pub-nav__brand-logo" />
                            <span className="pub-nav__brand-text">АИС <span style={{color:'#d40029', fontWeight:900}}>E</span>Sport</span>
                        </Link>

                        <ul className="pub-nav__links">
                            {menuGroupsDef.map((group, i) => (
                                <li key={i} className="pub-nav__item">
                                    {group.to ? (
                                        <NavLink
                                            to={group.to}
                                            className={({ isActive }) => isActive ? 'active' : ''}
                                        >
                                            {t(group.labelKey)}
                                        </NavLink>
                                    ) : (
                                        <>
                                            <button type="button" aria-haspopup="true">
                                                {t(group.labelKey)}
                                                <Chevron />
                                            </button>
                                            <div className="pub-nav__dropdown">
                                                {group.items.map(item => (
                                                    <NavLink key={item.to} to={item.to} className="pub-nav__dropdown-item">
                                                        <span className="pub-nav__dropdown-icon">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d={item.icon}/>
                                                            </svg>
                                                        </span>
                                                        <span className="pub-nav__dropdown-text">
                                                            <span className="pub-nav__dropdown-name">{t(item.textKey)}</span>
                                                            <span className="pub-nav__dropdown-desc">{t(item.descKey)}</span>
                                                        </span>
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className="pub-nav__right">
                            <Link to="/public/login" className="pub-login-btn">{t('public.cabinet')}</Link>
                            <button
                                type="button"
                                className="pub-burger-btn"
                                onClick={openMenu}
                                aria-label={t('public.openMenu')}
                                aria-expanded={menuOpen}
                                aria-controls="pub-mobile-drawer"
                            >
                                <span className="pub-burger-btn__bars" aria-hidden="true">
                                    <span /><span /><span />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer (off-canvas) */}
            <MobileDrawer
                open={menuOpen}
                onClose={closeMenu}
                menuGroups={menuGroupsDef}
                dark={dark}
                onToggleDark={toggleDark}
                currentLang={i18n.language}
                onChangeLang={(code) => { i18n.changeLanguage(code); closeMenu(); }}
            />

            {/* Breadcrumbs (not on home) */}
            {!isHome && pageTitle && (
                <nav className="pub-container" aria-label={t('public.breadcrumbAriaLabel')}>
                    <ol className="pub-breadcrumb">
                        <li><Link to="/public">{t('public.breadcrumbHome')}</Link></li>
                        <li aria-hidden="true"><span className="pub-breadcrumb__sep">›</span></li>
                        <li aria-current="page">{pageTitle}</li>
                    </ol>
                </nav>
            )}

            <PublicSpotlight />

            {/* Content */}
            <main className="pub-main" id="main-content" tabIndex="-1">
                <div key={pageKey} className={`pub-page-transition${fadeIn ? ' pub-page-enter' : ''}`}>
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="pub-footer">
                <div className="pub-container">
                    <div className="pub-footer__grid">
                        {/* Column 1: Brand */}
                        <div className="pub-footer__brand">
                            <div className="pub-footer__brand-header">
                                <img src="/logo.png" alt="ГАФКиС" className="pub-footer__brand-logo" />
                                <span className="pub-footer__brand-name">АИС <span style={{color:'#d40029'}}>e</span>Sport</span>
                            </div>
                            <p className="pub-footer__brand-desc">
                                {t('public.footerAboutText')}
                            </p>
                            <div className="pub-footer__social">
                                <a href="#" title="Facebook" aria-label="Facebook">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                                    </svg>
                                </a>
                                <a href="#" title="Instagram" aria-label="Instagram">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5"/>
                                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                    </svg>
                                </a>
                                <a href="#" title="YouTube" aria-label="YouTube">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/>
                                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                                    </svg>
                                </a>
                                <a href="#" title="Telegram" aria-label="Telegram">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"/>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Navigation */}
                        <div>
                            <div className="pub-footer__col-title">{t('public.footerNav')}</div>
                            <div className="pub-footer__links">
                                <Link to="/public">{t('public.breadcrumbHome')}</Link>
                                <Link to="/public/news">{t('public.navNews')}</Link>
                                <Link to="/public/about">{t('public.navAbout')}</Link>
                                <Link to="/public/athletes">{t('public.breadcrumbAthletes')}</Link>
                                <Link to="/public/coaches">{t('public.breadcrumbCoaches')}</Link>
                                <Link to="/public/events">{t('public.breadcrumbEvents')}</Link>
                                <Link to="/public/calendar">{t('public.navCalendar')}</Link>
                            </div>
                        </div>

                        {/* Column 3: Portals */}
                        <div>
                            <div className="pub-footer__col-title">{t('public.footerPortalsTitle')}</div>
                            <div className="pub-footer__links">
                                <a href="#">{t('public.footerGovPortal')}</a>
                                <a href="#">{t('public.footerOpenData')}</a>
                                <a href="#">{t('public.footerEservices')}</a>
                                <a href="#">{t('public.footerTunduk')}</a>
                            </div>
                        </div>

                        {/* Column 4: Contacts */}
                        <div>
                            <div className="pub-footer__col-title">{t('public.footerContacts')}</div>
                            <div className="pub-footer__contacts">
                                <a href="#" className="pub-footer__contact-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    <span>{t('public.footerAddress')}</span>
                                </a>
                                <a href="tel:+996312623412" className="pub-footer__contact-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                                    </svg>
                                    <span>+996 (312) 62-34-12</span>
                                </a>
                                <a href="mailto:info@sport.gov.kg" className="pub-footer__contact-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                    <span>info@sport.gov.kg</span>
                                </a>
                            </div>
                            <div className="pub-footer__links" style={{marginTop: 16}}>
                                <Link to="/public/anticorruption">{t('public.footerAntiCorruption')}</Link>
                                <a href="#">{t('public.footerPrivacy')}</a>
                            </div>
                        </div>
                    </div>

                    <div className="pub-footer__bottom">
                        <span>{t('public.copyright')} {t('public.footerAllRights')}</span>
                        <Link to="/public/statistics" className="pub-visit-counter">
                            <span aria-hidden="true" style={{ display: 'inline-flex', verticalAlign: 'middle' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg></span> Посещений: <b>{visitTotal.toLocaleString('ru-RU')}</b>
                        </Link>
                        <span>{t('public.footerVersion')}</span>
                    </div>
                </div>
            </footer>

            {/* Mobile bottom navigation (≤768px only via CSS) */}
            <MobileBottomNav />

            {/* Back to top button */}
            <button
                type="button"
                className={`pub-back-to-top${showTop ? ' visible' : ''}`}
                onClick={scrollToTop}
                aria-label={t('public.backToTop')}
                aria-hidden={!showTop}
                tabIndex={showTop ? 0 : -1}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15" />
                </svg>
            </button>

            {/* AI assistant (public context) */}
            <AiAssistant context="public" />
        </div>
    )
}
