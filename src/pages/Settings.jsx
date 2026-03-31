import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import { useRole } from '../context/RoleContext'
import './Settings.css'
import Breadcrumbs from '../components/Breadcrumbs'

/* ══════════════════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════════════════ */
const USERS = [
    { id: 1, name: 'Иванов Алексей Кайратович', login: 'a.ivanov', email: 'a.ivanov@sport.gov.kg', phone: '+996 312 62-34-10', role: 'superadmin', dept: 'ИТ-отдел', lastLogin: '12.03.2026 10:23', ip: '192.168.1.100', status: 'active', created: '01.01.2024' },
    { id: 2, name: 'Петрова Наталья Сергеевна', login: 'n.petrova', email: 'n.petrova@sport.gov.kg', phone: '+996 312 62-34-11', role: 'admin', dept: 'ИТ-отдел', lastLogin: '12.03.2026 09:47', ip: '192.168.1.101', status: 'active', created: '15.02.2024' },
    { id: 3, name: 'Сидоров Максим Борисович', login: 'm.sidorov', email: 'm.sidorov@sport.gov.kg', phone: '+996 312 62-34-12', role: 'employee', dept: 'Отдел реестров', lastLogin: '12.03.2026 08:58', ip: '192.168.1.102', status: 'active', created: '01.03.2024' },
    { id: 4, name: 'Кадырова Айгуль Маратовна', login: 'a.kadyrova', email: 'a.kadyrova@sport.gov.kg', phone: '+996 312 62-34-13', role: 'employee', dept: 'Отдел мероприятий', lastLogin: '11.03.2026 17:45', ip: '192.168.1.103', status: 'active', created: '10.04.2024' },
    { id: 5, name: 'Асанов Мирлан Бакытович', login: 'm.asanov', email: 'm.asanov@sport.gov.kg', phone: '+996 312 62-34-14', role: 'employee', dept: 'Отдел реестров', lastLogin: '10.03.2026 14:12', ip: '192.168.1.104', status: 'active', created: '20.05.2024' },
    { id: 6, name: 'Турсунова Назгуль Акматовна', login: 'n.tursunova', email: 'n.tursunova@sport.gov.kg', phone: '+996 312 62-34-15', role: 'readonly', dept: 'Юридический отдел', lastLogin: '08.03.2026 11:30', ip: '192.168.1.105', status: 'active', created: '01.06.2024' },
    { id: 7, name: 'Жумабеков Эрлан Канатович', login: 'e.zhumabekov', email: 'e.zhumabekov@sport.gov.kg', phone: '+996 312 62-34-16', role: 'employee', dept: 'Отдел мероприятий', lastLogin: '01.02.2026 09:00', ip: '192.168.1.106', status: 'blocked', created: '15.07.2024' },
    { id: 8, name: 'Бакиров Данияр Толонович', login: 'd.bakirov', email: 'd.bakirov@sport.gov.kg', phone: '+996 312 62-34-17', role: 'readonly', dept: 'Приёмная', lastLogin: '-', ip: '-', status: 'inactive', created: '01.03.2026' },
]

const ROLE_LABELS = {
    superadmin: { labelKey: 'settings.roles.superadmin', cls: 'st-role--super' },
    admin: { labelKey: 'settings.roles.admin', cls: 'st-role--admin' },
    employee: { labelKey: 'settings.roles.employee', cls: 'st-role--employee' },
    readonly: { labelKey: 'settings.roles.readonly', cls: 'st-role--readonly' },
}

const STATUS_LABELS = {
    active: { labelKey: 'settings.userStatus.active', cls: 'st-ustatus--active' },
    blocked: { labelKey: 'settings.userStatus.blocked', cls: 'st-ustatus--blocked' },
    inactive: { labelKey: 'settings.userStatus.notActivated', cls: 'st-ustatus--inactive' },
}

const MODULES = [
    'Спортсмены', 'Тренеры', 'Судьи', 'Заявки на звания',
    'Регистрация тренеров', 'Мероприятия', 'Организации', 'Сборные',
    'Аналитика', 'Администрирование',
]

const MODULE_I18N_KEYS = {
    'Спортсмены': 'settings.modules.athletes',
    'Тренеры': 'settings.modules.coaches',
    'Судьи': 'settings.modules.judges',
    'Заявки на звания': 'settings.modules.applications',
    'Регистрация тренеров': 'settings.modules.coaches',
    'Мероприятия': 'settings.modules.events',
    'Организации': 'settings.modules.organizations',
    'Сборные': 'settings.modules.teams',
    'Аналитика': 'settings.modules.analytics',
    'Администрирование': 'settings.modules.system',
}

const PERM_ROLES = ['superadmin', 'admin', 'employee', 'readonly']
const PERM_ROLE_LABEL_KEYS = { superadmin: 'settings.roles.superadmin', admin: 'settings.roles.admin', employee: 'settings.roles.employee', readonly: 'settings.roles.readonly' }

function initPerms() {
    const p = {}
    MODULES.forEach(m => {
        p[m] = {}
        PERM_ROLES.forEach(r => {
            if (r === 'superadmin') p[m][r] = { view: true, edit: true, del: true }
            else if (r === 'admin') p[m][r] = { view: true, edit: m === 'Администрирование', del: m === 'Администрирование' }
            else if (r === 'employee') p[m][r] = { view: m !== 'Администрирование', edit: !['Аналитика', 'Администрирование'].includes(m), del: false }
            else p[m][r] = { view: !['Администрирование'].includes(m), edit: false, del: false }
        })
    })
    return p
}

const ACTION_TYPES = {
    create: { labelKey: 'settings.actionTypes.create', cls: 'st-atype--create' },
    edit: { labelKey: 'settings.actionTypes.edit', cls: 'st-atype--edit' },
    delete: { labelKey: 'settings.actionTypes.delete', cls: 'st-atype--delete' },
    login: { labelKey: 'settings.actionTypes.login', cls: 'st-atype--login' },
    export: { labelKey: 'settings.actionTypes.export', cls: 'st-atype--export' },
}

const LOG_ENTRIES = [
    { dt: '12.03.2026 10:23', user: 'Иванов А.К.', action: 'login', module: 'Система', object: 'Сессия #4892', ip: '192.168.1.100' },
    { dt: '12.03.2026 10:18', user: 'Петрова Н.С.', action: 'edit', module: 'Тренеры', object: 'Бекбоев Н.Т. - обновлён статус', ip: '192.168.1.101' },
    { dt: '12.03.2026 10:05', user: 'Сидоров М.Б.', action: 'create', module: 'Спортсмены', object: 'Ормонов А.К. - новая запись', ip: '192.168.1.102' },
    { dt: '12.03.2026 09:47', user: 'Иванов А.К.', action: 'create', module: 'Мероприятия', object: 'Кубок Президента КР 2026', ip: '192.168.1.100' },
    { dt: '12.03.2026 09:32', user: 'Сидоров М.Б.', action: 'edit', module: 'Спортсмены', object: 'Джумабаев А.М. - обновлены данные', ip: '192.168.1.102' },
    { dt: '12.03.2026 09:15', user: 'Петрова Н.С.', action: 'edit', module: 'Судьи', object: 'Осмонова Г.А. - Национальная категория', ip: '192.168.1.101' },
    { dt: '12.03.2026 08:58', user: 'Сидоров М.Б.', action: 'login', module: 'Система', object: 'Сессия #4891', ip: '192.168.1.102' },
    { dt: '11.03.2026 17:45', user: 'Кадырова А.М.', action: 'export', module: 'Аналитика', object: 'Отчёт за Q1 2026', ip: '192.168.1.103' },
    { dt: '11.03.2026 16:30', user: 'Петрова Н.С.', action: 'edit', module: 'Заявки на звания', object: 'AW-20260306-041 - утверждена', ip: '192.168.1.101' },
    { dt: '11.03.2026 15:20', user: 'Асанов М.Б.', action: 'create', module: 'Тренеры', object: 'Турсунова Н.А. - регистрация', ip: '192.168.1.104' },
    { dt: '11.03.2026 14:10', user: 'Сидоров М.Б.', action: 'edit', module: 'Организации', object: 'Федерация бокса КР - обновлены данные', ip: '192.168.1.102' },
    { dt: '11.03.2026 12:00', user: 'Кадырова А.М.', action: 'login', module: 'Система', object: 'Сессия #4890', ip: '192.168.1.103' },
    { dt: '10.03.2026 16:45', user: 'Иванов А.К.', action: 'delete', module: 'Спортсмены', object: 'Тестовая запись (дубликат)', ip: '192.168.1.100' },
    { dt: '10.03.2026 15:30', user: 'Петрова Н.С.', action: 'edit', module: 'Регистрация тренеров', object: 'ТР-20260307-017 - утверждена', ip: '192.168.1.101' },
    { dt: '10.03.2026 14:12', user: 'Асанов М.Б.', action: 'login', module: 'Система', object: 'Сессия #4889', ip: '192.168.1.104' },
    { dt: '10.03.2026 11:00', user: 'Сидоров М.Б.', action: 'create', module: 'Сборные', object: 'Сборная КР по гимнастике (жен.)', ip: '192.168.1.102' },
    { dt: '09.03.2026 17:20', user: 'Иванов А.К.', action: 'edit', module: 'Администрирование', object: 'Роль «Сотрудник» - обновлены права', ip: '192.168.1.100' },
    { dt: '09.03.2026 16:00', user: 'Петрова Н.С.', action: 'create', module: 'Судьи', object: 'Эсенов Б.Т. - новая запись', ip: '192.168.1.101' },
    { dt: '09.03.2026 14:30', user: 'Кадырова А.М.', action: 'edit', module: 'Мероприятия', object: 'Спартакиада школьников - обновлены данные', ip: '192.168.1.103' },
    { dt: '08.03.2026 11:30', user: 'Турсунова Н.А.', action: 'login', module: 'Система', object: 'Сессия #4888', ip: '192.168.1.105' },
    { dt: '08.03.2026 10:15', user: 'Иванов А.К.', action: 'export', module: 'Спортсмены', object: 'Реестр спортсменов (полный)', ip: '192.168.1.100' },
    { dt: '07.03.2026 16:40', user: 'Сидоров М.Б.', action: 'edit', module: 'Спортсмены', object: 'Кулбаев А.Т. - обновлена медсправка', ip: '192.168.1.102' },
    { dt: '07.03.2026 14:00', user: 'Петрова Н.С.', action: 'delete', module: 'Заявки на звания', object: 'AW-20260303-040 - отклонена', ip: '192.168.1.101' },
    { dt: '06.03.2026 12:30', user: 'Асанов М.Б.', action: 'create', module: 'Спортсмены', object: 'Бейшеналиев Д.К. - обновлён разряд', ip: '192.168.1.104' },
    { dt: '06.03.2026 09:00', user: 'Иванов А.К.', action: 'login', module: 'Система', object: 'Сессия #4887', ip: '192.168.1.100' },
]

const TABS = [
    { key: 'users', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, labelKey: 'settings.tabs.users' },
    { key: 'roles', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, labelKey: 'settings.tabs.roles' },
    { key: 'log', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>, labelKey: 'settings.tabs.auditLog' },
    { key: 'system', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, labelKey: 'settings.tabs.system' },
]

export default function Settings() {
    const { t } = useTranslation()
    const toast = useToast()
    const { currentRole } = useRole()
    const [tab, setTab] = useState('users')
    const [drawer, setDrawer] = useState(null)
    const [showAddUser, setShowAddUser] = useState(false)
    const [perms, setPerms] = useState(initPerms)

    /* Log filters */
    const [logSearch, setLogSearch] = useState('')
    const [logAction, setLogAction] = useState('')
    const [logModule, setLogModule] = useState('')

    /* System settings */
    const [sysName] = useState('АИС eSport')
    const [sysFullName] = useState('Автоматизированная информационная система ГАФКиС КР')
    const [supportEmail, setSupportEmail] = useState('support@sport.gov.kg')
    const [supportPhone, setSupportPhone] = useState('+996 (312) 62-34-12')
    const [sysAddress, setSysAddress] = useState('г. Бишкек, ул. Московская 189')
    const [minPwdLen, setMinPwdLen] = useState(8)
    const [pwdExpiry, setPwdExpiry] = useState('90')
    const [maxAttempts, setMaxAttempts] = useState(5)
    const [lockOnFail, setLockOnFail] = useState(true)
    const [sessionTime, setSessionTime] = useState('60')
    const [twoFa, setTwoFa] = useState(false)

    /* Access check */
    if (!['superadmin', 'admin'].includes(currentRole)) {
        return (
            <div className="st-access-denied">
                <div style={{ width: 56, height: 56, borderRadius: 28, background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                <h2>{t('settings.accessDenied')}</h2>
                <p>{t('settings.accessDeniedDesc')}</p>
            </div>
        )
    }

    const togglePerm = (mod, role, perm) => {
        if (role === 'superadmin') return
        setPerms(prev => {
            const next = JSON.parse(JSON.stringify(prev))
            next[mod][role][perm] = !next[mod][role][perm]
            return next
        })
    }

    const filteredLog = LOG_ENTRIES.filter(e => {
        if (logSearch && !e.user.toLowerCase().includes(logSearch.toLowerCase())) return false
        if (logAction && e.action !== logAction) return false
        if (logModule && e.module !== logModule) return false
        return true
    })

    const activeUsers = USERS.filter(u => u.status === 'active').length
    const blockedUsers = USERS.filter(u => u.status === 'blocked').length
    const onlineNow = 3

    return (
        <div className="st">
            <Breadcrumbs current={t('settings.title')} />
            {/* ── Tabs ── */}
            <div className="st-tabs">
                {TABS.map(tb => (
                    <button key={tb.key}
                        className={`st-tab ${tab === tb.key ? 'st-tab--active' : ''}`}
                        onClick={() => setTab(tb.key)}>
                        <span>{tb.icon}</span> {t(tb.labelKey)}
                    </button>
                ))}
            </div>

            {/* ═══════════════════════════════════════════
               TAB: USERS
               ═══════════════════════════════════════════ */}
            {tab === 'users' && (
                <div>
                    <div className="st-section-header">
                        <h2 className="st-section-title">{t('settings.users.title')}</h2>
                        <button className="st-add-btn" onClick={() => setShowAddUser(true)}>{t('settings.users.addUser')}</button>
                    </div>

                    <div className="st-metrics">
                        <div className="st-metric"><span className="st-metric__icon st-metric__icon--blue">{MetricIcons.users()}</span><div className="st-metric__info"><span className="st-metric__val">{USERS.length}</span><span className="st-metric__lbl">{t('settings.users.total')}</span></div></div>
                        <div className="st-metric"><span className="st-metric__icon st-metric__icon--green">{MetricIcons.active()}</span><div className="st-metric__info"><span className="st-metric__val">{activeUsers}</span><span className="st-metric__lbl">{t('settings.users.active')}</span></div></div>
                        <div className="st-metric"><span className="st-metric__icon st-metric__icon--red">{MetricIcons.blocked()}</span><div className="st-metric__info"><span className="st-metric__val">{blockedUsers}</span><span className="st-metric__lbl">{t('settings.users.blocked')}</span></div></div>
                        <div className="st-metric"><span className="st-metric__icon st-metric__icon--amber">{MetricIcons.online()}</span><div className="st-metric__info"><span className="st-metric__val">{onlineNow}</span><span className="st-metric__lbl">{t('settings.users.online')}</span></div></div>
                    </div>

                    <div className="st-table-wrap">
                        <table className="st-table">
                            <thead>
                                <tr>
                                    <th>{t('common.name')}</th>
                                    <th>{t('settings.usersTable.login')}</th>
                                    <th>{t('settings.usersTable.role')}</th>
                                    <th>{t('settings.usersTable.department')}</th>
                                    <th>{t('settings.usersTable.lastLogin')}</th>
                                    <th>{t('common.status')}</th>
                                    <th>{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {USERS.map(u => (
                                    <tr key={u.id} className="st-table__row" onClick={() => setDrawer(u)}>
                                        <td>
                                            <div className="st-user-cell">
                                                <div className="st-user-avatar">{u.name.charAt(0)}{u.name.split(' ')[1]?.charAt(0) || ''}</div>
                                                <span className="st-user-name">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="st-table__mono">{u.login}</td>
                                        <td><span className={`st-role ${ROLE_LABELS[u.role]?.cls || ''}`}>{ROLE_LABELS[u.role]?.labelKey ? t(ROLE_LABELS[u.role].labelKey) : u.role}</span></td>
                                        <td>{u.dept}</td>
                                        <td className="st-table__muted">{u.lastLogin}</td>
                                        <td><span className={`st-ustatus ${STATUS_LABELS[u.status].cls}`}>{t(STATUS_LABELS[u.status].labelKey)}</span></td>
                                        <td>
                                            <div className="st-actions-cell">
                                                <button className="st-action-btn" onClick={e => { e.stopPropagation(); setDrawer(u) }}>{t('common.edit')}</button>
                                                <button className="st-action-btn st-action-btn--warn" onClick={e => { e.stopPropagation(); toast(`${u.status === 'blocked' ? t('settings.userActions.unblock') : t('settings.userActions.block')}: ${u.name}`) }}>
                                                    {u.status === 'blocked' ? t('settings.userActions.unblock') : t('settings.userActions.block')}
                                                </button>
                                                <button className="st-action-btn" onClick={e => { e.stopPropagation(); toast(`${t('settings.userActions.resetPassword')}: ${u.name}`) }}>{t('settings.userActions.resetPassword')}</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════
               TAB: ROLES & PERMISSIONS
               ═══════════════════════════════════════════ */}
            {tab === 'roles' && (
                <div>
                    <h2 className="st-section-title">{t('settings.permissions.title')}</h2>
                    <div className="st-table-wrap">
                        <table className="st-table st-perm-table">
                            <thead>
                                <tr>
                                    <th>{t('settings.auditTable.module')}</th>
                                    {PERM_ROLES.map(r => (
                                        <th key={r} colSpan="3" className="st-perm-role-th">{t(PERM_ROLE_LABEL_KEYS[r])}</th>
                                    ))}
                                </tr>
                                <tr>
                                    <th></th>
                                    {PERM_ROLES.map(r => (
                                        <React.Fragment key={r}>
                                            <th className="st-perm-sub-th">{t('settings.permissions.view')}</th>
                                            <th className="st-perm-sub-th">{t('settings.permissions.edit')}</th>
                                            <th className="st-perm-sub-th">{t('settings.permissions.delete')}</th>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MODULES.map(mod => (
                                    <tr key={mod}>
                                        <td className="st-perm-module">{MODULE_I18N_KEYS[mod] ? t(MODULE_I18N_KEYS[mod]) : mod}</td>
                                        {PERM_ROLES.map(r => (
                                            <React.Fragment key={r}>
                                                {['view', 'edit', 'del'].map(p => (
                                                    <td key={p} className="st-perm-cell">
                                                        <input
                                                            type="checkbox"
                                                            className="st-perm-cb"
                                                            checked={perms[mod]?.[r]?.[p] || false}
                                                            disabled={r === 'superadmin'}
                                                            onChange={() => togglePerm(mod, r, p)}
                                                        />
                                                    </td>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button className="st-save-btn" onClick={() => toast('Права сохранены (демо)')}>{t('settings.permissions.save')}</button>
                </div>
            )}

            {/* ═══════════════════════════════════════════
               TAB: AUDIT LOG
               ═══════════════════════════════════════════ */}
            {tab === 'log' && (
                <div>
                    <div className="st-section-header">
                        <h2 className="st-section-title">{t('settings.auditLog.title')}</h2>
                        <button className="st-export-btn" onClick={() => toast('Экспорт журнала - в разработке')}>Экспорт журнала</button>
                    </div>

                    <div className="st-log-filters">
                        <input className="st-filter-input" placeholder="Поиск по пользователю..." value={logSearch} onChange={e => setLogSearch(e.target.value)} />
                        <select className="st-filter-select" value={logAction} onChange={e => setLogAction(e.target.value)}>
                            <option value="">Все действия</option>
                            {Object.entries(ACTION_TYPES).map(([k, v]) => <option key={k} value={k}>{t(v.labelKey)}</option>)}
                        </select>
                        <select className="st-filter-select" value={logModule} onChange={e => setLogModule(e.target.value)}>
                            <option value="">Все модули</option>
                            {[...new Set(LOG_ENTRIES.map(e => e.module))].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <div className="st-table-wrap">
                        <table className="st-table">
                            <thead>
                                <tr>
                                    <th>{t('settings.auditTable.datetime')}</th>
                                    <th>{t('settings.auditTable.user')}</th>
                                    <th>{t('settings.auditTable.action')}</th>
                                    <th>{t('settings.auditTable.module')}</th>
                                    <th>{t('settings.auditTable.object')}</th>
                                    <th>{t('settings.auditTable.ip')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLog.map((e, i) => (
                                    <tr key={i}>
                                        <td className="st-table__mono">{e.dt}</td>
                                        <td className="st-table__bold">{e.user}</td>
                                        <td><span className={`st-atype ${ACTION_TYPES[e.action]?.cls || ''}`}>{ACTION_TYPES[e.action]?.labelKey ? t(ACTION_TYPES[e.action].labelKey) : e.action}</span></td>
                                        <td>{e.module}</td>
                                        <td className="st-table__muted">{e.object}</td>
                                        <td className="st-table__mono">{e.ip}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="st-log-note">
                        <div><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{verticalAlign:'middle',marginRight:4}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Журнал ведётся в соответствии с Постановлениями КР №760 и №762 от 21.11.2017</div>
                        <div><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{verticalAlign:'middle',marginRight:4}}><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="21" x2="8" y2="3"/></svg> Срок хранения журнала: 5 лет</div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════
               TAB: SYSTEM SETTINGS
               ═══════════════════════════════════════════ */}
            {tab === 'system' && (
                <div>
                    <h2 className="st-section-title">{t('settings.tabs.system')}</h2>

                    <div className="st-settings-row">
                        {/* Left: General */}
                        <div className="st-settings-card">
                            <h3 className="st-settings-card__title">{t('settings.systemMain')}</h3>
                            <div className="st-form-group">
                                <label className="st-form-label">{t('settings.sysForm.systemName')}</label>
                                <input className="st-form-input" value={sysName} readOnly />
                            </div>
                            <div className="st-form-group">
                                <label className="st-form-label">{t('settings.sysForm.fullName')}</label>
                                <input className="st-form-input" value={sysFullName} readOnly />
                            </div>
                            <div className="st-form-group">
                                <label className="st-form-label">{t('settings.sysForm.version')}</label>
                                <input className="st-form-input st-form-input--readonly" value="1.0.0" readOnly />
                            </div>
                            <div className="st-form-group">
                                <label className="st-form-label">{t('settings.sysForm.supportEmail')}</label>
                                <input className="st-form-input" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} />
                            </div>
                            <div className="st-form-group">
                                <label className="st-form-label">{t('fields.phone')}</label>
                                <input className="st-form-input" value={supportPhone} onChange={e => setSupportPhone(e.target.value)} />
                            </div>
                            <div className="st-form-group">
                                <label className="st-form-label">{t('settings.sysForm.gafkisAddress')}</label>
                                <input className="st-form-input" value={sysAddress} onChange={e => setSysAddress(e.target.value)} />
                            </div>
                        </div>

                        {/* Right: Security */}
                        <div className="st-settings-card">
                            <h3 className="st-settings-card__title">{t('settings.systemSecurity')}</h3>
                            <div className="st-form-group">
                                <label className="st-form-label">{t('settings.sysForm.minPasswordLength')}</label>
                                <input className="st-form-input" type="number" min="6" max="32" value={minPwdLen} onChange={e => setMinPwdLen(+e.target.value)} />
                            </div>
                            <div className="st-form-group">
                                <label className="st-form-label">{t('settings.sysForm.passwordExpiry')}</label>
                                <select className="st-form-input" value={pwdExpiry} onChange={e => setPwdExpiry(e.target.value)}>
                                    <option value="30">30 дней</option>
                                    <option value="60">60 дней</option>
                                    <option value="90">90 дней</option>
                                    <option value="180">180 дней</option>
                                    <option value="0">Не ограничен</option>
                                </select>
                            </div>
                            <div className="st-form-group">
                                <label className="st-form-label">{t('settings.sysForm.maxLoginAttempts')}</label>
                                <input className="st-form-input" type="number" min="3" max="10" value={maxAttempts} onChange={e => setMaxAttempts(+e.target.value)} />
                            </div>
                            <div className="st-form-group st-form-toggle-row">
                                <label className="st-form-label">{t('settings.sysForm.lockAfterFailed')}</label>
                                <button className={`st-toggle ${lockOnFail ? 'st-toggle--on' : ''}`} onClick={() => setLockOnFail(!lockOnFail)}>
                                    <span className="st-toggle__knob" />
                                </button>
                            </div>
                            <div className="st-form-group">
                                <label className="st-form-label">{t('settings.sysForm.sessionTime')}</label>
                                <select className="st-form-input" value={sessionTime} onChange={e => setSessionTime(e.target.value)}>
                                    <option value="30">30 минут</option>
                                    <option value="60">1 час</option>
                                    <option value="240">4 часа</option>
                                    <option value="480">8 часов</option>
                                </select>
                            </div>
                            <div className="st-form-group st-form-toggle-row">
                                <label className="st-form-label">{t('settings.sysForm.twoFactor')}</label>
                                <button className={`st-toggle ${twoFa ? 'st-toggle--on' : ''}`} onClick={() => setTwoFa(!twoFa)}>
                                    <span className="st-toggle__knob" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Integrations */}
                    <div className="st-settings-card" style={{ marginTop: 20 }}>
                        <h3 className="st-settings-card__title">Интеграции</h3>
                        <div className="st-integrations">
                            {[
                                { name: 'СМЭВ «Түндүк» ЕСИ', status: 'connected', icon: <span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:'#34C759'}}></span> },
                                { name: 'АИС Е-Кызмат', status: 'setup', icon: <span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:'#FF9500'}}></span> },
                                { name: 'МЗ КР (медсправки)', status: 'disconnected', icon: <span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:'#FF3B30'}}></span> },
                                { name: 'WMS Геосервис', status: 'setup', icon: <span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:'#FF9500'}}></span> },
                            ].map(intg => (
                                <div key={intg.name} className="st-integration">
                                    <span className="st-integration__icon">{intg.icon}</span>
                                    <span className="st-integration__name">{intg.name}</span>
                                    <span className={`st-integration__status st-integration__status--${intg.status}`}>
                                        {{ connected: t('settings.integrations.connected'), setup: t('settings.integrations.settings'), disconnected: t('settings.integrations.notConnected') }[intg.status]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="st-save-btn" style={{ marginTop: 20 }} onClick={() => toast('Настройки сохранены (демо)')}>{t('common.save')}</button>
                </div>
            )}

            {/* ── User Drawer ── */}
            {drawer && (
                <>
                    <div className="st-overlay" onClick={() => setDrawer(null)} />
                    <div className="st-drawer">
                        <div className="st-drawer__header">
                            <h2 className="st-drawer__title">{t('settings.userDrawer.title')}</h2>
                            <button className="st-close-btn" onClick={() => setDrawer(null)}>✕</button>
                        </div>
                        <div className="st-drawer__body">
                            <div className="st-drawer-avatar">{drawer.name.charAt(0)}{drawer.name.split(' ')[1]?.charAt(0) || ''}</div>
                            <div className="st-drawer-name">{drawer.name}</div>
                            <span className={`st-role ${ROLE_LABELS[drawer.role]?.cls || ''}`} style={{ marginBottom: 20, display: 'inline-block' }}>{ROLE_LABELS[drawer.role]?.labelKey ? t(ROLE_LABELS[drawer.role].labelKey) : drawer.role}</span>

                            <div className="st-info-grid">
                                <div className="st-info-item"><div className="st-info-label">{t('settings.userDrawerInfo.login')}</div><div className="st-info-value" style={{ fontFamily: 'monospace' }}>{drawer.login}</div></div>
                                <div className="st-info-item"><div className="st-info-label">{t('fields.email')}</div><div className="st-info-value">{drawer.email}</div></div>
                                <div className="st-info-item"><div className="st-info-label">{t('fields.phone')}</div><div className="st-info-value">{drawer.phone}</div></div>
                                <div className="st-info-item"><div className="st-info-label">{t('settings.userDrawerInfo.department')}</div><div className="st-info-value">{drawer.dept}</div></div>
                                <div className="st-info-item"><div className="st-info-label">{t('settings.userDrawerInfo.createdDate')}</div><div className="st-info-value">{drawer.created}</div></div>
                                <div className="st-info-item"><div className="st-info-label">{t('settings.userDrawerInfo.lastLogin')}</div><div className="st-info-value">{drawer.lastLogin}</div></div>
                                <div className="st-info-item" style={{ gridColumn: '1 / -1' }}><div className="st-info-label">{t('settings.userDrawerInfo.lastIp')}</div><div className="st-info-value" style={{ fontFamily: 'monospace' }}>{drawer.ip}</div></div>
                            </div>

                            <div className="st-form-group">
                                <label className="st-form-label">{t('settings.usersTable.role')}</label>
                                <select className="st-form-input" defaultValue={drawer.role}>
                                    <option value="superadmin">{t('settings.roles.superadmin')}</option>
                                    <option value="admin">{t('settings.roles.admin')}</option>
                                    <option value="employee">{t('settings.roles.employee')}</option>
                                    <option value="readonly">{t('settings.roles.readonly')}</option>
                                </select>
                            </div>
                            <div className="st-form-group">
                                <label className="st-form-label">{t('settings.usersTable.department')}</label>
                                <select className="st-form-input" defaultValue={drawer.dept}>
                                    <option>ИТ-отдел</option>
                                    <option>Отдел реестров</option>
                                    <option>Отдел мероприятий</option>
                                    <option>Юридический отдел</option>
                                    <option>Приёмная</option>
                                </select>
                            </div>
                        </div>
                        <div className="st-drawer__footer">
                            <button className="st-btn st-btn--primary" onClick={() => { toast('Сохранено (демо)'); setDrawer(null) }}>{t('common.save')}</button>
                            <button className="st-btn st-btn--warn" onClick={() => toast(`${drawer.status === 'blocked' ? t('settings.userActions.unblock') : t('settings.userActions.block')}: ${drawer.name}`)}>
                                {drawer.status === 'blocked' ? t('settings.userActions.unblock') : t('settings.userActions.block')}
                            </button>
                            <button className="st-btn st-btn--secondary" onClick={() => toast(`${t('settings.userActions.resetPassword')}: ${drawer.name}`)}>{t('settings.userActions.resetPassword')}</button>
                        </div>
                    </div>
                </>
            )}

            {/* ── Add User Modal ── */}
            {showAddUser && (
                <>
                    <div className="st-overlay" onClick={() => setShowAddUser(false)} />
                    <div className="st-modal">
                        <div className="st-modal__header">
                            <h2 className="st-modal__title">{t('settings.newUser.title')}</h2>
                            <button className="st-close-btn" onClick={() => setShowAddUser(false)}>✕</button>
                        </div>
                        <div className="st-modal__body">
                            <div className="st-form-grid">
                                <div className="st-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="st-form-label">{t('common.name')} *</label>
                                    <input className="st-form-input" placeholder="Фамилия Имя Отчество" />
                                </div>
                                <div className="st-form-group">
                                    <label className="st-form-label">{t('settings.newUserForm.login')} *</label>
                                    <input className="st-form-input" placeholder="i.ivanov" />
                                </div>
                                <div className="st-form-group">
                                    <label className="st-form-label">{t('fields.email')} *</label>
                                    <input className="st-form-input" type="email" placeholder="user@sport.gov.kg" />
                                </div>
                                <div className="st-form-group">
                                    <label className="st-form-label">{t('settings.usersTable.role')} *</label>
                                    <select className="st-form-input">
                                        <option value="employee">{t('settings.roles.employee')}</option>
                                        <option value="admin">{t('settings.roles.admin')}</option>
                                        <option value="readonly">{t('settings.roles.readonly')}</option>
                                    </select>
                                </div>
                                <div className="st-form-group">
                                    <label className="st-form-label">{t('settings.usersTable.department')} *</label>
                                    <select className="st-form-input">
                                        <option>ИТ-отдел</option>
                                        <option>Отдел реестров</option>
                                        <option>Отдел мероприятий</option>
                                        <option>Юридический отдел</option>
                                        <option>Приёмная</option>
                                    </select>
                                </div>
                                <div className="st-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="st-form-label">{t('settings.newUserForm.tempPassword')} *</label>
                                    <input className="st-form-input" type="password" placeholder="Минимум 8 символов" />
                                </div>
                            </div>
                        </div>
                        <div className="st-modal__footer">
                            <button className="st-btn st-btn--secondary" onClick={() => setShowAddUser(false)}>{t('common.cancel')}</button>
                            <button className="st-btn st-btn--primary" onClick={() => { toast('Пользователь создан (демо)'); setShowAddUser(false) }}>{t('common.save')}</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
