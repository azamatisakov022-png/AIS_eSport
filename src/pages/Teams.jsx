import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import { CardSkeleton, MetricSkeleton } from '../components/Skeleton'
import './Teams.css'
import Portal from '../components/Portal'
import Breadcrumbs from '../components/Breadcrumbs'

/* ── Mock data ── */
const SPORTS = ['Бокс','Дзюдо','Борьба','Тхэквондо','Тяжёлая атлетика','Футбол','Волейбол','Плавание','Лёгкая атлетика','Стрельба']
const AGE_CAT_KEYS = [
    { value: 'Взрослые', key: 'ageGroup.adults' },
    { value: 'Юниоры', key: 'ageGroup.juniors' },
    { value: 'Кадеты', key: 'ageGroup.cadets' },
    { value: 'Ветераны', key: 'ageGroup.veterans' },
]
const GENDER_KEYS = [
    { value: 'Мужская', key: 'teams.genderMale' },
    { value: 'Женская', key: 'teams.genderFemale' },
    { value: 'Смешанная', key: 'teams.genderMixed' },
]
const STATUS_KEYS = [
    { value: 'Активная', key: 'teams.statusActive' },
    { value: 'Формируется', key: 'teams.statusForming' },
    { value: 'Расформирована', key: 'teams.statusDisbanded' },
]

const TEAMS_DATA = [
    {
        id: 1, name: 'Сборная КР по боксу (мужчины, взрослые)', sport: 'Бокс',
        ageCat: 'Взрослые', gender: 'Мужская', status: 'Активная',
        headCoach: 'Алымкулов Бакыт Сапарович', seniorCoach: 'Исаков Жолдошбек Маратович', personalCoach: 'Турдубаев Эмиль Кайратович',
        doctor: 'Касымова Айгерим Таалайбековна',
        athletes: [
            { name: 'Асанов Бакыт Маратович', rank: 'МСМК', role: 'Капитан', since: 2019 },
            { name: 'Джумабаев Эрлан Калыкович', rank: 'МС КР', role: 'Основной состав', since: 2021 },
            { name: 'Бейшеналиев Данияр Кубатович', rank: 'МС КР', role: 'Основной состав', since: 2022 },
            { name: 'Ормонов Алмаз Кайратович', rank: 'КМС', role: 'Основной состав', since: 2023 },
            { name: 'Турдалиев Марат Асанович', rank: 'КМС', role: 'Резерв', since: 2024 },
            { name: 'Сатыбеков Нурлан Женишбекович', rank: 'МС КР', role: 'Основной состав', since: 2020 },
            { name: 'Кулбаев Айбек Толонович', rank: 'КМС', role: 'Резерв', since: 2025 },
        ],
        events: [
            { title: 'Чемпионат Азии по боксу', date: '2026-04-15', city: 'Ташкент', result: null },
            { title: 'Чемпионат КР по боксу', date: '2026-02-20', city: 'Бишкек', result: '1 золото, 2 серебра' },
            { title: 'Международный турнир «Шёлковый путь»', date: '2025-11-10', city: 'Бишкек', result: '3 золота, 1 бронза' },
        ],
        history: [
            { date: '2026-01-15', text: 'Добавлен Кулбаев А.Т. в резервный состав' },
            { date: '2025-09-01', text: 'Назначен главный тренер Алымкулов Б.С.' },
            { date: '2025-06-20', text: 'Исключён Маматов Р.Н. по состоянию здоровья' },
            { date: '2024-12-10', text: 'Утверждён состав на 2025 год' },
        ],
    },
    {
        id: 2, name: 'Сборная КР по дзюдо (женщины, взрослые)', sport: 'Дзюдо',
        ageCat: 'Взрослые', gender: 'Женская', status: 'Активная',
        headCoach: 'Кулматова Нургуль Бекболотовна', seniorCoach: 'Абдыкеримов Талант Калысбекович', personalCoach: '-',
        doctor: 'Омурбеков Жаныш Бакирович',
        athletes: [
            { name: 'Кулматова Айгерим Талантовна', rank: 'МСМК', role: 'Капитан', since: 2018 },
            { name: 'Сатыбалдиева Мээрим Кубатовна', rank: 'МС КР', role: 'Основной состав', since: 2020 },
            { name: 'Токтогулова Назира Эрлановна', rank: 'МС КР', role: 'Основной состав', since: 2022 },
            { name: 'Арапбаева Бурулай Маматовна', rank: 'КМС', role: 'Резерв', since: 2024 },
            { name: 'Эшматова Дамира Алтынбековна', rank: 'КМС', role: 'Основной состав', since: 2023 },
        ],
        events: [
            { title: 'Чемпионат Азии по дзюдо', date: '2026-05-08', city: 'Алматы', result: null },
            { title: 'Кубок Президента КР', date: '2026-01-25', city: 'Бишкек', result: '2 золота' },
        ],
        history: [
            { date: '2025-12-01', text: 'Утверждён состав на 2026 год' },
            { date: '2025-07-15', text: 'Назначена главный тренер Кулматова Н.Б.' },
        ],
    },
    {
        id: 3, name: 'Сборная КР по борьбе (мужчины, юниоры)', sport: 'Борьба',
        ageCat: 'Юниоры', gender: 'Мужская', status: 'Активная',
        headCoach: 'Жумабеков Асылбек Токтогулович', seniorCoach: 'Нуртазин Ерлан Болатович', personalCoach: '-',
        doctor: 'Исраилова Чолпон Кубатовна',
        athletes: [
            { name: 'Болотов Тимур Бакирович', rank: 'КМС', role: 'Капитан', since: 2023 },
            { name: 'Сыдыков Арлан Маратович', rank: 'I разряд', role: 'Основной состав', since: 2024 },
            { name: 'Темиров Нурбек Кайратович', rank: 'КМС', role: 'Основной состав', since: 2023 },
            { name: 'Алмазбеков Данияр Эрланович', rank: 'I разряд', role: 'Резерв', since: 2025 },
        ],
        events: [
            { title: 'Первенство Азии среди юниоров', date: '2026-06-12', city: 'Улан-Батор', result: null },
        ],
        history: [
            { date: '2025-10-05', text: 'Формирование юниорского состава' },
        ],
    },
    {
        id: 4, name: 'Сборная КР по тхэквондо (смешанная, взрослые)', sport: 'Тхэквондо',
        ageCat: 'Взрослые', gender: 'Смешанная', status: 'Активная',
        headCoach: 'Бактыгулов Нурлан Токтосунович', seniorCoach: 'Кайыпова Бермет Эркиновна', personalCoach: 'Маматов Руслан Нурланович',
        doctor: 'Акматова Гульнара Саматовна',
        athletes: [
            { name: 'Кожобеков Айбек Кубатович', rank: 'МСМК', role: 'Капитан', since: 2019 },
            { name: 'Сулайманова Жибек Бакировна', rank: 'МС КР', role: 'Основной состав', since: 2020 },
            { name: 'Токтоматов Исхак Нурланович', rank: 'МС КР', role: 'Основной состав', since: 2021 },
            { name: 'Асанова Айдана Маратовна', rank: 'КМС', role: 'Основной состав', since: 2023 },
            { name: 'Жолдошев Канат Болотович', rank: 'КМС', role: 'Резерв', since: 2024 },
            { name: 'Бекмуратова Элина Таалайбековна', rank: 'I разряд', role: 'Резерв', since: 2025 },
        ],
        events: [
            { title: 'Чемпионат мира по тхэквондо', date: '2026-07-20', city: 'Сеул', result: null },
            { title: 'Чемпионат КР по тхэквондо', date: '2026-03-05', city: 'Бишкек', result: '4 золота, 2 бронзы' },
        ],
        history: [
            { date: '2026-02-01', text: 'Добавлена Бекмуратова Э.Т. в резерв' },
            { date: '2025-08-20', text: 'Утверждён состав на сезон 2025-2026' },
        ],
    },
    {
        id: 5, name: 'Сборная КР по тяжёлой атлетике (мужчины, взрослые)', sport: 'Тяжёлая атлетика',
        ageCat: 'Взрослые', gender: 'Мужская', status: 'Формируется',
        headCoach: 'Усенов Медер Толонович', seniorCoach: '-', personalCoach: '-',
        doctor: '-',
        athletes: [
            { name: 'Жээнбеков Алтынбек Маматович', rank: 'МС КР', role: 'Основной состав', since: 2022 },
            { name: 'Калыков Бакыт Нурланович', rank: 'КМС', role: 'Основной состав', since: 2024 },
            { name: 'Садырбеков Эрнис Жолдошбекович', rank: 'КМС', role: 'Резерв', since: 2025 },
        ],
        events: [],
        history: [
            { date: '2026-03-01', text: 'Начато формирование нового состава' },
        ],
    },
    {
        id: 6, name: 'Сборная КР по футболу (женщины, юниоры)', sport: 'Футбол',
        ageCat: 'Юниоры', gender: 'Женская', status: 'Активная',
        headCoach: 'Бекболотова Назгуль Асыловна', seniorCoach: 'Токтомушев Азамат Кайратович', personalCoach: '-',
        doctor: 'Жумабаева Айнура Бакировна',
        athletes: [
            { name: 'Мамбетова Бегимай Эрлановна', rank: 'I разряд', role: 'Капитан', since: 2023 },
            { name: 'Нурланова Айпери Кубатовна', rank: 'I разряд', role: 'Основной состав', since: 2023 },
            { name: 'Сагынбаева Камила Болотовна', rank: 'II разряд', role: 'Основной состав', since: 2024 },
            { name: 'Темирова Бермет Нурбековна', rank: 'I разряд', role: 'Основной состав', since: 2024 },
            { name: 'Асанбекова Данара Маратовна', rank: 'II разряд', role: 'Резерв', since: 2025 },
        ],
        events: [
            { title: 'Первенство ЦА среди юниорок', date: '2026-05-20', city: 'Душанбе', result: null },
        ],
        history: [
            { date: '2025-11-15', text: 'Утверждён состав юниорской сборной' },
        ],
    },
    {
        id: 7, name: 'Сборная КР по волейболу (мужчины, взрослые)', sport: 'Волейбол',
        ageCat: 'Взрослые', gender: 'Мужская', status: 'Активная',
        headCoach: 'Асанкулов Тилек Болотович', seniorCoach: 'Маматов Жаныш Эркинович', personalCoach: '-',
        doctor: 'Калыбекова Элнура Толоновна',
        athletes: [
            { name: 'Токтобаев Бекзат Кайратович', rank: 'МС КР', role: 'Капитан', since: 2019 },
            { name: 'Сапарбеков Нурдин Маратович', rank: 'МС КР', role: 'Основной состав', since: 2020 },
            { name: 'Жолдошбеков Эмир Бакирович', rank: 'КМС', role: 'Основной состав', since: 2021 },
            { name: 'Кулматов Айдар Нурланович', rank: 'КМС', role: 'Основной состав', since: 2022 },
            { name: 'Орозбаев Тимур Жолдошбекович', rank: 'КМС', role: 'Основной состав', since: 2023 },
            { name: 'Бекташев Данил Кайратович', rank: 'I разряд', role: 'Резерв', since: 2024 },
        ],
        events: [
            { title: 'Кубок ЦА по волейболу', date: '2026-04-28', city: 'Бишкек', result: null },
            { title: 'Чемпионат КР по волейболу', date: '2025-12-15', city: 'Бишкек', result: 'Чемпион' },
        ],
        history: [
            { date: '2025-12-20', text: 'Подтверждён состав после Чемпионата КР' },
            { date: '2025-06-01', text: 'Назначен главный тренер Асанкулов Т.Б.' },
        ],
    },
    {
        id: 8, name: 'Сборная КР по плаванию (смешанная, кадеты)', sport: 'Плавание',
        ageCat: 'Кадеты', gender: 'Смешанная', status: 'Формируется',
        headCoach: 'Исмаилова Жылдыз Бекболотовна', seniorCoach: '-', personalCoach: '-',
        doctor: '-',
        athletes: [
            { name: 'Кадыров Эмиль Маратович', rank: 'I разряд', role: 'Основной состав', since: 2025 },
            { name: 'Токтосунова Аида Жолдошбековна', rank: 'II разряд', role: 'Основной состав', since: 2025 },
        ],
        events: [],
        history: [
            { date: '2026-02-15', text: 'Начат отбор кадетов для сборной' },
        ],
    },
    {
        id: 9, name: 'Сборная КР по лёгкой атлетике (мужчины, взрослые)', sport: 'Лёгкая атлетика',
        ageCat: 'Взрослые', gender: 'Мужская', status: 'Расформирована',
        headCoach: '-', seniorCoach: '-', personalCoach: '-',
        doctor: '-',
        athletes: [],
        events: [
            { title: 'Чемпионат КР по лёгкой атлетике', date: '2025-09-10', city: 'Бишкек', result: '2 золота, 1 серебро' },
        ],
        history: [
            { date: '2025-12-31', text: 'Сборная расформирована до нового утверждения' },
            { date: '2025-09-15', text: 'Выступление на Чемпионате КР' },
        ],
    },
    {
        id: 10, name: 'Сборная КР по стрельбе (смешанная, ветераны)', sport: 'Стрельба',
        ageCat: 'Ветераны', gender: 'Смешанная', status: 'Активная',
        headCoach: 'Абдыкадыров Мурат Эрланович', seniorCoach: 'Токтобаева Айнура Бакировна', personalCoach: '-',
        doctor: 'Эсенгулов Нурбек Маматович',
        athletes: [
            { name: 'Камчыбеков Болот Токтосунович', rank: 'МСМК', role: 'Капитан', since: 2015 },
            { name: 'Жусупов Кайрат Нурланович', rank: 'МС КР', role: 'Основной состав', since: 2017 },
            { name: 'Сартбаева Бактыгуль Эркиновна', rank: 'МС КР', role: 'Основной состав', since: 2018 },
            { name: 'Алыбаев Данияр Жолдошбекович', rank: 'КМС', role: 'Основной состав', since: 2020 },
        ],
        events: [
            { title: 'Чемпионат ЦА среди ветеранов', date: '2026-08-05', city: 'Нур-Султан', result: null },
        ],
        history: [
            { date: '2025-11-01', text: 'Утверждён состав ветеранской сборной на 2026 год' },
        ],
    },
]

const currentYear = new Date().getFullYear()

function fmt(d) { return new Date(d).toLocaleDateString('ru-RU') }

export default function Teams() {
    const { t } = useTranslation()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800)
        return () => clearTimeout(timer)
    }, [])
    const [search, setSearch] = useState('')
    const [fSport, setFSport] = useState('')
    const [fAge, setFAge] = useState('')
    const [fGender, setFGender] = useState('')
    const [fStatus, setFStatus] = useState('')

    const [drawer, setDrawer] = useState(null)
    const [drawerTab, setDrawerTab] = useState('roster')
    const [modal, setModal] = useState(false)

    const filtered = useMemo(() => {
        return TEAMS_DATA.filter(tm => {
            if (search && !tm.name.toLowerCase().includes(search.toLowerCase()) && !tm.sport.toLowerCase().includes(search.toLowerCase())) return false
            if (fSport && tm.sport !== fSport) return false
            if (fAge && tm.ageCat !== fAge) return false
            if (fGender && tm.gender !== fGender) return false
            if (fStatus && tm.status !== fStatus) return false
            return true
        })
    }, [search, fSport, fAge, fGender, fStatus])

    const totalAthletes = TEAMS_DATA.reduce((s, tm) => s + tm.athletes.length, 0)
    const activeCnt = TEAMS_DATA.filter(tm => tm.status === 'Активная').length
    const sportsCnt = new Set(TEAMS_DATA.map(tm => tm.sport)).size

    const openDrawer = (id) => { setDrawer(id); setDrawerTab('roster') }
    const sel = drawer ? TEAMS_DATA.find(tm => tm.id === drawer) : null

    const nextEvent = (team) => {
        const upcoming = team.events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date))
        return upcoming[0] || null
    }

    const statusClass = (s) => {
        if (s === 'Активная') return 'tm-status--green'
        if (s === 'Формируется') return 'tm-status--yellow'
        return 'tm-status--gray'
    }

    const translateStatus = (s) => {
        const found = STATUS_KEYS.find(x => x.value === s)
        return found ? t(found.key) : s
    }

    const translateAge = (a) => {
        const found = AGE_CAT_KEYS.find(x => x.value === a)
        return found ? t(found.key) : a
    }

    const translateGender = (g) => {
        const found = GENDER_KEYS.find(x => x.value === g)
        return found ? t(found.key) : g
    }

    return (
        <div className="tm-page">
            <Breadcrumbs current={t('teams.registryTitle')} />
            {/* Header */}
            <div className="tm-header">
                <h1 className="tm-header__title">{t('teams.registryTitle')}</h1>
                <button className="tm-header__btn" onClick={() => setModal(true)}>{t('teams.createTeam')}</button>
            </div>

            {isLoading ? (
                <>
                    <MetricSkeleton count={4} />
                    <CardSkeleton count={6} />
                </>
            ) : (
                <>
            {/* Metrics */}
            <div className="tm-metrics">
                <div className="tm-metric tm-metric--blue">
                    <div className="tm-metric__icon">{MetricIcons.stadium()}</div>
                    <div className="tm-metric__body">
                        <span className="tm-metric__value">{TEAMS_DATA.length}</span>
                        <span className="tm-metric__label">{t('teams.metricsTotal')}</span>
                    </div>
                </div>
                <div className="tm-metric tm-metric--green">
                    <div className="tm-metric__icon">{MetricIcons.active()}</div>
                    <div className="tm-metric__body">
                        <span className="tm-metric__value">{activeCnt}</span>
                        <span className="tm-metric__label">{t('teams.metricsActive')}</span>
                    </div>
                </div>
                <div className="tm-metric tm-metric--purple">
                    <div className="tm-metric__icon">{MetricIcons.target()}</div>
                    <div className="tm-metric__body">
                        <span className="tm-metric__value">{sportsCnt}</span>
                        <span className="tm-metric__label">{t('teams.metricsSports')}</span>
                    </div>
                </div>
                <div className="tm-metric tm-metric--cyan">
                    <div className="tm-metric__icon">{MetricIcons.users()}</div>
                    <div className="tm-metric__body">
                        <span className="tm-metric__value">{totalAthletes}</span>
                        <span className="tm-metric__label">{t('teams.metricsAthletes')}</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="tm-filters">
                <div className="tm-filters__search">
                    <span className="tm-filters__search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder={t('teams.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="tm-filters__select" value={fSport} onChange={e => setFSport(e.target.value)}>
                    <option value="">{t('athletes.filters.allSports')}</option>
                    {SPORTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <select className="tm-filters__select" value={fAge} onChange={e => setFAge(e.target.value)}>
                    <option value="">{t('teams.allAges')}</option>
                    {AGE_CAT_KEYS.map(a => <option key={a.value} value={a.value}>{t(a.key)}</option>)}
                </select>
                <select className="tm-filters__select" value={fGender} onChange={e => setFGender(e.target.value)}>
                    <option value="">{t('teams.anyGender')}</option>
                    {GENDER_KEYS.map(g => <option key={g.value} value={g.value}>{t(g.key)}</option>)}
                </select>
                <select className="tm-filters__select" value={fStatus} onChange={e => setFStatus(e.target.value)}>
                    <option value="">{t('common.allStatuses')}</option>
                    {STATUS_KEYS.map(s => <option key={s.value} value={s.value}>{t(s.key)}</option>)}
                </select>
            </div>

            {/* Cards grid */}
            {filtered.length === 0 ? (
                <div className="tm-empty">
                    <div style={{ width: 48, height: 48, borderRadius: 24, background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>{t('teams.notFound')}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{t('teams.notFoundHint')}</div>
                </div>
            ) : (
                <div className="tm-grid">
                    {filtered.map(team => {
                        const ne = nextEvent(team)
                        return (
                            <div key={team.id} className="tm-card">
                                <div className="tm-card__top">
                                    <span className="tm-card__flag">🇰🇬</span>
                                    <span className={`tm-status ${statusClass(team.status)}`}>{translateStatus(team.status)}</span>
                                </div>
                                <h3 className="tm-card__name">{team.name}</h3>

                                <div className="tm-card__tags">
                                    <span className="tm-card__sport-badge">{team.sport}</span>
                                    <span className="tm-card__meta">{translateAge(team.ageCat)} · {translateGender(team.gender)}</span>
                                </div>

                                <div className="tm-card__coach">
                                    <span className="tm-card__coach-avatar">{team.headCoach !== '-' ? team.headCoach.charAt(0) : '?'}</span>
                                    <div>
                                        <div className="tm-card__coach-label">{t('teams.headCoach')}</div>
                                        <div className="tm-card__coach-name">{team.headCoach}</div>
                                    </div>
                                </div>

                                <div className="tm-card__roster">
                                    <div className="tm-card__avatars">
                                        {team.athletes.slice(0, 5).map((a, i) => (
                                            <span key={i} className="tm-card__avatar" title={a.name}>{a.name.charAt(0)}</span>
                                        ))}
                                        {team.athletes.length > 5 && (
                                            <span className="tm-card__avatar tm-card__avatar--more">+{team.athletes.length - 5}</span>
                                        )}
                                    </div>
                                    <span className="tm-card__roster-count">{team.athletes.length} {t('teams.athleteCount')}</span>
                                </div>

                                {ne && (
                                    <div className="tm-card__event">
                                        <span className="tm-card__event-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></span>
                                        <div>
                                            <div className="tm-card__event-date">{fmt(ne.date)}</div>
                                            <div className="tm-card__event-name">{ne.title}</div>
                                        </div>
                                    </div>
                                )}

                                <button className="tm-card__open" onClick={() => openDrawer(team.id)}>{t('teams.openTeam')}</button>
                            </div>
                        )
                    })}
                </div>
            )}
            </>
            )}

            {/* ═══ Drawer ═══ */}
            {sel && (
                <Portal>
                <div className="tm-drawer-overlay" onClick={() => setDrawer(null)}>
                    <div className="tm-drawer" onClick={e => e.stopPropagation()}>
                        <div className="tm-drawer__header">
                            <div>
                                <div className="tm-drawer__flag">🇰🇬</div>
                                <div className="tm-drawer__name">{sel.name}</div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                    <span className="tm-card__sport-badge">{sel.sport}</span>
                                    <span className={`tm-status ${statusClass(sel.status)}`}>{translateStatus(sel.status)}</span>
                                </div>
                            </div>
                            <button className="tm-drawer__close" onClick={() => setDrawer(null)}>✕</button>
                        </div>

                        <div className="tm-tabs">
                            {[
                                { key: 'roster', label: t('teams.tabs.roster') },
                                { key: 'staff', label: t('teams.tabs.staff') },
                                { key: 'events', label: t('teams.tabs.events') },
                                { key: 'history', label: t('teams.tabs.history') },
                            ].map(tabItem => (
                                <button key={tabItem.key} className={`tm-tab ${drawerTab === tabItem.key ? 'tm-tab--active' : ''}`} onClick={() => setDrawerTab(tabItem.key)}>
                                    {tabItem.label}
                                </button>
                            ))}
                        </div>

                        <div className="tm-drawer__body">
                            {/* ── Roster tab ── */}
                            {drawerTab === 'roster' && (
                                <>
                                    <div className="tm-npa-hint">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:6,flexShrink:0,verticalAlign:'middle'}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> Ст. 32 Закона КР № 36: Спортсмен в сборной ≥ 5 лет — особые гарантии (здоровье, страхование, трудоустройство).
                                    </div>
                                    {sel.athletes.length === 0 ? (
                                        <div className="tm-empty-tab">
                                            <div style={{ width: 48, height: 48, borderRadius: 24, background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                                            <div style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>{t('teams.roster.notFormed')}</div>
                                        </div>
                                    ) : (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="tm-inner-table">
                                                <thead>
                                                    <tr>
                                                        <th>№</th>
                                                        <th>{t('teams.roster.athlete')}</th>
                                                        <th>{t('teams.roster.rank')}</th>
                                                        <th>{t('teams.roster.role')}</th>
                                                        <th>{t('teams.roster.since')}</th>
                                                        <th>{t('teams.roster.experience')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sel.athletes.map((a, i) => {
                                                        const years = currentYear - a.since
                                                        const hasGuarantee = years >= 5
                                                        return (
                                                            <tr key={i}>
                                                                <td>{i + 1}</td>
                                                                <td>
                                                                    <div className="tm-athlete-cell">
                                                                        <span className="tm-athlete-cell__avatar">{a.name.charAt(0)}</span>
                                                                        <span className="tm-athlete-cell__name">{a.name}</span>
                                                                        {hasGuarantee && <span className="tm-guarantee" title="Особые гарантии по ст. 32 (≥5 лет)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>}
                                                                    </div>
                                                                </td>
                                                                <td>{a.rank}</td>
                                                                <td>
                                                                    <span className={`tm-role ${a.role === 'Капитан' ? 'tm-role--captain' : a.role === 'Резерв' ? 'tm-role--reserve' : ''}`}>
                                                                        {a.role}
                                                                    </span>
                                                                </td>
                                                                <td>{a.since}</td>
                                                                <td>{years} {years === 1 ? t('teams.yearOne') : years < 5 ? t('teams.yearFew') : t('teams.yearMany')}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    <div className="tm-roster-actions">
                                        <button className="tm-btn tm-btn--primary" onClick={() => toast('Добавление спортсмена')}>+ Добавить спортсмена</button>
                                        <button className="tm-btn tm-btn--outline" onClick={() => toast('Удаление из состава')}>Удалить из состава</button>
                                    </div>
                                </>
                            )}

                            {/* ── Staff tab ── */}
                            {drawerTab === 'staff' && (
                                <div className="tm-staff-grid">
                                    {[
                                        { role: t('teams.staffRoles.headCoach'), name: sel.headCoach, icon: MetricIcons.teacher('#2563EB', 24), note: 'Назначается уполномоченным органом (ст. 32)' },
                                        { role: t('teams.staffRoles.seniorCoach'), name: sel.seniorCoach, icon: MetricIcons.teacher('#7C3AED', 24), note: 'Назначается уполномоченным органом (ст. 32)' },
                                        { role: t('teams.staffRoles.personalCoach'), name: sel.personalCoach, icon: MetricIcons.users('#16a34a', 24), note: null },
                                        { role: t('teams.staffRoles.teamDoctor'), name: sel.doctor, icon: MetricIcons.hospital('#ef4444', 24), note: null },
                                    ].map(s => (
                                        <div key={s.role} className="tm-staff-card">
                                            <div className="tm-staff-card__icon">{s.icon}</div>
                                            <div className="tm-staff-card__role">{s.role}</div>
                                            <div className="tm-staff-card__name">{s.name}</div>
                                            {s.note && <div className="tm-staff-card__note">{s.note}</div>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ── Events tab ── */}
                            {drawerTab === 'events' && (
                                <>
                                    {sel.events.length === 0 ? (
                                        <div className="tm-empty-tab">
                                            <div style={{ width: 48, height: 48, borderRadius: 24, background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div>
                                            <div style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>{t('common.noEvents')}</div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Upcoming */}
                                            {sel.events.filter(e => !e.result).length > 0 && (
                                                <>
                                                    <h3 className="tm-sub-title">{t('teams.eventsUpcoming')}</h3>
                                                    <div className="tm-event-list">
                                                        {sel.events.filter(e => !e.result).map((e, i) => (
                                                            <div key={i} className="tm-event-item tm-event-item--upcoming">
                                                                <div className="tm-event-item__date">{fmt(e.date)}</div>
                                                                <div className="tm-event-item__title">{e.title}</div>
                                                                <div className="tm-event-item__city">{e.city}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                            {/* Past */}
                                            {sel.events.filter(e => e.result).length > 0 && (
                                                <>
                                                    <h3 className="tm-sub-title" style={{ marginTop: 20 }}>{t('teams.eventsPast')}</h3>
                                                    <div className="tm-event-list">
                                                        {sel.events.filter(e => e.result).map((e, i) => (
                                                            <div key={i} className="tm-event-item">
                                                                <div className="tm-event-item__date">{fmt(e.date)}</div>
                                                                <div className="tm-event-item__title">{e.title}</div>
                                                                <div className="tm-event-item__city">{e.city}</div>
                                                                <div className="tm-event-item__result">{e.result}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            )}

                            {/* ── History tab ── */}
                            {drawerTab === 'history' && (
                                <>
                                    {sel.history.length === 0 ? (
                                        <div className="tm-empty-tab">
                                            <div style={{ width: 48, height: 48, borderRadius: 24, background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg></div>
                                            <div style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>{t('teams.historyEmpty')}</div>
                                        </div>
                                    ) : (
                                        <div className="tm-timeline">
                                            {sel.history.map((h, i) => (
                                                <div key={i} className="tm-timeline__item">
                                                    <div className="tm-timeline__dot" />
                                                    <div className="tm-timeline__content">
                                                        <div className="tm-timeline__date">{fmt(h.date)}</div>
                                                        <div className="tm-timeline__text">{h.text}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="tm-drawer__footer">
                            <button className="tm-btn tm-btn--primary" onClick={() => toast('Редактирование')}>{t('common.edit')}</button>
                            {sel.status === 'Активная' && (
                                <button className="tm-btn tm-btn--outline" onClick={() => toast('Экспорт состава')}>{t('teams.actions.exportRoster')}</button>
                            )}
                            {sel.status !== 'Расформирована' && (
                                <button className="tm-btn tm-btn--red" onClick={() => toast('Расформирование команды')}>{t('teams.actions.disband')}</button>
                            )}
                        </div>
                    </div>
                </div>
                </Portal>
            )}

            {/* ═══ Create Modal ═══ */}
            {modal && (
                <Portal>
                <div className="tm-modal-overlay" onClick={() => setModal(false)}>
                    <div className="tm-modal" onClick={e => e.stopPropagation()}>
                        <div className="tm-modal__header">
                            <h2 className="tm-modal__title">{t('teams.addNew')}</h2>
                            <button className="tm-modal__close" onClick={() => setModal(false)}>✕</button>
                        </div>
                        <div className="tm-modal__body">
                            <div className="tm-modal__grid">
                                <div className="tm-modal__section-title">{t('teams.modal.mainInfo')}</div>

                                <div className="tm-modal__field--full">
                                    <label className="tm-modal__label">{t('teams.form.teamName')} <span>*</span></label>
                                    <input className="tm-modal__input" placeholder="Сборная КР по …" />
                                </div>

                                <div>
                                    <label className="tm-modal__label">{t('fields.sport')} <span>*</span></label>
                                    <select className="tm-modal__input">
                                        <option value="">{t('common.select')}</option>
                                        {SPORTS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="tm-modal__label">{t('teams.form.ageCategory')} <span>*</span></label>
                                    <select className="tm-modal__input">
                                        <option value="">{t('common.select')}</option>
                                        {AGE_CAT_KEYS.map(a => <option key={a.value} value={a.value}>{t(a.key)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="tm-modal__label">{t('fields.gender')} <span>*</span></label>
                                    <select className="tm-modal__input">
                                        <option value="">{t('common.select')}</option>
                                        {GENDER_KEYS.map(g => <option key={g.value} value={g.value}>{t(g.key)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="tm-modal__label">{t('common.status')}</label>
                                    <select className="tm-modal__input">
                                        {STATUS_KEYS.map(s => <option key={s.value} value={s.value}>{t(s.key)}</option>)}
                                    </select>
                                </div>

                                <div className="tm-modal__section-title">{t('teams.modal.coachingStaff')}</div>

                                <div>
                                    <label className="tm-modal__label">{t('teams.staffRoles.headCoach')} <span>*</span></label>
                                    <input className="tm-modal__input" placeholder="ФИО тренера" />
                                </div>
                                <div>
                                    <label className="tm-modal__label">{t('teams.staffRoles.seniorCoach')}</label>
                                    <input className="tm-modal__input" placeholder="ФИО тренера" />
                                </div>
                                <div>
                                    <label className="tm-modal__label">{t('teams.staffRoles.personalCoach')}</label>
                                    <input className="tm-modal__input" placeholder="ФИО тренера" />
                                </div>
                                <div>
                                    <label className="tm-modal__label">{t('teams.staffRoles.teamDoctor')}</label>
                                    <input className="tm-modal__input" placeholder="ФИО врача" />
                                </div>

                                <div className="tm-modal__field--full">
                                    <div className="tm-npa-hint" style={{ marginBottom: 0 }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:6,flexShrink:0,verticalAlign:'middle'}}><path d="M12 3v2m0 14v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M3 12h2m14 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/><circle cx="12" cy="12" r="4"/></svg> Ст. 32 Закона КР № 36: Главный тренер и старший тренер назначаются уполномоченным органом.
                                        Состав формируется в порядке, определяемом Кабинетом Министров КР.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tm-modal__footer">
                            <button className="tm-btn tm-btn--outline" onClick={() => setModal(false)}>{t('common.cancel')}</button>
                            <button className="tm-btn tm-btn--primary" onClick={() => { toast('Команда создана'); setModal(false) }}>{t('teams.createTeam')}</button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}
        </div>
    )
}