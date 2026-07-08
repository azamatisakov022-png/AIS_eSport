import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRole } from '../context/RoleContext'
import { useTheme } from '../context/ThemeContext'
import { TbSun, TbMoon } from 'react-icons/tb'
import { CHAT_CONVERSATIONS } from '../intranet/data/intranetData'
import './Header.css'

const pageTitleKeys = {
    '/dashboard': 'pages.dashboard',
    '/athletes': 'pages.athletes',
    '/coaches': 'pages.coaches',
    '/judges': 'pages.judges',
    '/organizations': 'pages.organizations',
    '/facilities': 'pages.facilities',
    '/events': 'pages.events',
    '/teams': 'pages.teams',
    '/applications': 'pages.applications',
    '/analytics': 'pages.analytics',
    '/settings': 'pages.settings',
    '/cabinet': 'pages.cabinet',
    '/cabinet/passport': 'pages.cabinetPassport',
    '/cabinet/medical': 'pages.cabinetMedical',
    '/cabinet/events': 'pages.cabinetEvents',
    '/cabinet/training': 'pages.cabinetTraining',
    '/cabinet/coaches': 'pages.cabinetCoaches',
    '/cabinet/medals': 'pages.cabinetMedals',
    '/cabinet/team': 'pages.cabinetTeam',
    '/cabinet/applications': 'pages.cabinetApplications',
    '/cabinet/certificate': 'pages.cabinetCertificate',
    '/cabinet/athletes': 'pages.cabinetAthletes',
    '/cabinet/license': 'pages.cabinetLicense',
    '/cabinet/category': 'pages.cabinetCategory',
}

const LANGS = [
    { code: 'ru', label: 'RU' },
    { code: 'kg', label: 'KG' },
    { code: 'en', label: 'EN' },
]

export default function Header({ onToggleSidebar }) {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const { role, logout, hasAccess } = useRole()
    const chatUnread = CHAT_CONVERSATIONS.reduce((s, c) => s + (c.unread || 0), 0)
    const isCabinet = location.pathname.startsWith('/cabinet')
    const [langOpen, setLangOpen] = useState(false)
    const langRef = useRef(null)

    const titleKey = pageTitleKeys[location.pathname] || null
    const title = titleKey ? t(titleKey) : 'АИС eSport'

    const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0]
    
    const { theme, toggleTheme } = useTheme()

    const handleLogout = () => {
        logout()
        navigate('/public/login')
    }

    const handleLangChange = (code) => {
        i18n.changeLanguage(code)
        setLangOpen(false)
    }

    // Close lang dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) {
                setLangOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <header className="header">
            {/* Left */}
            <div className="header__left">
                <button
                    className="header__burger"
                    onClick={onToggleSidebar}
                    aria-label={t('header.menu')}
                >
                    <span /><span /><span />
                </button>
                <h1 className="header__page-title">{title}</h1>
                <span className="header__breadcrumb hide-mobile">
                    {isCabinet ? t('header.cabinetPortal') : t('header.internalPortal')}
                </span>
            </div>

            {/* Center: Search */}
            <div className="header__search hide-mobile">
                <span className="header__search-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86868B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                </span>
                <input
                    className="header__search-input"
                    type="text"
                    placeholder={t('header.searchPlaceholder')}
                />
            </div>

            {/* Right: Actions */}
            <div className="header__right">
                {/* Language Switcher */}
                <div className="header__lang" ref={langRef}>
                    <button
                        className="header__lang-btn"
                        onClick={() => setLangOpen(!langOpen)}
                    >
                        {currentLang.label}
                    </button>
                    {langOpen && (
                        <div className="header__lang-dropdown">
                            {LANGS.map(lang => (
                                <button
                                    key={lang.code}
                                    className={`header__lang-option ${lang.code === i18n.language ? 'active' : ''}`}
                                    onClick={() => handleLangChange(lang.code)}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button className="header__icon-btn" onClick={toggleTheme} title="Theme">
                    {theme === 'dark' ? <TbSun size={20} /> : <TbMoon size={20} />}
                </button>

                {hasAccess('/intranet/chat') && (
                    <button
                        className="header__icon-btn"
                        title="Внутренний чат"
                        onClick={() => navigate('/intranet/chat')}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor" fillOpacity="0.08" />
                        </svg>
                        {chatUnread > 0 && <span className="header__badge header__badge--count">{chatUnread}</span>}
                    </button>
                )}

                <button className="header__icon-btn" title={t('header.notifications')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span className="header__badge"></span>
                </button>

                <div className="header__profile">
                    <div className="header__user-info hide-mobile">
                        <span className="header__user-name">{role.name || role.shortLabel}</span>
                        <span className="header__user-role">{role.label}</span>
                    </div>
                </div>

                <button
                    className="header__logout-btn"
                    onClick={handleLogout}
                    title={t('header.logoutTitle')}
                >
                    <span className="header__logout-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" /><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" /><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" /></svg></span>
                    <span className="hide-mobile">{t('header.logout')}</span>
                </button>
            </div>
        </header>
    )
}
