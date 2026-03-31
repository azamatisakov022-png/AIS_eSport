import { useTranslation } from 'react-i18next'

const PAGE_NAMES = {
    '/':                 'nav.dashboard',
    '/athletes':         'nav.athletes',
    '/coaches':          'nav.coaches',
    '/judges':           'nav.judges',
    '/teams':            'nav.teams',
    '/events':           'nav.events',
    '/organizations':    'nav.organizations',
    '/facilities':       'nav.facilities',
    '/award-applications': 'nav.awardApplications',
    '/trainer-applications': 'nav.trainerApplications',
    '/analytics':        'nav.analytics',
    '/settings':         'nav.settings',
}

export default function Breadcrumbs({ current }) {
    const { t } = useTranslation()
    return (
        <div className="breadcrumbs">
            <span className="breadcrumbs__item" onClick={() => window.history.length > 1 && window.history.back()}>
                {t('nav.dashboard')}
            </span>
            <span className="breadcrumbs__separator">›</span>
            <span className="breadcrumbs__current">{current}</span>
        </div>
    )
}

export { PAGE_NAMES }
