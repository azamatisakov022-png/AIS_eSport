import React from 'react'

/* Outline-иконки госуслуг (вместо эмодзи). currentColor, 24x24. */
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const GOV_ICON = {
    medal: (
        <svg {...base}><circle cx="12" cy="9" r="6" /><path d="M9 14.5 7.5 22l4.5-2.6L16.5 22 15 14.5" /><path d="M12 6.5l1 2 2.2.2-1.7 1.5.5 2.1-2-1.1-2 1.1.5-2.1L8.8 8.7l2.2-.2z" /></svg>
    ),
    cert: (
        <svg {...base}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /><circle cx="15.5" cy="16.5" r="2.2" /></svg>
    ),
    gavel: (
        <svg {...base}><path d="M12 3v18M5 8h14M5 8l-3 6h6zM19 8l3 6h-6z" /><path d="M4 21h16" /></svg>
    ),
    restore: (
        <svg {...base}><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5" /></svg>
    ),
    qr: (
        <svg {...base}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3M21 14v3M14 18v3M17 21h4v-3M18 17h.01" /></svg>
    ),
    stadium: (
        <svg {...base}><ellipse cx="12" cy="12" rx="9" ry="5.5" /><ellipse cx="12" cy="12" rx="4" ry="2.4" /><path d="M3 12v3c0 3 4 5.5 9 5.5s9-2.5 9-5.5v-3" /></svg>
    ),
}
