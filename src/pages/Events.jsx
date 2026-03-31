import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import { TableSkeleton, MetricSkeleton } from '../components/Skeleton'
import './Events.css'
import Portal from '../components/Portal'
import Breadcrumbs from '../components/Breadcrumbs'

const SPORTS = ['Бокс', 'Борьба', 'Дзюдо', 'Футбол', 'Плавание', 'Лёгкая атлетика', 'Каратэ', 'Тхэквондо', 'Гимнастика', 'Шахматы', 'Волейбол', 'Баскетбол', 'Тяжёлая атлетика', 'Кок-бору']
const REGIONS = ['Бишкек', 'Ош', 'Каракол', 'Джалал-Абад', 'Нарын', 'Талас', 'Баткен', 'Токмок', 'Балыкчы']
const AGES_KEYS = ['ageGroup.adults', 'ageGroup.juniors', 'ageGroup.cadets', 'ageGroup.veterans']
const AGES_VALUES = ['Взрослые', 'Юниоры', 'Кадеты', 'Ветераны']
const LEVELS = ['Республиканский', 'Международный']
const EVENT_TYPE_DEFS = [
    { value: 'international', labelKey: 'events.types.international', icon: MetricIcons.globe('#F59E0B', 18), color: '#F59E0B' },
    { value: 'championship',  labelKey: 'events.types.championship',  icon: MetricIcons.trophy('#2563EB', 18), color: '#2563EB' },
    { value: 'premier',       labelKey: 'events.types.premier',       icon: MetricIcons.medal('#7C3AED', 18), color: '#7C3AED' },
    { value: 'spartakiad',    labelKey: 'events.types.spartakiad',    icon: MetricIcons.target('#16A34A', 18), color: '#16A34A' },
    { value: 'tournament',    labelKey: 'events.types.tournament',    icon: MetricIcons.medal('#0EA5E9', 18), color: '#0EA5E9' },
    { value: 'other',         labelKey: 'events.types.other',         icon: MetricIcons.clipboard('#9ca3af', 18), color: '#9ca3af' },
]
const JUDGES_LIST = ['Абдраимов К.М.', 'Маматова Г.Т.', 'Сыдыков Э.Б.', 'Бекбоева А.К.', 'Турсунов Д.А.', 'Кадыров Р.Б.', 'Усенова Н.Э.', 'Жумабеков Т.С.', 'Касымова Ж.Б.', 'Калыков А.Н.']
const ORGS_LIST = ['ГАФКиС КР', 'Федерация бокса КР', 'Федерация борьбы КР', 'Федерация дзюдо КР', 'ФФ КР', 'Федерация каратэ КР', 'Федерация тхэквондо КР', 'Федерация гимнастики КР', 'Федерация шахмат КР', 'Федерация плавания КР']

function typeObj(tp) { return EVENT_TYPE_DEFS.find(x => x.value === tp) || EVENT_TYPE_DEFS[5] }

const today = new Date()
today.setHours(0, 0, 0, 0)

function fmt(d) { return new Date(d).toLocaleDateString('ru-RU') }

function computeStatus(ev) {
    if (ev.cancelled) return 'cancelled'
    const s = new Date(ev.start); s.setHours(0,0,0,0)
    const e = new Date(ev.end); e.setHours(23,59,59,999)
    if (today < s) return 'planned'
    if (today > e) return 'finished'
    return 'live'
}

const COLORS = ['#2563EB', '#059669', '#7c3aed', '#d97706', '#e11d48', '#0d9488']
function getColor(id) { return COLORS[id % COLORS.length] }

const MOCK = [
    { id: 1,  title: 'Чемпионат КР по дзюдо 2026',                    type: 'championship',  sport: 'Дзюдо',            start: '2026-03-15', end: '2026-03-17', city: 'Бишкек',       venue: 'Дворец спорта им. Кожомкула', age: 'Взрослые',  level: 'Республиканский', organizer: 'ГАФКиС КР',                  judge: 'Абдраимов К.М.',  inPlan: true,  funded: true,  cancelled: false },
    { id: 2,  title: 'Кубок Бишкека по боксу',                         type: 'tournament',    sport: 'Бокс',             start: '2026-03-22', end: '2026-03-25', city: 'Бишкек',       venue: 'СК «Спартак»',                age: 'Взрослые',  level: 'Республиканский', organizer: 'Федерация бокса КР',          judge: 'Сыдыков Э.Б.',    inPlan: true,  funded: true,  cancelled: false },
    { id: 3,  title: 'Первенство КР по л/а - юниоры',                  type: 'premier',       sport: 'Лёгкая атлетика',  start: '2026-04-01', end: '2026-04-03', city: 'Бишкек',       venue: 'Стадион «Спартак»',           age: 'Юниоры',    level: 'Республиканский', organizer: 'ГАФКиС КР',                  judge: 'Бекбоева А.К.',   inPlan: true,  funded: true,  cancelled: false },
    { id: 4,  title: 'Спартакиада школьников КР - 2026',               type: 'spartakiad',    sport: 'Лёгкая атлетика',  start: '2026-04-10', end: '2026-04-15', city: 'Бишкек',       venue: 'Все спортивные объекты',       age: 'Кадеты',    level: 'Республиканский', organizer: 'ГАФКиС КР совместно с МОН',   judge: 'Комиссия ГАФКиС', inPlan: true,  funded: true,  cancelled: false },
    { id: 5,  title: 'Чемпионат Азии по борьбе - отбор',               type: 'international', sport: 'Борьба',           start: '2026-04-20', end: '2026-04-23', city: 'Бишкек',       venue: 'Дворец спорта им. Кожомкула', age: 'Взрослые',  level: 'Международный',   organizer: 'Азиатская конф. борьбы',      judge: 'Междунар. коллегия', inPlan: true, funded: true,  cancelled: false },
    { id: 6,  title: 'Республиканский турнир по каратэ',                type: 'tournament',    sport: 'Каратэ',           start: '2026-05-05', end: '2026-05-07', city: 'Ош',           venue: 'СК «Олимп»',                  age: 'Взрослые',  level: 'Республиканский', organizer: 'Федерация каратэ КР',         judge: 'Кадыров Р.Б.',    inPlan: true,  funded: true,  cancelled: false },
    { id: 7,  title: 'Кубок Президента КР по футболу',                 type: 'championship',  sport: 'Футбол',           start: '2026-05-15', end: '2026-05-25', city: 'Бишкек',       venue: 'Стадион «Дордой»',            age: 'Взрослые',  level: 'Республиканский', organizer: 'ФФ КР',                       judge: 'Турсунов Д.А.',   inPlan: true,  funded: true,  cancelled: false },
    { id: 8,  title: 'Первенство КР по плаванию - кадеты',             type: 'premier',       sport: 'Плавание',         start: '2026-06-01', end: '2026-06-03', city: 'Каракол',      venue: 'Водный центр «Иссык-Куль»',   age: 'Кадеты',    level: 'Республиканский', organizer: 'Федерация плавания КР',       judge: 'Усенова Н.Э.',    inPlan: true,  funded: true,  cancelled: false },
    { id: 9,  title: 'Междунар. турнир «Манас Опен» (тхэквондо)',      type: 'international', sport: 'Тхэквондо',        start: '2026-06-15', end: '2026-06-18', city: 'Бишкек',       venue: 'Дворец спорта им. Кожомкула', age: 'Взрослые',  level: 'Международный',   organizer: 'Федерация тхэквондо КР',     judge: 'Междунар. коллегия', inPlan: true, funded: true, cancelled: false },
    { id: 10, title: 'Товарищеский турнир по волейболу',                type: 'other',         sport: 'Волейбол',         start: '2026-07-05', end: '2026-07-06', city: 'Джалал-Абад',  venue: 'СК «Юность»',                 age: 'Взрослые',  level: 'Республиканский', organizer: 'Федерация волейбола КР',      judge: 'Калыков А.Н.',    inPlan: false, funded: false, cancelled: false },
    { id: 11, title: 'Чемпионат КР по гимнастике',                     type: 'championship',  sport: 'Гимнастика',       start: '2026-07-10', end: '2026-07-13', city: 'Бишкек',       venue: 'СДЮСШОР по гимнастике',       age: 'Взрослые',  level: 'Республиканский', organizer: 'Федерация гимнастики КР',     judge: 'Касымова Ж.Б.',   inPlan: true,  funded: true,  cancelled: false },
    { id: 12, title: 'Чемпионат мира по кок-бору',                     type: 'international', sport: 'Кок-бору',         start: '2026-09-01', end: '2026-09-07', city: 'Бишкек',       venue: 'Ипподром «Ак-Кула»',          age: 'Взрослые',  level: 'Международный',   organizer: 'Междунар. федерация кок-бору', judge: 'Междунар. коллегия', inPlan: true, funded: true, cancelled: false },
    { id: 13, title: 'Показательные выступления «Спорт для всех»',     type: 'other',         sport: 'Лёгкая атлетика',  start: '2026-10-10', end: '2026-10-10', city: 'Нарын',        venue: 'Городской стадион',            age: 'Взрослые',  level: 'Республиканский', organizer: 'Управление спорта Нарын',     judge: '-',               inPlan: false, funded: false, cancelled: false },
    { id: 14, title: 'Первенство КР по шахматам - юноши',              type: 'premier',       sport: 'Шахматы',          start: '2026-09-20', end: '2026-09-23', city: 'Бишкек',       venue: 'Шахматный клуб «Стратегия»',  age: 'Юниоры',    level: 'Республиканский', organizer: 'Федерация шахмат КР',         judge: 'Жумабеков Т.С.',  inPlan: true,  funded: true,  cancelled: false },
]

// make id=1 currently live
MOCK[0].start = new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10)
MOCK[0].end = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)

const PARTICIPANTS_MOCK = [
    { name: 'Асанов Бакыт',         region: 'Бишкек',    rank: 'МС КР',  weight: '73 кг' },
    { name: 'Кулматова Айгерим',     region: 'Бишкек',    rank: 'КМС',    weight: '57 кг' },
    { name: 'Джумабаев Эрлан',       region: 'Ош',        rank: 'МСМК',   weight: '81 кг' },
    { name: 'Бейшеналиев Данияр',    region: 'Нарын',     rank: 'МС КР',  weight: '90 кг' },
    { name: 'Сатыбалдиева Мээрим',   region: 'Бишкек',    rank: 'МС КР',  weight: '63 кг' },
    { name: 'Ормонов Алмаз',         region: 'Чуй',       rank: 'КМС',    weight: '68 кг' },
]

const RESULTS_MOCK = [
    { place: 1, medal: '●', name: 'Асанов Бакыт',      rank: 'МС КР', result: '1-е место' },
    { place: 2, medal: '●', name: 'Джумабаев Эрлан',    rank: 'МСМК',  result: '2-е место' },
    { place: 3, medal: '●', name: 'Бейшеналиев Данияр', rank: 'МС КР', result: '3-е место' },
    { place: 4, medal: '',   name: 'Ормонов Алмаз',      rank: 'КМС',   result: '4-е место' },
]

const DOCS_MOCK = [
    { name: 'Положение о соревновании', icon: '○', ok: true },
    { name: 'Приказ о проведении',      icon: '○', ok: true },
    { name: 'Протокол результатов',     icon: '○', ok: false },
]

const EMPTY_FORM = {
    title: '', type: '', sport: '', start: '', end: '', city: '',
    venue: '', age: 'Взрослые', level: 'Республиканский',
    organizer: '', judge: '', inPlan: true,
}

export default function Events() {
    const { t } = useTranslation()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800)
        return () => clearTimeout(timer)
    }, [])
    const [search, setSearch] = useState('')
    const [typeF, setTypeF] = useState('')
    const [sportF, setSportF] = useState('')
    const [statusF, setStatusF] = useState('all')
    const [planF, setPlanF] = useState('all')
    const [drawer, setDrawer] = useState(null)
    const [tab, setTab] = useState('info')
    const [addModal, setAddModal] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)

    const enriched = useMemo(() => MOCK.map(ev => ({ ...ev, _status: computeStatus(ev), _type: typeObj(ev.type) })), [])

    const filtered = useMemo(() => enriched.filter(ev => {
        if (search && !ev.title.toLowerCase().includes(search.toLowerCase())) return false
        if (typeF && ev.type !== typeF) return false
        if (sportF && ev.sport !== sportF) return false
        if (statusF !== 'all' && ev._status !== statusF) return false
        if (planF === 'in' && !ev.inPlan) return false
        if (planF === 'out' && ev.inPlan) return false
        return true
    }), [enriched, search, typeF, sportF, statusF, planF])

    const metrics = useMemo(() => ({
        total: enriched.length,
        planned: enriched.filter(e => e._status === 'planned').length,
        live: enriched.filter(e => e._status === 'live').length,
        finished: enriched.filter(e => e._status === 'finished').length,
        outPlan: enriched.filter(e => !e.inPlan).length,
    }), [enriched])

    const drawerEv = drawer !== null ? enriched.find(e => e.id === drawer) : null
    const openDrawer = (id) => { setDrawer(id); setTab('info') }
    const setField = (k, v) => setForm(p => ({ ...p, [k]: v }))

    const statusBadge = (s) => {
        const map = { planned: ['ev-badge--blue', t('events.statusPlanned')], live: ['ev-badge--red', t('events.statusLive')], finished: ['ev-badge--gray', t('events.statusFinished')], cancelled: ['ev-badge--dark', t('events.statusCancelled')] }
        const [cls, text] = map[s] || ['ev-badge--gray', s]
        return <span className={`ev-badge ${cls}`}>{text}</span>
    }

    return (
        <div className="ev-page">
            <Breadcrumbs current={t('events.registryTitle')} />
            {/* Header */}
            <div className="ev-header">
                <h1 className="ev-header__title">{t('events.registryTitle', { year: 2026 })}</h1>
                <button className="ev-header__btn" onClick={() => { setForm(EMPTY_FORM); setAddModal(true) }}>
                    <span>+</span> {t('events.createEvent')}
                </button>
            </div>

            {isLoading ? (
                <>
                    <MetricSkeleton count={5} />
                    <TableSkeleton rows={8} columns={9} />
                </>
            ) : (
                <>
            {/* Metrics */}
            <div className="ev-metrics">
                {[
                    { color: 'blue',   icon: MetricIcons.clipboard(), value: metrics.total,    label: t('events.metricsTotal') },
                    { color: 'cyan',   icon: MetricIcons.upcoming(), value: metrics.planned,  label: t('events.metricsUpcoming') },
                    { color: 'red',    icon: MetricIcons.live(), value: metrics.live,     label: t('events.metricsLive') },
                    { color: 'green',  icon: MetricIcons.active(), value: metrics.finished, label: t('events.metricsFinished') },
                    { color: 'orange', icon: MetricIcons.warning(), value: metrics.outPlan,  label: t('events.metricsNotInPlan') },
                ].map(m => (
                    <div className={`ev-metric ev-metric--${m.color}`} key={m.label}>
                        <div className="ev-metric__icon">{m.icon}</div>
                        <div className="ev-metric__body">
                            <span className="ev-metric__value">{m.value}</span>
                            <span className="ev-metric__label">{m.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="ev-filters">
                <div className="ev-filters__search">
                    <span className="ev-filters__search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder="Поиск по названию..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="ev-filters__select" value={typeF} onChange={e => setTypeF(e.target.value)}>
                    <option value="">{t('common.all')} {t('common.type').toLowerCase()}</option>
                    {EVENT_TYPE_DEFS.map(tp => <option key={tp.value} value={tp.value}>{tp.icon} {t(tp.labelKey)}</option>)}
                </select>
                <select className="ev-filters__select" value={sportF} onChange={e => setSportF(e.target.value)}>
                    <option value="">Все виды спорта</option>
                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="ev-filters__select" value={statusF} onChange={e => setStatusF(e.target.value)}>
                    <option value="all">Все статусы</option>
                    <option value="planned">Планируется</option>
                    <option value="live">Идёт</option>
                    <option value="finished">Завершено</option>
                    <option value="cancelled">Отменено</option>
                </select>
                <select className="ev-filters__select" value={planF} onChange={e => setPlanF(e.target.value)}>
                    <option value="all">План: все</option>
                    <option value="in">В плане</option>
                    <option value="out">Вне плана</option>
                </select>
            </div>

            {/* Table */}
            <div className="ev-table-wrap">
                <table className="ev-table">
                    <thead>
                        <tr>
                            <th>{t('events.table.name')}</th>
                            <th>{t('events.table.type')}</th>
                            <th>{t('fields.sport')}</th>
                            <th>{t('events.table.dates')}</th>
                            <th>{t('events.table.location')}</th>
                            <th>{t('events.table.judge')}</th>
                            <th>{t('events.table.inPlan')}</th>
                            <th>{t('common.status')}</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && <tr><td colSpan={9} className="ev-table__empty">Мероприятия не найдены</td></tr>}
                        {filtered.map(ev => (
                            <tr key={ev.id}>
                                <td>
                                    <span className="ev-title-cell">{ev.title}</span>
                                </td>
                                <td>
                                    <span className="ev-type-badge" style={{ background: ev._type.color + '18', color: ev._type.color, borderColor: ev._type.color + '40' }}>
                                        {ev._type.icon} {t(ev._type.labelKey)}
                                    </span>
                                </td>
                                <td>{ev.sport}</td>
                                <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>{fmt(ev.start)} - {fmt(ev.end)}</td>
                                <td style={{ fontSize: 12 }}>{ev.city}</td>
                                <td style={{ fontSize: 12 }}>{ev.judge}</td>
                                <td>
                                    {ev.inPlan
                                        ? <span className="ev-plan ev-plan--in">{t('events.planInPlan')}</span>
                                        : <span className="ev-plan ev-plan--out">{t('events.planNotInPlan')}</span>
                                    }
                                </td>
                                <td>{statusBadge(ev._status)}</td>
                                <td>
                                    <button className="ev-btn ev-btn--primary" onClick={() => openDrawer(ev.id)}>Открыть</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </>
            )}

            {/* ═══ DRAWER ═══ */}
            {drawerEv && (
                <Portal>
                <div className="ev-drawer-overlay" onClick={() => setDrawer(null)}>
                    <div className="ev-drawer" onClick={e => e.stopPropagation()}>
                        <div className="ev-drawer__header">
                            <div>
                                <div className="ev-drawer__name">{drawerEv.title}</div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <span className="ev-type-badge" style={{ background: drawerEv._type.color + '18', color: drawerEv._type.color, borderColor: drawerEv._type.color + '40' }}>
                                        {drawerEv._type.icon} {t(drawerEv._type.labelKey)}
                                    </span>
                                    {statusBadge(drawerEv._status)}
                                    {drawerEv.inPlan
                                        ? <span className="ev-plan ev-plan--in">{t('events.planInPlan')}</span>
                                        : <span className="ev-plan ev-plan--out">{t('events.planNotInPlan')}</span>
                                    }
                                </div>
                            </div>
                            <button className="ev-drawer__close" onClick={() => setDrawer(null)}>✕</button>
                        </div>

                        <div className="ev-tabs">
                            {['info', 'participants', 'results', 'docs'].map(tabKey => (
                                <button key={tabKey} className={`ev-tab ${tab === tabKey ? 'ev-tab--active' : ''}`} onClick={() => setTab(tabKey)}>
                                    {{ info: t('events.tabs.main'), participants: t('events.tabs.participants'), results: t('events.tabs.results'), docs: t('events.tabs.documents') }[tabKey]}
                                </button>
                            ))}
                        </div>

                        <div className="ev-drawer__body">
                            {tab === 'info' && (
                                <>
                                    {!drawerEv.inPlan && (
                                        <div className="ev-warn-banner">
                                            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#d97706', marginRight: 4 }} />
                                            <div>
                                                <strong>Мероприятие не включено в календарный план ГАФКиС.</strong><br />
                                                Государственное финансирование недоступно (Ст. 23 Закона КР № 36).
                                            </div>
                                        </div>
                                    )}
                                    <div className="ev-info-grid">
                                        {[
                                            [t('events.table.name'), drawerEv.title],
                                            [t('events.table.type'), `${drawerEv._type.icon} ${t(drawerEv._type.labelKey)}`],
                                            [t('fields.sport'), drawerEv.sport],
                                            [t('events.info.ageGroup'), drawerEv.age],
                                            [t('events.info.level'), drawerEv.level],
                                            [t('events.info.startDate'), fmt(drawerEv.start)],
                                            [t('events.info.endDate'), fmt(drawerEv.end)],
                                            [t('events.info.city'), drawerEv.city],
                                            [t('events.info.facility'), drawerEv.venue],
                                            [t('events.info.organizer'), drawerEv.organizer],
                                            [t('events.info.chiefJudge'), drawerEv.judge],
                                            [t('events.table.inPlan'), drawerEv.inPlan ? 'Да' : 'Нет'],
                                            [t('events.info.funding'), drawerEv.funded ? 'Государственное' : 'Не предусмотрено'],
                                        ].map(([label, val]) => (
                                            <div className="ev-info-item" key={label}>
                                                <div className="ev-info-item__label">{label}</div>
                                                <div className="ev-info-item__value">{val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {tab === 'participants' && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Участники ({PARTICIPANTS_MOCK.length})</span>
                                        <button className="ev-btn ev-btn--small" onClick={() => toast('Добавить участника (демо)')}>+ Добавить</button>
                                    </div>
                                    <table className="ev-inner-table">
                                        <thead><tr><th>№</th><th>{t('events.participantsTable.athlete')}</th><th>{t('events.participantsTable.region')}</th><th>{t('events.participantsTable.rank')}</th><th>{t('events.participantsTable.weight')}</th></tr></thead>
                                        <tbody>
                                            {PARTICIPANTS_MOCK.map((p, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                                                    <td>{p.region}</td>
                                                    <td>{p.rank}</td>
                                                    <td>{p.weight}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}

                            {tab === 'results' && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Результаты</span>
                                        <button className="ev-btn ev-btn--small" onClick={() => toast('Внести результаты (демо)')}>+ Внести результаты</button>
                                    </div>
                                    <div className="ev-result-hint">
                                        Результаты могут быть основанием для присвоения спортивного разряда/звания (БСК КР 2025-2028, Глава VI).
                                    </div>
                                    {drawerEv._status === 'finished' || drawerEv._status === 'live' ? (
                                        <table className="ev-inner-table">
                                            <thead><tr><th>{t('events.resultsTable.place')}</th><th></th><th>{t('events.resultsTable.athlete')}</th><th>{t('events.resultsTable.rank')}</th><th>{t('events.resultsTable.result')}</th></tr></thead>
                                            <tbody>
                                                {RESULTS_MOCK.map((r, i) => (
                                                    <tr key={i} style={r.place <= 3 ? { background: r.place === 1 ? '#fffbeb' : r.place === 2 ? '#f8fafc' : '#fefce8' } : {}}>
                                                        <td style={{ fontWeight: 700, fontSize: 15 }}>{r.place}</td>
                                                        <td style={{ fontSize: 22 }}>{r.medal}</td>
                                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</td>
                                                        <td>{r.rank}</td>
                                                        <td>{r.result}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
                                            Результаты будут доступны после проведения мероприятия
                                        </p>
                                    )}
                                </>
                            )}

                            {tab === 'docs' && (
                                <div className="ev-doc-list">
                                    {DOCS_MOCK.map(doc => (
                                        <div key={doc.name} className={`ev-doc-item ${doc.ok ? 'ev-doc-item--ok' : 'ev-doc-item--no'}`}>
                                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: doc.ok ? '#16a34a' : '#ef4444' }} />
                                            <span className="ev-doc-item__name">{doc.icon} {doc.name}</span>
                                            {doc.ok && <button className="ev-btn ev-btn--small" onClick={() => toast(`Просмотр: ${doc.name}`)}>Просмотр</button>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="ev-drawer__footer">
                            <button className="ev-btn ev-btn--primary" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => toast('Редактирование')}>{t('common.edit')}</button>
                            <button className="ev-btn ev-btn--green" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => toast('Опубликовано на сайте (демо)')}>{t('events.actions.publish')}</button>
                            <button className="ev-btn ev-btn--outline" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => toast('Формирование протокола (демо)')}>{t('events.actions.protocol')}</button>
                            <button className="ev-btn ev-btn--red" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => toast('Мероприятие отменено (демо)')}>{t('events.actions.cancel')}</button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}

            {/* ═══ ADD MODAL ═══ */}
            {addModal && (
                <Portal>
                <div className="ev-modal-overlay" onClick={() => setAddModal(false)}>
                    <div className="ev-modal" onClick={e => e.stopPropagation()}>
                        <div className="ev-modal__header">
                            <h2 className="ev-modal__title">{t('events.createEvent')}</h2>
                            <button className="ev-modal__close" onClick={() => setAddModal(false)}>✕</button>
                        </div>
                        <div className="ev-modal__body">
                            <div className="ev-modal__grid">
                                <h4 className="ev-modal__section-title">{t('events.modal.mainInfo')}</h4>

                                <div className="ev-modal__field ev-modal__field--full">
                                    <label className="ev-modal__label">{t('events.table.name')} <span>*</span></label>
                                    <input className="ev-modal__input" value={form.title} onChange={e => setField('title', e.target.value)} placeholder="Чемпионат КР по..." />
                                </div>
                                <div className="ev-modal__field">
                                    <label className="ev-modal__label">{t('events.form.eventType')} <span>*</span></label>
                                    <select className="ev-modal__input" value={form.type} onChange={e => setField('type', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {EVENT_TYPE_DEFS.map(tp => <option key={tp.value} value={tp.value}>{tp.icon} {t(tp.labelKey)}</option>)}
                                    </select>
                                </div>
                                <div className="ev-modal__field">
                                    <label className="ev-modal__label">{t('fields.sport')} <span>*</span></label>
                                    <select className="ev-modal__input" value={form.sport} onChange={e => setField('sport', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="ev-modal__field">
                                    <label className="ev-modal__label">{t('events.info.startDate')} <span>*</span></label>
                                    <input className="ev-modal__input" type="date" value={form.start} onChange={e => setField('start', e.target.value)} />
                                </div>
                                <div className="ev-modal__field">
                                    <label className="ev-modal__label">{t('events.info.endDate')} <span>*</span></label>
                                    <input className="ev-modal__input" type="date" value={form.end} onChange={e => setField('end', e.target.value)} />
                                </div>

                                <h4 className="ev-modal__section-title">{t('events.modal.location')}</h4>

                                <div className="ev-modal__field">
                                    <label className="ev-modal__label">{t('events.info.city')} <span>*</span></label>
                                    <select className="ev-modal__input" value={form.city} onChange={e => setField('city', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="ev-modal__field">
                                    <label className="ev-modal__label">{t('events.info.facility')}</label>
                                    <input className="ev-modal__input" value={form.venue} onChange={e => setField('venue', e.target.value)} placeholder="Дворец спорта..." />
                                </div>

                                <h4 className="ev-modal__section-title">{t('events.modal.organization')}</h4>

                                <div className="ev-modal__field">
                                    <label className="ev-modal__label">{t('events.form.ageGroup')}</label>
                                    <select className="ev-modal__input" value={form.age} onChange={e => setField('age', e.target.value)}>
                                        {AGES_VALUES.map((a, i) => <option key={a} value={a}>{t(AGES_KEYS[i])}</option>)}
                                    </select>
                                </div>
                                <div className="ev-modal__field">
                                    <label className="ev-modal__label">{t('events.form.level')}</label>
                                    <select className="ev-modal__input" value={form.level} onChange={e => setField('level', e.target.value)}>
                                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="ev-modal__field">
                                    <label className="ev-modal__label">{t('events.form.organizer')} <span>*</span></label>
                                    <select className="ev-modal__input" value={form.organizer} onChange={e => setField('organizer', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {ORGS_LIST.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="ev-modal__field">
                                    <label className="ev-modal__label">{t('events.form.chiefJudge')}</label>
                                    <select className="ev-modal__input" value={form.judge} onChange={e => setField('judge', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {JUDGES_LIST.map(j => <option key={j} value={j}>{j}</option>)}
                                    </select>
                                </div>

                                {/* Plan checkbox */}
                                <div className="ev-modal__field ev-modal__field--full">
                                    <label className="ev-plan-checkbox">
                                        <input type="checkbox" checked={form.inPlan} onChange={e => setField('inPlan', e.target.checked)} />
                                        <span>{t('events.form.calendarPlan')}</span>
                                    </label>
                                    {!form.inPlan && (
                                        <div className="ev-plan-warn">
                                            Мероприятия вне плана не финансируются государством (Ст. 23 Закона КР № 36)
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="ev-modal__footer">
                            <button className="ev-btn ev-btn--outline" onClick={() => setAddModal(false)}>{t('common.cancel')}</button>
                            <button className="ev-btn ev-btn--primary" style={{ padding: '10px 24px' }} onClick={() => { toast('Мероприятие создано (демо)'); setAddModal(false) }}>{t('events.createEvent')}</button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}
        </div>
    )
}