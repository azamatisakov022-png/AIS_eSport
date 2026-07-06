/**
 * Карта «путь → i18n-ключ названия» для document.title внутреннего портала.
 * Совпадение — по самому длинному префиксу (детальные страницы /:id
 * наследуют заголовок родительского реестра).
 */
export const NAV_TITLE_KEYS = {
    '/dashboard': 'nav.dashboard',
    '/athletes': 'nav.athletes',
    '/coaches': 'nav.coaches',
    '/judges': 'nav.judges',
    '/organizations': 'nav.organizations',
    '/facilities': 'nav.facilities',
    '/events': 'nav.events',
    '/teams': 'nav.teams',
    '/staff': 'nav.staff',
    '/medical-certificates': 'nav.medicalCerts',
    '/inventory': 'nav.inventory',
    '/stipends': 'nav.stipends',
    '/finance': 'nav.finance',
    '/applications': 'nav.applications',
    '/trainer-applications': 'nav.trainerApplications',
    '/award-applications': 'nav.awardApplications',
    '/judge-applications': 'nav.judgeApplications',
    '/restoration-applications': 'nav.restorationApplications',
    '/accreditation-applications': 'nav.accreditationApplications',
    '/transfer-applications': 'nav.transferApplications',
    '/protocol-submissions': 'nav.protocolSubmissions',
    '/analytics': 'nav.analytics',
    '/settings': 'nav.administration',
    '/intranet': 'nav.intranetHome',
    '/intranet/news': 'nav.intranetNews',
    '/intranet/announcements': 'nav.intranetAnnouncements',
    '/intranet/directory': 'nav.intranetDirectory',
    '/intranet/structure': 'nav.intranetStructure',
    '/intranet/regulations': 'nav.intranetRegulations',
    '/intranet/knowledge': 'nav.intranetKnowledge',
    '/intranet/templates': 'nav.intranetTemplates',
    '/intranet/calendar': 'nav.intranetCalendar',
    '/intranet/chat': 'nav.intranetChat',
    '/intranet/approvals': 'nav.approvals',
    '/intranet/routes': 'nav.routes',
    '/intranet/cms': 'nav.cms',
}

/** Заголовок вкладки по пути (самый длинный префикс) или null. */
export function titleKeyForPath(pathname) {
    let best = null
    for (const [path, key] of Object.entries(NAV_TITLE_KEYS)) {
        if (pathname === path || pathname.startsWith(path + '/')) {
            if (!best || path.length > best.path.length) best = { path, key }
        }
    }
    return best ? best.key : null
}
