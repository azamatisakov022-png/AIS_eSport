import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import './Organizations.css'
import Portal from '../components/Portal'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, MetricCard } from '../components/ui'

/* ── Shared data ── */
const TYPES_MAP = {
    federation:  { labelKey: 'organizations.types.federation',   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06" /><path d="M12 2L3 10h18L12 2z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" /><path d="M8 14v4" stroke="currentColor" strokeWidth="1.5" /><path d="M12 14v4" stroke="currentColor" strokeWidth="1.5" /><path d="M16 14v4" stroke="currentColor" strokeWidth="1.5" /></svg>, cls: 'og-type--gold' },
    school:      { labelKey: 'organizations.types.school',       icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L2 8l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" /><path d="M6 10v6c0 2 3 4 6 4s6-2 6-4v-6" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.05" /><path d="M22 8v6" stroke="currentColor" strokeWidth="1.5" /></svg>, cls: 'og-type--cyan' },
    club:        { labelKey: 'organizations.types.club',         icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8" stroke="currentColor" strokeWidth="1.5" /><path d="M12 17v4" stroke="currentColor" strokeWidth="1.5" /><path d="M7 4h10v5a5 5 0 0 1-10 0V4z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" /><path d="M7 7H4a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3h1" stroke="currentColor" strokeWidth="1.5" /><path d="M17 7h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3h-1" stroke="currentColor" strokeWidth="1.5" /></svg>, cls: 'og-type--purple' },
    association: { labelKey: 'organizations.types.association',  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" /><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" /></svg>, cls: 'og-type--green' },
    league:      { labelKey: 'organizations.types.league',       icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06" /><path d="M3 9h18" stroke="currentColor" strokeWidth="1" opacity="0.3" /><path d="M9 21V9" stroke="currentColor" strokeWidth="1" opacity="0.3" /><circle cx="15" cy="15" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12" /></svg>, cls: 'og-type--orange' },
}

const ACCRED_KEYS = [
    { value: 'Аккредитована',    labelKey: 'organizations.accreditation.accredited' },
    { value: 'На рассмотрении',  labelKey: 'organizations.accreditation.underReview' },
    { value: 'Отозвана',         labelKey: 'organizations.accreditation.revoked' },
]
const REGIONS = ['Бишкек','Ош','Чуй','Нарын','Иссык-Куль','Джалал-Абад','Баткен','Талас','Ош (обл.)']
const SPORTS = ['Бокс','Дзюдо','Борьба','Тхэквондо','Футбол','Волейбол','Плавание','Лёгкая атлетика','Стрельба','Многопрофильная']

export const ORGS_DATA = [
    {
        id: 1, name: 'Федерация бокса Кыргызской Республики', type: 'federation', sport: 'Бокс',
        inn: '01234567890123', regDate: '2005-03-15', region: 'Бишкек',
        address: 'г. Бишкек, ул. Токтогула, 125', phone: '+996 312 62-34-12', email: 'boxing@sport.kg', website: 'boxing.kg',
        head: 'Алымкулов Бакыт Сапарович', headTitle: 'Президент',
        accreditation: 'Аккредитована', athletes: 245, coaches: 32,
        staff: [
            { name: 'Асанов Бакыт', role: 'Спортсмен', rank: 'МСМК' },
            { name: 'Джумабаев Эрлан', role: 'Спортсмен', rank: 'МС КР' },
            { name: 'Ормонов Алмаз', role: 'Тренер', rank: '-' },
            { name: 'Турдубаев Эмиль', role: 'Тренер', rank: '-' },
        ],
        events: [
            { title: 'Чемпионат КР по боксу 2026', date: '2026-02-20', status: 'Завершено' },
            { title: 'Международный турнир «Шёлковый путь»', date: '2026-06-10', status: 'Предстоящее' },
        ],
        docs: [
            { name: 'Устав федерации', status: 'ok' },
            { name: 'Свидетельство о регистрации', status: 'ok' },
            { name: 'Аккредитационное письмо ГАФКиС', status: 'ok' },
        ],
    },
    {
        id: 2, name: 'Федерация дзюдо Кыргызской Республики', type: 'federation', sport: 'Дзюдо',
        inn: '01234567890124', regDate: '2003-07-22', region: 'Бишкек',
        address: 'г. Бишкек, пр. Чуй, 210', phone: '+996 312 55-10-20', email: 'judo@sport.kg', website: 'judokr.kg',
        head: 'Кулматова Нургуль Бекболотовна', headTitle: 'Президент',
        accreditation: 'Аккредитована', athletes: 312, coaches: 45,
        staff: [
            { name: 'Кулматова Айгерим', role: 'Спортсмен', rank: 'МСМК' },
            { name: 'Сатыбалдиева Мээрим', role: 'Спортсмен', rank: 'МС КР' },
            { name: 'Абдыкеримов Талант', role: 'Тренер', rank: '-' },
        ],
        events: [
            { title: 'Кубок Президента КР по дзюдо', date: '2026-01-25', status: 'Завершено' },
            { title: 'Чемпионат Азии по дзюдо', date: '2026-05-08', status: 'Предстоящее' },
        ],
        docs: [
            { name: 'Устав федерации', status: 'ok' },
            { name: 'Свидетельство о регистрации', status: 'ok' },
            { name: 'Аккредитационное письмо ГАФКиС', status: 'ok' },
        ],
    },
    {
        id: 3, name: 'Федерация борьбы КР', type: 'federation', sport: 'Борьба',
        inn: '01234567890125', regDate: '2001-11-05', region: 'Бишкек',
        address: 'г. Бишкек, ул. Манаса, 44', phone: '+996 312 44-22-11', email: 'wrestling@sport.kg', website: 'wrestlingkr.kg',
        head: 'Жумабеков Асылбек Токтогулович', headTitle: 'Президент',
        accreditation: 'Аккредитована', athletes: 520, coaches: 68,
        staff: [
            { name: 'Болотов Тимур', role: 'Спортсмен', rank: 'КМС' },
            { name: 'Темиров Нурбек', role: 'Спортсмен', rank: 'КМС' },
        ],
        events: [
            { title: 'Первенство КР по борьбе', date: '2026-04-18', status: 'Предстоящее' },
        ],
        docs: [
            { name: 'Устав федерации', status: 'ok' },
            { name: 'Свидетельство о регистрации', status: 'ok' },
            { name: 'Аккредитационное письмо ГАФКиС', status: 'ok' },
        ],
    },
    {
        id: 4, name: 'Федерация тхэквондо КР', type: 'federation', sport: 'Тхэквондо',
        inn: '01234567890126', regDate: '2008-02-10', region: 'Бишкек',
        address: 'г. Бишкек, ул. Ибраимова, 88', phone: '+996 312 33-11-55', email: 'tkd@sport.kg', website: 'tkdkr.kg',
        head: 'Бактыгулов Нурлан Токтосунович', headTitle: 'Президент',
        accreditation: 'На рассмотрении', athletes: 180, coaches: 24,
        staff: [
            { name: 'Кожобеков Айбек', role: 'Спортсмен', rank: 'МСМК' },
        ],
        events: [],
        docs: [
            { name: 'Устав федерации', status: 'ok' },
            { name: 'Свидетельство о регистрации', status: 'ok' },
            { name: 'Аккредитационное письмо ГАФКиС', status: 'missing' },
        ],
    },
    {
        id: 5, name: 'РДЮСШ олимпийского резерва г. Бишкек', type: 'school', sport: 'Многопрофильная',
        inn: '02345678901234', regDate: '1995-09-01', region: 'Бишкек',
        address: 'г. Бишкек, ул. Байтик Баатыра, 12', phone: '+996 312 61-15-00', email: 'rdyush@edu.kg', website: '',
        head: 'Маматова Айчурёк Болотовна', headTitle: 'Директор',
        accreditation: 'Аккредитована', athletes: 430, coaches: 55,
        staff: [
            { name: 'Кулбаев Айбек', role: 'Спортсмен', rank: 'КМС' },
            { name: 'Турдалиев Марат', role: 'Спортсмен', rank: 'КМС' },
        ],
        events: [
            { title: 'Спартакиада школ Бишкека', date: '2026-03-20', status: 'Предстоящее' },
        ],
        docs: [
            { name: 'Устав учреждения', status: 'ok' },
            { name: 'Лицензия на образовательную деятельность', status: 'ok' },
            { name: 'Аккредитационное письмо ГАФКиС', status: 'ok' },
        ],
    },
    {
        id: 6, name: 'ДЮСШ №3 г. Ош', type: 'school', sport: 'Многопрофильная',
        inn: '02345678901235', regDate: '2000-04-15', region: 'Ош',
        address: 'г. Ош, ул. Курманжан Датки, 56', phone: '+996 3222 5-10-20', email: 'dyush3osh@edu.kg', website: '',
        head: 'Абдыраимов Бакир Нурланович', headTitle: 'Директор',
        accreditation: 'Аккредитована', athletes: 280, coaches: 30,
        staff: [],
        events: [],
        docs: [
            { name: 'Устав учреждения', status: 'ok' },
            { name: 'Лицензия на образовательную деятельность', status: 'ok' },
            { name: 'Аккредитационное письмо ГАФКиС', status: 'ok' },
        ],
    },
    {
        id: 7, name: 'СК «Дордой» Бишкек', type: 'club', sport: 'Футбол',
        inn: '03456789012345', regDate: '2010-06-20', region: 'Бишкек',
        address: 'г. Бишкек, ул. Фрунзе, 100', phone: '+996 312 90-12-34', email: 'dordoi@club.kg', website: 'dordoi.kg',
        head: 'Сариев Марат Бакирович', headTitle: 'Генеральный директор',
        accreditation: 'Аккредитована', athletes: 85, coaches: 12,
        staff: [
            { name: 'Мамбетов Данияр', role: 'Спортсмен', rank: 'МС КР' },
        ],
        events: [
            { title: 'Чемпионат КР Премьер-лига', date: '2026-03-15', status: 'Предстоящее' },
        ],
        docs: [
            { name: 'Устав клуба', status: 'ok' },
            { name: 'Свидетельство о регистрации', status: 'ok' },
            { name: 'Аккредитационное письмо ГАФКиС', status: 'ok' },
        ],
    },
    {
        id: 8, name: 'СК «Абдыш-Ата» Кант', type: 'club', sport: 'Футбол',
        inn: '03456789012346', regDate: '2012-03-01', region: 'Чуй',
        address: 'г. Кант, ул. Ленина, 15', phone: '+996 3132 5-22-33', email: 'abdyshata@club.kg', website: '',
        head: 'Токтогулов Эркин Маратович', headTitle: 'Директор',
        accreditation: 'Аккредитована', athletes: 60, coaches: 8,
        staff: [],
        events: [],
        docs: [
            { name: 'Устав клуба', status: 'ok' },
            { name: 'Свидетельство о регистрации', status: 'ok' },
            { name: 'Аккредитационное письмо ГАФКиС', status: 'ok' },
        ],
    },
    {
        id: 9, name: 'Физкультурно-спортивное общество «Алга»', type: 'association', sport: 'Многопрофильная',
        inn: '04567890123456', regDate: '2015-01-20', region: 'Нарын',
        address: 'г. Нарын, ул. Ленина, 32', phone: '+996 3522 5-11-22', email: 'alga@sport.kg', website: '',
        head: 'Осмонов Кубат Жолдошбекович', headTitle: 'Председатель',
        accreditation: 'На рассмотрении', athletes: 95, coaches: 10,
        staff: [],
        events: [],
        docs: [
            { name: 'Устав общества', status: 'ok' },
            { name: 'Свидетельство о регистрации', status: 'ok' },
            { name: 'Аккредитационное письмо ГАФКиС', status: 'missing' },
        ],
    },
    {
        id: 10, name: 'ОО «Спорт для всех - Иссык-Куль»', type: 'association', sport: 'Многопрофильная',
        inn: '04567890123457', regDate: '2018-08-10', region: 'Иссык-Куль',
        address: 'г. Каракол, ул. Тоголок Молдо, 78', phone: '+996 3922 5-33-44', email: 'sportik@mail.kg', website: '',
        head: 'Касымбекова Жаркын Эркиновна', headTitle: 'Президент',
        accreditation: 'Аккредитована', athletes: 120, coaches: 14,
        staff: [],
        events: [
            { title: 'Региональная спартакиада Иссык-Куля', date: '2026-07-12', status: 'Предстоящее' },
        ],
        docs: [
            { name: 'Устав объединения', status: 'ok' },
            { name: 'Свидетельство о регистрации', status: 'ok' },
            { name: 'Аккредитационное письмо ГАФКиС', status: 'ok' },
        ],
    },
    {
        id: 11, name: 'Профессиональная футбольная лига КР', type: 'league', sport: 'Футбол',
        inn: '05678901234567', regDate: '2014-02-28', region: 'Бишкек',
        address: 'г. Бишкек, ул. Киевская, 200', phone: '+996 312 88-99-00', email: 'pfl@football.kg', website: 'pfl.kg',
        head: 'Ибраимов Талант Бакирович', headTitle: 'Генеральный директор',
        accreditation: 'Аккредитована', athletes: 0, coaches: 0,
        staff: [],
        events: [
            { title: 'Чемпионат КР Премьер-лига 2026', date: '2026-03-15', status: 'Предстоящее' },
        ],
        docs: [
            { name: 'Устав лиги', status: 'ok' },
            { name: 'Свидетельство о регистрации', status: 'ok' },
            { name: 'Аккредитационное письмо ГАФКиС', status: 'ok' },
        ],
    },
    {
        id: 12, name: 'Федерация стрельбы КР', type: 'federation', sport: 'Стрельба',
        inn: '01234567890130', regDate: '2011-05-18', region: 'Бишкек',
        address: 'г. Бишкек, ул. Жибек Жолу, 55', phone: '+996 312 77-55-33', email: 'shooting@sport.kg', website: '',
        head: 'Абдыкадыров Мурат Эрланович', headTitle: 'Президент',
        accreditation: 'Отозвана', athletes: 40, coaches: 6,
        staff: [
            { name: 'Камчыбеков Болот', role: 'Спортсмен', rank: 'МСМК' },
        ],
        events: [],
        docs: [
            { name: 'Устав федерации', status: 'ok' },
            { name: 'Свидетельство о регистрации', status: 'ok' },
            { name: 'Аккредитационное письмо ГАФКиС', status: 'missing' },
        ],
    },
]

function fmt(d) { return new Date(d).toLocaleDateString('ru-RU') }

export default function Organizations() {
    const { t } = useTranslation()
    const toast = useToast()
    const [search, setSearch] = useState('')
    const [fType, setFType] = useState('')
    const [fSport, setFSport] = useState('')
    const [fRegion, setFRegion] = useState('')
    const [fAccred, setFAccred] = useState('')

    const [drawer, setDrawer] = useState(null)
    const [drawerTab, setDrawerTab] = useState('info')
    const [modal, setModal] = useState(false)

    const filtered = useMemo(() => {
        return ORGS_DATA.filter(o => {
            if (search && !o.name.toLowerCase().includes(search.toLowerCase()) && !o.inn.includes(search)) return false
            if (fType && o.type !== fType) return false
            if (fSport && o.sport !== fSport) return false
            if (fRegion && o.region !== fRegion) return false
            if (fAccred && o.accreditation !== fAccred) return false
            return true
        })
    }, [search, fType, fSport, fRegion, fAccred])

    const fedCnt = ORGS_DATA.filter(o => o.type === 'federation').length
    const schoolCnt = ORGS_DATA.filter(o => o.type === 'school').length
    const clubCnt = ORGS_DATA.filter(o => o.type === 'club').length
    const accredCnt = ORGS_DATA.filter(o => o.accreditation === 'Аккредитована').length

    const openDrawer = (id) => { setDrawer(id); setDrawerTab('info') }
    const sel = drawer ? ORGS_DATA.find(o => o.id === drawer) : null

    const accredBadge = (status) => {
        const map = { 'Аккредитована': 'og-accred--green', 'На рассмотрении': 'og-accred--yellow', 'Отозвана': 'og-accred--red' }
        const labelMap = { 'Аккредитована': t('organizations.accreditation.accredited'), 'На рассмотрении': t('organizations.accreditation.underReview'), 'Отозвана': t('organizations.accreditation.revoked') }
        return <span className={`og-accred ${map[status] || ''}`}>{labelMap[status] || status}</span>
    }

    const typeBadge = (type) => {
        const tm = TYPES_MAP[type]
        return tm ? <span className={`og-type ${tm.cls}`}>{t(tm.labelKey)}</span> : null
    }

    return (
        <div className="og-page">
            <Breadcrumbs current={t('organizations.registryTitle')} />
            {/* Header */}
            <PageHeader
                title={t('organizations.registryTitle')}
                actions={<Button variant="primary" onClick={() => setModal(true)}>+ {t('organizations.addNew')}</Button>}
            />

            {/* Metrics */}
            <div className="og-metrics">
                <MetricCard tone="blue" icon={MetricIcons.building()} value={ORGS_DATA.length} label={t('organizations.metricsTotal')} />
                <MetricCard tone="amber" icon={MetricIcons.government()} value={fedCnt} label={t('organizations.metricsFederations')} />
                <MetricCard tone="cyan" icon={MetricIcons.school()} value={schoolCnt} label={t('organizations.metricsSchools')} />
                <MetricCard tone="purple" icon={MetricIcons.trophy()} value={clubCnt} label={t('organizations.metricsClubs')} />
                <MetricCard tone="green" icon={MetricIcons.active()} value={accredCnt} label={t('organizations.metricsAccredited')} />
            </div>

            {/* Filters */}
            <div className="og-filters">
                <div className="og-filters__search">
                    <span className="og-filters__search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder="Поиск по названию или ИНН…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="og-filters__select" value={fType} onChange={e => setFType(e.target.value)}>
                    <option value="">Все типы</option>
                    {Object.entries(TYPES_MAP).map(([k, v]) => <option key={k} value={k}>{t(v.labelKey)}</option>)}
                </select>
                <select className="og-filters__select" value={fSport} onChange={e => setFSport(e.target.value)}>
                    <option value="">Все виды спорта</option>
                    {SPORTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <select className="og-filters__select" value={fRegion} onChange={e => setFRegion(e.target.value)}>
                    <option value="">Все регионы</option>
                    {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
                <select className="og-filters__select" value={fAccred} onChange={e => setFAccred(e.target.value)}>
                    <option value="">Все статусы</option>
                    {ACCRED_KEYS.map(a => <option key={a.value} value={a.value}>{t(a.labelKey)}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="og-table-wrap">
                <table className="og-table">
                    <thead>
                        <tr>
                            <th>{t('organizations.table.organization')}</th>
                            <th>{t('fields.sport')}</th>
                            <th>{t('fields.region')}</th>
                            <th>{t('organizations.table.head')}</th>
                            <th>{t('organizations.table.athletes')}</th>
                            <th>{t('organizations.table.coaches')}</th>
                            <th>{t('organizations.table.accreditation')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td className="og-table__empty" colSpan={8}>{t('organizations.notFound')}</td></tr>
                        ) : filtered.map(o => (
                            <tr key={o.id}>
                                <td>
                                    <div className="og-name-cell">
                                        <div className="og-name-cell__name">{o.name}</div>
                                        {typeBadge(o.type)}
                                    </div>
                                </td>
                                <td>{o.sport}</td>
                                <td>{o.region}</td>
                                <td>
                                    <div className="og-head-cell">
                                        <span className="og-head-cell__name">{o.head}</span>
                                        <span className="og-head-cell__title">{o.headTitle}</span>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center', fontWeight: 600 }}>{o.athletes}</td>
                                <td style={{ textAlign: 'center', fontWeight: 600 }}>{o.coaches}</td>
                                <td>{accredBadge(o.accreditation)}</td>
                                <td>
                                    <button className="og-btn og-btn--small" onClick={() => openDrawer(o.id)}>Открыть</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ═══ Drawer ═══ */}
            {sel && (
                <Portal>
                <div className="og-drawer-overlay" onClick={() => setDrawer(null)}>
                    <div className="og-drawer" onClick={e => e.stopPropagation()}>
                        <div className="og-drawer__header">
                            <div>
                                <div className="og-drawer__name">{sel.name}</div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                    {typeBadge(sel.type)}
                                    {accredBadge(sel.accreditation)}
                                </div>
                            </div>
                            <button className="og-drawer__close" onClick={() => setDrawer(null)}>✕</button>
                        </div>

                        <div className="og-tabs">
                            {[
                                { key: 'info', label: t('organizations.tabs.main') },
                                { key: 'staff', label: t('organizations.tabs.staff') },
                                { key: 'events', label: t('organizations.tabs.events') },
                                { key: 'docs', label: t('organizations.tabs.documents') },
                            ].map(tab => (
                                <button key={tab.key} className={`og-tab ${drawerTab === tab.key ? 'og-tab--active' : ''}`} onClick={() => setDrawerTab(tab.key)}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="og-drawer__body">
                            {/* ── Info tab ── */}
                            {drawerTab === 'info' && (
                                <>
                                    <div className="og-npa-hint">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:6,flexShrink:0,verticalAlign:'middle'}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> Ст. 17 Закона КР № 36: ГАФКиС ведёт реестр республиканских федераций и даёт согласие на их регистрацию в органах юстиции.
                                    </div>
                                    <div className="og-info-grid">
                                        <div className="og-info-item">
                                            <div className="og-info-item__label">{t('fields.inn')}</div>
                                            <div className="og-info-item__value">{sel.inn}</div>
                                        </div>
                                        <div className="og-info-item">
                                            <div className="og-info-item__label">{t('organizations.drawer.regDate')}</div>
                                            <div className="og-info-item__value">{fmt(sel.regDate)}</div>
                                        </div>
                                        <div className="og-info-item">
                                            <div className="og-info-item__label">{t('fields.sport')}</div>
                                            <div className="og-info-item__value">{sel.sport}</div>
                                        </div>
                                        <div className="og-info-item">
                                            <div className="og-info-item__label">{t('fields.region')}</div>
                                            <div className="og-info-item__value">{sel.region}</div>
                                        </div>
                                        <div className="og-info-item" style={{ gridColumn: '1 / -1' }}>
                                            <div className="og-info-item__label">{t('fields.address')}</div>
                                            <div className="og-info-item__value">{sel.address}</div>
                                        </div>
                                        <div className="og-info-item">
                                            <div className="og-info-item__label">{t('fields.phone')}</div>
                                            <div className="og-info-item__value">{sel.phone}</div>
                                        </div>
                                        <div className="og-info-item">
                                            <div className="og-info-item__label">{t('fields.email')}</div>
                                            <div className="og-info-item__value">{sel.email}</div>
                                        </div>
                                        {sel.website && (
                                            <div className="og-info-item">
                                                <div className="og-info-item__label">{t('organizations.drawer.website')}</div>
                                                <div className="og-info-item__value">{sel.website}</div>
                                            </div>
                                        )}
                                        <div className="og-info-item">
                                            <div className="og-info-item__label">{t('organizations.drawer.head')}</div>
                                            <div className="og-info-item__value">{sel.head} ({sel.headTitle})</div>
                                        </div>
                                        <div className="og-info-item">
                                            <div className="og-info-item__label">{t('organizations.drawer.athletes')}</div>
                                            <div className="og-info-item__value">{sel.athletes}</div>
                                        </div>
                                        <div className="og-info-item">
                                            <div className="og-info-item__label">{t('organizations.drawer.coaches')}</div>
                                            <div className="og-info-item__value">{sel.coaches}</div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── Staff tab ── */}
                            {drawerTab === 'staff' && (
                                <>
                                    {sel.staff.length === 0 ? (
                                        <div className="og-empty-tab">
                                            <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                                            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>{t('organizations.staffEmpty')}</div>
                                        </div>
                                    ) : (
                                        <table className="og-inner-table">
                                            <thead>
                                                <tr>
                                                    <th>№</th>
                                                    <th>{t('common.name')}</th>
                                                    <th>{t('common.type')}</th>
                                                    <th>{t('fields.rank')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sel.staff.map((s, i) => (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</td>
                                                        <td>
                                                            <span className={`og-role ${s.role === 'Тренер' ? 'og-role--coach' : ''}`}>{s.role}</span>
                                                        </td>
                                                        <td>{s.rank}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </>
                            )}

                            {/* ── Events tab ── */}
                            {drawerTab === 'events' && (
                                <>
                                    {sel.events.length === 0 ? (
                                        <div className="og-empty-tab">
                                            <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                                            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>{t('common.noEvents')}</div>
                                        </div>
                                    ) : (
                                        <div className="og-event-list">
                                            {sel.events.map((e, i) => (
                                                <div key={i} className={`og-event-item ${e.status === 'Предстоящее' ? 'og-event-item--upcoming' : ''}`}>
                                                    <div className="og-event-item__date"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{verticalAlign:'middle',marginRight:4}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> {fmt(e.date)}</div>
                                                    <div className="og-event-item__title">{e.title}</div>
                                                    <span className={`og-accred ${e.status === 'Предстоящее' ? 'og-accred--yellow' : 'og-accred--green'}`}>
                                                        {e.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ── Docs tab ── */}
                            {drawerTab === 'docs' && (
                                <div className="og-doc-list">
                                    {sel.docs.map((doc, i) => (
                                        <div key={i} className={`og-doc-item ${doc.status === 'ok' ? 'og-doc-item--ok' : 'og-doc-item--no'}`}>
                                            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: doc.status === 'ok' ? '#16a34a' : '#ef4444' }} />
                                            <span className="og-doc-item__name">{doc.name}</span>
                                            {doc.status === 'ok' ? (
                                                <button className="og-btn og-btn--small" onClick={() => toast(`Скачивание: ${doc.name}`)}>{t('organizations.docs.download')}</button>
                                            ) : (
                                                <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 600 }}>{t('organizations.docs.missing')}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="og-drawer__footer">
                            <button className="og-btn og-btn--primary" onClick={() => toast('Редактирование')}>{t('common.edit')}</button>
                            {sel.accreditation !== 'Аккредитована' ? (
                                <button className="og-btn og-btn--green" onClick={() => toast('Выдача аккредитации')}>{t('organizations.actions.grantAccreditation')}</button>
                            ) : (
                                <button className="og-btn og-btn--red" onClick={() => toast('Отзыв аккредитации')}>{t('organizations.actions.revokeAccreditation')}</button>
                            )}
                        </div>
                    </div>
                </div>
                </Portal>
            )}

            {/* ═══ Add Modal ═══ */}
            {modal && (
                <Portal>
                <div className="og-modal-overlay" onClick={() => setModal(false)}>
                    <div className="og-modal" onClick={e => e.stopPropagation()}>
                        <div className="og-modal__header">
                            <h2 className="og-modal__title">{t('organizations.addNew')}</h2>
                            <button className="og-modal__close" onClick={() => setModal(false)}>✕</button>
                        </div>
                        <div className="og-modal__body">
                            <div className="og-modal__grid">
                                <div className="og-modal__section-title">{t('organizations.modal.mainInfo')}</div>

                                <div className="og-modal__field--full">
                                    <label className="og-modal__label">{t('common.name')} <span>*</span></label>
                                    <input className="og-modal__input" placeholder="Полное наименование организации" />
                                </div>
                                <div>
                                    <label className="og-modal__label">{t('common.type')} <span>*</span></label>
                                    <select className="og-modal__input">
                                        <option value="">{t('common.select')}</option>
                                        {Object.entries(TYPES_MAP).map(([k, v]) => <option key={k} value={k}>{t(v.labelKey)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="og-modal__label">{t('fields.sport')} <span>*</span></label>
                                    <select className="og-modal__input">
                                        <option value="">{t('common.select')}</option>
                                        {SPORTS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="og-modal__label">{t('fields.inn')} <span>*</span></label>
                                    <input className="og-modal__input" placeholder="14-значный ИНН" />
                                </div>
                                <div>
                                    <label className="og-modal__label">{t('organizations.drawer.regDate')}</label>
                                    <input className="og-modal__input" type="date" />
                                </div>

                                <div className="og-modal__section-title">{t('organizations.modal.contacts')}</div>

                                <div>
                                    <label className="og-modal__label">{t('fields.region')} <span>*</span></label>
                                    <select className="og-modal__input">
                                        <option value="">{t('common.select')}</option>
                                        {REGIONS.map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="og-modal__label">{t('fields.phone')}</label>
                                    <input className="og-modal__input" placeholder="+996 …" />
                                </div>
                                <div className="og-modal__field--full">
                                    <label className="og-modal__label">{t('fields.address')}</label>
                                    <input className="og-modal__input" placeholder="Полный адрес" />
                                </div>
                                <div>
                                    <label className="og-modal__label">{t('fields.email')}</label>
                                    <input className="og-modal__input" type="email" placeholder="email@example.kg" />
                                </div>
                                <div>
                                    <label className="og-modal__label">{t('organizations.drawer.website')}</label>
                                    <input className="og-modal__input" placeholder="example.kg" />
                                </div>

                                <div className="og-modal__section-title">{t('organizations.modal.management')}</div>

                                <div>
                                    <label className="og-modal__label">{t('organizations.form.headName')} <span>*</span></label>
                                    <input className="og-modal__input" placeholder="Фамилия Имя Отчество" />
                                </div>
                                <div>
                                    <label className="og-modal__label">{t('organizations.form.position')}</label>
                                    <input className="og-modal__input" placeholder="Президент / Директор / …" />
                                </div>
                            </div>
                        </div>
                        <div className="og-modal__footer">
                            <button className="og-btn og-btn--outline" onClick={() => setModal(false)}>{t('common.cancel')}</button>
                            <button className="og-btn og-btn--primary" onClick={() => { toast('Организация добавлена'); setModal(false) }}>{t('common.save')}</button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}
        </div>
    )
}