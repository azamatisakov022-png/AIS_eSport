import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRole, ROLES } from '../context/RoleContext'
import { useTheme } from '../context/ThemeContext'
import { TbSun, TbMoon } from 'react-icons/tb'
import './public-responsive.css'

const USER_NAMES = {
    athlete: 'Айбек Джумабаев',
    coach: 'Нурлан Абдыкалыков',
    judge: 'Гульнара Осмонова',
}

const ROLE_COLORS = {
    athlete: '#1a1a1a',
    coach: '#16a34a',
    judge: '#7C3AED',
}

export default function PublicCabinetLayout() {
    const { t } = useTranslation()
    const { currentRole, logout } = useRole()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const roleMeta = ROLES[currentRole] || ROLES.athlete
    const userName = USER_NAMES[currentRole] || roleMeta.label
    const roleColor = ROLE_COLORS[currentRole] || '#86868b'

    const handleLogout = () => {
        logout()
        navigate('/public/login')
    }

    return (
        <div style={s.wrap} className="pub-wrap">
            {/* Header - fixed 60px */}
            <header style={s.header} className="pub-header">
                <Link to="/public" style={s.brand} className="pub-brand">
                    <img src="/logo.png" alt="ГАФКиС" style={s.logo} />
                    <div className="pub-brand-text">
                        <div style={s.brandTitle}>ГАФКиС</div>
                        <div style={s.brandSub} className="hide-mobile">{t('public.ais')}</div>
                    </div>
                </Link>

                <div style={s.actions} className="pub-actions">
                    <button style={s.notifBtn} onClick={toggleTheme} title="Toggle Theme">
                        {theme === 'dark' ? <TbSun size={20} /> : <TbMoon size={20} />}
                    </button>

                    <button style={s.notifBtn} title={t('public.notifications')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.06" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                        <span style={s.notifDot} />
                    </button>

                    <div style={s.userBlock} className="pub-user-block">
                        <div style={{ ...s.avatar, background: roleColor }}>
                            {userName.split(' ').map(w => w[0]).join('')}
                        </div>
                        <div className="hide-mobile">
                            <div style={s.userName}>{userName}</div>
                            <div style={{ ...s.roleBadge, background: `${roleColor}15`, color: roleColor }}>
                                {roleMeta.icon} {roleMeta.label}
                            </div>
                        </div>
                    </div>

                    <button style={s.logoutBtn} onClick={handleLogout} title={t('public.logoutTitle')} className="pub-logout-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" />
                            <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" />
                            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="hide-mobile">{t('public.logout')}</span>
                    </button>
                </div>
            </header>

            {/* Body - sidebar + content, fills remaining height */}
            <div style={s.body} className="pub-body">
                <Outlet />
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════ */
const s = {
    /* Outer wrapper - full viewport, column layout */
    wrap: {
        height: '100vh', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', fontFamily: 'inherit',
    },

    /* Header - 60px, no shrink */
    header: {
        height: 60, flexShrink: 0,
        background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', zIndex: 100,
    },

    /* Brand */
    brand: {
        display: 'flex', alignItems: 'center', gap: 12,
        textDecoration: 'none', color: 'inherit',
    },
    logo: { width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' },
    brandTitle: { fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' },
    brandSub: { fontSize: 11, color: 'var(--text-muted)', marginTop: 1 },

    /* Right actions */
    actions: { display: 'flex', alignItems: 'center', gap: 16 },

    notifBtn: {
        position: 'relative', background: 'var(--bg-panel)', border: 'none',
        borderRadius: 10, width: 40, height: 40, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-primary)',
    },
    notifDot: {
        position: 'absolute', top: 8, right: 9, width: 8, height: 8,
        borderRadius: '50%', background: '#ef4444', border: '2px solid #fff',
    },

    userBlock: { display: 'flex', alignItems: 'center', gap: 10 },
    avatar: {
        width: 36, height: 36, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 13, fontWeight: 800,
    },
    userName: { fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' },
    roleBadge: {
        display: 'inline-block', padding: '1px 8px', borderRadius: 12,
        fontSize: 10, fontWeight: 700, marginTop: 2,
    },

    logoutBtn: {
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 16px', border: 'none', borderRadius: 20,
        background: '#fee2e2', color: '#ef4444', fontSize: 13, fontWeight: 700,
        fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
    },

    /* Body - fills all space below header, no constraints */
    body: {
        flex: 1, display: 'flex', overflow: 'hidden',
    },
}
