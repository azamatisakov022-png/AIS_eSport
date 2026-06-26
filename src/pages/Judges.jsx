import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { judgesApi } from '../api/esport'
import { MetricIcons } from '../components/CabinetIcons'
import './Judges.css'
import Portal from '../components/Portal'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, MetricCard } from '../components/ui'

const SPORTS = ['Бокс', 'Борьба', 'Дзюдо', 'Футбол', 'Плавание', 'Лёгкая атлетика', 'Каратэ', 'Тхэквондо', 'Гимнастика', 'Шахматы', 'Волейбол', 'Баскетбол', 'Хоккей', 'Биатлон']
const REGIONS = ['Бишкек', 'Ош', 'Чуйская', 'Иссык-Кульская', 'Джалал-Абадская', 'Нарынская', 'Баткенская', 'Таласская', 'Ошская']
const CATEGORY_KEYS = [
    { value: 'Международная', key: 'judges.categories.international' },
    { value: 'Национальная', key: 'judges.categories.national' },
    { value: 'I категория', key: 'judges.categories.first' },
    { value: 'Судья по спорту', key: 'judges.categories.sportJudge' },
]
const ORGS = ['ГАФКиС КР', 'Федерация бокса КР', 'Федерация борьбы КР', 'Федерация дзюдо КР', 'Федерация футбола КР', 'Федерация плавания КР', 'Федерация лёгкой атлетики КР', 'Федерация каратэ КР', 'Федерация тхэквондо КР', 'Федерация гимнастики КР', 'Федерация шахмат КР']

const today = new Date()
today.setHours(0, 0, 0, 0)

function daysUntil(dateStr) {
    const d = new Date(dateStr)
    return Math.ceil((d - today) / (1000 * 60 * 60 * 24))
}

function fmt(dateStr) {
    return dateStr ? new Date(dateStr).toLocaleDateString('ru-RU') : '—'
}

function computeStatus(j) {
    if (j.annulled) return 'annulled'
    const days = daysUntil(j.endDate)
    if (days <= 0) return 'annulled'
    if (days <= 30) return 'expiring'
    return 'active'
}

function catClass(cat) {
    if (!cat) return 'jd-cat--base'
    const c = cat.toLowerCase()
    if (c.includes('международ')) return 'jd-cat--intl'
    if (c.includes('национал')) return 'jd-cat--national'
    if (c.startsWith('i категория') || c.startsWith('i ')) return 'jd-cat--first'
    return 'jd-cat--base'
}

const MOCK = [
    { id: 1,  name: 'Абдраимов Кайрат Маратович',        birth: '1978-03-15', sex: 'М', phone: '+996 555 101010', email: 'abdraim@mail.kg',    cert: 'УД-КР-2023-0012', category: 'Международная', sports: ['Бокс'],                   attestDate: '2023-06-10', endDate: '2027-06-10', region: 'Бишкек',          org: 'Федерация бокса КР',             annulled: false },
    { id: 2,  name: 'Маматова Гулнара Токтосуновна',      birth: '1985-07-22', sex: 'Ж', phone: '+996 700 202020', email: 'mamatova@gmail.com',  cert: 'УД-КР-2024-0034', category: 'Национальная',  sports: ['Дзюдо'],                  attestDate: '2024-01-18', endDate: '2028-01-18', region: 'Бишкек',          org: 'Федерация дзюдо КР',             annulled: false },
    { id: 3,  name: 'Сыдыков Эркин Бакирович',            birth: '1980-11-03', sex: 'М', phone: '+996 777 303030', email: 'sydykov@inbox.kg',    cert: 'УД-КР-2023-0056', category: 'Международная', sports: ['Борьба', 'Дзюдо'],        attestDate: '2023-09-25', endDate: '2027-09-25', region: 'Ош',              org: 'Федерация борьбы КР',            annulled: false },
    { id: 4,  name: 'Бекбоева Айжан Кубанычбековна',      birth: '1990-04-18', sex: 'Ж', phone: '+996 550 404040', email: 'bekboeva@mail.kg',    cert: 'УД-КР-2024-0078', category: 'I категория',   sports: ['Лёгкая атлетика'],        attestDate: '2024-03-12', endDate: '2028-03-12', region: 'Чуйская',         org: 'Федерация лёгкой атлетики КР',   annulled: false },
    { id: 5,  name: 'Турсунов Данияр Алмазович',          birth: '1983-09-07', sex: 'М', phone: '+996 500 505050', email: 'tursunov@gmail.com',  cert: 'УД-КР-2022-0091', category: 'Национальная',  sports: ['Футбол'],                 attestDate: '2022-12-05', endDate: '2026-12-05', region: 'Бишкек',          org: 'Федерация футбола КР',           annulled: false },
    { id: 6,  name: 'Кадыров Руслан Байышович',           birth: '1975-01-25', sex: 'М', phone: '+996 555 606060', email: 'kadyrov@inbox.kg',    cert: 'УД-КР-2023-0103', category: 'Международная', sports: ['Каратэ', 'Тхэквондо'],   attestDate: '2023-07-20', endDate: '2027-07-20', region: 'Джалал-Абадская', org: 'Федерация каратэ КР',            annulled: false },
    { id: 7,  name: 'Усенова Назгуль Эрмековна',          birth: '1992-06-14', sex: 'Ж', phone: '+996 700 707070', email: 'usenova@mail.kg',     cert: 'УД-КР-2024-0115', category: 'I категория',   sports: ['Гимнастика'],             attestDate: '2024-02-28', endDate: '2028-02-28', region: 'Бишкек',          org: 'Федерация гимнастики КР',        annulled: false },
    { id: 8,  name: 'Жумабеков Тимур Сапарбекович',       birth: '1988-12-01', sex: 'М', phone: '+996 770 808080', email: 'jumabekov@gmail.com', cert: 'УД-КР-2023-0127', category: 'Судья по спорту', sports: ['Шахматы'],              attestDate: '2023-10-15', endDate: '2027-10-15', region: 'Нарынская',       org: 'Федерация шахмат КР',            annulled: false },
    { id: 9,  name: 'Асанбекова Мээрим Талантовна',        birth: '1994-08-20', sex: 'Ж', phone: '+996 550 909090', email: 'asanbekova@mail.kg',  cert: 'УД-КР-2024-0139', category: 'Судья по спорту', sports: ['Плавание'],             attestDate: '2024-05-10', endDate: '2028-05-10', region: 'Иссык-Кульская',  org: 'Федерация плавания КР',          annulled: false },
    { id: 10, name: 'Борубаев Марат Кулбаевич',           birth: '1981-05-30', sex: 'М', phone: '+996 555 111222', email: 'borubaev@inbox.kg',   cert: 'УД-КР-2023-0148', category: 'Национальная',  sports: ['Бокс', 'Борьба'],         attestDate: '2023-08-14', endDate: '2027-08-14', region: 'Ошская',          org: 'Федерация бокса КР',             annulled: false },
    { id: 11, name: 'Токоева Нуржан Айбековна',           birth: '1987-02-11', sex: 'Ж', phone: '+996 700 333444', email: 'tokoeva@gmail.com',   cert: 'УД-КР-2024-0160', category: 'I категория',   sports: ['Тхэквондо'],              attestDate: '2024-04-22', endDate: '2028-04-22', region: 'Баткенская',      org: 'Федерация тхэквондо КР',         annulled: false },
    { id: 12, name: 'Калыков Адылбек Нурматович',          birth: '1979-10-08', sex: 'М', phone: '+996 500 555666', email: 'kalykov@mail.kg',     cert: 'УД-КР-2022-0172', category: 'Судья по спорту', sports: ['Волейбол'],             attestDate: '2022-11-30', endDate: '2026-11-30', region: 'Таласская',       org: 'ГАФКиС КР',                     annulled: false },
    { id: 13, name: 'Эсенгулов Бакыт Токтоматович',       birth: '1976-04-02', sex: 'М', phone: '+996 777 777888', email: 'esengulov@inbox.kg',  cert: 'УД-КР-2023-0185', category: 'Национальная',  sports: ['Лёгкая атлетика', 'Бокс'],attestDate: '2023-05-18', endDate: '2027-05-18', region: 'Бишкек',          org: 'Федерация лёгкой атлетики КР',   annulled: false },
    { id: 14, name: 'Омурзаков Нурлан Женишбекович',       birth: '1984-07-19', sex: 'М', phone: '+996 550 999000', email: 'omurzakov@gmail.com', cert: 'УД-КР-2021-0045', category: 'I категория',   sports: ['Футбол'],                 attestDate: '2021-02-15', endDate: '2025-02-15', region: 'Ош',              org: 'Федерация футбола КР',           annulled: true  },
]

// Make id=5 and id=12 expiring (endDate within 30 days)
MOCK[4].endDate = new Date(Date.now() + 22 * 86400000).toISOString().slice(0, 10)
MOCK[11].endDate = new Date(Date.now() + 11 * 86400000).toISOString().slice(0, 10)

const EVENTS_MOCK = [
    { name: 'Чемпионат КР по боксу', date: '2026-04-10', place: 'Бишкек', role: 'Главный судья', status: 'Назначен' },
    { name: 'Кубок Азии по дзюдо', date: '2026-05-20', place: 'Ош', role: 'Боковой судья', status: 'Подтверждён' },
    { name: 'Первенство среди юниоров', date: '2026-03-15', place: 'Каракол', role: 'Арбитр', status: 'Завершено' },
    { name: 'Республиканский турнир', date: '2026-06-01', place: 'Бишкек', role: 'Судья на ковре', status: 'Назначен' },
]

const DOC_LABEL_KEYS = ['judges.docs.certificate', 'judges.docs.diploma', 'judges.docs.attestation']

const HISTORY_MOCK = [
    { action: 'Присвоена категория «Судья по спорту»', color: 'green',  user: 'Алымбеков К.Т.' },
    { action: 'Повышение до «I категория»',            color: 'blue',   user: 'Касымова А.Б.' },
    { action: 'Повышение до «Национальная»',           color: 'blue',   user: 'Мамытов Э.К.' },
    { action: 'Аттестация пройдена',                   color: 'green',  user: 'Система' },
]

const EMPTY_FORM = {
    name: '', birth: '', sex: 'М', phone: '', email: '',
    category: '', sports: '', org: '', region: '', attestDate: '',
}

export default function Judges() {
    const { t } = useTranslation()
    const toast = useToast()
    const [data, setData] = useState(MOCK)
    const [search, setSearch] = useState('')
    const [catF, setCatF] = useState('')
    const [sportF, setSportF] = useState('')
    const [regionF, setRegionF] = useState('')
    const [statusF, setStatusF] = useState('all')
    const [drawer, setDrawer] = useState(null)
    const [tab, setTab] = useState('info')
    const [addModal, setAddModal] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)

    // Загрузка реестра судей из бэкенда (с фолбэком на демо-данные)
    useEffect(() => {
        let alive = true
        judgesApi.list({ size: 200 })
            .then(({ items }) => { if (alive && items.length) setData(items) })
            .catch(() => { /* остаёмся на демо-данных */ })
        return () => { alive = false }
    }, [])

    const enriched = useMemo(() => data.map(j => ({ ...j, _status: computeStatus(j) })), [data])

    const filtered = useMemo(() => {
        return enriched.filter(j => {
            if (search && !j.name.toLowerCase().includes(search.toLowerCase()) && !j.cert.toLowerCase().includes(search.toLowerCase())) return false
            if (catF && j.category !== catF) return false
            if (sportF && !j.sports.includes(sportF)) return false
            if (regionF && j.region !== regionF) return false
            if (statusF !== 'all' && j._status !== statusF) return false
            return true
        })
    }, [enriched, search, catF, sportF, regionF, statusF])

    const metrics = useMemo(() => ({
        total: enriched.length,
        intl: enriched.filter(j => j.category && j.category.toLowerCase().includes('международ')).length,
        national: enriched.filter(j => j.category && j.category.toLowerCase().includes('национал')).length,
        expiring: enriched.filter(j => j._status === 'expiring').length,
        annulled: enriched.filter(j => j._status === 'annulled').length,
    }), [enriched])

    const drawerJudge = drawer !== null ? enriched.find(j => j.id === drawer) : null

    const openDrawer = (id) => {
        setDrawer(id)
        setTab('info')
    }

    const setField = (k, v) => setForm(p => ({ ...p, [k]: v }))

    const translateCategory = (cat) => {
        const found = CATEGORY_KEYS.find(c => c.value === cat)
        return found ? t(found.key) : cat
    }

    const DOC_LABELS = DOC_LABEL_KEYS.map(key => t(key))

    const statusBadge = (s) => {
        if (s === 'active')   return <span className="jd-badge jd-badge--green">{t('coaches.statusActive')}</span>
        if (s === 'expiring') return <span className="jd-badge jd-badge--orange">{t('coaches.statusExpiring')}</span>
        return <span className="jd-badge jd-badge--gray">{t('judges.metricsRevoked')}</span>
    }

    return (
        <div className="jd-page">
            <Breadcrumbs current={t('judges.registryTitle')} />
            {/* Header */}
            <PageHeader
                title={t('judges.registryTitle')}
                actions={<Button variant="primary" onClick={() => { setForm(EMPTY_FORM); setAddModal(true) }}><span>+</span> {t('judges.addNew')}</Button>}
            />

            {/* Metrics */}
            <div className="jd-metrics">
                <MetricCard tone="blue" icon={MetricIcons.judge()} value={metrics.total} label={t('judges.metricsTotal')} />
                <MetricCard tone="amber" icon={MetricIcons.globe()} value={metrics.intl} label={t('judges.metricsInternational')} />
                <MetricCard tone="purple" icon={MetricIcons.medal('#d97706')} value={metrics.national} label={t('judges.metricsNational')} />
                <MetricCard tone="orange" icon={MetricIcons.warning()} value={metrics.expiring} label={t('judges.metricsExpiring')} />
                <MetricCard tone="red" icon={MetricIcons.blocked()} value={metrics.annulled} label={t('judges.metricsRevoked')} />
            </div>

            {/* Filters */}
            <div className="jd-filters">
                <div className="jd-filters__search">
                    <span className="jd-filters__search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder="Поиск по ФИО или номеру..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="jd-filters__select" value={catF} onChange={e => setCatF(e.target.value)}>
                    <option value="">{t('common.allCategories')}</option>
                    {CATEGORY_KEYS.map(c => <option key={c.value} value={c.value}>{t(c.key)}</option>)}
                </select>
                <select className="jd-filters__select" value={sportF} onChange={e => setSportF(e.target.value)}>
                    <option value="">Все виды спорта</option>
                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="jd-filters__select" value={regionF} onChange={e => setRegionF(e.target.value)}>
                    <option value="">Все регионы</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select className="jd-filters__select" value={statusF} onChange={e => setStatusF(e.target.value)}>
                    <option value="all">Все статусы</option>
                    <option value="active">Действующее</option>
                    <option value="expiring">Истекает</option>
                    <option value="annulled">Аннулировано</option>
                </select>
            </div>

            {/* Table */}
            <div className="jd-table-wrap">
                <table className="jd-table">
                    <thead>
                        <tr>
                            <th>{t('common.name')}</th>
                            <th>{t('judges.table.certNumber')}</th>
                            <th>{t('judges.table.category')}</th>
                            <th>{t('fields.sport')}</th>
                            <th>{t('fields.region')}</th>
                            <th>{t('fields.expiryDate')}</th>
                            <th>{t('common.status')}</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} className="jd-table__empty">{t('judges.notFound')}</td></tr>
                        )}
                        {filtered.map(j => {
                            const days = daysUntil(j.endDate)
                            const daysClass = days <= 0 ? 'jd-days--danger' : days <= 30 ? 'jd-days--danger' : days <= 90 ? 'jd-days--warn' : 'jd-days--ok'
                            return (
                                <tr key={j.id}>
                                    <td>
                                        <div className="jd-person">
                                            <div className="jd-person__info">
                                                <div className="jd-person__name">{j.name}</div>
                                                <div className="jd-person__sub">{[j.sex, j.birth ? fmt(j.birth) : null].filter(Boolean).join(', ') || '—'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="jd-cert">{j.cert}</span></td>
                                    <td><span className={`jd-cat ${catClass(j.category)}`}>{translateCategory(j.category)}</span></td>
                                    <td>{j.sports.join(', ')}</td>
                                    <td>{j.region}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {fmt(j.endDate)}
                                        {j._status !== 'annulled' && (
                                            <span className={`jd-days ${daysClass}`}>
                                                {days > 0 ? `${days} ${t('common.daysShort')}` : t('common.overdue')}
                                            </span>
                                        )}
                                    </td>
                                    <td>{statusBadge(j._status)}</td>
                                    <td>
                                        <button className="jd-btn jd-btn--primary" onClick={() => openDrawer(j.id)}>
                                            {t('common.view')}
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Drawer */}
            {drawerJudge && (
                <Portal>
                <div className="jd-drawer-overlay" onClick={() => setDrawer(null)}>
                    <div className="jd-drawer" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="jd-drawer__header">
                            <div className="jd-drawer__profile">
                                <div>
                                    <div className="jd-drawer__name">{drawerJudge.name}</div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <span className={`jd-cat ${catClass(drawerJudge.category)}`}>{translateCategory(drawerJudge.category)}</span>
                                        {statusBadge(drawerJudge._status)}
                                    </div>
                                </div>
                            </div>
                            <button className="jd-drawer__close" onClick={() => setDrawer(null)}>✕</button>
                        </div>

                        {/* Tabs */}
                        <div className="jd-tabs">
                            <button className={`jd-tab ${tab === 'info' ? 'jd-tab--active' : ''}`} onClick={() => setTab('info')}>{t('judges.tabs.main')}</button>
                            <button className={`jd-tab ${tab === 'events' ? 'jd-tab--active' : ''}`} onClick={() => setTab('events')}>{t('judges.tabs.events')}</button>
                            <button className={`jd-tab ${tab === 'docs' ? 'jd-tab--active' : ''}`} onClick={() => setTab('docs')}>{t('judges.tabs.documents')}</button>
                            <button className={`jd-tab ${tab === 'history' ? 'jd-tab--active' : ''}`} onClick={() => setTab('history')}>{t('judges.tabs.history')}</button>
                        </div>

                        {/* Body */}
                        <div className="jd-drawer__body">
                            {tab === 'info' && (
                                <div className="jd-info-grid">
                                    <div className="jd-info-item">
                                        <div className="jd-info-item__label">{t('common.name')}</div>
                                        <div className="jd-info-item__value">{drawerJudge.name}</div>
                                    </div>
                                    <div className="jd-info-item">
                                        <div className="jd-info-item__label">{t('fields.birthDate')}</div>
                                        <div className="jd-info-item__value">{fmt(drawerJudge.birth)}</div>
                                    </div>
                                    <div className="jd-info-item">
                                        <div className="jd-info-item__label">{t('fields.gender')}</div>
                                        <div className="jd-info-item__value">{drawerJudge.sex === 'М' ? t('fields.male') : t('fields.female')}</div>
                                    </div>
                                    <div className="jd-info-item">
                                        <div className="jd-info-item__label">{t('fields.phone')}</div>
                                        <div className="jd-info-item__value">{drawerJudge.phone}</div>
                                    </div>
                                    <div className="jd-info-item">
                                        <div className="jd-info-item__label">{t('fields.email')}</div>
                                        <div className="jd-info-item__value">{drawerJudge.email}</div>
                                    </div>
                                    <div className="jd-info-item">
                                        <div className="jd-info-item__label">{t('fields.region')}</div>
                                        <div className="jd-info-item__value">{drawerJudge.region}</div>
                                    </div>
                                    <div className="jd-info-item">
                                        <div className="jd-info-item__label">{t('judges.table.certNumber')}</div>
                                        <div className="jd-info-item__value" style={{ fontFamily: 'monospace' }}>{drawerJudge.cert}</div>
                                    </div>
                                    <div className="jd-info-item">
                                        <div className="jd-info-item__label">{t('judges.table.category')}</div>
                                        <div className="jd-info-item__value">
                                            <span className={`jd-cat ${catClass(drawerJudge.category)}`}>{translateCategory(drawerJudge.category)}</span>
                                        </div>
                                    </div>
                                    <div className="jd-info-item">
                                        <div className="jd-info-item__label">{t('judges.drawer.attestationDate')}</div>
                                        <div className="jd-info-item__value">{fmt(drawerJudge.attestDate)}</div>
                                    </div>
                                    <div className="jd-info-item">
                                        <div className="jd-info-item__label">{t('fields.expiryDate')}</div>
                                        <div className="jd-info-item__value">
                                            {fmt(drawerJudge.endDate)}
                                            {drawerJudge._status !== 'annulled' && (() => {
                                                const d = daysUntil(drawerJudge.endDate)
                                                return <span className={`jd-days ${d <= 30 ? 'jd-days--danger' : 'jd-days--ok'}`} style={{ marginLeft: 6 }}>{d > 0 ? `${d} ${t('common.daysShort')}` : t('common.overdue')}</span>
                                            })()}
                                        </div>
                                    </div>
                                    <div className="jd-info-item jd-info-item--full">
                                        <div className="jd-info-item__label">{t('judges.drawer.sportTypes')}</div>
                                        <div className="jd-info-item__value" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                            {drawerJudge.sports.map(s => (
                                                <span key={s} className="jd-sport-tag">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="jd-info-item jd-info-item--full">
                                        <div className="jd-info-item__label">{t('fields.organization')}</div>
                                        <div className="jd-info-item__value">{drawerJudge.org}</div>
                                    </div>
                                </div>
                            )}

                            {tab === 'events' && (
                                <div className="jd-events-table-wrap">
                                    <table className="jd-events-table">
                                        <thead>
                                            <tr>
                                                <th>{t('judges.eventsTable.event')}</th>
                                                <th>{t('judges.eventsTable.date')}</th>
                                                <th>{t('judges.eventsTable.location')}</th>
                                                <th>{t('judges.eventsTable.role')}</th>
                                                <th>{t('judges.eventsTable.status')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {EVENTS_MOCK.map((ev, i) => (
                                                <tr key={i}>
                                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{ev.name}</td>
                                                    <td>{fmt(ev.date)}</td>
                                                    <td>{ev.place}</td>
                                                    <td>{ev.role}</td>
                                                    <td>
                                                        <span className={`jd-badge ${ev.status === 'Завершено' ? 'jd-badge--gray' : ev.status === 'Подтверждён' ? 'jd-badge--green' : 'jd-badge--blue'}`}>
                                                            {ev.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {tab === 'docs' && (
                                <div className="jd-doc-list">
                                    {DOC_LABELS.map((label, i) => (
                                        <div key={label} className="jd-doc-item jd-doc-item--ok">
                                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
                                            <span className="jd-doc-item__name">{label}</span>
                                            <button className="jd-btn jd-btn--small" onClick={() => toast(`${t('common.view')}: ${label}`)}>{t('common.view')}</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {tab === 'history' && (
                                <div className="jd-history">
                                    {HISTORY_MOCK.map((h, i) => {
                                        const d = new Date(drawerJudge.attestDate)
                                        d.setDate(d.getDate() - (HISTORY_MOCK.length - 1 - i) * 365)
                                        return (
                                            <div className="jd-history-item" key={i}>
                                                <div className={`jd-history-item__dot jd-history-item__dot--${h.color}`} />
                                                <div>
                                                    <div>{h.action}</div>
                                                    <div className="jd-history-item__date">{fmt(d.toISOString().slice(0, 10))}</div>
                                                    <div className="jd-history-item__user">{h.user}</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="jd-drawer__footer">
                            <button className="jd-btn jd-btn--primary" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => toast('Редактирование')}>{t('common.edit')}</button>
                            <button className="jd-btn jd-btn--red" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => toast('Аннулирование удостоверения')}>{t('judges.actions.revoke')}</button>
                            <button className="jd-btn jd-btn--green" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => toast('Повышение категории')}>{t('judges.actions.promoteCategory')}</button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}

            {/* Add Modal */}
            {addModal && (
                <Portal>
                <div className="jd-modal-overlay" onClick={() => setAddModal(false)}>
                    <div className="jd-modal" onClick={e => e.stopPropagation()}>
                        <div className="jd-modal__header">
                            <h2 className="jd-modal__title">{t('judges.addNew')}</h2>
                            <button className="jd-modal__close" onClick={() => setAddModal(false)}>✕</button>
                        </div>
                        <div className="jd-modal__body">
                            <div className="jd-modal__grid">
                                <h4 className="jd-modal__section-title">{t('athletes.modal.personalData')}</h4>

                                <div className="jd-modal__field">
                                    <label className="jd-modal__label">{t('common.name')} <span>*</span></label>
                                    <input className="jd-modal__input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Фамилия Имя Отчество" />
                                </div>
                                <div className="jd-modal__field">
                                    <label className="jd-modal__label">{t('fields.birthDate')} <span>*</span></label>
                                    <input className="jd-modal__input" type="date" value={form.birth} onChange={e => setField('birth', e.target.value)} />
                                </div>
                                <div className="jd-modal__field">
                                    <label className="jd-modal__label">{t('fields.gender')}</label>
                                    <select className="jd-modal__input" value={form.sex} onChange={e => setField('sex', e.target.value)}>
                                        <option value="М">{t('fields.male')}</option>
                                        <option value="Ж">{t('fields.female')}</option>
                                    </select>
                                </div>
                                <div className="jd-modal__field">
                                    <label className="jd-modal__label">{t('fields.phone')} <span>*</span></label>
                                    <input className="jd-modal__input" type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+996 XXX XXXXXX" />
                                </div>
                                <div className="jd-modal__field">
                                    <label className="jd-modal__label">{t('fields.email')}</label>
                                    <input className="jd-modal__input" type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="email@example.com" />
                                </div>
                                <div className="jd-modal__field">
                                    <label className="jd-modal__label">{t('fields.region')} <span>*</span></label>
                                    <select className="jd-modal__input" value={form.region} onChange={e => setField('region', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>

                                <h4 className="jd-modal__section-title">{t('judges.modal.judgeData')}</h4>

                                <div className="jd-modal__field">
                                    <label className="jd-modal__label">{t('judges.table.category')} <span>*</span></label>
                                    <select className="jd-modal__input" value={form.category} onChange={e => setField('category', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {CATEGORY_KEYS.map(c => <option key={c.value} value={c.value}>{t(c.key)}</option>)}
                                    </select>
                                </div>
                                <div className="jd-modal__field">
                                    <label className="jd-modal__label">{t('fields.sport')} <span>*</span></label>
                                    <input className="jd-modal__input" value={form.sports} onChange={e => setField('sports', e.target.value)} placeholder="Бокс, Дзюдо..." />
                                </div>
                                <div className="jd-modal__field">
                                    <label className="jd-modal__label">{t('fields.organization')} <span>*</span></label>
                                    <select className="jd-modal__input" value={form.org} onChange={e => setField('org', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {ORGS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="jd-modal__field">
                                    <label className="jd-modal__label">{t('judges.drawer.attestationDate')} <span>*</span></label>
                                    <input className="jd-modal__input" type="date" value={form.attestDate} onChange={e => setField('attestDate', e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="jd-modal__footer">
                            <button className="jd-btn jd-btn--outline" onClick={() => setAddModal(false)}>{t('common.cancel')}</button>
                            <button className="jd-btn jd-btn--primary" style={{ padding: '10px 24px' }} onClick={() => { toast('Судья сохранён (демо)'); setAddModal(false) }}>{t('common.save')}</button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}
        </div>
    )
}