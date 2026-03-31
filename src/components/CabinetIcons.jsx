/**
 * CabinetIcons - Modern duotone SVG icons for dashboards & cabinets
 * Each icon uses a filled area at reduced opacity + crisp strokes
 */

/* ── helper ── */
const I = ({ children, size = 16 }) => (
    <svg
        width={size} height={size} viewBox="0 0 24 24"
        fill="none" strokeLinecap="round" strokeLinejoin="round"
    >
        {children}
    </svg>
)

export const CabinetIcons = {
    /* Profile - person silhouette with body fill */
    profile: (size) => (
        <I size={size}>
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12" />
            <path d="M6 21v-1a6 6 0 0 1 12 0v1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" />
        </I>
    ),

    /* Rank / Trophy - cup with handles */
    rank: (size) => (
        <I size={size}>
            <path d="M8 21h8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 17v4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
            <path d="M7 7H4a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3h1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M17 7h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3h-1" stroke="currentColor" strokeWidth="1.5" />
        </I>
    ),

    /* Medical - heart with pulse line */
    medical: (size) => (
        <I size={size}>
            <path d="M12 20S4 14 4 9.5a4.5 4.5 0 0 1 8-2.83 4.5 4.5 0 0 1 8 2.83C20 14 12 20 12 20z"
                stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" />
            <polyline points="8 13 10 11 12 14 14 10 16 13" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </I>
    ),

    /* Events - calendar with checkmark */
    events: (size) => (
        <I size={size}>
            <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06" />
            <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 2v4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 2v4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 15l2 2 4-4" stroke="currentColor" strokeWidth="1.5" />
        </I>
    ),

    /* Training - dumbbell */
    training: (size) => (
        <I size={size}>
            <path d="M6.5 7a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V9a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
            <path d="M17.5 7a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V9a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
            <path d="M8.5 12h7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 10v4" stroke="currentColor" strokeWidth="2" />
            <path d="M21 10v4" stroke="currentColor" strokeWidth="2" />
        </I>
    ),

    /* Coaches - person with whistle */
    coaches: (size) => (
        <I size={size}>
            <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12" />
            <path d="M2 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06" />
            <circle cx="19" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
            <path d="M19 10.5v2" stroke="currentColor" strokeWidth="1.5" />
        </I>
    ),

    /* Medal - medal with ribbon */
    medal: (size) => (
        <I size={size}>
            <path d="M7.21 2L9 7h6l1.79-5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" />
            <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
            <path d="M12 11v3l2 1" stroke="currentColor" strokeWidth="1.5" />
        </I>
    ),

    /* Team - shield with people */
    team: (size) => (
        <I size={size}>
            <path d="M12 2l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z"
                stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.07" />
            <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
            <path d="M8.5 17a4.5 4.5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.5" />
        </I>
    ),

    /* Applications - clipboard with checkmark */
    applications: (size) => (
        <I size={size}>
            <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06" />
            <path d="M9 1h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V1z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12" />
            <path d="M9 13l2 2 4-4" stroke="currentColor" strokeWidth="1.5" />
        </I>
    ),

    /* Notifications - bell with dot */
    notifications: (size) => (
        <I size={size}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="18" cy="4" r="3" fill="#FF3B30" stroke="none" opacity="0.9" />
        </I>
    ),

    /* Certificate - document with seal */
    certificate: (size) => (
        <I size={size}>
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06" />
            <path d="M7 7h10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 11h6" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
            <path d="M16 15v1l1 0.5" stroke="currentColor" strokeWidth="1.5" />
        </I>
    ),

    /* Athletes - running person */
    athletes: (size) => (
        <I size={size}>
            <circle cx="14" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
            <path d="M6 20l3-7 4 1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 13l4-4 3 2 3-3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 8l2 4-4 2" stroke="currentColor" strokeWidth="1.5" />
        </I>
    ),

    /* Category - star badge */
    category: (size) => (
        <I size={size}>
            <path d="M12 2l2.4 4.8 5.3.8-3.85 3.75.9 5.3L12 14.3 7.25 16.65l.9-5.3L4.3 7.6l5.3-.8L12 2z"
                stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12" />
        </I>
    ),

    /* Logout - arrow + door */
    logout: (size) => (
        <I size={size}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" />
            <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </I>
    ),
    
    /* Facilities - stadium */
    facilities: (size) => (
        <I size={size}>
            <ellipse cx="12" cy="14" rx="9" ry="5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" />
            <path d="M3 14V8c0-3 4-5 9-5s9 2 9 5v6" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
            <path d="M3 8c0 3 4 5 9 5s9-2 9-5" stroke="currentColor" strokeWidth="1.5" />
        </I>
    ),
}

/* ── Dashboard metric icons (larger, with color tinting) ── */
export const DashboardIcons = {
    athletes: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" stroke="#2563EB" strokeWidth="1.5" fill="#2563EB" fillOpacity="0.15" />
            <path d="M4 21v-1a8 8 0 0 1 16 0v1" stroke="#2563EB" strokeWidth="1.5" fill="#2563EB" fillOpacity="0.08" />
        </svg>
    ),
    coaches: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="7" r="3.5" stroke="#2563EB" strokeWidth="1.5" fill="#2563EB" fillOpacity="0.15" />
            <path d="M2 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" stroke="#2563EB" strokeWidth="1.5" fill="#2563EB" fillOpacity="0.06" />
            <circle cx="19" cy="8" r="2" stroke="#2563EB" strokeWidth="1.5" fill="#2563EB" fillOpacity="0.2" />
            <path d="M19 10v1.5" stroke="#2563EB" strokeWidth="1.5" />
        </svg>
    ),
    judges: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l2.4 4.8 5.3.8-3.85 3.75.9 5.3L12 14.3 7.25 16.65l.9-5.3L4.3 7.6l5.3-.8L12 2z"
                stroke="#2563EB" strokeWidth="1.5" fill="#2563EB" fillOpacity="0.12" />
        </svg>
    ),
    events: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="3" stroke="#2563EB" strokeWidth="1.5" fill="#2563EB" fillOpacity="0.06" />
            <path d="M3 10h18" stroke="#2563EB" strokeWidth="1.5" />
            <path d="M8 2v4" stroke="#2563EB" strokeWidth="1.5" />
            <path d="M16 2v4" stroke="#2563EB" strokeWidth="1.5" />
            <path d="M9 15l2 2 4-4" stroke="#2563EB" strokeWidth="1.5" />
        </svg>
    ),
    applications: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="3" width="14" height="18" rx="2" stroke="#d97706" strokeWidth="1.5" fill="#d97706" fillOpacity="0.08" />
            <path d="M9 1h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V1z" stroke="#d97706" strokeWidth="1.5" fill="#d97706" fillOpacity="0.12" />
            <path d="M9 11h6" stroke="#d97706" strokeWidth="1.5" />
            <path d="M9 14h4" stroke="#d97706" strokeWidth="1.5" />
        </svg>
    ),
    organizations: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="8" width="16" height="14" rx="2" stroke="#2563EB" strokeWidth="1.5" fill="#2563EB" fillOpacity="0.06" />
            <path d="M12 2L4 8h16L12 2z" stroke="#2563EB" strokeWidth="1.5" fill="#2563EB" fillOpacity="0.1" />
            <rect x="9" y="14" width="6" height="8" rx="1" stroke="#2563EB" strokeWidth="1.5" fill="#2563EB" fillOpacity="0.08" />
            <path d="M8 11h2" stroke="#2563EB" strokeWidth="1.5" />
            <path d="M14 11h2" stroke="#2563EB" strokeWidth="1.5" />
        </svg>
    ),
}

/* ── Metric card icons - colored duotone, replace emoji ── */
const M = (children, color = '#2563EB', size = 22) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {children(color)}
    </svg>
)

export const MetricIcons = {
    /* People / total */
    total: (c = '#2563EB', s = 22) => M(cl => <>
        <circle cx="12" cy="8" r="4" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.15" />
        <path d="M4 21v-1a8 8 0 0 1 16 0v1" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.06" />
    </>, c, s),

    /* Checkmark circle - active/approved */
    active: (c = '#16a34a', s = 22) => M(cl => <>
        <circle cx="12" cy="12" r="9" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.1" />
        <path d="M8 12l3 3 5-5" stroke={cl} strokeWidth="2" />
    </>, c, s),

    /* Warning triangle - expiring */
    warning: (c = '#d97706', s = 22) => M(cl => <>
        <path d="M12 3L2 21h20L12 3z" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.08" />
        <path d="M12 10v4" stroke={cl} strokeWidth="2" />
        <circle cx="12" cy="17" r="0.5" fill={cl} stroke="none" />
    </>, c, s),

    /* Blocked / cancelled circle-cross */
    blocked: (c = '#ef4444', s = 22) => M(cl => <>
        <circle cx="12" cy="12" r="9" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.08" />
        <path d="M15 9l-6 6" stroke={cl} strokeWidth="2" />
        <path d="M9 9l6 6" stroke={cl} strokeWidth="2" />
    </>, c, s),

    /* Rejected - X in circle */
    rejected: (c = '#ef4444', s = 22) => M(cl => <>
        <circle cx="12" cy="12" r="9" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.08" />
        <path d="M15 9l-6 6" stroke={cl} strokeWidth="2" />
        <path d="M9 9l6 6" stroke={cl} strokeWidth="2" />
    </>, c, s),

    /* Search / review - magnifying glass */
    search: (c = '#7C3AED', s = 22) => M(cl => <>
        <circle cx="11" cy="11" r="7" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.08" />
        <path d="M21 21l-4.35-4.35" stroke={cl} strokeWidth="2" />
    </>, c, s),

    /* Clock / pending */
    clock: (c = '#d97706', s = 22) => M(cl => <>
        <circle cx="12" cy="12" r="9" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.08" />
        <path d="M12 7v5l3 3" stroke={cl} strokeWidth="1.5" />
    </>, c, s),

    /* Online / green dot */
    online: (c = '#16a34a', s = 22) => M(cl => <>
        <circle cx="12" cy="12" r="9" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.06" />
        <circle cx="12" cy="12" r="4" fill={cl} fillOpacity="0.5" stroke="none" />
    </>, c, s),

    /* Building - organization */
    building: (c = '#2563EB', s = 22) => M(cl => <>
        <rect x="4" y="8" width="16" height="14" rx="2" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.06" />
        <path d="M12 2L4 8h16L12 2z" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.1" />
        <rect x="9" y="14" width="6" height="8" rx="1" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.08" />
        <path d="M8 11h2" stroke={cl} strokeWidth="1.5" />
        <path d="M14 11h2" stroke={cl} strokeWidth="1.5" />
    </>, c, s),

    /* Government / federation */
    government: (c = '#7C3AED', s = 22) => M(cl => <>
        <rect x="3" y="10" width="18" height="12" rx="1" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.06" />
        <path d="M12 2L3 10h18L12 2z" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.1" />
        <path d="M8 14v4" stroke={cl} strokeWidth="1.5" />
        <path d="M12 14v4" stroke={cl} strokeWidth="1.5" />
        <path d="M16 14v4" stroke={cl} strokeWidth="1.5" />
    </>, c, s),

    /* School / graduation */
    school: (c = '#2563EB', s = 22) => M(cl => <>
        <path d="M12 3L2 8l10 5 10-5-10-5z" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.1" />
        <path d="M6 10v6c0 2 3 4 6 4s6-2 6-4v-6" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.05" />
        <path d="M22 8v6" stroke={cl} strokeWidth="1.5" />
    </>, c, s),

    /* Trophy */
    trophy: (c = '#d97706', s = 22) => M(cl => <>
        <path d="M8 21h8" stroke={cl} strokeWidth="1.5" />
        <path d="M12 17v4" stroke={cl} strokeWidth="1.5" />
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.1" />
        <path d="M7 7H4a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3h1" stroke={cl} strokeWidth="1.5" />
        <path d="M17 7h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3h-1" stroke={cl} strokeWidth="1.5" />
    </>, c, s),

    /* Medal */
    medal: (c = '#2563EB', s = 22) => M(cl => <>
        <path d="M7.21 2L9 7h6l1.79-5" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.08" />
        <circle cx="12" cy="14" r="6" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.1" />
        <path d="M12 11v3l2 1" stroke={cl} strokeWidth="1.5" />
    </>, c, s),

    /* Stadium */
    stadium: (c = '#2563EB', s = 22) => M(cl => <>
        <ellipse cx="12" cy="14" rx="9" ry="5" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.08" />
        <path d="M3 14V8c0-3 4-5 9-5s9 2 9 5v6" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.04" />
        <path d="M3 8c0 3 4 5 9 5s9-2 9-5" stroke={cl} strokeWidth="1.5" />
    </>, c, s),

    /* Wrench - reconstruction */
    wrench: (c = '#d97706', s = 22) => M(cl => <>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
            stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.08" />
    </>, c, s),

    /* Map pin */
    mapPin: (c = '#7C3AED', s = 22) => M(cl => <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.08" />
        <circle cx="12" cy="10" r="3" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.15" />
    </>, c, s),

    /* Globe - international */
    globe: (c = '#0891b2', s = 22) => M(cl => <>
        <circle cx="12" cy="12" r="9" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.06" />
        <path d="M2 12h20" stroke={cl} strokeWidth="1.5" />
        <path d="M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9" stroke={cl} strokeWidth="1.5" />
        <path d="M12 3c-2.5 2.5-4 5.5-4 9s1.5 6.5 4 9" stroke={cl} strokeWidth="1.5" />
    </>, c, s),

    /* Target - goal */
    target: (c = '#0EA5E9', s = 22) => M(cl => <>
        <circle cx="12" cy="12" r="9" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.04" />
        <circle cx="12" cy="12" r="5" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.08" />
        <circle cx="12" cy="12" r="1.5" fill={cl} stroke="none" />
    </>, c, s),

    /* Hospital / medical */
    hospital: (c = '#ef4444', s = 22) => M(cl => <>
        <rect x="3" y="3" width="18" height="18" rx="3" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.06" />
        <path d="M12 8v8" stroke={cl} strokeWidth="2" />
        <path d="M8 12h8" stroke={cl} strokeWidth="2" />
    </>, c, s),

    /* Clipboard / document list */
    clipboard: (c = '#2563EB', s = 22) => M(cl => <>
        <rect x="5" y="3" width="14" height="18" rx="2" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.06" />
        <path d="M9 1h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V1z" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.12" />
        <path d="M9 11h6" stroke={cl} strokeWidth="1.5" />
        <path d="M9 14h4" stroke={cl} strokeWidth="1.5" />
    </>, c, s),

    /* Upcoming - arrow-right-circle */
    upcoming: (c = '#0891b2', s = 22) => M(cl => <>
        <circle cx="12" cy="12" r="9" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.08" />
        <path d="M12 8l4 4-4 4" stroke={cl} strokeWidth="1.5" />
        <path d="M8 12h8" stroke={cl} strokeWidth="1.5" />
    </>, c, s),

    /* Live - pulse dot */
    live: (c = '#ef4444', s = 22) => M(cl => <>
        <circle cx="12" cy="12" r="4" fill={cl} fillOpacity="0.6" stroke="none" />
        <circle cx="12" cy="12" r="8" stroke={cl} strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
        <circle cx="12" cy="12" r="1.5" fill={cl} stroke="none" />
    </>, c, s),

    /* Coach / teacher */
    teacher: (c = '#2563EB', s = 22) => M(cl => <>
        <circle cx="10" cy="7" r="4" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.12" />
        <path d="M2 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.06" />
        <circle cx="19" cy="8" r="2.5" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.15" />
        <path d="M19 10.5v2" stroke={cl} strokeWidth="1.5" />
    </>, c, s),

    /* Judge (gavel) */
    judge: (c = '#7C3AED', s = 22) => M(cl => <>
        <circle cx="12" cy="8" r="4" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.12" />
        <path d="M4 21v-1a8 8 0 0 1 16 0v1" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.06" />
        <path d="M12 2l2.4 4.8 5.3.8-3.85 3.75.9 5.3L12 14.3 7.25 16.65l.9-5.3L4.3 7.6l5.3-.8L12 2z"
            stroke={cl} strokeWidth="1" fill={cl} fillOpacity="0.08" transform="translate(10,-2) scale(0.4)" />
    </>, c, s),

    /* Users group */
    users: (c = '#2563EB', s = 22) => M(cl => <>
        <circle cx="9" cy="7" r="3.5" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.12" />
        <path d="M1 21v-1a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v1" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.06" />
        <circle cx="18" cy="8" r="2.5" stroke={cl} strokeWidth="1.5" fill={cl} fillOpacity="0.1" />
        <path d="M20 15a4.5 4.5 0 0 1 3 4v2" stroke={cl} strokeWidth="1.5" />
    </>, c, s),
}

export default CabinetIcons
