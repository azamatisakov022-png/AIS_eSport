import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRole, ROLES } from '../context/RoleContext'
import './intranet.css'

/* ════════════ Демо-данные ════════════ */
const NEWS = [
    { id: 1, date: '28.05', title: 'Запуск АИС «eSport» на тестовом контуре', desc: 'Тестовый контур развёрнут, доступ открыт для сотрудников центрального аппарата.' },
    { id: 2, date: '24.05', title: 'Совещание по подготовке к Чемпионату Азии', desc: 'Запланировано совещание с руководителями областных управлений и федерациями.' },
    { id: 3, date: '20.05', title: 'Цифровая трансформация: квартальный отчёт', desc: 'Опубликован квартальный отчёт по реализации Концепции цифровой трансформации.' },
    { id: 4, date: '14.05', title: 'Открыта запись на курсы повышения квалификации', desc: 'Заявки принимаются до 10.06 в отделе кадров.' },
]

const ANNOUNCEMENTS = [
    { id: 1, tag: 'hr', tagLabel: 'Отдел кадров', title: 'Графики отпусков - до 15.06 утвердить с руководителями', author: 'Алиева А.К.', date: 'сегодня' },
    { id: 2, tag: 'it', tagLabel: 'ИТ', title: 'Плановые работы на портале 02.06 c 22:00 до 02:00', author: 'Системный администратор', date: 'вчера' },
    { id: 3, tag: 'mgmt', tagLabel: 'Руководство', title: 'Открытие отделения подготовки тренеров в Оше', author: 'Канцелярия', date: '2 дня назад' },
]

const CALENDAR = [
    { day: 3, mon: 'июн', title: 'Планёрка по результатам отчётности', time: '10:00 · каб. 312' },
    { day: 5, mon: 'июн', title: 'Совещание с областными управлениями', time: '14:00 · онлайн' },
    { day: 8, mon: 'июн', title: 'Заседание коллегии', time: '11:00 · большой зал' },
    { day: 12, mon: 'июн', title: 'Аудит документооборота', time: 'весь день' },
]

/* ════════════ Иконки ════════════ */
const ICONS = {
    news: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>),
    structure: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M12 9v3"/><path d="M6 15v-3h12v3"/></svg>),
    directory: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/><path d="M2 8v12a2 2 0 0 0 2 2h12"/><circle cx="14" cy="11" r="2"/><path d="M11 17a3 3 0 0 1 6 0"/></svg>),
    regulations: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>),
    knowledge: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>),
    templates: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>),
    chat: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
    announcements: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 12 22 21 22 3"/><line x1="22" y1="12" x2="6" y2="12"/></svg>),
    calendar: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
}

const TILES = [
    { to: '/intranet/news', icon: ICONS.news, title: 'Новости', sub: 'Последние события ГАФКиС' },
    { to: '/intranet/structure', icon: ICONS.structure, title: 'Структура', sub: 'Центральный аппарат и подразделения' },
    { to: '/intranet/directory', icon: ICONS.directory, title: 'Справочник', sub: 'Контакты сотрудников' },
    { to: '/intranet/regulations', icon: ICONS.regulations, title: 'Регламенты', sub: 'Приказы, инструкции, положения' },
    { to: '/intranet/knowledge', icon: ICONS.knowledge, title: 'База знаний', sub: 'Методики, инструкции, FAQ' },
    { to: '/intranet/templates', icon: ICONS.templates, title: 'Шаблоны', sub: 'Документы и формы' },
    { to: '/intranet/chat', icon: ICONS.chat, title: 'Чат', sub: 'Внутренние сообщения', badge: 4 },
    { to: '/intranet/announcements', icon: ICONS.announcements, title: 'Объявления', sub: 'HR · ИТ · Руководство' },
    { to: '/intranet/calendar', icon: ICONS.calendar, title: 'Календарь', sub: 'События и мероприятия' },
]

function getGreeting() {
    const h = new Date().getHours()
    if (h < 6) return 'Доброй ночи'
    if (h < 12) return 'Доброе утро'
    if (h < 18) return 'Добрый день'
    return 'Добрый вечер'
}

function getToday() {
    return new Date().toLocaleDateString('ru-RU', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
}

export default function IntranetHome() {
    const { currentRole } = useRole()
    const role = ROLES[currentRole] || {}

    const greeting = useMemo(() => `${getGreeting()}, ${role.name?.split(' ')[0] || 'сотрудник'}`, [role.name])
    const today = useMemo(() => getToday(), [])

    return (
        <div className="intra">
            {/* Hero */}
            <div className="intra-hero">
                <div>
                    <h1 className="intra-hero__greeting">{greeting}</h1>
                    <p className="intra-hero__sub">{today} · {role.label || 'Сотрудник ГАФКиС'}</p>
                </div>
                <div className="intra-hero__stats">
                    <div className="intra-hero__stat">
                        <div className="intra-hero__stat-val">4</div>
                        <div className="intra-hero__stat-label">непрочитанных</div>
                    </div>
                    <div className="intra-hero__stat">
                        <div className="intra-hero__stat-val">2</div>
                        <div className="intra-hero__stat-label">задач</div>
                    </div>
                    <div className="intra-hero__stat">
                        <div className="intra-hero__stat-val">12</div>
                        <div className="intra-hero__stat-label">документов в работе</div>
                    </div>
                </div>
            </div>

            {/* Quick-access tiles */}
            <div className="intra-tiles">
                {TILES.map(tile => (
                    <Link key={tile.to} to={tile.to} className="intra-tile">
                        {tile.badge && <span className="intra-tile__badge">{tile.badge}</span>}
                        <div className="intra-tile__icon">{tile.icon}</div>
                        <div className="intra-tile__title">{tile.title}</div>
                        <div className="intra-tile__sub">{tile.sub}</div>
                    </Link>
                ))}
            </div>

            {/* 3-column main grid */}
            <div className="intra-grid">
                {/* News */}
                <div className="intra-panel">
                    <div className="intra-panel__head">
                        <h2 className="intra-panel__title">Новости для сотрудников</h2>
                        <Link to="/intranet/news" className="intra-panel__action">Все →</Link>
                    </div>
                    <div className="intra-panel__body">
                        {NEWS.map(n => (
                            <Link key={n.id} to={`/intranet/news/${n.id}`} className="intra-news-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="intra-news-item__date">{n.date}</div>
                                <div className="intra-news-item__body">
                                    <p className="intra-news-item__title">{n.title}</p>
                                    <p className="intra-news-item__desc">{n.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Announcements */}
                <div className="intra-panel">
                    <div className="intra-panel__head">
                        <h2 className="intra-panel__title">Объявления</h2>
                        <Link to="/intranet/announcements" className="intra-panel__action">Все →</Link>
                    </div>
                    <div className="intra-panel__body">
                        {ANNOUNCEMENTS.map(a => (
                            <div key={a.id} className="intra-ann-item">
                                <span className={`intra-ann-item__tag intra-ann-tag--${a.tag}`}>{a.tagLabel}</span>
                                <p className="intra-ann-item__title">{a.title}</p>
                                <div className="intra-ann-item__meta">{a.author} · {a.date}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar */}
                <div className="intra-panel">
                    <div className="intra-panel__head">
                        <h2 className="intra-panel__title">Календарь</h2>
                        <Link to="/intranet/calendar" className="intra-panel__action">Все →</Link>
                    </div>
                    <div className="intra-panel__body">
                        {CALENDAR.map((c, i) => (
                            <div key={i} className="intra-cal-item">
                                <div className="intra-cal-item__date">
                                    <div className="intra-cal-item__date-day">{c.day}</div>
                                    <div className="intra-cal-item__date-mon">{c.mon}</div>
                                </div>
                                <div className="intra-cal-item__body">
                                    <p className="intra-cal-item__title">{c.title}</p>
                                    <div className="intra-cal-item__meta">{c.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
