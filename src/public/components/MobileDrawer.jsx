import { useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Mobile drawer (off-canvas) navigation.
 * - Slides in from the right
 * - Closes on Escape, overlay click, link navigation
 * - Focus trap inside drawer
 * - Body scroll lock when open
 *
 * Props:
 *   open: bool
 *   onClose: () => void
 *   menuGroups: nav structure from PublicLayout
 *   dark: bool
 *   onToggleDark: () => void
 *   currentLang: string
 *   onChangeLang: (code) => void
 */
export default function MobileDrawer({ open, onClose, menuGroups, dark, onToggleDark, currentLang, onChangeLang }) {
    const { t } = useTranslation()
    const drawerRef = useRef(null)
    const closeBtnRef = useRef(null)
    const previouslyFocused = useRef(null)

    /* Body scroll lock + Escape + focus management */
    useEffect(() => {
        if (!open) return
        previouslyFocused.current = document.activeElement
        document.body.style.overflow = 'hidden'

        // Focus close button on open
        const focusTimer = setTimeout(() => closeBtnRef.current?.focus(), 50)

        const onKey = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                onClose()
                return
            }
            if (e.key !== 'Tab') return
            // Focus trap
            const drawer = drawerRef.current
            if (!drawer) return
            const focusable = drawer.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
            if (focusable.length === 0) return
            const first = focusable[0]
            const last = focusable[focusable.length - 1]
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
                first.focus()
            }
        }
        document.addEventListener('keydown', onKey)

        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', onKey)
            clearTimeout(focusTimer)
            // Return focus to opener
            previouslyFocused.current?.focus?.()
        }
    }, [open, onClose])

    return (
        <>
            <div
                className={`pub-mobile-overlay${open ? ' is-open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <aside
                ref={drawerRef}
                className={`pub-mobile-drawer${open ? ' is-open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label={t('public.menuAriaLabel')}
                aria-hidden={!open}
            >
                <div className="pub-mobile-drawer__header">
                    <span className="pub-mobile-drawer__title">{t('public.menu')}</span>
                    <button
                        ref={closeBtnRef}
                        type="button"
                        className="pub-mobile-drawer__close"
                        onClick={onClose}
                        aria-label={t('public.closeMenu')}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <nav className="pub-mobile-drawer__nav" aria-label={t('public.menuAriaLabel')}>
                    {menuGroups.map((group, gi) => {
                        if (group.to) {
                            // Top-level link without subitems
                            return (
                                <NavLink
                                    key={gi}
                                    to={group.to}
                                    className={({ isActive }) => `pub-mobile-drawer__link${isActive ? ' is-active' : ''}`}
                                    onClick={onClose}
                                >
                                    {t(group.labelKey)}
                                </NavLink>
                            )
                        }
                        // Group with subitems
                        return (
                            <div key={gi} className="pub-mobile-drawer__group">
                                <div className="pub-mobile-drawer__group-title">{t(group.labelKey)}</div>
                                {group.items.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={({ isActive }) => `pub-mobile-drawer__sublink${isActive ? ' is-active' : ''}`}
                                        onClick={onClose}
                                    >
                                        {t(item.textKey)}
                                    </NavLink>
                                ))}
                            </div>
                        )
                    })}
                </nav>

                <div className="pub-mobile-drawer__divider" />

                {/* Topbar links (Открытые данные / Портал ГАФКиС / Онлайн-приёмная) */}
                <div className="pub-mobile-drawer__topbar">
                    <a href="#" onClick={onClose}>{t('public.topBarOpenData')}</a>
                    <a href="#" onClick={onClose}>{t('public.topBarPortal')}</a>
                    <a href="#" onClick={onClose}>{t('public.topBarReception')}</a>
                </div>

                <div className="pub-mobile-drawer__divider" />

                {/* Settings: theme + language */}
                <div className="pub-mobile-drawer__settings">
                    <div className="pub-mobile-drawer__settings-row">
                        <span className="pub-mobile-drawer__settings-label">{t('public.theme')}</span>
                        <button
                            type="button"
                            className="pub-mobile-drawer__pill"
                            onClick={onToggleDark}
                            aria-label={dark ? t('public.themeLight') : t('public.themeDark')}
                            aria-pressed={dark}
                        >
                            <span aria-hidden="true" style={{ display: 'inline-flex' }}>{dark
                                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 3v1M12 20v1M5.6 5.6l.7.7M17.7 17.7l.7.7M3 12h1M20 12h1M5.6 18.4l.7-.7M17.7 6.3l.7-.7" /></svg>
                                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>}
                            </span>
                            <span>{dark ? t('public.themeLightShort') : t('public.themeDarkShort')}</span>
                        </button>
                    </div>
                    <div className="pub-mobile-drawer__settings-row">
                        <span className="pub-mobile-drawer__settings-label">{t('public.language')}</span>
                        <div className="pub-mobile-drawer__langs">
                            {['ru', 'kg', 'en'].map((code) => (
                                <button
                                    key={code}
                                    type="button"
                                    className={`pub-mobile-drawer__pill${currentLang === code ? ' is-active' : ''}`}
                                    onClick={() => onChangeLang(code)}
                                    aria-label={t('public.switchLanguage', { lang: code.toUpperCase() })}
                                    aria-current={currentLang === code ? 'true' : undefined}
                                >
                                    {code.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Login CTA */}
                <Link
                    to="/public/login"
                    className="pub-mobile-drawer__cta"
                    onClick={onClose}
                >
                    {t('public.cabinet')}
                </Link>
            </aside>
        </>
    )
}
