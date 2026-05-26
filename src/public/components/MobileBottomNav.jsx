import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Sticky bottom navigation for mobile.
 * Visible only on screens ≤ 768px.
 * 5 quick-access items: Home / Events / Services / Verify / Cabinet
 */
const items = [
    {
        to: '/public',
        labelKey: 'public.bottomNavHome',
        end: true,
        icon: (
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />
        ),
    },
    {
        to: '/public/events',
        labelKey: 'public.bottomNavEvents',
        icon: (
            <>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </>
        ),
    },
    {
        to: '/public/services',
        labelKey: 'public.bottomNavServices',
        icon: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 12l2 2 4-4" />
            </>
        ),
    },
    {
        to: '/public/verify',
        labelKey: 'public.bottomNavVerify',
        icon: (
            <>
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </>
        ),
    },
    {
        to: '/public/login',
        labelKey: 'public.bottomNavCabinet',
        icon: (
            <>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </>
        ),
    },
]

export default function MobileBottomNav() {
    const { t } = useTranslation()

    return (
        <nav className="pub-bottom-nav" aria-label={t('public.bottomNavAriaLabel')}>
            {items.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `pub-bottom-nav__item${isActive ? ' is-active' : ''}`}
                >
                    <svg
                        className="pub-bottom-nav__icon"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        {item.icon}
                    </svg>
                    <span className="pub-bottom-nav__label">{t(item.labelKey)}</span>
                </NavLink>
            ))}
        </nav>
    )
}
