/* ══════════════════════════════════════════════════════════════
   Единый набор иконок публичного портала.
   Стиль: Lucide (https://lucide.dev) - outline 24×24, stroke 1.5.
   Цвет наследуется от родителя через currentColor. Размер задаётся
   CSS-ом через width/height на родительской обёртке.
   ══════════════════════════════════════════════════════════════ */

const base = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
}

/* ── Quick Access ───────────────────────────────────────────── */

// Спортсмены - бегущая фигура
export function IconAthletes(props) {
    return (
        <svg {...base} {...props}>
            <circle cx="13" cy="4" r="2" />
            <path d="M4 22l5-7 4 2 3-5 4 3" />
            <path d="M9 9l3-3 3 2 4-1" />
        </svg>
    )
}

// Тренеры - выпускная кепка
export function IconCoaches(props) {
    return (
        <svg {...base} {...props}>
            <path d="M22 10v6" />
            <path d="M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    )
}

// Судьи - весы правосудия
export function IconJudges(props) {
    return (
        <svg {...base} {...props}>
            <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z" />
            <path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
    )
}

// Мероприятия - календарь
export function IconEvents(props) {
    return (
        <svg {...base} {...props}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 10h18" />
            <path d="M8 2v4" />
            <path d="M16 2v4" />
        </svg>
    )
}

// Организации - здание
export function IconOrganizations(props) {
    return (
        <svg {...base} {...props}>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01M12 6h.01M16 6h.01" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" />
            <path d="M8 14h.01M12 14h.01M16 14h.01" />
        </svg>
    )
}

// Госуслуги - документ
export function IconServices(props) {
    return (
        <svg {...base} {...props}>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="16" y2="17" />
            <line x1="8" y1="9" x2="10" y2="9" />
        </svg>
    )
}

// Объекты - спорткомплекс
export function IconFacilities(props) {
    return (
        <svg {...base} {...props}>
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
            <path d="M12 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            <path d="M6 14v4" />
            <path d="M18 14v4" />
        </svg>
    )
}

// Проверка QR - QR-код
export function IconQrVerify(props) {
    return (
        <svg {...base} {...props}>
            <rect x="3" y="3" width="6" height="6" rx="1" />
            <rect x="15" y="3" width="6" height="6" rx="1" />
            <rect x="3" y="15" width="6" height="6" rx="1" />
            <path d="M15 15h2v2" />
            <path d="M21 15v3" />
            <path d="M15 21h6" />
            <path d="M19 18v3" />
        </svg>
    )
}

/* ── Gov Services ───────────────────────────────────────────── */

// Регистрация тренера - добавление человека
export function IconUserPlus(props) {
    return (
        <svg {...base} {...props}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
    )
}

// Спортивное звание - кубок
export function IconTrophy(props) {
    return (
        <svg {...base} {...props}>
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
        </svg>
    )
}

// Судейская категория - щит с галочкой
export function IconShieldCheck(props) {
    return (
        <svg {...base} {...props}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
