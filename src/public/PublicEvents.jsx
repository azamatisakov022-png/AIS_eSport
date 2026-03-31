import { useState, useMemo } from 'react'
import { useScrollReveal, useAnimatedCounter, useCardTilt } from './useDesignEffects'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PublicHero, { PublicHeroCounter } from './components/PublicHero'
import PublicSelect from './components/PublicSelect'

const MOCK_EVENTS = ['Бокс', 'Борьба', 'Дзюдо', 'Футбол', 'Плавание', 'Лёгкая атлетика', 'Каратэ', 'Тхэквондо', 'Гимнастика', 'Шахматы', 'Волейбол', 'Баскетбол', 'Тяжёлая атлетика', 'Кок-бору']
const SPORTS = MOCK_EVENTS
const MONTHS_RU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const REGIONS = ['Бишкек', 'Ош', 'Каракол', 'Джалал-Абад', 'Нарын', 'Талас', 'Баткен', 'Токмок', 'Балыкчы']
const TYPES = [
    { value: 'international', labelKey: 'public.typeInternational', icon: '', color: '#F59E0B' },
    { value: 'championship',  labelKey: 'public.typeChampionship',  icon: '', color: '#1a1a1a' },
    { value: 'premier',       labelKey: 'public.typePremier',       icon: '', color: '#7C3AED' },
    { value: 'spartakiad',    labelKey: 'public.typeSpartakiad',    icon: '', color: '#16A34A' },
    { value: 'tournament',    labelKey: 'public.typeTournament',    icon: '', color: '#0EA5E9' },
    { value: 'other',         labelKey: 'public.typeOther',         icon: '', color: '#9ca3af' },
]

function typeObj(tp) { return TYPES.find(x => x.value === tp) || TYPES[5] }

const today = new Date()
today.setHours(0, 0, 0, 0)

function fmt(d) { return new Date(d).toLocaleDateString('ru-RU') }

function eventStatus(start, end) {
    const s = new Date(start); s.setHours(0,0,0,0)
    const e = new Date(end); e.setHours(23,59,59,999)
    if (today < s) return 'upcoming'
    if (today > e) return 'finished'
    return 'live'
}

export const EVENTS_DATA = [
    { id: 1,  title: 'Чемпионат КР по дзюдо 2026',                      type: 'championship',  sport: 'Дзюдо',            start: '2026-03-15', end: '2026-03-17', city: 'Бишкек',       venue: 'Дворец спорта им. Кожомкула', age: 'Взрослые',  organizer: 'ГАФКиС КР', judge: 'Абдраимов К.М.', desc: 'Ежегодный чемпионат Кыргызской Республики по дзюдо среди мужчин и женщин.' },
    { id: 2,  title: 'Кубок Бишкека по боксу',                           type: 'tournament',    sport: 'Бокс',             start: '2026-03-22', end: '2026-03-25', city: 'Бишкек',       venue: 'СК «Спартак»',                age: 'Взрослые',  organizer: 'Федерация бокса КР', judge: 'Сыдыков Э.Б.', desc: 'Традиционный республиканский турнир по боксу.' },
    { id: 3,  title: 'Первенство КР по лёгкой атлетике - юниоры',        type: 'premier',       sport: 'Лёгкая атлетика',  start: '2026-04-01', end: '2026-04-03', city: 'Бишкек',       venue: 'Стадион «Спартак»',           age: 'Юниоры',    organizer: 'ГАФКиС КР', judge: 'Бекбоева А.К.', desc: 'Первенство среди юниоров по лёгкой атлетике.' },
    { id: 4,  title: 'Спартакиада школьников КР - 2026',                 type: 'spartakiad',    sport: 'Лёгкая атлетика',  start: '2026-04-10', end: '2026-04-15', city: 'Бишкек',       venue: 'Все спортивные объекты',       age: 'Кадеты',    organizer: 'ГАФКиС КР совместно с МОН КР', judge: 'Комиссия ГАФКиС', desc: 'Ежегодная республиканская спартакиада школьников.' },
    { id: 5,  title: 'Чемпионат Азии по борьбе - отборочный',            type: 'international', sport: 'Борьба',           start: '2026-04-20', end: '2026-04-23', city: 'Бишкек',       venue: 'Дворец спорта им. Кожомкула', age: 'Взрослые',  organizer: 'Азиатская конфедерация борьбы', judge: 'Международная коллегия', desc: 'Отборочный чемпионат Азии среди борцов вольного стиля.' },
    { id: 6,  title: 'Республиканский турнир по каратэ',                  type: 'tournament',    sport: 'Каратэ',           start: '2026-05-05', end: '2026-05-07', city: 'Ош',           venue: 'СК «Олимп»',                  age: 'Взрослые',  organizer: 'Федерация каратэ КР', judge: 'Кадыров Р.Б.', desc: 'Турнир среди спортсменов карате всех возрастных категорий.' },
    { id: 7,  title: 'Кубок Президента КР по футболу',                   type: 'championship',  sport: 'Футбол',           start: '2026-05-15', end: '2026-05-25', city: 'Бишкек',       venue: 'Стадион «Дордой»',            age: 'Взрослые',  organizer: 'ФФ КР', judge: 'Ормонов А.К.', desc: 'Ежегодный розыгрыш Кубка Президента КР по футболу.' },
    { id: 8,  title: 'Первенство КР по плаванию - кадеты',               type: 'premier',       sport: 'Плавание',         start: '2026-06-01', end: '2026-06-03', city: 'Каракол',      venue: 'Водный центр «Иссык-Куль»',   age: 'Кадеты',    organizer: 'ГАФКиС КР', judge: 'Усенова Н.Э.', desc: 'Первенство среди кадетов по плаванию.' },
    { id: 9,  title: 'Международный турнир по тхэквондо «Манас Опен»',   type: 'international', sport: 'Тхэквондо',        start: '2026-06-15', end: '2026-06-18', city: 'Бишкек',       venue: 'Дворец спорта им. Кожомкула', age: 'Взрослые',  organizer: 'Федерация тхэквондо КР', judge: 'Международная коллегия', desc: 'Открытый международный турнир «Манас Опен» по тхэквондо.' },
    { id: 10, title: 'Чемпионат КР по гимнастике',                       type: 'championship',  sport: 'Гимнастика',       start: '2026-07-10', end: '2026-07-13', city: 'Бишкек',       venue: 'СДЮСШОР по гимнастике',       age: 'Взрослые',  organizer: 'Федерация гимнастики КР', judge: 'Касымова Ж.Б.', desc: 'Чемпионат Кыргызстана по спортивной гимнастике.' },
    { id: 11, title: 'Спартакиада среди ветеранов',                       type: 'spartakiad',    sport: 'Лёгкая атлетика',  start: '2026-08-01', end: '2026-08-05', city: 'Каракол',      venue: 'Городской стадион Каракол',    age: 'Ветераны',  organizer: 'ГАФКиС КР', judge: 'Комиссия ГАФКиС', desc: 'Спартакиада среди ветеранов спорта Кыргызской Республики.' },
    { id: 12, title: 'Чемпионат мира по кок-бору - Бишкек',              type: 'international', sport: 'Кок-бору',         start: '2026-09-01', end: '2026-09-07', city: 'Бишкек',       venue: 'Ипподром «Ак-Кула»',          age: 'Взрослые',  organizer: 'Международная федерация кок-бору', judge: 'Международная коллегия', desc: 'Чемпионат мира по национальному конному виду спорта.' },
    { id: 13, title: 'Первенство КР по шахматам - юноши',                type: 'premier',       sport: 'Шахматы',          start: '2026-09-20', end: '2026-09-23', city: 'Бишкек',       venue: 'Шахматный клуб «Стратегия»',  age: 'Юниоры',    organizer: 'Федерация шахмат КР', judge: 'Жумабеков Т.С.', desc: 'Первенство среди юношей до 18 лет.' },
    { id: 14, title: 'Республиканский турнир по волейболу',               type: 'tournament',    sport: 'Волейбол',         start: '2026-10-05', end: '2026-10-09', city: 'Джалал-Абад',  venue: 'СК «Юность»',                 age: 'Взрослые',  organizer: 'Федерация волейбола КР', judge: 'Калыков А.Н.', desc: 'Турнир по волейболу среди команд регионов.' },
    { id: 15, title: 'Международный марафон «Иссык-Куль 2026»',          type: 'international', sport: 'Лёгкая атлетика',  start: '2026-10-20', end: '2026-10-20', city: 'Балыкчы',      venue: 'Побережье Иссык-Куля',        age: 'Взрослые',  organizer: 'ГАФКиС КР', judge: 'Комиссия ГАФКиС', desc: 'Международный забег вокруг озера Иссык-Куль.' },
    { id: 16, title: 'Закрытие спортивного сезона - гала-турнир',         type: 'other',         sport: 'Лёгкая атлетика',  start: '2026-12-15', end: '2026-12-16', city: 'Бишкек',       venue: 'Дворец спорта им. Кожомкула', age: 'Взрослые',  organizer: 'ГАФКиС КР', judge: 'Комиссия ГАФКиС', desc: 'Торжественное завершение спортивного сезона с показательными выступлениями.' },
]

// pre-finished events for results
const FINISHED_IDS = [1, 2]
EVENTS_DATA[0].end = '2026-03-11'
EVENTS_DATA[0].start = '2026-03-09'
EVENTS_DATA[1].end = '2026-03-10'
EVENTS_DATA[1].start = '2026-03-08'

export default function PublicEvents() {
    const { t } = useTranslation()
    const revealCards = useScrollReveal(0.08)
    const tilt = useCardTilt(4)
    const [view, setView] = useState('list')
    const [search, setSearch] = useState('')
    const [typeF, setTypeF] = useState('')
    const [sportF, setSportF] = useState('')
    const [regionF, setRegionF] = useState('')
    const [monthF, setMonthF] = useState('')

    const enriched = useMemo(() => EVENTS_DATA.map(ev => ({
        ...ev, _status: eventStatus(ev.start, ev.end), _type: typeObj(ev.type),
    })), [])

    const filtered = useMemo(() => {
        return enriched.filter(ev => {
            if (search && !ev.title.toLowerCase().includes(search.toLowerCase())) return false
            if (typeF && ev.type !== typeF) return false
            if (sportF && ev.sport !== sportF) return false
            if (regionF && ev.city !== regionF) return false
            if (monthF) {
                const m = new Date(ev.start).getMonth()
                if (m !== parseInt(monthF)) return false
            }
            return true
        })
    }, [enriched, search, typeF, sportF, regionF, monthF])

    const intlCount = enriched.filter(e => e.type === 'international').length
    const next30 = enriched.filter(e => {
        const d = new Date(e.start)
        const diff = (d - today) / (1000 * 60 * 60 * 24)
        return diff >= 0 && diff <= 30
    }).length

    const resetFilters = () => { setSearch(''); setTypeF(''); setSportF(''); setRegionF(''); setMonthF('') }

    /* calendar grid */
    const calendarByMonth = useMemo(() => {
        const months = Array.from({ length: 12 }, () => [])
        enriched.forEach(ev => {
            const m = new Date(ev.start).getMonth()
            months[m].push(ev)
        })
        return months
    }, [enriched])

    return (
        <>
            {/* Hero */}
            <PublicHero title={t('public.eventsCalendarTitle')} description={t('public.eventsHeroSub')} variant="indigo" layoutMode="abstract">
                <PublicHeroCounter animRef={{current: null}} value={enriched.length} label={t('public.eventsIn2026')} />
                <PublicHeroCounter animRef={{current: null}} value={next30} label={t('public.eventsUpcoming30')} />
                <PublicHeroCounter animRef={{current: null}} value={intlCount} label={t('public.eventsInternational')} />
            </PublicHero>

            <div className="pub-section">
                <div className="pub-container">
                    {/* View toggle + Filters */}
                    <div style={h.toolbar}>
                        <div style={h.viewToggle}>
                            <button style={{ ...h.viewBtn, ...(view === 'list' ? h.viewBtnActive : {}) }} onClick={() => setView('list')}>{t('public.listView')}</button>
                            <button style={{ ...h.viewBtn, ...(view === 'calendar' ? h.viewBtnActive : {}) }} onClick={() => setView('calendar')}>{t('public.calendarView')}</button>
                        </div>
                    </div>

                    <div style={h.filters}>
                        <div style={h.searchWrap}>
                            <span style={h.searchIcon}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
                            <input style={h.searchInput} placeholder={t('public.searchByTitle') || 'Поиск...'} value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <PublicSelect style={{...h.select, width: 200}} value={typeF} onChange={setTypeF} placeholder={t('public.allTypes') || 'Все типы'} options={[{value:'', label: t('public.allTypes') || 'Все типы'}, ...TYPES.map(tp => ({value: tp.value, label: `${tp.icon} ${t(tp.labelKey) || tp.value}`}))]} />
                        <PublicSelect style={{...h.select, width: 200}} value={sportF} onChange={setSportF} placeholder={t('public.allSports') || 'Все виды спорта'} options={[{value:'', label: t('public.allSports') || 'Все виды спорта'}, ...SPORTS.map(sp => ({value: sp, label: sp}))]} />
                        <PublicSelect style={{...h.select, width: 200}} value={monthF} onChange={setMonthF} placeholder={t('public.allMonths') || 'Все месяцы'} options={[{value:'', label: t('public.allMonths') || 'Все месяцы'}, ...MONTHS_RU.map((m, i) => ({value: String(i), label: m}))]} />
                        <PublicSelect style={{...h.select, width: 200}} value={regionF} onChange={setRegionF} placeholder={t('public.allRegions') || 'Все регионы'} options={[{value:'', label: t('public.allRegions') || 'Все регионы'}, ...REGIONS.map(r => ({value: r, label: r}))]} />
                        <button style={h.resetBtn} onClick={resetFilters}>{t('public.reset') || 'Сбросить'}</button>
                    </div>

                    {/* ═══ LIST VIEW ═══ */}
                    {view === 'list' && (
                        <div ref={revealCards} className="scroll-reveal" style={h.cardList}>
                            {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'var(--theme-text-secondary)', padding: 40 }}>{t('public.eventsNotFound')}</p>}
                            {filtered.map((ev, idx) => (
                                <div key={ev.id} className="pub-card stagger-item card-tilt-3d" style={{ ...h.card, '--i': idx }} {...tilt}>
                                    <div style={h.cardBody}>
                                        <div style={h.cardTop}>
                                            <span style={{ ...h.typeBadge, background: ev._type.color + '18', color: ev._type.color, borderColor: ev._type.color + '40' }}>
                                                {ev._type.icon} {t(ev._type.labelKey)}
                                            </span>
                                            <span style={h.sportTag}>{ev.sport}</span>
                                            {ev._status === 'upcoming' && <span style={h.statusUpcoming}>{t('public.upcoming')}</span>}
                                            {ev._status === 'live' && <span style={h.statusLive}>{t('public.eventLive')}</span>}
                                            {ev._status === 'finished' && <span style={h.statusFinished}>{t('public.eventFinished')}</span>}
                                        </div>
                                        <h3 style={h.cardTitle}>{ev.title}</h3>
                                        <div style={h.cardMeta}>
                                            <span>{fmt(ev.start)}{ev.start !== ev.end ? ` - ${fmt(ev.end)}` : ''}</span>
                                            <span>{ev.city}, {ev.venue}</span>
                                            <span>{ev.age}</span>
                                        </div>
                                    </div>
                                    <div style={h.cardActions}>
                                        <Link to={`/public/events/${ev.id}`} style={h.detailBtn}>{t('public.moreDetails')}</Link>
                                        {ev._status === 'finished' && (
                                            <Link to={`/public/events/${ev.id}`} style={h.resultBtn}>{t('public.eventResults')}</Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ═══ CALENDAR VIEW ═══ */}
                    {view === 'calendar' && (
                        <div style={h.calGrid}>
                            {calendarByMonth.map((events, mi) => (
                                <div key={mi} style={h.calMonth}>
                                    <div style={h.calMonthTitle}>{t('public.months', { returnObjects: true })[mi]}</div>
                                    <div style={h.calMonthBody}>
                                        {events.length === 0 && <span style={{ fontSize: 12, color: 'var(--theme-text-secondary)' }}>-</span>}
                                        {events.map(ev => {
                                            const tp = typeObj(ev.type)
                                            return (
                                                <Link key={ev.id} to={`/public/events/${ev.id}`} style={{ ...h.calEvent, borderLeftColor: tp.color, textDecoration: 'none' }}>
                                                    <span style={{ fontSize: 11, color: tp.color, fontWeight: 700 }}>{tp.icon}</span>
                                                    <span style={{ fontSize: 11, color: '#1a1a1a', lineHeight: 1.3 }}>{ev.title}</span>
                                                    <span style={{ fontSize: 10, color: 'var(--theme-text-secondary)' }}>{new Date(ev.start).getDate()}-{new Date(ev.end).getDate()}</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

const h = {
    hero: {
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        padding: '36px 0 28px', color: '#fff', borderRadius: '0 0 20px 20px',
    },
    heroTitle: { fontSize: 28, fontWeight: 500, margin: 0, marginBottom: 8 },
    heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, marginBottom: 28 },
    heroCounters: { display: 'flex', gap: 16, flexWrap: 'wrap' },
    heroCounter: { display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 24px' },
    heroCounterValue: { fontSize: 22, fontWeight: 500 },
    heroCounterLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },

    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    viewToggle: { display: 'flex', gap: 0, border: '1px solid #d2d2d7', borderRadius: 12, overflow: 'hidden' },
    viewBtn: {
        padding: '10px 20px', border: 'none', background: 'var(--theme-bg-card)',
        fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
        color: 'var(--theme-text-secondary)', transition: 'all 0.2s',
    },
    viewBtnActive: { background: '#1a1a1a', color: '#fff' },

    filters: {
        display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center',
    },
    searchWrap: { position: 'relative', flex: 1, minWidth: 200 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' },
    searchInput: {
        width: '100%', height: '46px', padding: '12px 16px 12px 36px',
        border: '1px solid var(--theme-border)', borderRadius: 12, fontSize: 14,
        fontFamily: 'inherit', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.25s ease'
    },
    select: {
        padding: '10px 12px', border: '1px solid #d2d2d7', borderRadius: 12,
        fontSize: 13, fontFamily: 'inherit', color: '#1a1a1a', outline: 'none',
        background: 'var(--theme-bg-card)', cursor: 'pointer',
    },
    resetBtn: {
        padding: '10px 16px', border: '1px solid #d2d2d7', borderRadius: 12,
        fontSize: 13, fontFamily: 'inherit', color: 'var(--theme-text-secondary)', background: 'var(--theme-bg-card)',
        cursor: 'pointer', transition: 'all 0.2s',
    },

    cardList: { display: 'flex', flexDirection: 'column', gap: 14 },
    card: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 24px', position: 'relative', overflow: 'hidden',
        gap: 20, flexWrap: 'wrap',
    },
    cardBody: { flex: 1, minWidth: 0 },
    cardTop: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 },
    typeBadge: {
        display: 'inline-block', padding: '3px 10px', borderRadius: 16,
        fontSize: 11, fontWeight: 800, border: '1px solid',
    },
    sportTag: {
        display: 'inline-block', padding: '2px 8px', borderRadius: 10,
        fontSize: 11, fontWeight: 500, background: '#f5f5f7', color: '#6e6e73',
    },
    statusUpcoming: {
        display: 'inline-block', padding: '2px 10px', borderRadius: 10,
        fontSize: 11, fontWeight: 700, background: '#dbeafe', color: '#1d4ed8',
    },
    statusLive: {
        display: 'inline-block', padding: '2px 10px', borderRadius: 10,
        fontSize: 11, fontWeight: 700, background: '#fee2e2', color: '#dc2626',
        animation: 'pubEvPulse 1.5s infinite',
    },
    statusFinished: {
        display: 'inline-block', padding: '2px 10px', borderRadius: 10,
        fontSize: 11, fontWeight: 700, background: '#f3f4f6', color: '#6b7280',
    },
    cardTitle: { fontSize: 16, fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px' },
    cardMeta: { display: 'flex', gap: 20, fontSize: 13, color: 'var(--theme-text-secondary)', flexWrap: 'wrap' },
    cardActions: { display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 },
    detailBtn: {
        display: 'inline-block', padding: '8px 20px', background: '#1a1a1a', color: '#fff',
        borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none',
        textAlign: 'center', transition: 'background 0.2s',
    },
    resultBtn: {
        display: 'inline-block', padding: '8px 20px', background: '#f0fdf4', color: '#16a34a',
        border: '1px solid #bbf7d0', borderRadius: 12, fontSize: 13, fontWeight: 700,
        textDecoration: 'none', textAlign: 'center',
    },

    calGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 },
    calMonth: {
        background: 'var(--theme-bg-card)', border: '1px solid #d2d2d7', borderRadius: 10,
        overflow: 'hidden', minHeight: 120,
    },
    calMonthTitle: {
        padding: '10px 14px', fontSize: 14, fontWeight: 800, color: '#1a1a1a',
        background: '#f5f5f7', borderBottom: '1px solid #d2d2d7',
    },
    calMonthBody: { padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 },
    calEvent: {
        display: 'flex', gap: 6, alignItems: 'flex-start', padding: '4px 8px',
        borderLeft: '3px solid', borderRadius: '0 4px 4px 0', background: '#f5f5f7',
    },
}
