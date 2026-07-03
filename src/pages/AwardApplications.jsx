import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { awardsApi } from '../api/esport'
import { MetricIcons } from '../components/CabinetIcons'
import './AwardApplications.css'
import Portal from '../components/Portal'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, MetricCard, Badge } from '../components/ui'
import { useNavigate } from 'react-router-dom'

const GROUP_KEYS = { A: 'awardApplications.groups.A', B: 'awardApplications.groups.B', C: 'awardApplications.groups.C' }
const STATUS_KEYS = [
    { value: 'Подана',                   label: 'Подана' },
    { value: 'Проверка комплектности',   label: 'Проверка комплектности' },
    { value: 'На доработке',             label: 'На доработке' },
    { value: 'На рассмотрении',          label: 'На рассмотрении' },
    { value: 'Одобрено',                 label: 'Одобрено' },
    { value: 'Ожидание решения Кабмина', label: 'Ожидание решения Кабмина' },
    { value: 'Приказ подписан',          label: 'Приказ подписан' },
    { value: 'Присвоено',                label: 'Присвоено' },
    { value: 'Отклонена',                label: 'Отклонена' },
    { value: 'Отозвана',                 label: 'Отозвана' },
]
const DEPRIVE_REASONS = ['Допинг', 'Судимость', 'Недостоверные документы', 'Нарушение этики']

const today = new Date()
today.setHours(0, 0, 0, 0)

function fmt(dateStr) { return new Date(dateStr).toLocaleDateString('ru-RU') }
function daysUntil(dateStr) { return Math.ceil((new Date(dateStr) - today) / (1000 * 60 * 60 * 24)) }
function addWorkDays(dateStr, days) {
    const d = new Date(dateStr)
    let added = 0
    while (added < days) { d.setDate(d.getDate() + 1); const wd = d.getDay(); if (wd !== 0 && wd !== 6) added++ }
    return d.toISOString().slice(0, 10)
}
function awardGroup(award) {
    if (!award) return 'C'
    const u = award.toUpperCase()
    if (u.includes('КМС') || u.includes('КАНДИДАТ')) return 'B'               // группа B
    if (u.includes('ЗАСЛУЖЕНН') || u.includes('ЗМС') || u.includes('ЗТ')
        || u.includes('МСМК') || u.includes('МАСТЕР СПОРТА') || u.includes('МС КР')
        || u.includes('МСВЕТ')) return 'A'                                   // высшие звания
    return 'C'                                                                // разряды
}
function deadlineDays(group) { return group === 'A' ? 30 : group === 'B' ? 20 : 15 }
// Кто присваивает звание/разряд по уровню (Q14): A→Агентство, B→область/город, C→спорторганизация
const GROUP_ORGAN = { A: 'ГАФКиС', B: 'Обл./гор. управление ФКиС', C: 'Спортшкола / спорторганизация' }

const BASE_DOCS = ['Копия паспорта', '2 фотографии 3х4', 'Протокол соревнований']
const HIGH_DOCS = ['Представление от организации', 'Ходатайство федерации', 'Выписка из протокола', 'Заключение Дирекции', 'Справка об отсутствии судимости']
const TRAINER_DOCS = ['Копия трудовой книжки', 'Список спортсменов', 'Списки групп за 4 года']

function getDocList(award) {
    const g = awardGroup(award)
    let docs = [...BASE_DOCS]
    if (g === 'A') docs = [...docs, ...HIGH_DOCS]
    if (award === 'ЗТ КР') docs = [...docs, ...TRAINER_DOCS]
    return docs
}

const MOCK = [
    { id: 1,  appNo: 'AW-20260225-094512', name: 'Асанов Бакыт Маратович',         award: 'МС КР',    sport: 'Дзюдо',            submitDate: '2026-02-25', status: 'На рассмотрении', docsUploaded: 8, docsTotal: 8 },
    { id: 2,  appNo: 'AW-20260301-112033', name: 'Кулматова Айгерим Сагынбековна',  award: 'КМС',      sport: 'Лёгкая атлетика',  submitDate: '2026-03-01', status: 'Подана',           docsUploaded: 3, docsTotal: 3 },
    { id: 3,  appNo: 'AW-20260210-083045', name: 'Джумабаев Эрлан Калыкович',       award: 'ЗМС КР',   sport: 'Бокс',             submitDate: '2026-02-10', status: 'На рассмотрении', docsUploaded: 8, docsTotal: 8 },
    { id: 4,  appNo: 'AW-20260228-150120', name: 'Токтогулова Назира Асылбековна',  award: 'I разряд',  sport: 'Плавание',         submitDate: '2026-02-28', status: 'Присвоено',       docsUploaded: 3, docsTotal: 3 },
    { id: 5,  appNo: 'AW-20260220-091530', name: 'Бейшеналиев Данияр Кубатович',    award: 'МСМК',     sport: 'Борьба',           submitDate: '2026-02-20', status: 'Требует доработки', docsUploaded: 6, docsTotal: 8 },
    { id: 6,  appNo: 'AW-20260305-140011', name: 'Сатыбалдиева Мээрим Акжолтоевна', award: 'КМС',      sport: 'Каратэ',           submitDate: '2026-03-05', status: 'Подана',           docsUploaded: 3, docsTotal: 3 },
    { id: 7,  appNo: 'AW-20260215-100500', name: 'Ормонов Алмаз Кайратович',        award: 'ЗТ КР',    sport: 'Футбол',           submitDate: '2026-02-15', status: 'На рассмотрении', docsUploaded: 11, docsTotal: 11 },
    { id: 8,  appNo: 'AW-20260308-093012', name: 'Касымова Жылдыз Болотбековна',    award: 'II разряд', sport: 'Гимнастика',       submitDate: '2026-03-08', status: 'Подана',           docsUploaded: 3, docsTotal: 3 },
    { id: 9,  appNo: 'AW-20260118-112200', name: 'Турдалиев Марат Сапарбекович',    award: 'МС КР',    sport: 'Дзюдо',            submitDate: '2026-01-18', status: 'Присвоено',       docsUploaded: 8, docsTotal: 8 },
    { id: 10, appNo: 'AW-20260303-160045', name: 'Эсенгулова Айчурок Таалайбековна',award: 'I юн.',     sport: 'Плавание',         submitDate: '2026-03-03', status: 'Отказано',        docsUploaded: 3, docsTotal: 3 },
    { id: 11, appNo: 'AW-20260125-081515', name: 'Жумагулов Тимур Эркинович',       award: 'ЗМС КР',   sport: 'Шахматы',          submitDate: '2026-01-25', status: 'Отказано',        docsUploaded: 8, docsTotal: 8 },
    { id: 12, appNo: 'AW-20260310-143022', name: 'Абдылдаев Нурбек Турдумаматович', award: 'III разряд',sport: 'Тхэквондо',        submitDate: '2026-03-10', status: 'Подана',           docsUploaded: 3, docsTotal: 3 },
]

const DEPRIVE_MOCK = [
    { id: 101, name: 'Кадыров Руслан Байышович',   award: 'МС КР',        sport: 'Каратэ', reason: 'Допинг',                   initiatedDate: '2026-02-01', appealDeadline: '2027-02-01', status: 'Лишён' },
    { id: 102, name: 'Борубаев Марат Кулбаевич',    award: 'ЗМС КР',       sport: 'Бокс',   reason: 'Недостоверные документы',   initiatedDate: '2026-03-01', appealDeadline: '2026-04-01', status: 'На рассмотрении' },
    { id: 103, name: 'Осмонов Тилек Азаматович',    award: 'МСМК → МС КР', sport: 'Борьба', reason: 'Пересмотр результатов',     initiatedDate: '2026-03-10', appealDeadline: '2027-03-10', status: 'Понижение' },
]

const RESTORE_MOCK = [
    { id: 201, name: 'Омурзаков Нурлан Женишбекович', award: 'МС КР', sport: 'Футбол', submitDate: '2026-03-05', deadline: '2026-04-05', votes: '-', status: 'На рассмотрении' },
]

const COMMISSION = [
    { name: 'Алымбеков К.Т.', position: 'Председатель комиссии' },
    { name: 'Касымова А.Б.', position: 'Заместитель председателя' },
    { name: 'Мамытов Э.К.', position: 'Член комиссии' },
]

const HISTORY_MOCK = [
    { action: 'Заявка подана', color: 'blue', user: 'Система' },
    { action: 'Принята на рассмотрение', color: 'green', user: 'Алымбеков К.Т.' },
    { action: 'Документы проверены', color: 'blue', user: 'Касымова А.Б.' },
]

export default function AwardApplications() {
    const { t } = useTranslation()
    const toast = useToast()
    const navigate = useNavigate()
    const [mainTab, setMainTab] = useState('assign')
    const [search, setSearch] = useState('')
    const [groupF, setGroupF] = useState('')
    const [statusF, setStatusF] = useState('all')
    const [rows, setRows] = useState(MOCK)

    // Загрузка из бэкенда (с фолбэком на демо-данные при недоступности API)
    useEffect(() => {
        let alive = true
        awardsApi.list({ size: 200 })
            .then(({ items }) => {
                if (!alive || !items.length) return
                setRows(items.map(a => ({
                    id: a.id,
                    appNo: a.appNo,
                    name: a.applicantName || a.athleteName || '—',
                    award: a.award,
                    sport: a.sport || '—',
                    submitDate: a.submitDate,
                    status: a.status,
                    docsUploaded: a.docsUploaded ?? 0,
                    docsTotal: a.docsTotal ?? 0,
                    _group: a.awardGroup,
                    _routing: a.routingLevel,
                    _deadline: a.deadline,
                    _remain: a.remainingDays,
                })))
            })
            .catch(() => { /* остаёмся на демо-данных */ })
        return () => { alive = false }
    }, [])

    const enriched = useMemo(() => rows.map(a => {
        const g = awardGroup(a.award)
        const dl = a._deadline || addWorkDays(a.submitDate, deadlineDays(g))
        const remain = a._remain != null ? a._remain : daysUntil(dl)
        return { ...a, group: g, deadline: dl, remain, routing: a._routing }
    }), [rows])

    const filtered = useMemo(() => {
        return enriched.filter(a => {
            if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.appNo.toLowerCase().includes(search.toLowerCase())) return false
            if (groupF && a.group !== groupF) return false
            if (statusF !== 'all' && a.status !== statusF) return false
            return true
        })
    }, [enriched, search, groupF, statusF])

    const metrics = useMemo(() => ({
        total: enriched.length,
        reviewing: enriched.filter(a => a.status === 'На рассмотрении').length,
        expiring: enriched.filter(a => (a.status === 'На рассмотрении' || a.status === 'Подана') && a.remain <= 5 && a.remain > 0).length,
        awarded: enriched.filter(a => a.status === 'Присвоено' || a.status === 'Награждена').length,
        rejected: enriched.filter(a => a.status === 'Отказано' || a.status === 'Отклонена').length,
    }), [enriched])

    const statusBadge = (status) => {
        const map = {
            'Подана':                   'blue',
            'Проверка комплектности':   'blue',
            'Требует доработки':        'amber',
            'На доработке':             'amber',
            'На рассмотрении':          'amber',
            'Ожидание решения Кабмина': 'amber',
            'Одобрено':                 'green',
            'Одобрена':                 'green',
            'Приказ подписан':          'green',
            'Награждена':               'green',
            'Присвоено':                'green',
            'Отказано':                 'red',
            'Отклонена':                'red',
            'Отозвана':                 'gray',
            'Лишён':                    'gray',
        }
        const labelMap = {
            'Подана': t('awardApplications.statuses.submitted'),
            'На рассмотрении': t('awardApplications.statuses.underReview'),
            'Требует доработки': t('awardApplications.statuses.needsRevision'),
            'Присвоено': t('awardApplications.statuses.awarded'),
            'Отказано': t('awardApplications.statuses.rejected'),
        }
        return <Badge variant={map[status] || 'gray'}>{labelMap[status] || status}</Badge>
    }

    const genCertNo = () => {
        const year = new Date().getFullYear()
        const num = String(Math.floor(Math.random() * 9000) + 1000)
        return `УД-КР-${year}-${num}`
    }

    return (
        <div className="aw-page">
            <Breadcrumbs current={t('awardApplications.registryTitle')} />
            {/* Header */}
            <PageHeader title={t('awardApplications.registryTitle')} />

            {/* Main tabs */}
            <div className="aw-main-tabs">
                <button className={`aw-main-tab ${mainTab === 'assign' ? 'aw-main-tab--active' : ''}`} onClick={() => setMainTab('assign')}>{t('awardApplications.tabs.assign')}</button>
                <button className={`aw-main-tab ${mainTab === 'deprive' ? 'aw-main-tab--active' : ''}`} onClick={() => setMainTab('deprive')}>{t('awardApplications.tabs.deprive')}</button>
                <button className={`aw-main-tab ${mainTab === 'restore' ? 'aw-main-tab--active' : ''}`} onClick={() => setMainTab('restore')}>{t('awardApplications.tabs.restore')}</button>
            </div>

            {/* ═══════ ПРИСВОЕНИЕ ═══════ */}
            {mainTab === 'assign' && (
                <>
                    {/* Metrics */}
                    <div className="aw-metrics">
                        <MetricCard tone="blue" icon={MetricIcons.clipboard()} value={metrics.total} label={t('awardApplications.metricsTotal')} />
                        <MetricCard tone="amber" icon={MetricIcons.search()} value={metrics.reviewing} label={t('awardApplications.metricsUnderReview')} />
                        <MetricCard tone="red" icon={MetricIcons.clock()} value={metrics.expiring} label={t('awardApplications.metricsExpiring')} />
                        <MetricCard tone="green" icon={MetricIcons.active()} value={metrics.awarded} label={t('awardApplications.metricsAwarded')} />
                        <MetricCard icon={MetricIcons.rejected()} value={metrics.rejected} label={t('awardApplications.metricsRejected')} />
                    </div>

                    {/* Filters */}
                    <div className="aw-filters">
                        <div className="aw-filters__search">
                            <span className="aw-filters__search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                            <input placeholder="Поиск по ФИО или номеру заявки..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <select className="aw-filters__select" value={groupF} onChange={e => setGroupF(e.target.value)}>
                            <option value="">{t('awardApplications.filtersAllGroups')}</option>
                            <option value="A">{t('awardApplications.filtersGroupA')}</option>
                            <option value="B">{t('awardApplications.filtersGroupB')}</option>
                            <option value="C">{t('awardApplications.filtersGroupC')}</option>
                        </select>
                        <select className="aw-filters__select" value={statusF} onChange={e => setStatusF(e.target.value)}>
                            <option value="all">{t('common.allStatuses')}</option>
                            {STATUS_KEYS.map(st => <option key={st.value} value={st.value}>{st.label}</option>)}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="aw-table-wrap">
                        <table className="aw-table">
                            <thead>
                                <tr>
                                    <th>{t('awardApplications.table.appNumber')}</th>
                                    <th>{t('awardApplications.table.applicant')}</th>
                                    <th>{t('awardApplications.table.rank')}</th>
                                    <th>{t('fields.sport')}</th>
                                    <th>Маршрут</th>
                                    <th>{t('awardApplications.table.submitDate')}</th>
                                    <th>{t('awardApplications.table.remaining')}</th>
                                    <th>{t('awardApplications.table.completeness')}</th>
                                    <th>{t('common.status')}</th>
                                    <th>{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 && (
                                    <tr><td colSpan={10} className="aw-table__empty">Заявки не найдены</td></tr>
                                )}
                                {filtered.map(a => {
                                    const daysClass = a.remain <= 0 ? 'aw-days--danger' : a.remain <= 5 ? 'aw-days--danger' : a.remain <= 10 ? 'aw-days--warn' : 'aw-days--ok'
                                    const isTerminal = ['Присвоено', 'Награждена', 'Отказано', 'Отклонена', 'Отозвана'].includes(a.status)
                                    return (
                                        <tr key={a.id}>
                                            <td><span className="aw-appno">{a.appNo}</span></td>
                                            <td>
                                                <span className="aw-person__name">{a.name}</span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    <span style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>{a.award}</span>
                                                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{t(GROUP_KEYS[a.group])}</span>
                                                </div>
                                            </td>
                                            <td>{a.sport}</td>
                                            <td style={{ fontSize: 12, color: '#475569', maxWidth: 150 }}>{a.routing || GROUP_ORGAN[a.group]}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{fmt(a.submitDate)}</td>
                                            <td>
                                                {!isTerminal ? (
                                                    <span className={`aw-days ${daysClass}`}>
                                                        {a.remain > 0 ? `${a.remain} ${t('awardApplications.workingDays')}` : t('awardApplications.overdue')}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontSize: 12 }}>-</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`aw-completeness ${a.docsUploaded === a.docsTotal ? 'aw-completeness--full' : 'aw-completeness--partial'}`}>
                                                    {a.docsUploaded}/{a.docsTotal}
                                                </span>
                                            </td>
                                            <td>{statusBadge(a.status)}</td>
                                            <td>
                                                <button className="aw-btn aw-btn--primary" onClick={() => navigate(`/award-applications/${a.id}`)}>Открыть</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* ═══════ ЛИШЕНИЕ ═══════ */}
            {mainTab === 'deprive' && (
                <>
                    <div className="aw-tab-header">
                        <div>
                            <p className="aw-tab-desc">Лишение или понижение спортивного звания/разряда по решению Комиссии ГАФКиС; сведения хранятся в архиве.</p>
                            <p className="aw-tab-desc">Срок апелляции: 1 месяц (ЗМС/ЗТ), 1 год (МС/МСМК).</p>
                        </div>
                        <button className="aw-header__btn" onClick={() => toast('Инициирование лишения / понижения (демо)')}>
                            <span>+</span> Инициировать лишение / понижение
                        </button>
                    </div>

                    <div className="aw-table-wrap">
                        <table className="aw-table">
                            <thead>
                                <tr>
                                    <th>ФИО</th>
                                    <th>Звание</th>
                                    <th>Вид спорта</th>
                                    <th>Основание</th>
                                    <th>Дата инициации</th>
                                    <th>Срок апелляции</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {DEPRIVE_MOCK.map(d => (
                                    <tr key={d.id}>
                                        <td>
                                            <span className="aw-person__name">{d.name}</span>
                                        </td>
                                        <td><span style={{ fontWeight: 600 }}>{d.award}</span></td>
                                        <td>{d.sport}</td>
                                        <td>
                                            <span className="aw-reason-badge">{d.reason}</span>
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{fmt(d.initiatedDate)}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            до {fmt(d.appealDeadline)}
                                            {(() => {
                                                const rem = daysUntil(d.appealDeadline)
                                                return rem > 0
                                                    ? <span className="aw-days aw-days--ok" style={{ marginLeft: 6 }}>{rem} дн.</span>
                                                    : <span className="aw-days aw-days--danger" style={{ marginLeft: 6 }}>истёк</span>
                                            })()}
                                        </td>
                                        <td>{statusBadge(d.status === 'Лишён' ? 'Лишён' : d.status)}</td>
                                        <td>
                                            <button className="aw-btn aw-btn--primary" onClick={() => toast('Карточка лишения (демо)')}>Открыть</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* ═══════ ВОССТАНОВЛЕНИЕ ═══════ */}
            {mainTab === 'restore' && (
                <>
                    <div className="aw-tab-header">
                        <div>
                            <p className="aw-tab-desc">Восстановление в спортивном звании по решению Комиссии.</p>
                            <p className="aw-tab-desc">Решение принимается тайным голосованием 2/3 членов комиссии, срок рассмотрения - 1 месяц.</p>
                        </div>
                    </div>

                    <div className="aw-table-wrap">
                        <table className="aw-table">
                            <thead>
                                <tr>
                                    <th>ФИО</th>
                                    <th>Звание</th>
                                    <th>Вид спорта</th>
                                    <th>Дата подачи</th>
                                    <th>Дедлайн</th>
                                    <th>Голосование</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RESTORE_MOCK.map(r => (
                                    <tr key={r.id}>
                                        <td>
                                            <span className="aw-person__name">{r.name}</span>
                                        </td>
                                        <td><span style={{ fontWeight: 600 }}>{r.award}</span></td>
                                        <td>{r.sport}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{fmt(r.submitDate)}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            {fmt(r.deadline)}
                                            {(() => {
                                                const rem = daysUntil(r.deadline)
                                                return rem > 0
                                                    ? <span className="aw-days aw-days--ok" style={{ marginLeft: 6 }}>{rem} дн.</span>
                                                    : <span className="aw-days aw-days--danger" style={{ marginLeft: 6 }}>истёк</span>
                                            })()}
                                        </td>
                                        <td><span style={{ color: '#94a3b8' }}>{r.votes}</span></td>
                                        <td>{statusBadge(r.status)}</td>
                                        <td>
                                            <button className="aw-btn aw-btn--primary" onClick={() => toast('Карточка восстановления (демо)')}>Открыть</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}