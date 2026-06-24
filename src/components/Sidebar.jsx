import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRole, ROLES, ROLE_ROUTES } from '../context/RoleContext'
import './Sidebar.css'

/* ── SVG icon components (16x16, strokeWidth 1.5) ── */
const icons = {
    dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    athletes: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    coaches: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    judges: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M3 12h18"/><circle cx="12" cy="12" r="10"/></svg>,
    organizations: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>,
    facilities: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/></svg>,
    events: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    teams: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    applications: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    trainerApps: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>,
    awardApps: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    analytics: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    intranet: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    intranetNews: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>,
    intranetStructure: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/></svg>,
    intranetDirectory: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/><circle cx="14" cy="11" r="2"/><path d="M11 17a3 3 0 0 1 6 0"/></svg>,
    intranetRegulations: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>,
    intranetKnowledge: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    intranetTemplates: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
    intranetChat: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    intranetAnnouncements: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 12 22 21 22 3"/><line x1="22" y1="12" x2="6" y2="12"/></svg>,
    intranetCalendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    routes: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h8"/><path d="M6 8v8"/><path d="M16 18H8"/><path d="M18 16V8"/></svg>,
    approvals: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/><path d="M5 22V8"/></svg>,
    cms: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    staff: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    medical: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>,
    inventory: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
}

const ICON_MAP = {
    '/dashboard': 'dashboard',
    '/athletes': 'athletes',
    '/coaches': 'coaches',
    '/judges': 'judges',
    '/organizations': 'organizations',
    '/facilities': 'facilities',
    '/events': 'events',
    '/teams': 'teams',
    '/staff': 'staff',
    '/medical-certificates': 'medical',
    '/inventory': 'inventory',
    '/applications': 'applications',
    '/trainer-applications': 'trainerApps',
    '/award-applications': 'awardApps',
    '/judge-applications': 'judgeApps',
    '/restoration-applications': 'restorationApps',
    '/accreditation-applications': 'accreditationApps',
    '/transfer-applications': 'transferApps',
    '/protocol-submissions': 'protocolSubs',
    '/analytics': 'analytics',
    '/settings': 'settings',
    '/intranet': 'intranet',
    '/intranet/news': 'intranetNews',
    '/intranet/structure': 'intranetStructure',
    '/intranet/directory': 'intranetDirectory',
    '/intranet/regulations': 'intranetRegulations',
    '/intranet/knowledge': 'intranetKnowledge',
    '/intranet/templates': 'intranetTemplates',
    '/intranet/chat': 'intranetChat',
    '/intranet/announcements': 'intranetAnnouncements',
    '/intranet/calendar': 'intranetCalendar',
    '/intranet/routes': 'routes',
    '/intranet/approvals': 'approvals',
    '/intranet/cms': 'cms',
}

const ROLE_NAMES = {
    employee: 'Сотрудник ГАФКиС',
    admin: 'Системный администратор',
    superadmin: 'Суперадминистратор',
}

const ROLE_DISPLAY = {
    employee: 'Сотрудник',
    admin: 'Сис. админ',
    superadmin: 'Суперадмин',
}

function getInitials(name) {
    const parts = name.split(' ')
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}

const allNavGroups = [
    {
        labelKey: 'nav.registries',
        items: [
            { to: '/dashboard', textKey: 'nav.dashboard' },
            { to: '/athletes', textKey: 'nav.athletes' },
            { to: '/coaches', textKey: 'nav.coaches' },
            { to: '/judges', textKey: 'nav.judges' },
            { to: '/organizations', textKey: 'nav.organizations' },
            { to: '/facilities', textKey: 'nav.facilities' },
            { to: '/events', textKey: 'nav.events' },
            { to: '/teams', textKey: 'nav.teams' },
            { to: '/staff', textKey: 'nav.staff' },
            { to: '/medical-certificates', textKey: 'nav.medicalCerts' },
            { to: '/inventory', textKey: 'nav.inventory' },
        ]
    },
    {
        labelKey: 'nav.intranet',
        items: [
            { to: '/intranet', textKey: 'nav.intranetHome' },
            { to: '/intranet/news', textKey: 'nav.intranetNews' },
            { to: '/intranet/announcements', textKey: 'nav.intranetAnnouncements' },
            { to: '/intranet/directory', textKey: 'nav.intranetDirectory' },
            { to: '/intranet/structure', textKey: 'nav.intranetStructure' },
            { to: '/intranet/regulations', textKey: 'nav.intranetRegulations' },
            { to: '/intranet/knowledge', textKey: 'nav.intranetKnowledge' },
            { to: '/intranet/templates', textKey: 'nav.intranetTemplates' },
            { to: '/intranet/calendar', textKey: 'nav.intranetCalendar' },
            { to: '/intranet/chat', textKey: 'nav.intranetChat' },
        ]
    },
    {
        labelKey: 'nav.documentation',
        items: [
            { to: '/applications', textKey: 'nav.applications' },
            { to: '/trainer-applications', textKey: 'nav.trainerApplications' },
            { to: '/award-applications', textKey: 'nav.awardApplications' },
            { to: '/judge-applications', textKey: 'nav.judgeApplications' },
            { to: '/restoration-applications', textKey: 'nav.restorationApplications' },
            { to: '/accreditation-applications', textKey: 'nav.accreditationApplications' },
            { to: '/transfer-applications', textKey: 'nav.transferApplications' },
            { to: '/protocol-submissions', textKey: 'nav.protocolSubmissions' },
            { to: '/intranet/approvals', textKey: 'nav.approvals' },
            { to: '/intranet/routes', textKey: 'nav.routes' },
            { to: '/intranet/cms', textKey: 'nav.cms' },
            { to: '/analytics', textKey: 'nav.analytics' },
        ]
    },
    {
        labelKey: 'nav.system',
        items: [
            { to: '/settings', textKey: 'nav.administration' },
        ]
    },
]

export default function Sidebar({ isOpen, onClose }) {
    const { t } = useTranslation()
    const { currentRole, hasAccess, logout } = useRole()
    const navigate = useNavigate()

    const roleData = ROLES[currentRole] || {}
    const userName = roleData.name || ROLE_NAMES[currentRole] || 'Пользователь'
    const roleLabel = ROLE_DISPLAY[currentRole] || currentRole

    const handleLogout = () => {
        if (logout) logout()
        navigate('/public/login')
    }

    const visibleGroups = allNavGroups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => hasAccess(item.to)),
        }))
        .filter((group) => group.items.length > 0)

    return (
        <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
            {/* User Header - like CabinetSidebar */}
            <div className="sidebar__user-header">
                <div className="sidebar__avatar">{roleData.initials || getInitials(userName)}</div>
                <div className="sidebar__user-name">{userName}</div>
                <div className="sidebar__user-role">{roleLabel}</div>
            </div>

            {/* Navigation */}
            <nav className="sidebar__nav">
                {visibleGroups.map((group) => (
                    <div className="sidebar__group" key={group.labelKey}>
                        <div className="sidebar__group-label">{t(group.labelKey)}</div>
                        {group.items.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/dashboard' || item.to === '/intranet'}
                                className={({ isActive }) =>
                                    `sidebar__link ${isActive ? 'active' : ''}`
                                }
                            >
                                {({ isActive }) => (<>
                                    {isActive && <span className="sidebar__accent-bar" />}
                                    <span className="sidebar__link-icon" style={{color: isActive ? '#0071E3' : '#8E8E93'}}>
                                        {icons[ICON_MAP[item.to]] || icons.dashboard}
                                    </span>
                                    <span>{t(item.textKey)}</span>
                                </>)}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

        </aside>
    )
}
