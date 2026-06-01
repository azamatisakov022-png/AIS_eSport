import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRole } from '../context/RoleContext'
import { useTheme } from '../context/ThemeContext'

/* ══════════════════════════════════════════════════════
   MOCK DATA - Athlete: Айбек Джумабаев
   ══════════════════════════════════════════════════════ */
const ATHLETE = {
    firstName: 'Айбек', lastName: 'Джумабаев', patronymic: 'Маратович',
    dob: '12.05.1999', gender: 'Мужской', region: 'Бишкек',
    phone: '+996 555 78 90 12', email: 'aibek.j@mail.kg',
    inn: '22605199900123', sport: 'Бокс',
    currentRank: 'МС КР', currentRankDate: '10.03.2024', currentRankSport: 'Бокс', currentRankNo: 'УД-КР-2024-0312',
}

const RANKS_HISTORY = [
    { rank: 'МС КР', date: '10.03.2024', sport: 'Бокс', docNo: 'УД-КР-2024-0312' },
    { rank: 'КМС', date: '15.06.2022', sport: 'Бокс', docNo: 'УД-КР-2022-0189' },
    { rank: 'I разряд', date: '20.01.2021', sport: 'Бокс', docNo: 'УД-КР-2021-0045' },
]

const ATH_MEDICAL = {
    statusLabel: 'Истекает скоро',
    issued: '15.04.2025', expires: '15.04.2026', issuer: 'РЦСМ г. Бишкек',
    daysLeft: 20, totalDays: 365,
}

const ATH_EVENTS = [
    { title: 'Чемпионат КР по боксу', date: '2026-02-20', place: 'г. Бишкек', result: '2-е место', rankConfirmed: true, past: true },
    { title: 'Международный турнир «Шёлковый путь»', date: '2025-11-10', place: 'г. Бишкек', result: '1-е место', rankConfirmed: true, past: true },
    { title: 'Чемпионат Азии по боксу', date: '2026-04-15', place: 'г. Ташкент', result: null, rankConfirmed: false, past: false },
    { title: 'Кубок Президента КР', date: '2026-05-20', place: 'г. Бишкек', result: null, rankConfirmed: false, past: false },
]

const ATH_TRAININGS = [
    { date: '10.03.2026', coach: 'Алымкулов Б.С.', type: 'Спарринг', duration: '2 часа' },
    { date: '08.03.2026', coach: 'Алымкулов Б.С.', type: 'ОФП', duration: '1.5 часа' },
    { date: '06.03.2026', coach: 'Исаков Ж.М.', type: 'Техника', duration: '2 часа' },
    { date: '05.03.2026', coach: 'Алымкулов Б.С.', type: 'Спарринг', duration: '2 часа' },
    { date: '03.03.2026', coach: 'Исаков Ж.М.', type: 'ОФП', duration: '1.5 часа' },
]

const ATH_COACHES = [
    { name: 'Алымкулов Бакыт Сапарович', sport: 'Бокс', type: 'Главный тренер' },
    { name: 'Исаков Жолдошбек Маратович', sport: 'Бокс', type: 'Личный тренер' },
    { name: 'Турдубаев Эмиль Кайратович', sport: 'Бокс', type: 'Первый тренер' },
]

const ATH_MEDALS = [
    { medal: 'gold', comp: 'Международный турнир «Шёлковый путь»', date: '2025-11-10', country: 'Кыргызстан' },
    { medal: 'silver', comp: 'Чемпионат КР по боксу 2026', date: '2026-02-20', country: 'Кыргызстан' },
]

const ATH_TEAM = {
    name: 'Сборная КР по боксу (мужчины, взрослые)',
    headCoach: 'Алымкулов Бакыт Сапарович',
    seniorCoach: 'Исаков Жолдошбек Маратович',
    members: ['Джумабаев Айбек', 'Бейшеналиев Данияр', 'Ормонов Алмаз', 'Турдалиев Марат', 'Сатыбеков Нурлан', 'Кулбаев Айбек'],
    nextEvent: { title: 'Чемпионат Азии по боксу', date: '15.04.2026', place: 'г. Ташкент' },
}

const ATH_APPS = [
    { type: 'Присвоение звания', date: '25.02.2026', status: 'На рассмотрении', no: 'AW-20260225-094512', statusCls: 'yellow' },
    { type: 'Медицинская справка', date: '15.04.2025', status: 'Утверждено', no: 'MD-20250415-001', statusCls: 'green' },
]

const ATH_NOTIF = [
    { icon: 'bell', text: 'Ваша заявка AW-20260225-094512 на присвоение звания МСМК принята к рассмотрению', date: '26.02.2026' },
    { icon: 'warn', text: 'Срок медицинской справки истекает через 20 дней. Обновите справку.', date: '25.02.2026' },
    { icon: 'calendar', text: 'Вы включены в состав сборной на Чемпионат Азии по боксу (15.04.2026, Ташкент)', date: '20.02.2026' },
    { icon: 'check', text: 'Звание МС КР подтверждено по результатам Чемпионата КР', date: '22.02.2026' },
]

/* ══════════════════════════════════════════════════════
   MOCK DATA - Coach: Нурлан Бекбоев
   ══════════════════════════════════════════════════════ */
const COACH = {
    firstName: 'Нурлан', lastName: 'Бекбоев', patronymic: 'Токтосунович',
    dob: '03.08.1985', gender: 'Мужской', region: 'Бишкек',
    phone: '+996 700 55 33 11', email: 'n.bekboev@sport.kg',
    inn: '30808198500456', sport: 'Бокс', specialization: 'Бокс - подготовка сборной',
}

const COACH_CERT = {
    no: 'СВ-КР-2023-0847', issued: '15.04.2023', expires: '15.04.2026',
    status: 'Действующее', daysLeft: 34, totalDays: 1095,
}

const COACH_ATHLETES = [
    { name: 'Джумабаев Айбек Маратович', rank: 'МС КР', sport: 'Бокс', medExpiring: false, inTeam: true },
    { name: 'Бейшеналиев Данияр Кубатович', rank: 'МС КР', sport: 'Бокс', medExpiring: true, inTeam: true },
    { name: 'Ормонов Алмаз Кайратович', rank: 'КМС', sport: 'Бокс', medExpiring: false, inTeam: false },
    { name: 'Турдалиев Марат Асанович', rank: 'КМС', sport: 'Бокс', medExpiring: false, inTeam: false },
    { name: 'Кулбаев Айбек Толонович', rank: 'КМС', sport: 'Бокс', medExpiring: true, inTeam: false },
]

const COACH_EVENTS = [
    { title: 'Чемпионат Азии по боксу', date: '2026-04-15', place: 'г. Ташкент', myAthletes: 2, status: 'Предстоящее' },
    { title: 'Кубок Президента КР', date: '2026-05-20', place: 'г. Бишкек', myAthletes: 4, status: 'Предстоящее' },
    { title: 'Чемпионат КР по боксу', date: '2026-02-20', place: 'г. Бишкек', myAthletes: 5, status: 'Завершено' },
]

const COACH_TRAININGS = [
    { date: '10.03.2026', athletes: 'Джумабаев А., Бейшеналиев Д.', type: 'Спарринг', duration: '2 часа' },
    { date: '08.03.2026', athletes: 'Ормонов А., Турдалиев М., Кулбаев А.', type: 'ОФП', duration: '1.5 часа' },
    { date: '06.03.2026', athletes: 'Все', type: 'Техника', duration: '2 часа' },
    { date: '05.03.2026', athletes: 'Джумабаев А., Ормонов А.', type: 'Спарринг', duration: '2 часа' },
]

const COACH_TEAM = {
    assigned: true,
    name: 'Сборная КР по боксу (мужчины, взрослые)',
    role: 'Главный тренер',
    members: ['Джумабаев Айбек', 'Бейшеналиев Данияр', 'Ормонов Алмаз', 'Турдалиев Марат', 'Сатыбеков Нурлан', 'Кулбаев Айбек'],
    nextTrip: { title: 'Чемпионат Азии по боксу', date: '15.04.2026', place: 'г. Ташкент', days: '10–20 апреля' },
}

const COACH_APPS = [
    { type: 'Учётная регистрация', date: '10.04.2023', status: 'Утверждено', no: 'ТР-20230410-001', statusCls: 'green' },
    { type: 'Продление свидетельства', date: '01.03.2026', status: 'На рассмотрении', no: 'ТР-20260301-015', statusCls: 'yellow' },
]

const COACH_NOTIF = [
    { icon: 'warn', text: 'Срок действия свидетельства СВ-КР-2023-0847 истекает через 34 дня. Подайте заявку на продление.', date: '10.03.2026' },
    { icon: 'calendar', text: 'Вы назначены тренером сборной на Чемпионат Азии по боксу (15.04.2026)', date: '05.03.2026' },
    { icon: 'warn', text: 'Медсправка спортсмена Бейшеналиев Д.К. истекает через 15 дней', date: '01.03.2026' },
    { icon: 'check', text: 'Заявка на продление свидетельства принята к рассмотрению', date: '02.03.2026' },
    { icon: 'warn', text: 'Медсправка спортсмена Кулбаев А.Т. истекает через 10 дней', date: '28.02.2026' },
]

/* ══════════════════════════════════════════════════════
   MOCK DATA - Judge: Гульнара Осмонова
   ══════════════════════════════════════════════════════ */
const JUDGE = {
    firstName: 'Гульнара', lastName: 'Осмонова', patronymic: 'Алмазбековна',
    dob: '18.09.1980', gender: 'Женский', region: 'Бишкек',
    phone: '+996 772 44 88 33', email: 'g.osmonova@sport.kg',
    inn: '21809198000789',
    sports: ['Гимнастика', 'Лёгкая атлетика'],
}

const JUDGE_CATEGORY = {
    category: 'Национальная категория',
    categoryColor: 'var(--text-primary)',
    no: 'УД-КР-2024-0234',
    attestationDate: '10.07.2024',
    expires: '10.07.2026',
    daysLeft: 120,
    totalDays: 730,
}

const JUDGE_CATEGORY_HISTORY = [
    { category: 'Национальная категория', date: '10.07.2024', assignedBy: 'ГАФКиС КР - Аттестационная комиссия' },
    { category: 'I категория', date: '05.03.2022', assignedBy: 'ГАФКиС КР - Аттестационная комиссия' },
    { category: 'Судья по спорту', date: '20.11.2019', assignedBy: 'Федерация гимнастики КР' },
]

const JUDGE_EVENTS = [
    { title: 'Чемпионат КР по гимнастике', date: '2026-04-10', place: 'г. Бишкек', judgeRole: 'Главный судья', status: 'Предстоящее', confirmed: false, past: false },
    { title: 'Кубок Президента КР по лёгкой атлетике', date: '2026-05-20', place: 'г. Бишкек', judgeRole: 'Судья в поле', status: 'Предстоящее', confirmed: true, past: false },
    { title: 'Чемпионат КР по лёгкой атлетике', date: '2026-02-15', place: 'г. Бишкек', judgeRole: 'Главный судья', status: 'Завершено', confirmed: true, past: true },
    { title: 'Международный турнир по гимнастике', date: '2025-10-05', place: 'г. Алматы', judgeRole: 'Судья в поле', status: 'Завершено', confirmed: true, past: true },
]

const JUDGE_APPS = [
    { type: 'Повышение категории', date: '01.02.2024', status: 'Утверждено', no: 'JD-20240201-023', statusCls: 'green' },
    { type: 'Восстановление удостоверения', date: '10.03.2026', status: 'На рассмотрении', no: 'JD-20260310-008', statusCls: 'yellow' },
]

const JUDGE_NOTIF = [
    { icon: 'calendar', text: 'Вы назначены Главным судьёй на Чемпионат КР по гимнастике (10.04.2026). Подтвердите участие.', date: '08.03.2026' },
    { icon: 'check', text: 'Ваше участие в Кубке Президента КР по лёгкой атлетике подтверждено.', date: '05.03.2026' },
    { icon: 'bell', text: 'Заявка JD-20260310-008 на восстановление удостоверения принята к рассмотрению.', date: '10.03.2026' },
    { icon: 'warn', text: 'Срок действия удостоверения УД-КР-2024-0234 истекает через 120 дней.', date: '01.03.2026' },
]

/* ── SVG Icons (16x16 duotone, from shared component) ── */
import { CabinetIcons } from '../components/CabinetIcons'
const MI = Object.fromEntries(
    Object.entries(CabinetIcons).map(([key, fn]) => [key, fn(16)])
)
MI.apps = MI.applications
MI.notif = MI.notifications
MI.cert = MI.certificate
MI.ranks = MI.rank
MI.medals = MI.medal

/* ── Menus ── */
const ATHLETE_MENU = [
    { key: 'profile', icon: 'profile', labelKey: 'public.cabMenuProfile' },
    { key: 'ranks', icon: 'ranks', labelKey: 'public.cabMenuRanks' },
    { key: 'medical', icon: 'medical', labelKey: 'public.cabMenuMedical' },
    { key: 'events', icon: 'events', labelKey: 'public.cabMenuEvents' },
    { key: 'training', icon: 'training', labelKey: 'public.cabMenuTraining' },
    { key: 'coaches', icon: 'coaches', labelKey: 'public.cabMenuCoaches' },
    { key: 'medals', icon: 'medals', labelKey: 'public.cabMenuMedals' },
    { key: 'team', icon: 'team', labelKey: 'public.cabMenuTeam' },
    { key: 'apps', icon: 'apps', labelKey: 'public.cabMenuApps' },
    { key: 'notif', icon: 'notif', labelKey: 'public.cabMenuNotif' },
]

const COACH_MENU = [
    { key: 'profile', icon: 'profile', labelKey: 'public.cabMenuProfile' },
    { key: 'cert', icon: 'cert', labelKey: 'public.cabMenuCert' },
    { key: 'athletes', icon: 'athletes', labelKey: 'public.cabMenuAthletes' },
    { key: 'events', icon: 'events', labelKey: 'public.cabMenuEvents' },
    { key: 'training', icon: 'training', labelKey: 'public.cabMenuTraining' },
    { key: 'team', icon: 'team', labelKey: 'public.cabMenuTeam' },
    { key: 'apps', icon: 'apps', labelKey: 'public.cabMenuApps' },
    { key: 'notif', icon: 'notif', labelKey: 'public.cabMenuNotif' },
]

const JUDGE_MENU = [
    { key: 'profile', icon: 'profile', labelKey: 'public.cabMenuProfile' },
    { key: 'category', icon: 'category', labelKey: 'public.cabMenuCategory' },
    { key: 'events', icon: 'events', labelKey: 'public.cabMenuEvents' },
    { key: 'apps', icon: 'apps', labelKey: 'public.cabMenuApps' },
    { key: 'notif', icon: 'notif', labelKey: 'public.cabMenuNotif' },
]

function fmt(d) { return new Date(d).toLocaleDateString('ru-RU') }

export default function PublicCabinet() {
    const location = useLocation()
    const navigate = useNavigate()
    const role = location.state?.role || 'athlete'
    const [section, setSection] = useState('profile')
    const [eventFilter, setEventFilter] = useState('all')
    const [showAppMenu, setShowAppMenu] = useState(false)

    const isCoach = role === 'coach'
    const isJudge = role === 'judge'
    const isAthlete = !isCoach && !isJudge
    const menu = isJudge ? JUDGE_MENU : isCoach ? COACH_MENU : ATHLETE_MENU
    const user = isJudge ? JUDGE : isCoach ? COACH : ATHLETE
    const notifs = isJudge ? JUDGE_NOTIF : isCoach ? COACH_NOTIF : ATH_NOTIF
    const notifCount = notifs.length

    const { logout } = useRole()
    const { theme, toggleTheme } = useTheme()
    const { t } = useTranslation()

    const roleLabel = isJudge
        ? `Судья · ${JUDGE.sports.join(', ')}`
        : isCoach
            ? `Тренер · ${user.sport}`
            : `${ATHLETE.currentRank} · ${user.sport}`

    const handleLogout = () => {
        logout()
        navigate('/public/login')
    }

    return (
        <div style={c.layout}>
            {/* ── V2 Sidebar ── */}
            <aside style={c.sidebar}>
                <div style={c.sidebarProfile}>
                    <div style={c.avatar}>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</div>
                    <div style={c.sidebarName}>{user.lastName} {user.firstName}</div>
                    <div style={c.sidebarRole}>{isJudge ? t('public.cabRoleJudge') : isCoach ? t('public.cabRoleCoach') : t('public.cabRoleAthlete')}</div>
                </div>

                <nav style={c.sidebarNav}>
                    {menu.map(m => {
                        const active = section === m.key
                        return (
                            <button key={m.key} className="cab-nav-item"
                                style={active ? { ...c.navItem, ...c.navItemActive } : c.navItem}
                                onClick={() => { setSection(m.key); setShowAppMenu(false) }}>
                                {active && <span style={c.navAccent} />}
                                <span style={{ display: 'flex', color: active ? '#0071E3' : 'var(--text-muted)' }}>{MI[m.icon]}</span>
                                <span style={{ flex: 1 }}>{t(m.labelKey)}</span>
                                {m.key === 'notif' && notifCount > 0 && <span style={c.notifBadge}>{notifCount}</span>}
                            </button>
                        )
                    })}
                </nav>

                <div style={c.sidebarFooter}>
                    <button style={{...c.sidebarLogoutBtn, color: theme === 'dark' ? '#FFD60A' : '#FF9F0A'}} className="cab-theme-btn" onClick={toggleTheme}>
                        <span style={{ fontSize: 16 }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
                        <span style={{color: 'var(--text-primary)'}}>{theme === 'dark' ? 'Светлая тема' : 'Темная тема'}</span>
                    </button>
                    <button style={c.sidebarLogoutBtn} className="cab-logout-btn" onClick={handleLogout}>
                        <span style={{ display: 'flex' }}>{MI.logout}</span>
                        {t('public.cabLogout')}
                    </button>
                </div>
            </aside>
            <style>{`
                .cab-nav-item { transition: all 0.2s ease !important; }
                .cab-nav-item:hover { background: rgba(120,120,128,0.08) !important; }
                .cab-logout-btn:hover { background: rgba(255,59,48,0.06) !important; }
                .cab-theme-btn:hover { background: rgba(120,120,128,0.08) !important; }
                .cab-edit-btn:hover { background: var(--bg-panel) !important; }
                .cab-table tr { transition: background 0.15s ease; }
                .cab-table tbody tr:hover { background: rgba(0,113,227,0.05) !important; }
                .cab-kpi-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .cab-kpi-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important; }
            `}</style>

            {/* ── Content area ── */}
            <main style={c.content}>

                {/* ══════════════════════════════════════════
                   SHARED: PROFILE
                   ══════════════════════════════════════════ */}
                {section === 'profile' && (
                    <div>
                        <h2 style={c.pageTitle}>{t('public.cabProfileTitle')}</h2>


                        {/* V2 White hero card */}
                        <div style={c.heroCard}>
                            <div style={c.heroAvatar}>
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </div>
                            <div style={c.heroName}>{user.lastName} {user.firstName} {user.patronymic}</div>
                            <div style={c.heroBadges}>
                                <span style={c.badgeGold}>
                                    {isJudge ? JUDGE_CATEGORY.category : isCoach ? t('public.cabHighestCategory') : ATHLETE.currentRank}
                                </span>
                                <span style={c.badgeBlue}>{isJudge ? JUDGE.sports[0] : user.sport}</span>
                                <span style={c.badgeGray}>{user.region}</span>
                            </div>
                            <button style={c.heroEditBtn} className="cab-edit-btn">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                {t('public.cabEditBtn')}
                            </button>
                        </div>

                        {/* Data rows */}
                        <div style={c.dataSection}>
                            <div style={c.dataRow}><span style={c.dataLabel}>{t('public.cabDob')}</span><span style={c.dataValue}>{user.dob}</span></div>
                            <div style={c.dataRow}><span style={c.dataLabel}>{t('public.cabSex')}</span><span style={c.dataValue}>{user.gender}</span></div>
                            <div style={c.dataRow}><span style={c.dataLabel}>{t('public.cabRegion')}</span><span style={c.dataValue}>{user.region}</span></div>
                            <div style={c.dataRow}>
                                <span style={c.dataLabel}>{isJudge ? t('public.sportsLabel') : t('public.sportTypeLabel')}</span>
                                <span style={c.dataValue}>{isJudge ? JUDGE.sports.join(', ') : user.sport}</span>
                            </div>
                            {isCoach && <div style={c.dataRow}><span style={c.dataLabel}>{t('public.cabSpecialization')}</span><span style={c.dataValue}>{COACH.specialization}</span></div>}
                            <div style={c.dataRow}><span style={c.dataLabel}>{t('public.phone')}</span><span style={c.dataValue}>{user.phone}</span></div>
                            <div style={c.dataRow}><span style={c.dataLabel}>Email</span><span style={c.dataValue}>{user.email}</span></div>
                            <div style={{ ...c.dataRow, borderBottom: 'none' }}><span style={c.dataLabel}>{t('public.cabINN')}</span><span style={{ ...c.dataValue, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{user.inn}</span></div>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
                   ATHLETE-ONLY SECTIONS
                   ══════════════════════════════════════════ */}

                {/* RANKS */}
                {isAthlete && section === 'ranks' && (
                    <div>
                        <h2 style={c.pageTitle}>{t('public.cabRanksTitle')}</h2>
                        <div style={c.currentRankCard}>
                            <div style={c.currentRankBadge}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6, verticalAlign: 'middle', marginTop: -2 }}><circle cx="12" cy="9" r="6" stroke="#FFD700" strokeWidth="1.5" fill="#FFD700" fillOpacity="0.2" /><path d="M9 14.5L7 22l5-3 5 3-2-7.5" stroke="#FFD700" strokeWidth="1.5" fill="#FFD700" fillOpacity="0.15" /><circle cx="12" cy="9" r="2.5" fill="#FFD700" fillOpacity="0.5" /></svg>{ATHLETE.currentRank}</div>
                            <div style={{ fontSize: 14, color: '#6e6e73', marginTop: 8 }}>
                                {t('public.cabRankSport') + ':'} <b>{ATHLETE.currentRankSport}</b> · {t('public.cabRankAssigned') + ':'} <b>{ATHLETE.currentRankDate}</b>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{t('public.cabRankCertNo')} {ATHLETE.currentRankNo}</div>
                        </div>
                        <div style={c.hintBox}>{t('public.cabRankHint')}</div>
                        <h3 style={c.subTitle}>{t('public.cabRankHistory')}</h3>
                        <div style={c.tableWrap}>
                            <table style={c.table}>
                                <thead><tr><th style={c.th}>{t('public.cabRankCol')}</th><th style={c.th}>{t('public.cabDateAssigned')}</th><th style={c.th}>{t('public.sportTypeLabel')}</th><th style={c.th}>{t('public.cabCertNoCol')}</th></tr></thead>
                                <tbody>
                                    {RANKS_HISTORY.map((r, i) => (
                                        <tr key={i}>
                                            <td style={{ ...c.td, fontWeight: 700, color: 'var(--text-primary)' }}>{r.rank}</td>
                                            <td style={c.td}>{r.date}</td>
                                            <td style={c.td}>{r.sport}</td>
                                            <td style={{ ...c.td, fontFamily: 'monospace', fontSize: 12 }}>{r.docNo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Link to="/public/award-application" style={c.primaryBtn}>{t('public.cabApplyNewRank')}</Link>
                    </div>
                )}

                {/* MEDICAL */}
                {isAthlete && section === 'medical' && (
                    <div>
                        <h2 style={c.pageTitle}>{t('public.cabMedicalTitle')}</h2>
                        <div style={c.card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <span style={c.medBadgeWarn}>{ATH_MEDICAL.statusLabel}</span>
                                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('public.cabDaysLeft')} {ATH_MEDICAL.daysLeft} {t('public.cabDaysUnit')}</span>
                            </div>
                            <div style={c.infoGrid}>
                                <div style={c.infoItem}><div style={c.infoLabel}>{t('public.cabIssuedDate')}</div><div style={c.infoValue}>{ATH_MEDICAL.issued}</div></div>
                                <div style={c.infoItem}><div style={c.infoLabel}>{t('public.cabValidUntil')}</div><div style={c.infoValue}>{ATH_MEDICAL.expires}</div></div>
                                <div style={{ ...c.infoItem, gridColumn: '1 / -1' }}><div style={c.infoLabel}>{t('public.cabIssuer')}</div><div style={c.infoValue}>{ATH_MEDICAL.issuer}</div></div>
                            </div>
                            <div style={c.progressWrap}>
                                <div style={c.progressBg}><div style={{ ...c.progressFill, width: `${Math.max(0, 100 - (ATH_MEDICAL.daysLeft / ATH_MEDICAL.totalDays * 100))}%` }} /></div>
                                <div style={c.progressLabels}><span>{ATH_MEDICAL.issued}</span><span>{ATH_MEDICAL.expires}</span></div>
                            </div>
                            <button style={c.primaryBtn}>{t('public.cabUploadNewCert')}</button>
                        </div>
                    </div>
                )}

                {/* ATH COACHES */}
                {isAthlete && section === 'coaches' && (
                    <div>
                        <h2 style={c.pageTitle}>{t('public.cabCoachesTitle')}</h2>
                        <div style={c.coachGrid}>
                            {ATH_COACHES.map((coach, i) => (
                                <div key={i} style={c.coachCard}>
                                    <div style={c.coachAvatar}>{coach.name.charAt(0)}</div>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{coach.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{coach.sport}</div>
                                    <span style={c.coachType}>{coach.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ATH MEDALS */}
                {isAthlete && section === 'medals' && (
                    <div>
                        <h2 style={c.pageTitle}>{t('public.cabMedalsTitle')}</h2>
                        <div style={c.medalSummary}>
                            {[{ color: '#f59e0b', label: t('public.cabGold'), count: 1, num: '1' },
                              { color: '#94a3b8', label: t('public.cabSilver'), count: 1, num: '2' },
                              { color: '#cd7f32', label: t('public.cabBronze'), count: 0, num: '3' }].map((md, i) => (
                                <div key={i} style={c.medalCount}>
                                    <div style={{ width: 44, height: 44, borderRadius: 22, background: `${md.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="9" r="6" stroke={md.color} strokeWidth="1.5" fill={md.color} fillOpacity="0.2" />
                                            <path d="M9 14.5L7 22l5-3 5 3-2-7.5" stroke={md.color} strokeWidth="1.5" fill={md.color} fillOpacity="0.15" />
                                            <text x="12" y="11.5" textAnchor="middle" fill={md.color} fontSize="8" fontWeight="800">{md.num}</text>
                                        </svg>
                                    </div>
                                    <span style={c.medalNum}>{md.count}</span>
                                    <span style={c.medalLbl}>{md.label}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {ATH_MEDALS.map((m, i) => {
                                const medalCfg = { gold: { color: '#f59e0b', num: '1' }, silver: { color: '#94a3b8', num: '2' }, bronze: { color: '#cd7f32', num: '3' } };
                                const mc = medalCfg[m.medal] || medalCfg.gold;
                                return (
                                    <div key={i} style={c.medalCard}>
                                        <div style={{ width: 48, height: 48, borderRadius: 24, background: `${mc.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="9" r="6" stroke={mc.color} strokeWidth="1.5" fill={mc.color} fillOpacity="0.2" />
                                                <path d="M9 14.5L7 22l5-3 5 3-2-7.5" stroke={mc.color} strokeWidth="1.5" fill={mc.color} fillOpacity="0.15" />
                                                <text x="12" y="11.5" textAnchor="middle" fill={mc.color} fontSize="8" fontWeight="800">{mc.num}</text>
                                            </svg>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{m.comp}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span>{fmt(m.date)}</span>
                                                <span>·</span>
                                                <span>{m.country}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
                   COACH-ONLY SECTIONS
                   ══════════════════════════════════════════ */}

                {/* CERTIFICATE */}
                {isCoach && section === 'cert' && (
                    <div>
                        <h2 style={c.pageTitle}>{t('public.cabCertTitle')}</h2>
                        <div style={c.certCard}>
                            <div style={c.certHeader}>
                                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{t('public.cabCertRegDesc')}</div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 8 }}>№ {COACH_CERT.no}</div>
                                <span style={c.certStatusBadge}>{COACH_CERT.status}</span>
                            </div>
                        </div>
                        <div style={c.card}>
                            <div style={c.infoGrid}>
                                <div style={c.infoItem}><div style={c.infoLabel}>{t('public.cabCertIssuedDate')}</div><div style={c.infoValue}>{COACH_CERT.issued}</div></div>
                                <div style={c.infoItem}><div style={c.infoLabel}>{t('public.cabCertValidUntil')}</div><div style={c.infoValue}>{COACH_CERT.expires}</div></div>
                                <div style={{ ...c.infoItem, gridColumn: '1 / -1' }}>
                                    <div style={c.infoLabel}>{t('public.cabCertDaysLeft')}</div>
                                    <div style={{ ...c.infoValue, color: COACH_CERT.daysLeft <= 60 ? '#d97706' : '#16a34a' }}>
                                        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: COACH_CERT.daysLeft <= 60 ? '#d97706' : '#16a34a', marginRight: 6 }} />{COACH_CERT.daysLeft} {t('public.cabDaysUnit')}
                                    </div>
                                </div>
                            </div>
                            <div style={c.progressWrap}>
                                <div style={c.progressBg}><div style={{ ...c.progressFill, width: `${Math.max(0, 100 - (COACH_CERT.daysLeft / COACH_CERT.totalDays * 100))}%` }} /></div>
                                <div style={c.progressLabels}><span>{COACH_CERT.issued}</span><span>{COACH_CERT.expires}</span></div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                <button style={c.primaryBtn} onClick={() => alert(t('public.cabDownloadPdf'))}>{t('public.cabDownloadCert')}</button>
                                <Link to="/public/trainer-registration" style={{ ...c.primaryBtn, background: '#16a34a' }}>{t('public.cabApplyRenewal')}</Link>
                            </div>
                        </div>
                        <div style={c.hintBox}>{t('public.cabCertBasis')}</div>
                    </div>
                )}

                {/* MY ATHLETES */}
                {isCoach && section === 'athletes' && (
                    <div>
                        <h2 style={c.pageTitle}>{t('public.cabMyAthletesTitle')}</h2>
                        <div style={c.coachGrid}>
                            {COACH_ATHLETES.map((a, i) => (
                                <div key={i} style={c.athleteCard}>
                                    <div style={c.coachAvatar}>{a.name.charAt(0)}</div>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{a.name}</div>
                                    <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                                        <span style={c.rankBadge}>{a.rank}</span>
                                        {a.inTeam && <span style={c.teamBadge}>{t('public.cabTeamBadge')}</span>}
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{a.sport}</div>
                                    {a.medExpiring && <div style={c.medWarn}>{t('public.cabMedExpiring')}</div>}
                                    <button style={{ ...c.primaryBtn, marginTop: 8, fontSize: 11, padding: '6px 14px' }}
                                        onClick={() => alert(`Профиль: ${a.name}`)}>{t('public.cabViewProfile')}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
                   JUDGE-ONLY: CATEGORY
                   ══════════════════════════════════════════ */}
                {isJudge && section === 'category' && (
                    <div>
                        <h2 style={c.pageTitle}>{t('public.cabCategoryTitle')}</h2>

                        {/* Big judge certificate card */}
                        <div style={c.certCard}>
                            <div style={c.certHeader}>
                                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{t('public.cabJudgeCertTitle')}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                                    <span style={{ ...c.judgeCatBadge, background: JUDGE_CATEGORY.categoryColor }}>
                                        {JUDGE_CATEGORY.category}
                                    </span>
                                </div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 10 }}>
                                    № {JUDGE_CATEGORY.no}
                                </div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>
                                    {t('public.cabAttestation') + ':'} {JUDGE_CATEGORY.attestationDate} · {t('public.cabCertValidUntil') + ':'} {JUDGE_CATEGORY.expires}
                                </div>
                            </div>
                        </div>

                        {/* Details card with progress */}
                        <div style={c.card}>
                            <div style={c.infoGrid}>
                                <div style={c.infoItem}><div style={c.infoLabel}>{t('public.cabAttestationDate')}</div><div style={c.infoValue}>{JUDGE_CATEGORY.attestationDate}</div></div>
                                <div style={c.infoItem}><div style={c.infoLabel}>{t('public.cabValidUntil')}</div><div style={c.infoValue}>{JUDGE_CATEGORY.expires}</div></div>
                                <div style={{ ...c.infoItem, gridColumn: '1 / -1' }}>
                                    <div style={c.infoLabel}>{t('public.cabCertDaysLeft')}</div>
                                    <div style={{ ...c.infoValue, color: JUDGE_CATEGORY.daysLeft <= 90 ? '#d97706' : '#16a34a' }}>
                                        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: JUDGE_CATEGORY.daysLeft <= 90 ? '#d97706' : '#16a34a', marginRight: 6 }} />{JUDGE_CATEGORY.daysLeft} {t('public.cabDaysUnit')}
                                    </div>
                                </div>
                            </div>
                            <div style={c.progressWrap}>
                                <div style={c.progressBg}>
                                    <div style={{ ...c.progressFill, width: `${Math.max(0, 100 - (JUDGE_CATEGORY.daysLeft / JUDGE_CATEGORY.totalDays * 100))}%` }} />
                                </div>
                                <div style={c.progressLabels}>
                                    <span>{JUDGE_CATEGORY.attestationDate}</span>
                                    <span>{JUDGE_CATEGORY.expires}</span>
                                </div>
                            </div>
                        </div>

                        {/* Category history */}
                        <h3 style={c.subTitle}>{t('public.cabCategoryHistory')}</h3>
                        <div style={c.tableWrap}>
                            <table style={c.table}>
                                <thead>
                                    <tr>
                                        <th style={c.th}>{t('public.cabCategoryCol')}</th>
                                        <th style={c.th}>{t('public.cabDateAssigned')}</th>
                                        <th style={c.th}>{t('public.cabAssignedByCol')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {JUDGE_CATEGORY_HISTORY.map((h, i) => (
                                        <tr key={i}>
                                            <td style={{ ...c.td, fontWeight: 700, color: 'var(--text-primary)' }}>{h.category}</td>
                                            <td style={c.td}>{h.date}</td>
                                            <td style={c.td}>{h.assignedBy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Link to="/public/judge-category" style={{ ...c.primaryBtn, display: 'inline-block', textDecoration: 'none' }}>
                            {t('public.cabApplyUpgrade')}
                        </Link>

                        <div style={{ ...c.hintBox, marginTop: 20 }}>
                            {t('public.cabJudgeBasis')}
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
                   SHARED: EVENTS (different data per role)
                   ══════════════════════════════════════════ */}
                {section === 'events' && (
                    <div>
                        <h2 style={c.pageTitle}>{isJudge ? t('public.cabEventsTitle') : isCoach ? t('public.cabCoachEvents') : t('public.cabEventsTitle')}</h2>

                        {/* Filters for athlete and judge */}
                        {(isAthlete || isJudge) && (
                            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                {['all', 'upcoming', 'past'].map(f => (
                                    <button key={f} style={eventFilter === f ? { ...c.filterBtn, ...c.filterBtnActive } : c.filterBtn}
                                        onClick={() => setEventFilter(f)}>
                                        {f === 'all' ? t('public.cabAllFilter') : f === 'upcoming' ? t('public.cabUpcoming') : t('public.cabPast')}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div style={c.tableWrap}>
                            <table style={c.table}>
                                <thead>
                                    <tr>
                                        <th style={c.th}>{t('public.cabEventCol')}</th>
                                        <th style={c.th}>{t('public.cabDateCol')}</th>
                                        <th style={c.th}>{t('public.cabPlaceCol')}</th>
                                        {isJudge ? (
                                            <><th style={c.th}>{t('public.cabJudgeRoleCol')}</th><th style={c.th}>{t('public.cabStatusCol')}</th><th style={c.th}>{t('public.cabActionCol')}</th></>
                                        ) : isCoach ? (
                                            <><th style={c.th}>{t('public.cabMyAthletesCol')}</th><th style={c.th}>{t('public.cabStatusCol')}</th></>
                                        ) : (
                                            <><th style={c.th}>{t('public.cabResultCol')}</th><th style={c.th}>{t('public.cabRankConfirmed')}</th></>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {isJudge ? (
                                        JUDGE_EVENTS
                                            .filter(e => eventFilter === 'all' ? true : eventFilter === 'past' ? e.past : !e.past)
                                            .map((e, i) => (
                                                <tr key={i}>
                                                    <td style={{ ...c.td, fontWeight: 700, color: 'var(--text-primary)' }}>{e.title}</td>
                                                    <td style={c.td}>{fmt(e.date)}</td>
                                                    <td style={c.td}>{e.place}</td>
                                                    <td style={c.td}>
                                                        <span style={{
                                                            ...c.statusBadge,
                                                            background: e.judgeRole === 'Главный судья' ? 'rgba(59,130,246,0.15)' : 'var(--bg-panel)',
                                                            color: e.judgeRole === 'Главный судья' ? 'var(--accent)' : 'var(--text-muted)',
                                                        }}>{e.judgeRole}</span>
                                                    </td>
                                                    <td style={c.td}>
                                                        <span style={{ ...c.statusBadge, ...(e.status === 'Предстоящее' ? c.statusYellow : c.statusGreen) }}>{e.status}</span>
                                                    </td>
                                                    <td style={c.td}>
                                                        {!e.past && !e.confirmed && (
                                                            <button style={{ ...c.primaryBtn, fontSize: 11, padding: '5px 12px' }}
                                                                onClick={() => alert('Участие подтверждено!')}>
                                                                {t('public.cabConfirmBtn')}
                                                            </button>
                                                        )}
                                                        {!e.past && e.confirmed && (
                                                            <span style={c.statusOk}>{t('public.cabConfirmed')}</span>
                                                        )}
                                                        {e.past && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>-</span>}
                                                    </td>
                                                </tr>
                                            ))
                                    ) : isCoach ? (
                                        COACH_EVENTS.map((e, i) => (
                                            <tr key={i}>
                                                <td style={{ ...c.td, fontWeight: 700, color: 'var(--text-primary)' }}>{e.title}</td>
                                                <td style={c.td}>{fmt(e.date)}</td>
                                                <td style={c.td}>{e.place}</td>
                                                <td style={{ ...c.td, fontWeight: 700, textAlign: 'center' }}>{e.myAthletes}</td>
                                                <td style={c.td}>
                                                    <span style={{ ...c.statusBadge, ...(e.status === 'Предстоящее' ? c.statusYellow : c.statusGreen) }}>{e.status}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        ATH_EVENTS
                                            .filter(e => eventFilter === 'all' ? true : eventFilter === 'past' ? e.past : !e.past)
                                            .map((e, i) => (
                                                <tr key={i}>
                                                    <td style={{ ...c.td, fontWeight: 700, color: 'var(--text-primary)' }}>{e.title}</td>
                                                    <td style={c.td}>{fmt(e.date)}</td>
                                                    <td style={c.td}>{e.place}</td>
                                                    <td style={c.td}>{e.result || <span style={{ color: 'var(--text-muted)' }}>-</span>}</td>
                                                    <td style={c.td}>
                                                        {e.rankConfirmed ? <span style={c.statusOk}>{t('public.cabYes')}</span> : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                                                    </td>
                                                </tr>
                                            ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
                   SHARED: TRAINING (athlete & coach only)
                   ══════════════════════════════════════════ */}
                {!isJudge && section === 'training' && (
                    <div>
                        <h2 style={c.pageTitle}>{isCoach ? t('public.cabTrainingProcess') : t('public.cabTrainingTitle')}</h2>
                        <div style={c.card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h3 style={{ ...c.subTitle, margin: 0, border: 'none', padding: 0 }}>{t('public.cabScheduleWeek')}</h3>
                                {isCoach && <button style={{ ...c.primaryBtn, fontSize: 11, padding: '6px 14px' }}>{t('public.cabPlanTraining')}</button>}
                            </div>
                            <div style={c.weekGrid}>
                                {t('public.cabWeekDays', { returnObjects: true }).map((day, i) => {
                                    const has = isCoach ? [0, 1, 2, 3, 4].includes(i) : [0, 2, 4].includes(i)
                                    return (
                                        <div key={day} style={{ ...c.weekDay, background: has ? 'rgba(59,130,246,0.15)' : 'var(--bg-panel)', borderColor: has ? 'var(--accent)' : 'var(--border-color)' }}>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{day}</div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: has ? 'var(--text-primary)' : 'var(--border-color)' }}>{has ? '•' : '-'}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <h3 style={c.subTitle}>{t('public.cabRecentTrainings')}</h3>
                        <div style={c.tableWrap}>
                            <table style={c.table}>
                                <thead>
                                    <tr>
                                        <th style={c.th}>{t('public.cabDateCol')}</th>
                                        <th style={c.th}>{isCoach ? t('public.cabAthletesCol') : t('public.cabCoachCol')}</th>
                                        <th style={c.th}>{t('public.cabTypeCol')}</th>
                                        <th style={c.th}>{t('public.cabDurationCol')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(isCoach ? COACH_TRAININGS : ATH_TRAININGS).map((tr, i) => (
                                        <tr key={i}>
                                            <td style={c.td}>{tr.date}</td>
                                            <td style={{ ...c.td, fontWeight: 500, color: 'var(--text-primary)' }}>{isCoach ? tr.athletes : tr.coach}</td>
                                            <td style={c.td}>{tr.type}</td>
                                            <td style={c.td}>{tr.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
                   SHARED: TEAM (athlete & coach only)
                   ══════════════════════════════════════════ */}
                {!isJudge && section === 'team' && (
                    <div>
                        <h2 style={c.pageTitle}>{t('public.cabTeamTitle')}</h2>
                        {isCoach ? (
                            COACH_TEAM.assigned ? (
                                <div style={c.card}>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{COACH_TEAM.name}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>{t('public.cabYourRole') + ':'} {COACH_TEAM.role}</div>
                                    <h3 style={c.subTitle}>{t('public.cabComposition')}</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {COACH_TEAM.members.map((m, i) => (
                                            <div key={i} style={c.teamMember}>
                                                <span style={c.teamAvatar}>{m.charAt(0)}</span>
                                                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{m}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {COACH_TEAM.nextTrip && (
                                        <div style={c.teamEvent}>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{t('public.cabNextTrip')}</div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{COACH_TEAM.nextTrip.title}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{COACH_TEAM.nextTrip.days} · {COACH_TEAM.nextTrip.place}</div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={c.emptyState}>
                                    <div style={{ width: 56, height: 56, borderRadius: 28, background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    </div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 12 }}>{t('public.cabNotAssigned')}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{t('public.cabNotAssignedHint')}</div>
                                </div>
                            )
                        ) : (
                            <div style={c.card}>
                                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>{ATH_TEAM.name}</div>
                                <div style={c.infoGrid}>
                                    <div style={c.infoItem}><div style={c.infoLabel}>{t('public.cabHeadCoach')}</div><div style={c.infoValue}>{ATH_TEAM.headCoach}</div></div>
                                    <div style={c.infoItem}><div style={c.infoLabel}>{t('public.cabSeniorCoach')}</div><div style={c.infoValue}>{ATH_TEAM.seniorCoach}</div></div>
                                </div>
                                <h3 style={{ ...c.subTitle, marginTop: 20 }}>{t('public.cabTeamComposition')}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {ATH_TEAM.members.map((m, i) => (
                                        <div key={i} style={c.teamMember}>
                                            <span style={c.teamAvatar}>{m.charAt(0)}</span>
                                            <span style={{ fontSize: 13, fontWeight: m === 'Джумабаев Айбек' ? 700 : 400, color: m === 'Джумабаев Айбек' ? 'var(--text-primary)' : 'var(--text-primary)' }}>
                                                {m} {m === 'Джумабаев Айбек' && t('public.cabYou')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {ATH_TEAM.nextEvent && (
                                    <div style={c.teamEvent}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{t('public.cabNextEvent')}</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{ATH_TEAM.nextEvent.title}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ATH_TEAM.nextEvent.date} · {ATH_TEAM.nextEvent.place}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ══════════════════════════════════════════
                   SHARED: APPLICATIONS (different data per role)
                   ══════════════════════════════════════════ */}
                {section === 'apps' && (
                    <div>
                        <h2 style={c.pageTitle}>{t('public.cabAppsTitle')}</h2>
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                            <button style={c.primaryBtn} onClick={() => setShowAppMenu(!showAppMenu)}>{t('public.cabNewApp')}</button>
                            {showAppMenu && (
                                <div style={c.appMenu}>
                                    {isJudge ? (
                                        <>
                                            <Link to="/public/judge-category" style={c.appMenuItem}>{t('public.cabCategoryUpgrade')}</Link>
                                            <Link to="/public/document-restoration" style={c.appMenuItem}>{t('public.cabCertRestore')}</Link>
                                        </>
                                    ) : isCoach ? (
                                        <>
                                            <Link to="/public/trainer-registration" style={c.appMenuItem}>{t('public.cabCoachRegistration')}</Link>
                                            <Link to="/public/award-application" style={c.appMenuItem}>{t('public.cabAwardZTKR')}</Link>
                                            <Link to="/public/document-restoration" style={c.appMenuItem}>{t('public.cabCertDuplicate')}</Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/public/award-application" style={c.appMenuItem}>{t('public.cabAwardApply')}</Link>
                                            <Link to="/public/trainer-registration" style={c.appMenuItem}>{t('public.cabCoachRegApply')}</Link>
                                            <Link to="/public/document-restoration" style={c.appMenuItem}>{t('public.cabDocRestore')}</Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <div style={c.tableWrap}>
                            <table style={c.table}>
                                <thead><tr><th style={c.th}>{t('public.cabAppTypeCol')}</th><th style={c.th}>{t('public.cabAppDateCol')}</th><th style={c.th}>{t('public.cabStatusCol')}</th><th style={c.th}>{t('public.cabAppNoCol')}</th></tr></thead>
                                <tbody>
                                    {(isJudge ? JUDGE_APPS : isCoach ? COACH_APPS : ATH_APPS).map((a, i) => (
                                        <tr key={i}>
                                            <td style={{ ...c.td, fontWeight: 700, color: 'var(--text-primary)' }}>{a.type}</td>
                                            <td style={c.td}>{a.date}</td>
                                            <td style={c.td}>
                                                <span style={{ ...c.statusBadge, ...(a.statusCls === 'green' ? c.statusGreen : c.statusYellow) }}>{a.status}</span>
                                            </td>
                                            <td style={{ ...c.td, fontFamily: 'monospace', fontSize: 12 }}>{a.no}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
                   SHARED: NOTIFICATIONS
                   ══════════════════════════════════════════ */}
                {section === 'notif' && (
                    <div>
                        <h2 style={c.pageTitle}>{t('public.cabNotifTitle')}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {notifs.map((n, i) => (
                                <div key={i} style={c.notifItem}>
                                    {(() => {
                                        const sz = 32, r = 16;
                                        const cfg = {
                                            bell: { bg: '#fff3e0', color: '#f59e0b', path: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z' },
                                            warn: { bg: '#fef3c7', color: '#d97706', path: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' },
                                            calendar: { bg: '#dbeafe', color: '#3b82f6', path: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z' },
                                            check: { bg: '#dcfce7', color: '#22c55e', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
                                        };
                                        const c = cfg[n.icon] || cfg.bell;
                                        return (
                                            <div style={{ width: sz, height: sz, borderRadius: r, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill={c.color}><path d={c.path} /></svg>
                                            </div>
                                        );
                                    })()}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{n.text}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{n.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

/* ═══════════════════════════════════════════════
   STYLES - matches internal portal layout
   ═══════════════════════════════════════════════ */
const c = {
    /* ── Layout ── */
    layout: { display: 'flex', flex: 1, overflow: 'hidden' },

    /* ── V2 Sidebar ── */
    sidebar: {
        width: 240, flexShrink: 0, height: '100%',
        background: 'var(--bg-sidebar)',
        boxShadow: '1px 0 8px rgba(0,0,0,0.04)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', padding: '24px 16px',
    },
    sidebarProfile: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingBottom: 20, borderBottom: '1px solid #E5E5EA', marginBottom: 8,
    },
    avatar: {
        width: 48, height: 48, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7EB6F6, #B8A9EE)',
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 500, flexShrink: 0, marginBottom: 10,
        boxShadow: '0 2px 12px rgba(126,182,246,0.3)',
    },
    sidebarName: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' },
    sidebarRole: { fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textAlign: 'center' },

    sidebarNav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', paddingTop: 4 },
    navItem: {
        display: 'flex', alignItems: 'center', gap: 10, position: 'relative',
        padding: '10px 14px', borderRadius: 10, border: 'none',
        background: 'transparent', color: 'var(--text-secondary)',
        fontSize: 13, fontWeight: 400, fontFamily: 'inherit',
        cursor: 'pointer', textAlign: 'left', width: '100%',
    },
    navItemActive: { color: '#0071E3', fontWeight: 600, background: 'rgba(0,113,227,0.06)' },
    navAccent: {
        position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3,
        borderRadius: 2, background: '#0071E3',
    },
    notifBadge: {
        marginLeft: 'auto', background: '#FF3B30', color: '#fff',
        fontSize: 9, fontWeight: 600, borderRadius: 10, padding: '2px 6px',
        minWidth: 18, textAlign: 'center', lineHeight: '14px',
    },

    sidebarFooter: { marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-color)', flexShrink: 0 },
    sidebarLogoutBtn: {
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', border: 'none', borderRadius: 10,
        background: 'none', color: '#FF3B30',
        fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
    },

    /* ── Content ── */
    content: { flex: 1, padding: '32px 36px', overflowY: 'auto', background: 'var(--bg-card)', height: '100%' },
    pageTitle: { fontSize: 24, fontWeight: 300, color: 'var(--text-primary)', margin: '0 0 24px', letterSpacing: -0.3 },
    subTitle: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px', paddingBottom: 8, borderBottom: '1px solid var(--border-color)' },

    /* ── V2 Hero card ── */
    heroCard: {
        background: 'var(--bg-card)', borderRadius: 20, padding: '36px 32px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginBottom: 28, position: 'relative',
    },
    heroAvatar: {
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7EB6F6, #B8A9EE)',
        color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, fontWeight: 400, marginBottom: 16,
        boxShadow: '0 4px 20px rgba(126,182,246,0.35)',
    },
    heroName: { fontSize: 22, fontWeight: 300, color: 'var(--text-primary)', letterSpacing: -0.3, marginBottom: 12 },
    heroBadges: { display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
    badgeGold: {
        display: 'inline-block', padding: '4px 14px', borderRadius: 20,
        background: 'linear-gradient(135deg, #F5E6C8, #E8D5A8)', color: '#8B6914',
        fontSize: 12, fontWeight: 600,
    },
    badgeBlue: {
        display: 'inline-block', padding: '4px 14px', borderRadius: 20,
        background: 'rgba(10,132,255,0.15)', color: 'var(--accent)', fontSize: 12, fontWeight: 500,
    },
    badgeGray: {
        display: 'inline-block', padding: '4px 14px', borderRadius: 20,
        background: 'var(--bg-panel)', color: 'var(--text-muted)', fontSize: 12, fontWeight: 500,
    },
    heroEditBtn: {
        position: 'absolute', top: 20, right: 24,
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: 10,
        background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500,
        fontFamily: 'inherit', cursor: 'pointer',
    },

    /* ── Data rows ── */
    dataSection: {
        background: 'var(--bg-card)', borderRadius: 16, padding: '4px 0',
        boxShadow: 'var(--shadow-xs)',
    },
    dataRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 24px', borderBottom: '1px solid var(--border-color)',
    },
    dataLabel: { fontSize: 13, color: 'var(--text-muted)' },
    dataValue: { fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' },

    /* ── Cards (for other sections) ── */
    card: { background: 'var(--bg-card)', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 1px 10px rgba(0,0,0,0.04)' },
    profileCard: { background: 'var(--bg-card)', borderRadius: 16, padding: 24, boxShadow: '0 1px 10px rgba(0,0,0,0.04)' },
    profileTop: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border-color)' },
    profileAvatar: {
        width: 52, height: 52, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7EB6F6, #B8A9EE)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 500, flexShrink: 0,
    },
    profileName: { fontSize: 17, fontWeight: 500, color: 'var(--text-primary)' },
    linkBtn: { background: 'none', border: 'none', color: '#0071E3', fontSize: 12, fontWeight: 500, cursor: 'pointer', marginTop: 8, fontFamily: 'inherit', padding: 0 },

    /* Info grid - kept for other sections */
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 },
    infoItem: { padding: '12px 16px', background: 'var(--bg-panel)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    infoLabel: { fontSize: 12, color: 'var(--text-muted)' },
    infoValue: { fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' },

    /* Buttons */
    primaryBtn: {
        display: 'inline-block', padding: '10px 20px',
        background: 'var(--text-primary)', color: '#fff', border: 'none', borderRadius: 12,
        fontSize: 13, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'none',
    },
    filterBtn: { padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: 12, background: 'var(--bg-card)', fontSize: 12, fontWeight: 500, fontFamily: 'inherit', color: 'var(--text-muted)', cursor: 'pointer' },
    filterBtnActive: { background: 'var(--text-primary)', color: '#fff', borderColor: 'var(--text-primary)' },

    /* Current rank */
    currentRankCard: { background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)', borderRadius: 14, padding: '28px', marginBottom: 20, color: '#fff' },
    currentRankBadge: { display: 'inline-block', padding: '6px 18px', borderRadius: 20, background: 'rgba(255,255,255,0.2)', fontSize: 18, fontWeight: 800, color: '#fff' },

    /* Hint */
    hintBox: { padding: '14px 18px', marginBottom: 20, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, fontSize: 13, color: 'var(--accent)', lineHeight: 1.5 },

    /* Table */
    tableWrap: { overflow: 'auto', marginBottom: 16 },
    table: { width: '100%', borderCollapse: 'collapse', background: 'var(--bg-card)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-color)' },
    th: { textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-panel)', whiteSpace: 'nowrap' },
    td: { padding: '10px 14px', fontSize: 13, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle' },
    statusOk: { color: '#16a34a', fontWeight: 700, fontSize: 12 },

    /* Medical */
    medBadgeWarn: { display: 'inline-block', padding: '4px 14px', borderRadius: 20, background: 'rgba(217,119,6,0.15)', color: '#d97706', fontSize: 12, fontWeight: 700 },
    progressWrap: { marginBottom: 20, marginTop: 16 },
    progressBg: { height: 8, borderRadius: 4, background: 'var(--border-color)', overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #16a34a, #d97706, #ef4444)', transition: 'width 0.5s' },
    progressLabels: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 },

    /* Week grid */
    weekGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 },
    weekDay: { padding: '12px 8px', textAlign: 'center', borderRadius: 12, border: '1px solid' },

    /* Coach cards */
    coachGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
    coachCard: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    coachAvatar: {
        width: 52, height: 52, borderRadius: '50%',
        background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, fontWeight: 800, margin: '0 auto 12px',
    },
    coachType: { display: 'inline-block', marginTop: 8, padding: '3px 12px', borderRadius: 10, background: 'rgba(59,130,246,0.15)', color: 'var(--accent)', fontSize: 11, fontWeight: 700 },

    /* Medals */
    medalSummary: { display: 'flex', gap: 20, marginBottom: 24 },
    medalCount: { flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
    medalNum: { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' },
    medalLbl: { fontSize: 12, color: 'var(--text-muted)' },
    medalCard: { display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16 },

    /* Team */
    teamMember: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-panel)', borderRadius: 12 },
    teamAvatar: { width: 28, height: 28, borderRadius: '50%', background: 'var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 },
    teamEvent: { marginTop: 20, padding: '14px 18px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 12 },

    /* Applications */
    statusBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 },
    statusGreen: { background: 'rgba(22,163,74,0.15)', color: '#16a34a' },
    statusYellow: { background: 'rgba(217,119,6,0.15)', color: '#d97706' },
    appMenu: {
        position: 'absolute', top: '100%', left: 0, marginTop: 6,
        background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 10, minWidth: 240,
    },
    appMenuItem: { display: 'block', padding: '12px 16px', fontSize: 13, color: 'var(--text-primary)', textDecoration: 'none', borderBottom: '1px solid var(--border-color)' },

    /* Notifications */
    notifItem: { display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10 },

    /* ── Coach-specific ── */
    certCard: {
        background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
        borderRadius: 14, overflow: 'hidden', marginBottom: 20,
    },
    certHeader: { padding: '28px 32px' },
    certStatusBadge: {
        display: 'inline-block', marginTop: 12, padding: '4px 14px', borderRadius: 20,
        background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, fontWeight: 700,
    },
    athleteCard: {
        background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16,
        padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    rankBadge: {
        display: 'inline-block', padding: '2px 10px', borderRadius: 10,
        background: 'rgba(29,78,216,0.15)', color: '#1d4ed8', fontSize: 11, fontWeight: 800,
    },
    teamBadge: {
        display: 'inline-block', padding: '2px 10px', borderRadius: 10,
        background: 'rgba(22,163,74,0.15)', color: '#16a34a', fontSize: 11, fontWeight: 700,
    },
    medWarn: {
        marginTop: 8, padding: '4px 10px', borderRadius: 12,
        background: 'rgba(217,119,6,0.15)', color: '#d97706', fontSize: 11, fontWeight: 700,
    },
    emptyState: {
        textAlign: 'center', padding: '60px 20px',
        background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14,
    },

    /* ── Judge-specific ── */
    judgeCatBadge: {
        display: 'inline-block', padding: '6px 18px', borderRadius: 20,
        color: '#fff', fontSize: 14, fontWeight: 800,
    },
    sportTag: {
        display: 'inline-block', padding: '3px 12px', borderRadius: 10,
        background: 'rgba(29,78,216,0.15)', color: '#1d4ed8', fontSize: 12, fontWeight: 700,
    },
}
