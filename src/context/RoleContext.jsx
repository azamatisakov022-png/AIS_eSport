import { createContext, useContext, useState } from 'react'

/**
 * Роли строго по ТЗ:
 * - superadmin:   Суперадминистратор - полный доступ
 * - admin:        Системный администратор - управление пользователями и настройками
 * - employee:     Сотрудник ГАФКиС - реестры, заявления, документооборот
 * - athlete:      Спортсмен - личный кабинет
 * - coach:        Тренер - личный кабинет
 * - judge:        Судья - личный кабинет
 */

export const ROLES = {
    superadmin: {
        key: 'superadmin',
        label: 'Суперадминистратор',
        shortLabel: 'Суперадмин',
        name: 'Касымов А.Т.',
        icon: '',
        initials: 'СА',
        description: 'Полный доступ ко всему',
    },
    admin: {
        key: 'admin',
        label: 'Системный администратор',
        shortLabel: 'Сис. админ',
        name: 'Бекешов М.К.',
        icon: '',
        initials: 'АД',
        description: 'Управление пользователями и настройками',
    },
    employee: {
        key: 'employee',
        label: 'Сотрудник ГАФКиС',
        shortLabel: 'Сотрудник',
        name: 'Сатыбалдиев К.Ж.',
        icon: '',
        initials: 'СГ',
        description: 'Работа с реестрами и документооборотом',
    },
    athlete: {
        key: 'athlete',
        label: 'Спортсмен',
        shortLabel: 'Спортсмен',
        icon: '',
        initials: 'СП',
        description: 'Личный кабинет спортсмена',
    },
    coach: {
        key: 'coach',
        label: 'Тренер',
        shortLabel: 'Тренер',
        icon: '',
        initials: 'ТР',
        description: 'Личный кабинет тренера',
    },
    judge: {
        key: 'judge',
        label: 'Судья',
        shortLabel: 'Судья',
        icon: '',
        initials: 'СД',
        description: 'Личный кабинет судьи',
    },
    org: {
        key: 'org',
        label: 'Организация',
        shortLabel: 'Организация',
        icon: '',
        initials: 'ОР',
        description: 'Личный кабинет организации',
    },
}

/**
 * Какие маршруты доступны каждой роли
 */
const INTRANET_ROUTES = [
    '/intranet',
    '/intranet/news',
    '/intranet/structure',
    '/intranet/directory',
    '/intranet/regulations',
    '/intranet/knowledge',
    '/intranet/templates',
    '/intranet/chat',
    '/intranet/announcements',
    '/intranet/calendar',
    '/intranet/routes',
    '/intranet/approvals',
    '/intranet/cms',
]

export const ROLE_ROUTES = {
    superadmin: [
        '/dashboard', '/athletes', '/coaches', '/judges',
        '/organizations', '/facilities', '/events', '/teams',
        '/staff', '/medical-certificates', '/inventory', '/stipends', '/finance',
        '/applications', '/trainer-applications', '/award-applications', '/judge-applications', '/restoration-applications', '/accreditation-applications', '/transfer-applications', '/protocol-submissions', '/analytics', '/settings',
        ...INTRANET_ROUTES,
    ],
    admin: [
        '/dashboard', '/settings',
        ...INTRANET_ROUTES,
    ],
    employee: [
        '/dashboard', '/athletes', '/coaches', '/judges',
        '/organizations', '/facilities', '/events', '/teams',
        '/staff', '/medical-certificates', '/inventory', '/stipends', '/finance',
        '/applications', '/trainer-applications', '/award-applications', '/judge-applications', '/restoration-applications', '/accreditation-applications', '/transfer-applications', '/protocol-submissions', '/analytics',
        ...INTRANET_ROUTES,
    ],
    athlete: [
        '/dashboard', '/events',
    ],
    coach: [
        '/dashboard', '/athletes', '/events',
    ],
    judge: [
        '/dashboard', '/events',
    ],
    org: [
        '/dashboard', '/events', '/cabinet',
    ],
}

const RoleContext = createContext(null)

export function RoleProvider({ children }) {
    const [currentRole, setCurrentRole] = useState('superadmin')

    const role = ROLES[currentRole] || ROLES.superadmin
    const allowedRoutes = ROLE_ROUTES[currentRole] || []
    const isLoggedIn = !!currentRole

    const hasAccess = (path) => allowedRoutes.includes(path)

    const logout = () => {
        setCurrentRole('superadmin')
    }

    return (
        <RoleContext.Provider value={{ currentRole, setCurrentRole, role, allowedRoutes, hasAccess, isLoggedIn, logout }}>
            {children}
        </RoleContext.Provider>
    )
}

export function useRole() {
    const ctx = useContext(RoleContext)
    if (!ctx) throw new Error('useRole must be used within RoleProvider')
    return ctx
}
