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
        name: 'Асанов Бекболот Маратович',
        icon: '',
        initials: 'СП',
        description: 'Личный кабинет спортсмена',
        // Демо-профиль: имитация данных, полученных при авторизации через «Түндүк» ЕСИ
        persona: {
            lastName: 'Асанов', firstName: 'Бекболот', middleName: 'Маратович',
            inn: '20415199800101', birthDate: '1998-04-15', sex: 'М',
            phone: '+996555112233', email: 'b.asanov@example.kg',
            sport: 'Дзюдо', org: 'СДЮСШОР г. Бишкек',
        },
    },
    coach: {
        key: 'coach',
        label: 'Тренер',
        shortLabel: 'Тренер',
        name: 'Иванов Сергей Петрович',
        icon: '',
        initials: 'ТР',
        description: 'Личный кабинет тренера',
        persona: {
            lastName: 'Иванов', firstName: 'Сергей', middleName: 'Петрович',
            inn: '21203198500202', birthDate: '1985-03-12', sex: 'М',
            phone: '+996555223344', email: 's.ivanov@example.kg',
            sport: 'Дзюдо', org: 'СДЮСШОР г. Бишкек',
        },
    },
    judge: {
        key: 'judge',
        label: 'Судья',
        shortLabel: 'Судья',
        name: 'Мамытов Руслан Каныбекович',
        icon: '',
        initials: 'СД',
        description: 'Личный кабинет судьи',
        persona: {
            lastName: 'Мамытов', firstName: 'Руслан', middleName: 'Каныбекович',
            inn: '22207197900303', birthDate: '1979-07-22', sex: 'М',
            phone: '+996555334455', email: 'r.mamytov@example.kg',
            sport: 'Бокс', org: 'Федерация бокса КР',
        },
    },
    org: {
        key: 'org',
        // Переименовано по решению УРФКиМС 16.07.2026: не «Организация», а «Спортивная школа»
        label: 'Спортивная школа',
        shortLabel: 'Спортшкола',
        name: 'СДЮСШ «Олимп»',
        icon: '',
        initials: 'СШ',
        description: 'Личный кабинет спортивной школы',
        persona: {
            lastName: 'СДЮСШ «Олимп»', firstName: '', middleName: '',
            inn: '30101200100404', birthDate: '', sex: 'М',
            phone: '+996555445566', email: 'olimp@example.kg',
            sport: '', org: 'СДЮСШ «Олимп»',
        },
    },
}

/** «Гость» — состояние до авторизации: доступен только публичный портал. */
export const GUEST = {
    key: null,
    label: 'Гость (не авторизован)',
    shortLabel: 'Гость',
    name: 'Гость',
    icon: '',
    initials: 'Г',
    description: 'Для подачи заявлений и работы в кабинетах требуется вход',
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
        '/staff', '/medical-certificates', '/stipends', '/finance',
        '/applications', '/trainer-applications', '/award-applications', '/judge-applications', '/restoration-applications', '/accreditation-applications', '/transfer-applications', '/protocol-submissions', '/tarifications', '/staffing-plans', '/coach-schedules', '/calendar-plans', '/sports-registry', '/signer-delegation', '/awards', '/zt', '/reports', '/analytics', '/settings',
        ...INTRANET_ROUTES,
    ],
    admin: [
        '/dashboard', '/settings',
        ...INTRANET_ROUTES,
    ],
    employee: [
        '/dashboard', '/athletes', '/coaches', '/judges',
        '/organizations', '/facilities', '/events', '/teams',
        '/staff', '/medical-certificates', '/stipends', '/finance',
        '/applications', '/trainer-applications', '/award-applications', '/judge-applications', '/restoration-applications', '/accreditation-applications', '/transfer-applications', '/protocol-submissions', '/tarifications', '/staffing-plans', '/coach-schedules', '/calendar-plans', '/sports-registry', '/signer-delegation', '/awards', '/zt', '/reports', '/analytics',
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

const ROLE_STORAGE_KEY = 'esport_role'

export function RoleProvider({ children }) {
    // До входа пользователь — «Гость»: роль появляется только после авторизации
    // (демо-карточки на /public/login имитируют вход через «Түндүк» ЕСИ).
    // Роль хранится в localStorage, чтобы сессия переживала перезагрузку страницы.
    const [currentRole, setCurrentRoleState] = useState(() => {
        try {
            const saved = localStorage.getItem(ROLE_STORAGE_KEY)
            return saved && ROLES[saved] ? saved : null
        } catch { return null }
    })

    const setCurrentRole = (key) => {
        setCurrentRoleState(key)
        try {
            if (key) localStorage.setItem(ROLE_STORAGE_KEY, key)
            else localStorage.removeItem(ROLE_STORAGE_KEY)
        } catch { /* ignore */ }
    }

    const role = ROLES[currentRole] || GUEST
    const allowedRoutes = ROLE_ROUTES[currentRole] || []
    const isLoggedIn = !!currentRole

    const hasAccess = (path) => allowedRoutes.includes(path)

    const logout = () => {
        setCurrentRole(null)
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
