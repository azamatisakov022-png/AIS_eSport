import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import './Coaches.css'
import Portal from '../components/Portal'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, MetricCard, Badge } from '../components/ui'

const SPORTS = ['Бокс', 'Борьба', 'Дзюдо', 'Футбол', 'Плавание', 'Лёгкая атлетика', 'Каратэ', 'Тхэквондо', 'Гимнастика', 'Шахматы']
const REGIONS = ['Бишкек', 'Ош', 'Чуйская', 'Иссык-Кульская', 'Джалал-Абадская', 'Нарынская', 'Баткенская', 'Таласская', 'Ошская']
const ORGS = ['СДЮСШОР №3 г. Бишкек', 'ДЮСШ «Олимп»', 'Ошская СДЮСШОР', 'СК «Иссык-Куль»', 'ДЮСШ Нарынской области', 'Федерация тхэквондо КР', 'СДЮСШОР «Кубат»', 'ФК «Дордой» Академия', 'Шахматный клуб «Стратегия»', 'СДЮСШОР по гимнастике', 'ДЮСШ №5 г. Ош', 'Водный центр «Дельфин»']

const today = new Date()
today.setHours(0, 0, 0, 0)

function addYears(dateStr, y) {
    const d = new Date(dateStr)
    d.setFullYear(d.getFullYear() + y)
    return d.toISOString().slice(0, 10)
}

function daysUntil(dateStr) {
    const d = new Date(dateStr)
    return Math.ceil((d - today) / (1000 * 60 * 60 * 24))
}

function fmt(dateStr) {
    return new Date(dateStr).toLocaleDateString('ru-RU')
}

function computeStatus(coach) {
    if (coach.annulled) return 'annulled'
    const days = daysUntil(coach.endDate)
    if (days <= 0) return 'annulled'
    if (days <= 30) return 'expiring'
    return 'active'
}

const MOCK = [
    { id: 1,  name: 'Асанов Бакыт Маратович',            birth: '1985-04-12', sex: 'М', phone: '+996 555 112233', email: 'asanov@mail.kg',       cert: 'СВ-КР-2024-00142', regDate: '2024-03-15', sport: 'Дзюдо',           rank: 'Мастер спорта КР',              org: 'СДЮСШОР №3 г. Бишкек',       employ: 'Штатный',     region: 'Бишкек',          annulled: false, docs: [1,1,1,1] },
    { id: 2,  name: 'Кулматова Айгерим Сагынбековна',     birth: '1990-08-22', sex: 'Ж', phone: '+996 700 445566', email: 'kulmatova@gmail.com',   cert: 'СВ-КР-2024-00198', regDate: '2024-05-20', sport: 'Лёгкая атлетика', rank: 'КМС',                           org: 'ДЮСШ «Олимп»',              employ: 'Штатный',     region: 'Бишкек',          annulled: false, docs: [1,1,1,1] },
    { id: 3,  name: 'Джумабаев Эрлан Калыкович',          birth: '1988-01-30', sex: 'М', phone: '+996 777 889900', email: 'jumabaev@inbox.kg',     cert: 'СВ-КР-2023-00087', regDate: '2023-11-10', sport: 'Бокс',            rank: 'Мастер спорта межд. класса',    org: 'Ошская СДЮСШОР',             employ: 'Штатный',     region: 'Ош',              annulled: false, docs: [1,1,1,1] },
    { id: 4,  name: 'Токтогулова Назира Асылбековна',     birth: '1992-11-05', sex: 'Ж', phone: '+996 550 112244', email: 'toktogulova@mail.kg',   cert: 'СВ-КР-2024-00215', regDate: '2024-06-01', sport: 'Плавание',        rank: 'КМС',                           org: 'СК «Иссык-Куль»',            employ: 'Совместитель', region: 'Иссык-Кульская', annulled: false, docs: [1,1,1,1] },
    { id: 5,  name: 'Бейшеналиев Данияр Кубатович',       birth: '1982-06-18', sex: 'М', phone: '+996 700 998877', email: 'beish@mail.kg',         cert: 'СВ-КР-2023-00054', regDate: '2023-04-22', sport: 'Борьба',          rank: 'Мастер спорта КР',              org: 'ДЮСШ Нарынской области',      employ: 'Штатный',     region: 'Нарынская',       annulled: false, docs: [1,1,1,1] },
    { id: 6,  name: 'Абдылдаев Нурбек Турдумаматович',    birth: '1995-03-08', sex: 'М', phone: '+996 555 667788', email: 'abdyldaev@gmail.com',   cert: 'СВ-КР-2022-00312', regDate: '2022-04-18', sport: 'Тхэквондо',      rank: '1 разряд',                      org: 'Федерация тхэквондо КР',      employ: 'Совместитель', region: 'Джалал-Абадская', annulled: true,  docs: [1,0,1,1] },
    { id: 7,  name: 'Сатыбалдиева Мээрим Акжолтоевна',    birth: '1993-09-14', sex: 'Ж', phone: '+996 770 223344', email: 'satybald@mail.kg',      cert: 'СВ-КР-2025-00018', regDate: '2025-01-12', sport: 'Каратэ',          rank: 'Мастер спорта КР',              org: 'СДЮСШОР «Кубат»',            employ: 'Штатный',     region: 'Бишкек',          annulled: false, docs: [1,1,1,1] },
    { id: 8,  name: 'Ормонов Алмаз Кайратович',           birth: '1987-12-01', sex: 'М', phone: '+996 500 556677', email: 'ormonov@inbox.kg',      cert: 'СВ-КР-2024-00176', regDate: '2024-04-30', sport: 'Футбол',          rank: 'Лицензия UEFA B',               org: 'ФК «Дордой» Академия',        employ: 'Штатный',     region: 'Чуйская',         annulled: false, docs: [1,1,1,1] },
    { id: 9,  name: 'Жумагулов Тимур Эркинович',          birth: '1991-07-20', sex: 'М', phone: '+996 555 998877', email: 'jumagulov@mail.kg',     cert: 'СВ-КР-2023-00101', regDate: '2023-05-05', sport: 'Шахматы',         rank: 'Международный мастер ФИДЕ',     org: 'Шахматный клуб «Стратегия»',  employ: 'Совместитель', region: 'Бишкек',          annulled: false, docs: [1,1,1,1] },
    { id: 10, name: 'Касымова Жылдыз Болотбековна',       birth: '1994-02-28', sex: 'Ж', phone: '+996 700 112299', email: 'kasymova@gmail.com',    cert: 'СВ-КР-2024-00233', regDate: '2024-07-15', sport: 'Гимнастика',      rank: 'Мастер спорта КР',              org: 'СДЮСШОР по гимнастике',       employ: 'Штатный',     region: 'Бишкек',          annulled: false, docs: [1,1,1,1] },
    { id: 11, name: 'Турдалиев Марат Сапарбекович',       birth: '1986-10-03', sex: 'М', phone: '+996 550 778899', email: 'turdaliev@mail.kg',     cert: 'СВ-КР-2023-00089', regDate: '2023-03-28', sport: 'Дзюдо',           rank: 'КМС',                           org: 'ДЮСШ №5 г. Ош',              employ: 'Штатный',     region: 'Ошская',          annulled: false, docs: [1,1,1,1] },
    { id: 12, name: 'Эсенгулова Айчурок Таалайбековна',   birth: '1996-05-17', sex: 'Ж', phone: '+996 700 334455', email: 'esengulov@gmail.com',   cert: 'СВ-КР-2025-00031', regDate: '2025-02-10', sport: 'Плавание',        rank: 'КМС',                           org: 'Водный центр «Дельфин»',      employ: 'Штатный',     region: 'Бишкек',          annulled: false, docs: [1,1,1,1] },
].map(c => ({ ...c, endDate: addYears(c.regDate, 3) }))

// Make id=5 and id=11 expiring (endDate in next 20 days)
MOCK[4].endDate = new Date(Date.now() + 18 * 86400000).toISOString().slice(0, 10)
MOCK[10].endDate = new Date(Date.now() + 8 * 86400000).toISOString().slice(0, 10)

const DOC_LABEL_KEYS = ['coaches.docs.passport', 'coaches.docs.diploma', 'coaches.docs.sportTitle', 'coaches.docs.criminalRecord']

const HISTORY_MOCK = [
    { action: 'Свидетельство выдано', color: 'green', user: 'Алымбеков К.Т.' },
    { action: 'Данные обновлены', color: 'blue', user: 'Касымова А.Б.' },
    { action: 'Проверка подлинности - подтверждена', color: 'green', user: 'Система' },
]

const EMPTY_FORM = {
    name: '', birth: '', sex: 'М', phone: '', email: '',
    sport: '', rank: '', org: '', employ: 'Штатный', region: '',
}

export default function Coaches() {
    const { t } = useTranslation()
    const toast = useToast()
    const [data] = useState(MOCK)
    const [search, setSearch] = useState('')
    const [sportF, setSportF] = useState('')
    const [regionF, setRegionF] = useState('')
    const [statusF, setStatusF] = useState('all')
    const [orgF, setOrgF] = useState('')
    const [drawer, setDrawer] = useState(null)
    const [tab, setTab] = useState('info')
    const [addModal, setAddModal] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)

    const enriched = useMemo(() => data.map(c => ({ ...c, _status: computeStatus(c) })), [data])

    const filtered = useMemo(() => {
        return enriched.filter(c => {
            if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.cert.toLowerCase().includes(search.toLowerCase())) return false
            if (sportF && c.sport !== sportF) return false
            if (regionF && c.region !== regionF) return false
            if (orgF && c.org !== orgF) return false
            if (statusF !== 'all' && c._status !== statusF) return false
            return true
        })
    }, [enriched, search, sportF, regionF, statusF, orgF])

    const metrics = useMemo(() => ({
        total: enriched.length,
        active: enriched.filter(c => c._status === 'active').length,
        expiring: enriched.filter(c => c._status === 'expiring').length,
        annulled: enriched.filter(c => c._status === 'annulled').length,
    }), [enriched])

    const drawerCoach = drawer !== null ? enriched.find(c => c.id === drawer) : null

    const openDrawer = (id) => {
        setDrawer(id)
        setTab('info')
    }

    const setField = (k, v) => setForm(p => ({ ...p, [k]: v }))

    const statusBadge = (s) => {
        if (s === 'active')   return <Badge variant="green">{t('coaches.statusActive')}</Badge>
        if (s === 'expiring') return <Badge variant="amber">{t('coaches.statusExpiring')}</Badge>
        return <Badge variant="gray">{t('coaches.statusRevoked')}</Badge>
    }

    return (
        <div className="co-page">
            <Breadcrumbs current={t('coaches.registryTitle')} />
            {/* Header */}
            <PageHeader
                title={t('coaches.registryTitle')}
                actions={<Button variant="primary" onClick={() => { setForm(EMPTY_FORM); setAddModal(true) }}><span>+</span> {t('coaches.addNew')}</Button>}
            />

            {/* Metrics */}
            <div className="co-metrics">
                <MetricCard tone="blue" icon={MetricIcons.teacher()} value={metrics.total} label={t('coaches.metricsTotal')} />
                <MetricCard tone="green" icon={MetricIcons.active()} value={metrics.active} label={t('coaches.metricsActive')} />
                <MetricCard tone="orange" icon={MetricIcons.warning()} value={metrics.expiring} label={t('coaches.metricsExpiring')} />
                <MetricCard icon={MetricIcons.blocked()} value={metrics.annulled} label={t('coaches.metricsRevoked')} />
            </div>

            {/* Filters */}
            <div className="co-filters">
                <div className="co-filters__search">
                    <span className="co-filters__search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder={t('coaches.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="co-filters__select" value={sportF} onChange={e => setSportF(e.target.value)}>
                    <option value="">{t('athletes.filters.allSports')}</option>
                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="co-filters__select" value={regionF} onChange={e => setRegionF(e.target.value)}>
                    <option value="">{t('athletes.filters.allRegions')}</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select className="co-filters__select" value={orgF} onChange={e => setOrgF(e.target.value)}>
                    <option value="">{t('coaches.allOrganizations')}</option>
                    {ORGS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <select className="co-filters__select" value={statusF} onChange={e => setStatusF(e.target.value)}>
                    <option value="all">{t('common.allStatuses')}</option>
                    <option value="active">{t('coaches.metricsActive')}</option>
                    <option value="expiring">{t('coaches.statusExpiring')}</option>
                    <option value="annulled">{t('coaches.metricsRevoked')}</option>
                </select>
            </div>

            {/* Table */}
            <div className="co-table-wrap">
                <table className="co-table">
                    <thead>
                        <tr>
                            <th>{t('coaches.table.name')}</th>
                            <th>{t('coaches.table.certNumber')}</th>
                            <th>{t('coaches.table.sport')}</th>
                            <th>{t('coaches.table.organization')}</th>
                            <th>{t('common.region')}</th>
                            <th>{t('coaches.table.expiryDate')}</th>
                            <th>{t('common.status')}</th>
                            <th>{t('coaches.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} className="co-table__empty">{t('coaches.notFound')}</td></tr>
                        )}
                        {filtered.map(c => {
                            const days = daysUntil(c.endDate)
                            const daysClass = days <= 0 ? 'co-days--danger' : days <= 30 ? 'co-days--danger' : days <= 90 ? 'co-days--warn' : 'co-days--ok'
                            return (
                                <tr key={c.id}>
                                    <td>
                                        <div className="co-person">
                                            <div className="co-person__info">
                                                <div className="co-person__name">{c.name}</div>
                                                <div className="co-person__sub">{c.sex}, {fmt(c.birth)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="co-cert">{c.cert}</span></td>
                                    <td>{c.sport}</td>
                                    <td style={{ fontSize: 12 }}>{c.org}</td>
                                    <td>{c.region}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {fmt(c.endDate)}
                                        {c._status !== 'annulled' && (
                                            <span className={`co-days ${daysClass}`}>
                                                {days > 0 ? `${days} ${t('common.daysShort')}` : t('coaches.expired')}
                                            </span>
                                        )}
                                    </td>
                                    <td>{statusBadge(c._status)}</td>
                                    <td>
                                        <button className="co-btn co-btn--primary" onClick={() => openDrawer(c.id)}>
                                            Просмотр
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Drawer */}
            {drawerCoach && (
                <Portal>
                <div className="co-drawer-overlay" onClick={() => setDrawer(null)}>
                    <div className="co-drawer" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="co-drawer__header">
                            <div className="co-drawer__profile">
                                <div>
                                    <div className="co-drawer__name">{drawerCoach.name}</div>
                                    {statusBadge(drawerCoach._status)}
                                </div>
                            </div>
                            <button className="co-drawer__close" onClick={() => setDrawer(null)}>✕</button>
                        </div>

                        {/* Tabs */}
                        <div className="co-tabs">
                            <button className={`co-tab ${tab === 'info' ? 'co-tab--active' : ''}`} onClick={() => setTab('info')}>{t('coaches.tabs.main')}</button>
                            <button className={`co-tab ${tab === 'docs' ? 'co-tab--active' : ''}`} onClick={() => setTab('docs')}>{t('coaches.tabs.documents')}</button>
                            <button className={`co-tab ${tab === 'history' ? 'co-tab--active' : ''}`} onClick={() => setTab('history')}>{t('coaches.tabs.history')}</button>
                        </div>

                        {/* Body */}
                        <div className="co-drawer__body">
                            {tab === 'info' && (
                                <div className="co-info-grid">
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('common.name')}</div>
                                        <div className="co-info-item__value">{drawerCoach.name}</div>
                                    </div>
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('fields.birthDate')}</div>
                                        <div className="co-info-item__value">{fmt(drawerCoach.birth)}</div>
                                    </div>
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('fields.gender')}</div>
                                        <div className="co-info-item__value">{drawerCoach.sex === 'М' ? t('fields.male') : t('fields.female')}</div>
                                    </div>
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('fields.phone')}</div>
                                        <div className="co-info-item__value">{drawerCoach.phone}</div>
                                    </div>
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('fields.email')}</div>
                                        <div className="co-info-item__value">{drawerCoach.email}</div>
                                    </div>
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('coaches.drawer.certNumber')}</div>
                                        <div className="co-info-item__value" style={{ fontFamily: 'monospace' }}>{drawerCoach.cert}</div>
                                    </div>
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('coaches.drawer.regDate')}</div>
                                        <div className="co-info-item__value">{fmt(drawerCoach.regDate)}</div>
                                    </div>
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('coaches.drawer.endDate')}</div>
                                        <div className="co-info-item__value">
                                            {fmt(drawerCoach.endDate)}
                                            {drawerCoach._status !== 'annulled' && (() => {
                                                const d = daysUntil(drawerCoach.endDate)
                                                return <span className={`co-days ${d <= 30 ? 'co-days--danger' : 'co-days--ok'}`} style={{ marginLeft: 6 }}>{d > 0 ? `${d} ${t('common.daysShort')}` : t('coaches.expired')}</span>
                                            })()}
                                        </div>
                                    </div>
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('fields.sport')}</div>
                                        <div className="co-info-item__value">{drawerCoach.sport}</div>
                                    </div>
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('coaches.drawer.rankDegree')}</div>
                                        <div className="co-info-item__value">{drawerCoach.rank}</div>
                                    </div>
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('fields.organization')}</div>
                                        <div className="co-info-item__value">{drawerCoach.org}</div>
                                    </div>
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('coaches.drawer.employment')}</div>
                                        <div className="co-info-item__value">{drawerCoach.employ}</div>
                                    </div>
                                    <div className="co-info-item">
                                        <div className="co-info-item__label">{t('fields.region')}</div>
                                        <div className="co-info-item__value">{drawerCoach.region}</div>
                                    </div>
                                </div>
                            )}

                            {tab === 'docs' && (
                                <div className="co-doc-list">
                                    {DOC_LABEL_KEYS.map((labelKey, i) => (
                                        <div key={labelKey} className={`co-doc-item ${drawerCoach.docs[i] ? 'co-doc-item--ok' : 'co-doc-item--no'}`}>
                                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: drawerCoach.docs[i] ? '#16a34a' : '#ef4444' }} />
                                            <span className="co-doc-item__name">{t(labelKey)}</span>
                                            {drawerCoach.docs[i] && (
                                                <button className="co-btn co-btn--small" onClick={() => toast(`Просмотр: ${t(labelKey)}`)}>{t('common.view')}</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {tab === 'history' && (
                                <div className="co-history">
                                    {HISTORY_MOCK.map((h, i) => {
                                        const d = new Date(drawerCoach.regDate)
                                        d.setDate(d.getDate() + i * 45)
                                        return (
                                            <div className="co-history-item" key={i}>
                                                <div className={`co-history-item__dot co-history-item__dot--${h.color}`} />
                                                <div>
                                                    <div>{h.action}</div>
                                                    <div className="co-history-item__date">{fmt(d.toISOString().slice(0, 10))}</div>
                                                    <div className="co-history-item__user">{h.user}</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="co-drawer__footer">
                            <button className="co-btn co-btn--primary" onClick={() => toast('Редактирование')}>{t('common.edit')}</button>
                            <button className="co-btn co-btn--red" onClick={() => toast('Аннулирование свидетельства')}>{t('coaches.actions.revoke')}</button>
                            <button className="co-btn co-btn--outline" onClick={() => toast('Выдача дубликата')}>{t('coaches.actions.duplicate')}</button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}

            {/* Add Modal */}
            {addModal && (
                <Portal>
                <div className="co-modal-overlay" onClick={() => setAddModal(false)}>
                    <div className="co-modal" onClick={e => e.stopPropagation()}>
                        <div className="co-modal__header">
                            <h2 className="co-modal__title">{t('coaches.addNew')}</h2>
                            <button className="co-modal__close" onClick={() => setAddModal(false)}>✕</button>
                        </div>
                        <div className="co-modal__body">
                            <div className="co-modal__grid">
                                <h4 className="co-modal__section-title">{t('athletes.modal.personalData')}</h4>

                                <div className="co-modal__field">
                                    <label className="co-modal__label">{t('common.name')} <span>*</span></label>
                                    <input className="co-modal__input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Фамилия Имя Отчество" />
                                </div>
                                <div className="co-modal__field">
                                    <label className="co-modal__label">{t('fields.birthDate')} <span>*</span></label>
                                    <input className="co-modal__input" type="date" value={form.birth} onChange={e => setField('birth', e.target.value)} />
                                </div>
                                <div className="co-modal__field">
                                    <label className="co-modal__label">{t('fields.gender')}</label>
                                    <select className="co-modal__input" value={form.sex} onChange={e => setField('sex', e.target.value)}>
                                        <option value="М">{t('fields.male')}</option>
                                        <option value="Ж">{t('fields.female')}</option>
                                    </select>
                                </div>
                                <div className="co-modal__field">
                                    <label className="co-modal__label">{t('fields.phone')} <span>*</span></label>
                                    <input className="co-modal__input" type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+996 XXX XXXXXX" />
                                </div>
                                <div className="co-modal__field">
                                    <label className="co-modal__label">{t('fields.email')}</label>
                                    <input className="co-modal__input" type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="email@example.com" />
                                </div>

                                <h4 className="co-modal__section-title">{t('coaches.modal.professionalData')}</h4>

                                <div className="co-modal__field">
                                    <label className="co-modal__label">{t('fields.sport')} <span>*</span></label>
                                    <select className="co-modal__input" value={form.sport} onChange={e => setField('sport', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="co-modal__field">
                                    <label className="co-modal__label">{t('coaches.drawer.rankDegree')}</label>
                                    <input className="co-modal__input" value={form.rank} onChange={e => setField('rank', e.target.value)} placeholder="Мастер спорта, КМС..." />
                                </div>
                                <div className="co-modal__field">
                                    <label className="co-modal__label">{t('fields.organization')} <span>*</span></label>
                                    <select className="co-modal__input" value={form.org} onChange={e => setField('org', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {ORGS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="co-modal__field">
                                    <label className="co-modal__label">{t('coaches.drawer.employment')}</label>
                                    <select className="co-modal__input" value={form.employ} onChange={e => setField('employ', e.target.value)}>
                                        <option value="Штатный">{t('employment.fullTime')}</option>
                                        <option value="Совместитель">{t('employment.partTime')}</option>
                                    </select>
                                </div>
                                <div className="co-modal__field">
                                    <label className="co-modal__label">{t('fields.region')} <span>*</span></label>
                                    <select className="co-modal__input" value={form.region} onChange={e => setField('region', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="co-modal__footer">
                            <button className="co-btn co-btn--outline" onClick={() => setAddModal(false)}>{t('common.cancel')}</button>
                            <button className="co-btn co-btn--primary" style={{ padding: '10px 24px' }} onClick={() => { toast('Тренер сохранён (демо)'); setAddModal(false) }}>{t('common.save')}</button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}
        </div>
    )
}