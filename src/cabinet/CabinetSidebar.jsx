import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRole } from '../context/RoleContext'
import { useTheme } from '../context/ThemeContext'
import { CabinetIcons } from '../components/CabinetIcons'

/* SVG icon components (16x16, duotone) */
const icons = Object.fromEntries(
    Object.entries(CabinetIcons).map(([key, fn]) => [key, fn(16)])
)

const CABINET_NAV = {
    athlete: {
        sublabelKey: 'cabinet.role.athlete',
        name: 'Асанов Бекболот',
        items: [
            { to: '/cabinet',             icon: 'profile',       textKey: 'cabinet.nav.profile' },
            { to: '/cabinet/passport',    icon: 'rank',          textKey: 'cabinet.nav.ranks' },
            { to: '/cabinet/medical',     icon: 'medical',       textKey: 'cabinet.nav.medical' },
            { to: '/cabinet/events',      icon: 'events',        textKey: 'cabinet.nav.events' },
            { to: '/cabinet/training',    icon: 'training',      textKey: 'cabinet.nav.training' },
            { to: '/cabinet/coaches',     icon: 'coaches',       textKey: 'cabinet.nav.coaches' },
            { to: '/cabinet/medals',      icon: 'medal',         textKey: 'cabinet.nav.medals' },
            { to: '/cabinet/team',        icon: 'team',          textKey: 'cabinet.nav.team' },
            { to: '/cabinet/applications',icon: 'applications',  textKey: 'cabinet.nav.applications' },
            { to: '/cabinet/notifications',icon:'notifications', textKey: 'cabinet.nav.notifications', badge: 3 },
        ],
    },
    coach: {
        sublabelKey: 'cabinet.role.coach',
        name: 'Иванов Сергей',
        items: [
            { to: '/cabinet',             icon: 'profile',       textKey: 'cabinet.nav.profile' },
            { to: '/cabinet/certificate', icon: 'certificate',   textKey: 'cabinet.nav.certificate' },
            { to: '/cabinet/athletes',    icon: 'athletes',      textKey: 'cabinet.nav.athletes' },
            { to: '/cabinet/events',      icon: 'events',        textKey: 'cabinet.nav.events' },
            { to: '/cabinet/training',    icon: 'training',      textKey: 'cabinet.nav.trainingProcess' },
            { to: '/cabinet/team',        icon: 'team',          textKey: 'cabinet.nav.team' },
            { to: '/cabinet/applications',icon: 'applications',  textKey: 'cabinet.nav.applications' },
            { to: '/cabinet/notifications',icon:'notifications', textKey: 'cabinet.nav.notifications', badge: 1 },
        ],
    },
    judge: {
        sublabelKey: 'cabinet.role.judge',
        name: 'Мамытов Руслан',
        items: [
            { to: '/cabinet',             icon: 'profile',       textKey: 'cabinet.nav.profile' },
            { to: '/cabinet/category',    icon: 'category',      textKey: 'cabinet.nav.category' },
            { to: '/cabinet/events',      icon: 'events',        textKey: 'cabinet.nav.events' },
            { to: '/cabinet/applications',icon: 'applications',  textKey: 'cabinet.nav.applications' },
            { to: '/cabinet/notifications',icon:'notifications', textKey: 'cabinet.nav.notifications', badge: 2 },
        ],
    },
    org: {
        sublabelKey: 'Организация',
        name: 'СДЮСШ Олимп',
        items: [
            { to: '/cabinet',             icon: 'profile',       textKey: 'Профиль организации' },
            { to: '/cabinet/athletes',    icon: 'athletes',      textKey: 'Мои спортсмены' },
            { to: '/cabinet/coaches',     icon: 'coaches',       textKey: 'Мои тренеры' },
            { to: '/cabinet/events',      icon: 'events',        textKey: 'Мероприятия' },
            { to: '/cabinet/facilities',  icon: 'facilities',    textKey: 'Спортивные объекты' },
            { to: '/cabinet/applications',icon: 'applications',  textKey: 'Заявки на звания' },
            { to: '/cabinet/notifications',icon:'notifications', textKey: 'cabinet.nav.notifications', badge: 5 },
        ],
    },
}

function getInitials(name) {
    const p = name.split(' ')
    return (p[0]?.[0] || '') + (p[1]?.[0] || '')
}

export default function CabinetSidebar({ isOpen, onClose }) {
    const { t } = useTranslation()
    const { currentRole, logout } = useRole()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const nav = CABINET_NAV[currentRole]
    if (!nav) return null

    const handleLogout = () => {
        if (logout) logout()
        navigate('/public/login')
    }

    return (
        <aside style={s.sidebar} className={`cab-sidebar ${isOpen ? 'cab-sidebar--open' : ''}`}>
            {/* Centered avatar + name */}
            <div style={s.userHeader}>
                <div style={s.avatar}>{getInitials(nav.name)}</div>
                <div style={s.userName}>{nav.name}</div>
                <div style={s.userRole}>{t(nav.sublabelKey)}</div>
            </div>

            {/* V2 Nav */}
            <nav style={s.nav}>
                {nav.items.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/cabinet'}
                        style={({ isActive }) => ({
                            ...s.link,
                            ...(isActive ? s.linkActive : {}),
                        })}
                        className="cab-sidebar-link"
                    >
                        {({ isActive }) => (<>
                            {isActive && <span style={s.accent} />}
                            <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)', display: 'flex' }}>{icons[item.icon]}</span>
                            <span style={{ flex: 1 }}>{t(item.textKey)}</span>
                            {item.badge && <span style={s.badge}>{item.badge}</span>}
                        </>)}
                    </NavLink>
                ))}
            </nav>
            <style>{`
                .cab-sidebar-link { transition: all 0.2s ease !important; }
                .cab-sidebar-link:hover { background: rgba(120,120,128,0.08) !important; }
            `}</style>
        </aside>
    )
}

const s = {
    sidebar: {
        position: 'fixed', top: 0, left: 0, width: 240, height: '100vh',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex', flexDirection: 'column', zIndex: 100,
        padding: '24px 16px',
    },
    userHeader: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingBottom: 20, borderBottom: '1px solid var(--border-color)', marginBottom: 8,
    },
    avatar: {
        width: 48, height: 48, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7EB6F6, #B8A9EE)',
        color: 'var(--text-inverse)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 500, marginBottom: 10,
        boxShadow: '0 2px 12px rgba(126,182,246,0.3)',
    },
    userName: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' },
    userRole: { fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textAlign: 'center' },
    nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', paddingTop: 4 },
    link: {
        display: 'flex', alignItems: 'center', gap: 10, position: 'relative',
        padding: '10px 14px', borderRadius: 10, fontSize: 13,
        color: 'var(--text-secondary)', textDecoration: 'none',
        cursor: 'pointer', border: 'none', background: 'none',
    },
    linkActive: {
        color: 'var(--accent)', fontWeight: 600, background: 'var(--accent-light)',
    },
    accent: {
        position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3,
        borderRadius: 2, background: 'var(--accent)',
    },
    badge: {
        background: 'var(--rose)', color: 'var(--text-inverse)', fontSize: 9,
        padding: '2px 6px', borderRadius: 10, marginLeft: 'auto', fontWeight: 600,
        lineHeight: '14px',
    },
    logoutWrap: {
        marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-color)',
    },
    logoutBtn: {
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '10px 14px', borderRadius: 10, fontSize: 13,
        color: 'var(--rose)', background: 'none', border: 'none',
        cursor: 'pointer', fontFamily: 'inherit',
    },
}
