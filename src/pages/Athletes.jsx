import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import Breadcrumbs from '../components/Breadcrumbs'
import { TableSkeleton, MetricSkeleton } from '../components/Skeleton'
import './Athletes.css'
import Portal from '../components/Portal'
import { athletesApi, VERIFICATION, LIFECYCLE } from '../api/esport'

const VERIF_CHIP = {
    DRAFT: { bg: 'rgba(142,142,147,0.15)', color: '#6e6e73' },
    IN_REVIEW: { bg: 'rgba(217,119,6,0.15)', color: '#b45309' },
    VERIFIED: { bg: 'rgba(22,163,74,0.15)', color: '#16a34a' },
    REJECTED: { bg: 'rgba(225,29,72,0.15)', color: '#e11d48' },
}
const LIFE_CHIP = {
    ACTIVE: { bg: 'rgba(22,163,74,0.12)', color: '#16a34a' },
    INACTIVE: { bg: 'rgba(142,142,147,0.15)', color: '#6e6e73' },
    SUSPENDED: { bg: 'rgba(217,119,6,0.15)', color: '#b45309' },
    DISQUALIFIED: { bg: 'rgba(225,29,72,0.15)', color: '#e11d48' },
    RETIRED: { bg: 'rgba(99,102,241,0.15)', color: '#6366f1' },
    EXCLUDED: { bg: 'rgba(60,60,67,0.18)', color: '#3c3c43' },
}
function chip(map, code) { return map[code] || { bg: 'rgba(142,142,147,0.15)', color: '#6e6e73' } }

const SPORTS = ['Бокс', 'Борьба', 'Дзюдо', 'Футбол', 'Плавание', 'Лёгкая атлетика', 'Каратэ', 'Тхэквондо', 'Гимнастика', 'Шахматы', 'Тяжёлая атлетика', 'Стрельба']
const REGIONS = ['Бишкек', 'Ош', 'Чуйская', 'Иссык-Кульская', 'Джалал-Абадская', 'Нарынская', 'Баткенская', 'Таласская', 'Ошская']
const RANKS = ['ЗМС КР', 'МСМК', 'МС КР', 'КМС', 'I р.', 'II р.', 'III р.', 'I юн.р.', 'II юн.р.', 'III юн.р.']
const ORGS = ['СДЮСШОР №3', 'ДЮСШ «Олимп»', 'Ошская СДЮСШОР', 'СК «Иссык-Куль»', 'ДЮСШ Нарынской обл.', 'СДЮСШОР «Кубат»', 'ФК «Дордой»', 'Шахматный клуб «Стратегия»', 'СДЮСШОР по гимнастике', 'ДЮСШ №5 г. Ош', 'Водный центр «Дельфин»', 'Стрелковый клуб КР']
const COLORS = ['#2563EB', '#059669', '#7c3aed', '#d97706', '#e11d48', '#0d9488', '#6366f1', '#0891b2']

function fmt(d) { return d ? new Date(d).toLocaleDateString('ru-RU') : '-' }
function initials(n) { const p = n.split(' '); return (p[0]?.[0] || '') + (p[1]?.[0] || '') }
function avColor(id) { return COLORS[id % COLORS.length] }

function rankClass(r) {
    if (r === 'ЗМС КР') return 'ath-rank--zms'
    if (r === 'МСМК') return 'ath-rank--msmk'
    if (r === 'МС КР') return 'ath-rank--ms'
    if (r === 'КМС') return 'ath-rank--kms'
    if (r.includes('юн')) return 'ath-rank--yun'
    return 'ath-rank--razr'
}

function medStatus(d, t) {
    const exp = new Date(d)
    const now = new Date(); now.setHours(0,0,0,0)
    const diff = Math.ceil((exp - now) / 86400000)
    if (diff < 0) return { label: t('status.expired'), cls: 'ath-badge--red', key: 'expired' }
    if (diff <= 30) return { label: t('status.expiring'), cls: 'ath-badge--orange', key: 'expiring' }
    return { label: t('status.valid'), cls: 'ath-badge--green', key: 'valid' }
}

function insStatus(d, t) {
    const exp = new Date(d)
    const now = new Date(); now.setHours(0,0,0,0)
    const diff = Math.ceil((exp - now) / 86400000)
    if (diff < 0) return { label: t('status.expired'), cls: 'ath-badge--red' }
    if (diff <= 30) return { label: t('status.expiring'), cls: 'ath-badge--orange' }
    return { label: t('status.valid'), cls: 'ath-badge--green' }
}

const MOCK = [
    { id:1,  name:'Тыныстанов Айбек Маратович',       birth:'1998-04-12', sex:'М', phone:'+996 555 112233', email:'tynystanov@mail.kg',  region:'Бишкек',         sport:'Дзюдо',           rank:'ЗМС КР',  coach:'Асанов Б.М.',       org:'СДЮСШОР №3',              team:'Сборная КР по дзюдо',    medExp:'2026-08-15', medIssued:'2025-08-15', medBy:'РСМЦ г. Бишкек',  insExp:'2026-12-01', docs:[1,1,1], medals:[{m:'gold',e:'Чемпионат Азии',y:2023,c:'Узбекистан'},{m:'silver',e:'Гран-при Ташкент',y:2024,c:'Узбекистан'},{m:'gold',e:'Чемпионат КР',y:2024,c:'Кыргызстан'}] },
    { id:2,  name:'Алымбекова Айпери Нурлановна',      birth:'2001-08-22', sex:'Ж', phone:'+996 700 445566', email:'alymbekova@gmail.com', region:'Бишкек',         sport:'Лёгкая атлетика', rank:'МСМК',    coach:'Кулматова А.С.',    org:'ДЮСШ «Олимп»',           team:'Сборная КР по л/а',      medExp:'2026-05-20', medIssued:'2025-05-20', medBy:'РСМЦ г. Бишкек',  insExp:'2026-06-01', docs:[1,1,1], medals:[{m:'gold',e:'Чемпионат ЦА',y:2024,c:'Казахстан'},{m:'bronze',e:'Азиатские игры',y:2023,c:'Китай'}] },
    { id:3,  name:'Сыдыков Нурбек Кубанычбекович',     birth:'1996-01-30', sex:'М', phone:'+996 777 889900', email:'sydykov@inbox.kg',     region:'Ош',             sport:'Бокс',            rank:'МС КР',   coach:'Джумабаев Э.К.',    org:'Ошская СДЮСШОР',          team:'Сборная КР по боксу',    medExp:'2025-12-10', medIssued:'2024-12-10', medBy:'ОМЦ г. Ош',       insExp:'2026-01-15', docs:[1,1,1], medals:[{m:'gold',e:'Чемпионат КР',y:2023,c:'Кыргызстан'},{m:'silver',e:'Кубок Азии',y:2024,c:'Таиланд'}] },
    { id:4,  name:'Маматова Жаркынай Эмилбековна',     birth:'2003-11-05', sex:'Ж', phone:'+996 550 112244', email:'mamatova@mail.kg',     region:'Нарынская',      sport:'Борьба',          rank:'КМС',     coach:'Бейшеналиев Д.К.',  org:'ДЮСШ Нарынской обл.',     team:null,                     medExp:'2025-02-01', medIssued:'2024-02-01', medBy:'ОМЦ г. Нарын',    insExp:'2025-03-01', docs:[1,1,0], medals:[{m:'bronze',e:'Первенство КР',y:2024,c:'Кыргызстан'}] },
    { id:5,  name:'Кулов Эрлан Бактыбекович',          birth:'2000-03-08', sex:'М', phone:'+996 555 667788', email:'kulov@gmail.com',      region:'Джалал-Абадская', sport:'Тхэквондо',       rank:'МС КР',   coach:'Абдылдаев Н.Т.',    org:'Федерация тхэквондо',     team:'Сборная КР по тхэквондо', medExp:'2026-09-01', medIssued:'2025-09-01', medBy:'РСМЦ г. Бишкек',  insExp:'2026-10-01', docs:[1,1,1], medals:[{m:'gold',e:'Открытый ЧА',y:2023,c:'Корея'},{m:'gold',e:'Чемпионат КР',y:2024,c:'Кыргызстан'}] },
    { id:6,  name:'Орозбекова Нуриза Сагынбековна',    birth:'2005-09-14', sex:'Ж', phone:'+996 770 223344', email:'orozbekova@mail.kg',   region:'Бишкек',         sport:'Каратэ',          rank:'I р.',    coach:'Сатыбалдиева М.А.', org:'СДЮСШОР «Кубат»',         team:null,                     medExp:'2026-01-20', medIssued:'2025-01-20', medBy:'РСМЦ г. Бишкек',  insExp:'2026-02-01', docs:[1,1,1], medals:[{m:'silver',e:'Первенство КР (юн.)',y:2024,c:'Кыргызстан'}] },
    { id:7,  name:'Жапаров Данияр Талантбекович',       birth:'1999-12-01', sex:'М', phone:'+996 500 556677', email:'zhaparov@inbox.kg',    region:'Чуйская',        sport:'Футбол',          rank:'КМС',     coach:'Ормонов А.К.',      org:'ФК «Дордой»',             team:'Сборная КР по футболу',  medExp:'2026-04-30', medIssued:'2025-04-30', medBy:'РСМЦ г. Бишкек',  insExp:'2026-05-01', docs:[1,1,1], medals:[] },
    { id:8,  name:'Асанбекова Мээрим Кайратовна',       birth:'2002-02-28', sex:'Ж', phone:'+996 700 112299', email:'asanbekova@gmail.com', region:'Иссык-Кульская', sport:'Плавание',        rank:'МС КР',   coach:'Токтогулова Н.А.',  org:'СК «Иссык-Куль»',         team:'Сборная КР по плаванию', medExp:'2026-06-01', medIssued:'2025-06-01', medBy:'ОМЦ г. Каракол',  insExp:'2026-07-01', docs:[1,1,1], medals:[{m:'gold',e:'Чемпионат КР',y:2024,c:'Кыргызстан'},{m:'silver',e:'Кубок ЦА',y:2023,c:'Узбекистан'}] },
    { id:9,  name:'Бекмуратов Тимур Алмазович',        birth:'1997-07-20', sex:'М', phone:'+996 555 998877', email:'bekmuratov@mail.kg',   region:'Бишкек',         sport:'Борьба',          rank:'ЗМС КР',  coach:'Бейшеналиев Д.К.',  org:'СДЮСШОР №3',              team:'Сборная КР по борьбе',   medExp:'2026-08-22', medIssued:'2025-08-22', medBy:'РСМЦ г. Бишкек',  insExp:'2026-09-01', docs:[1,1,1], medals:[{m:'gold',e:'Чемпионат Азии',y:2022,c:'Индия'},{m:'gold',e:'Чемпионат КР',y:2023,c:'Кыргызстан'},{m:'bronze',e:'Чемпионат мира',y:2023,c:'Сербия'}] },
    { id:10, name:'Токтосунова Айдай Бакытбековна',    birth:'2004-05-17', sex:'Ж', phone:'+996 700 334455', email:'toktosunova@gmail.com', region:'Бишкек',        sport:'Гимнастика',      rank:'КМС',     coach:'Касымова Ж.Б.',     org:'СДЮСШОР по гимнастике',   team:null,                     medExp:'2026-07-15', medIssued:'2025-07-15', medBy:'РСМЦ г. Бишкек',  insExp:'2026-08-01', docs:[1,1,1], medals:[{m:'silver',e:'Кубок КР',y:2024,c:'Кыргызстан'}] },
    { id:11, name:'Эсенов Руслан Маратович',           birth:'1995-10-03', sex:'М', phone:'+996 550 778899', email:'esenov@mail.kg',       region:'Ош',             sport:'Тяжёлая атлетика', rank:'МСМК',   coach:'Турдалиев М.С.',    org:'ДЮСШ №5 г. Ош',           team:'Сборная КР по т/а',      medExp:'2025-01-28', medIssued:'2024-01-28', medBy:'ОМЦ г. Ош',       insExp:'2025-02-01', docs:[1,1,1], medals:[{m:'gold',e:'Чемпионат ЦА',y:2023,c:'Узбекистан'},{m:'silver',e:'Чемпионат Азии',y:2024,c:'Бахрейн'}] },
    { id:12, name:'Калыкова Бурул Жумабековна',        birth:'2006-06-18', sex:'Ж', phone:'+996 770 667788', email:'kalykova@mail.kg',     region:'Таласская',      sport:'Дзюдо',           rank:'II р.',   coach:'Асанов Б.М.',       org:'Таласская ДЮСШ',          team:null,                     medExp:'2026-02-01', medIssued:'2025-02-01', medBy:'ОМЦ г. Талас',    insExp:'2026-03-01', docs:[1,0,1], medals:[] },
    { id:13, name:'Омуралиев Бакыт Эркинбекович',      birth:'2001-04-30', sex:'М', phone:'+996 555 223344', email:'omuraliev@gmail.com',  region:'Бишкек',         sport:'Стрельба',        rank:'МС КР',   coach:'Абдылдаев Н.Т.',    org:'Стрелковый клуб КР',      team:'Сборная КР по стрельбе', medExp:'2026-02-14', medIssued:'2025-02-14', medBy:'РСМЦ г. Бишкек',  insExp:'2026-03-01', docs:[1,1,1], medals:[{m:'gold',e:'Чемпионат КР',y:2024,c:'Кыргызстан'}] },
    { id:14, name:'Сагынбаева Нурайым Талантовна',      birth:'2007-08-22', sex:'Ж', phone:'+996 700 556677', email:'sagynbaeva@mail.kg',   region:'Баткенская',     sport:'Лёгкая атлетика', rank:'III юн.р.', coach:'Кулматова А.С.',  org:'ДЮСШ Баткенской обл.',    team:null,                     medExp:'2025-02-10', medIssued:'2024-02-10', medBy:'ОМЦ г. Баткен',   insExp:'2025-03-01', docs:[1,1,0], medals:[] },
    { id:15, name:'Турсунбаев Азамат Кубатович',        birth:'1994-01-15', sex:'М', phone:'+996 777 112233', email:'tursunbaev@inbox.kg',  region:'Ошская',         sport:'Бокс',            rank:'МС КР',   coach:'Джумабаев Э.К.',    org:'Ошская СДЮСШОР',          team:'Сборная КР по боксу',    medExp:'2026-05-05', medIssued:'2025-05-05', medBy:'ОМЦ г. Ош',       insExp:'2026-06-01', docs:[1,1,1], medals:[{m:'gold',e:'Чемпионат КР',y:2023,c:'Кыргызстан'},{m:'bronze',e:'Кубок Азии',y:2024,c:'Таиланд'}] },
]

const DOC_LABEL_KEYS = ['athletes.docs.passport', 'athletes.docs.rankCertificate', 'athletes.docs.medCertificate']

const HISTORY = [
    { action: 'Паспорт спортсмена создан', color: 'green', user: 'Алымбеков К.Т.' },
    { action: 'Звание присвоено', color: 'blue', user: 'Касымова А.Б.' },
    { action: 'Медицинская справка обновлена', color: 'orange', user: 'Врач РСМЦ' },
    { action: 'Включён в состав сборной', color: 'blue', user: 'Алымбеков К.Т.' },
]

const EMPTY_FORM = {
    name:'', birth:'', sex:'М', phone:'', email:'',
    sport:'', rank:'', org:'', region:'', coach:'', team:'',
}

export default function Athletes() {
    const { t } = useTranslation()
    const toast = useToast()
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [apiError, setApiError] = useState(false)
    const [verF, setVerF] = useState('')
    const [reload, setReload] = useState(0)

    useEffect(() => {
        let alive = true
        setIsLoading(true)
        athletesApi.list({ verification: verF })
            .then(({ items }) => { if (alive) { setData(items); setApiError(false) } })
            .catch(() => { if (alive) { setData(MOCK); setApiError(true) } })
            .finally(() => { if (alive) setIsLoading(false) })
        return () => { alive = false }
    }, [verF, reload])

    const [search, setSearch] = useState('')
    const [sportF, setSportF] = useState('')
    const [rankF, setRankF] = useState('')
    const [regionF, setRegionF] = useState('')
    const [medF, setMedF] = useState('all')
    const [drawer, setDrawer] = useState(null)
    const [tab, setTab] = useState('profile')
    const [addModal, setAddModal] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)

    const refresh = () => setReload(r => r + 1)

    async function runAction(label, promise) {
        try { await promise; toast(label); refresh() }
        catch (e) { toast('Ошибка: ' + (e.message || 'не удалось')) }
    }
    const doSubmit = (id) => runAction('Отправлено на проверку', athletesApi.submit(id))
    const doVerify = (id) => runAction('Запись подтверждена', athletesApi.verify(id))
    const doReject = (id) => { const r = window.prompt('Причина отказа:'); if (r !== null) runAction('Запись отклонена', athletesApi.reject(id, r)) }
    const doLifecycle = (id, status) => { if (!status) return; runAction('Статус изменён', athletesApi.lifecycle(id, status, null)) }

    async function saveNew() {
        if (!form.name || !form.birth) { toast('Заполните ФИО и дату рождения'); return }
        try {
            await athletesApi.create({
                fullName: form.name, birthDate: form.birth,
                sex: form.sex === 'Ж' ? 'FEMALE' : 'MALE',
                phone: form.phone || null, email: form.email || null,
                region: form.region || null, sport: form.sport || null,
                rank: form.rank || null, coachName: form.coach || null,
            })
            toast('Спортсмен добавлен (статус «Черновик»)')
            setAddModal(false); refresh()
        } catch (e) { toast('Ошибка: ' + (e.message || 'не удалось')) }
    }

    const enriched = useMemo(() => data.map(a => ({
        ...a,
        _med: a._med || medStatus(a.medExp, t),
        _ins: a._ins || insStatus(a.insExp, t),
    })), [data, t])

    const filtered = useMemo(() => enriched.filter(a => {
        if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
        if (sportF && a.sport !== sportF) return false
        if (rankF && a.rank !== rankF) return false
        if (regionF && a.region !== regionF) return false
        if (medF !== 'all' && a._med.key !== medF) return false
        return true
    }), [enriched, search, sportF, rankF, regionF, medF])

    const m = useMemo(() => ({
        total: enriched.length,
        masters: enriched.filter(a => ['ЗМС КР','МСМК','МС КР'].includes(a.rank)).length,
        kms: enriched.filter(a => a.rank === 'КМС').length,
        razr: enriched.filter(a => !['ЗМС КР','МСМК','МС КР','КМС'].includes(a.rank)).length,
        medExp: enriched.filter(a => a._med.key === 'expired').length,
    }), [enriched])

    const da = drawer !== null ? enriched.find(a => a.id === drawer) : null

    const openDrawer = (id) => { setDrawer(id); setTab('profile') }
    const setField = (k, v) => setForm(p => ({ ...p, [k]: v }))

    return (
        <div className="ath-page">
            <Breadcrumbs current={t('athletes.registryTitle')} />
            {/* Header */}
            <div className="ath-header">
                <h1 className="ath-header__title">{t('athletes.registryTitle')}</h1>
                <button className="ath-header__btn" onClick={() => { setForm(EMPTY_FORM); setAddModal(true) }}>
                    <span>+</span> {t('athletes.addNew')}
                </button>
            </div>

            {isLoading ? (
                <>
                    <MetricSkeleton count={5} />
                    <TableSkeleton rows={8} columns={8} />
                </>
            ) : (
                <>
            {/* Metrics */}
            <div className="ath-metrics">
                <div className="ath-metric ath-metric--blue">
                    <div className="ath-metric__icon">{MetricIcons.medal()}</div>
                    <div className="ath-metric__body"><span className="ath-metric__value">{m.total}</span><span className="ath-metric__label">{t('athletes.metricsTotal')}</span></div>
                </div>
                <div className="ath-metric ath-metric--gold">
                    <div className="ath-metric__icon">{MetricIcons.trophy()}</div>
                    <div className="ath-metric__body"><span className="ath-metric__value">{m.masters}</span><span className="ath-metric__label">{t('athletes.metricsTopRanks')}</span></div>
                </div>
                <div className="ath-metric ath-metric--cyan">
                    <div className="ath-metric__icon">{MetricIcons.target()}</div>
                    <div className="ath-metric__body"><span className="ath-metric__value">{m.kms}</span><span className="ath-metric__label">{t('athletes.metricsCms')}</span></div>
                </div>
                <div className="ath-metric ath-metric--green">
                    <div className="ath-metric__icon">{MetricIcons.clipboard()}</div>
                    <div className="ath-metric__body"><span className="ath-metric__value">{m.razr}</span><span className="ath-metric__label">{t('athletes.metricsRanked')}</span></div>
                </div>
                <div className="ath-metric ath-metric--red">
                    <div className="ath-metric__icon">{MetricIcons.hospital()}</div>
                    <div className="ath-metric__body"><span className="ath-metric__value">{m.medExp}</span><span className="ath-metric__label">{t('athletes.metricsExpiredMed')}</span></div>
                </div>
            </div>

            {/* Filters */}
            <div className="ath-filters">
                <div className="ath-filters__search">
                    <span className="ath-filters__search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
                    <input placeholder={t('athletes.filters.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="ath-filters__select" value={sportF} onChange={e => setSportF(e.target.value)}>
                    <option value="">{t('athletes.filters.allSports')}</option>
                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="ath-filters__select" value={rankF} onChange={e => setRankF(e.target.value)}>
                    <option value="">{t('athletes.filters.allRanks')}</option>
                    {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select className="ath-filters__select" value={regionF} onChange={e => setRegionF(e.target.value)}>
                    <option value="">{t('athletes.filters.allRegions')}</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select className="ath-filters__select" value={medF} onChange={e => setMedF(e.target.value)}>
                    <option value="all">{t('athletes.medFilterAll')}</option>
                    <option value="valid">{t('status.valid')}</option>
                    <option value="expiring">{t('status.expiring')}</option>
                    <option value="expired">{t('status.expired')}</option>
                </select>
                <select className="ath-filters__select" value={verF} onChange={e => setVerF(e.target.value)} title="Статус верификации">
                    <option value="">Все статусы</option>
                    {VERIFICATION.map(v => <option key={v.code} value={v.code}>{v.label}</option>)}
                </select>
            </div>
            {apiError && <div style={{ margin: '0 0 12px', fontSize: 12, color: '#b45309' }}>Бэкенд недоступен - показаны демо-данные. Запустите сервер (порт 8082).</div>}

            {/* Table */}
            <div className="ath-table-wrap">
                <table className="ath-table">
                    <thead>
                        <tr>
                            <th>{t('athletes.table.name')}</th>
                            <th>{t('athletes.table.birthDate')}</th>
                            <th>{t('athletes.table.sport')}</th>
                            <th>{t('athletes.table.rank')}</th>
                            <th>{t('athletes.table.coach')}</th>
                            <th>{t('athletes.table.medical')}</th>
                            <th>Верификация</th>
                            <th>Статус</th>
                            <th>{t('athletes.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && <tr><td colSpan={9} className="ath-table__empty">{t('athletes.notFound')}</td></tr>}
                        {filtered.map(a => (
                            <tr key={a.id}>
                                <td>
                                    <div className="ath-person">
                                        <div className="ath-avatar" style={{ background: avColor(a.id) }}>{initials(a.name)}</div>
                                        <div>
                                            <div className="ath-person__name">{a.name}</div>
                                            <div className="ath-person__sub">{a.region}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{fmt(a.birth)}</td>
                                <td>{a.sport}</td>
                                <td><span className={`ath-rank ${rankClass(a.rank)}`}>{a.rank}</span></td>
                                <td style={{ fontSize: 12 }}>{a.coach}</td>
                                <td><span className={`ath-badge ${a._med.cls}`}>{a._med.label}</span></td>
                                <td>{a.verificationStatusLabel
                                    ? <span style={{ background: chip(VERIF_CHIP, a.verificationStatus).bg, color: chip(VERIF_CHIP, a.verificationStatus).color, padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{a.verificationStatusLabel}</span>
                                    : '-'}</td>
                                <td>{a.lifecycleStatusLabel
                                    ? <span style={{ background: chip(LIFE_CHIP, a.lifecycleStatus).bg, color: chip(LIFE_CHIP, a.lifecycleStatus).color, padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{a.lifecycleStatusLabel}</span>
                                    : '-'}</td>
                                <td><button className="ath-btn ath-btn--primary" onClick={() => openDrawer(a.id)}>Просмотр</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </>
            )}

            {/* Drawer */}
            {da && (
                <Portal>
                <div className="ath-drawer-overlay" onClick={() => setDrawer(null)}>
                    <div className="ath-drawer" onClick={e => e.stopPropagation()}>
                        <div className="ath-drawer__header">
                            <div className="ath-drawer__profile">
                                <div className="ath-drawer__avatar" style={{ background: avColor(da.id) }}>{initials(da.name)}</div>
                                <div>
                                    <div className="ath-drawer__name">{da.name}</div>
                                    <span className={`ath-rank ${rankClass(da.rank)}`}>{da.rank}</span>
                                </div>
                            </div>
                            <button className="ath-drawer__close" onClick={() => setDrawer(null)}>✕</button>
                        </div>

                        <div className="ath-tabs">
                            {['profile','achievements','medicine','documents','history'].map(tabKey => (
                                <button key={tabKey} className={`ath-tab ${tab === tabKey ? 'ath-tab--active' : ''}`} onClick={() => setTab(tabKey)}>
                                    {{ profile: t('athletes.tabs.profile'), achievements: t('athletes.tabs.achievements'), medicine: t('athletes.tabs.medicine'), documents: t('athletes.tabs.documents'), history: t('athletes.tabs.history') }[tabKey]}
                                </button>
                            ))}
                        </div>

                        <div className="ath-drawer__body">
                            {tab === 'profile' && (
                                <div className="ath-info-grid">
                                    <div className="ath-info-item"><div className="ath-info-item__label">{t('common.name')}</div><div className="ath-info-item__value">{da.name}</div></div>
                                    <div className="ath-info-item"><div className="ath-info-item__label">{t('fields.birthDate')}</div><div className="ath-info-item__value">{fmt(da.birth)}</div></div>
                                    <div className="ath-info-item"><div className="ath-info-item__label">{t('fields.gender')}</div><div className="ath-info-item__value">{da.sex === 'М' ? t('fields.male') : t('fields.female')}</div></div>
                                    <div className="ath-info-item"><div className="ath-info-item__label">{t('fields.phone')}</div><div className="ath-info-item__value">{da.phone}</div></div>
                                    <div className="ath-info-item"><div className="ath-info-item__label">{t('fields.email')}</div><div className="ath-info-item__value">{da.email}</div></div>
                                    <div className="ath-info-item"><div className="ath-info-item__label">{t('fields.region')}</div><div className="ath-info-item__value">{da.region}</div></div>
                                    <div className="ath-info-item"><div className="ath-info-item__label">{t('fields.sport')}</div><div className="ath-info-item__value">{da.sport}</div></div>
                                    <div className="ath-info-item"><div className="ath-info-item__label">{t('athletes.table.rank')}</div><div className="ath-info-item__value">{da.rank}</div></div>
                                    <div className="ath-info-item"><div className="ath-info-item__label">{t('fields.coach')}</div><div className="ath-info-item__value">{da.coach}</div></div>
                                    <div className="ath-info-item"><div className="ath-info-item__label">{t('fields.organization')}</div><div className="ath-info-item__value">{da.org}</div></div>
                                    <div className="ath-info-item ath-info-item--full"><div className="ath-info-item__label">{t('athletes.drawer.team')}</div><div className="ath-info-item__value">{da.team || '-'}</div></div>
                                </div>
                            )}

                            {tab === 'achievements' && (
                                <>
                                    {da.medals.length === 0 ? (
                                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>Нет зарегистрированных достижений</p>
                                    ) : (
                                        <table className="ath-medals-table">
                                            <thead><tr><th>{t('athletes.achievementsTable.medal')}</th><th>{t('athletes.achievementsTable.competition')}</th><th>{t('athletes.achievementsTable.year')}</th><th>{t('athletes.achievementsTable.country')}</th></tr></thead>
                                            <tbody>
                                                {da.medals.map((md, i) => (
                                                    <tr key={i}>
                                                        <td className="ath-medals-table__medal">{md.m}</td>
                                                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{md.e}</td>
                                                        <td>{md.y}</td>
                                                        <td>{md.c}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                    <button className="ath-btn ath-btn--outline" style={{ marginTop: 16 }} onClick={() => toast('Добавить достижение (демо)')}>+ Добавить достижение</button>
                                </>
                            )}

                            {tab === 'medicine' && (
                                <>
                                    <div className="ath-med-card">
                                        <div className="ath-med-card__title">{t('athletes.drawer.medCertificate')}</div>
                                        <div className="ath-med-row"><span className="ath-med-row__label">{t('common.status')}</span><span className="ath-med-row__value"><span className={`ath-badge ${da._med.cls}`}>{da._med.label}</span></span></div>
                                        <div className="ath-med-row"><span className="ath-med-row__label">{t('fields.issuedDate')}</span><span className="ath-med-row__value">{fmt(da.medIssued)}</span></div>
                                        <div className="ath-med-row"><span className="ath-med-row__label">{t('athletes.drawer.validUntil')}</span><span className="ath-med-row__value">{fmt(da.medExp)}</span></div>
                                        <div className="ath-med-row"><span className="ath-med-row__label">{t('athletes.drawer.issuedBy')}</span><span className="ath-med-row__value">{da.medBy}</span></div>
                                    </div>
                                    <div className="ath-med-card">
                                        <div className="ath-med-card__title">{t('athletes.drawer.insurance')}</div>
                                        <div className="ath-med-row"><span className="ath-med-row__label">{t('common.status')}</span><span className="ath-med-row__value"><span className={`ath-badge ${da._ins.cls}`}>{da._ins.label}</span></span></div>
                                        <div className="ath-med-row"><span className="ath-med-row__label">{t('athletes.drawer.insValidUntil')}</span><span className="ath-med-row__value">{fmt(da.insExp)}</span></div>
                                    </div>
                                </>
                            )}

                            {tab === 'documents' && (
                                <div className="ath-doc-list">
                                    {DOC_LABEL_KEYS.map((labelKey, i) => (
                                        <div key={labelKey} className={`ath-doc-item ${da.docs[i] ? 'ath-doc-item--ok' : 'ath-doc-item--no'}`}>
                                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: da.docs[i] ? '#16a34a' : '#ef4444' }} />
                                            <span className="ath-doc-item__name">{t(labelKey)}</span>
                                            {da.docs[i] && <button className="ath-btn ath-btn--small" onClick={() => toast(`Просмотр: ${t(labelKey)}`)}>{t('common.view')}</button>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {tab === 'history' && (
                                <div>
                                    {HISTORY.map((h, i) => {
                                        const d = new Date(da.birth); d.setFullYear(2024); d.setMonth(d.getMonth() + i * 2)
                                        return (
                                            <div className="ath-history-item" key={i}>
                                                <div className={`ath-history-dot ath-history-dot--${h.color}`} />
                                                <div>
                                                    <div>{h.action}</div>
                                                    <div className="ath-history-date">{fmt(d.toISOString().slice(0, 10))}</div>
                                                    <div className="ath-history-user">{h.user}</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {da.statusNote && (
                            <div style={{ padding: '0 20px', fontSize: 12, color: '#b45309' }}>Причина / примечание: {da.statusNote}</div>
                        )}
                        <div className="ath-drawer__footer" style={{ flexWrap: 'wrap', gap: 8 }}>
                            {(da.verificationStatus === 'DRAFT' || da.verificationStatus === 'REJECTED') && (
                                <button className="ath-btn ath-btn--primary" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => { doSubmit(da.id); setDrawer(null) }}>Отправить на проверку</button>
                            )}
                            {da.verificationStatus === 'IN_REVIEW' && (
                                <>
                                    <button className="ath-btn ath-btn--primary" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => { doVerify(da.id); setDrawer(null) }}>Подтвердить</button>
                                    <button className="ath-btn ath-btn--red" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => { doReject(da.id); setDrawer(null) }}>Отклонить</button>
                                </>
                            )}
                            <select className="ath-filters__select" value="" style={{ minWidth: 170 }} onChange={e => { doLifecycle(da.id, e.target.value); setDrawer(null) }}>
                                <option value="">Сменить статус…</option>
                                {LIFECYCLE.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                            </select>
                            <button className="ath-btn ath-btn--outline" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => toast('Печать паспорта спортсмена')}>{t('athletes.actions.printPassport')}</button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}

            {/* Add Modal */}
            {addModal && (
                <Portal>
                <div className="ath-modal-overlay" onClick={() => setAddModal(false)}>
                    <div className="ath-modal" onClick={e => e.stopPropagation()}>
                        <div className="ath-modal__header">
                            <h2 className="ath-modal__title">{t('athletes.addNew')}</h2>
                            <button className="ath-modal__close" onClick={() => setAddModal(false)}>✕</button>
                        </div>
                        <div className="ath-modal__body">
                            <div className="ath-modal__grid">
                                <h4 className="ath-modal__section-title">{t('athletes.modal.personalData')}</h4>
                                <div className="ath-modal__field">
                                    <label className="ath-modal__label">{t('common.name')} <span>*</span></label>
                                    <input className="ath-modal__input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Фамилия Имя Отчество" />
                                </div>
                                <div className="ath-modal__field">
                                    <label className="ath-modal__label">{t('fields.birthDate')} <span>*</span></label>
                                    <input className="ath-modal__input" type="date" value={form.birth} onChange={e => setField('birth', e.target.value)} />
                                </div>
                                <div className="ath-modal__field">
                                    <label className="ath-modal__label">{t('fields.gender')}</label>
                                    <select className="ath-modal__input" value={form.sex} onChange={e => setField('sex', e.target.value)}>
                                        <option value="М">{t('fields.male')}</option>
                                        <option value="Ж">{t('fields.female')}</option>
                                    </select>
                                </div>
                                <div className="ath-modal__field">
                                    <label className="ath-modal__label">{t('fields.phone')} <span>*</span></label>
                                    <input className="ath-modal__input" type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+996 XXX XXXXXX" />
                                </div>
                                <div className="ath-modal__field">
                                    <label className="ath-modal__label">{t('fields.email')}</label>
                                    <input className="ath-modal__input" type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="email@example.com" />
                                </div>
                                <div className="ath-modal__field">
                                    <label className="ath-modal__label">{t('fields.region')} <span>*</span></label>
                                    <select className="ath-modal__input" value={form.region} onChange={e => setField('region', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>

                                <h4 className="ath-modal__section-title">{t('athletes.modal.sportData')}</h4>
                                <div className="ath-modal__field">
                                    <label className="ath-modal__label">{t('fields.sport')} <span>*</span></label>
                                    <select className="ath-modal__input" value={form.sport} onChange={e => setField('sport', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="ath-modal__field">
                                    <label className="ath-modal__label">{t('athletes.table.rank')} <span>*</span></label>
                                    <select className="ath-modal__input" value={form.rank} onChange={e => setField('rank', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="ath-modal__field">
                                    <label className="ath-modal__label">{t('fields.organization')} <span>*</span></label>
                                    <select className="ath-modal__input" value={form.org} onChange={e => setField('org', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        {ORGS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="ath-modal__field">
                                    <label className="ath-modal__label">{t('fields.coach')}</label>
                                    <input className="ath-modal__input" value={form.coach} onChange={e => setField('coach', e.target.value)} placeholder="ФИО тренера" />
                                </div>
                                <div className="ath-modal__field">
                                    <label className="ath-modal__label">{t('athletes.drawer.team')}</label>
                                    <input className="ath-modal__input" value={form.team} onChange={e => setField('team', e.target.value)} placeholder="Если включён в состав" />
                                </div>
                            </div>
                        </div>
                        <div className="ath-modal__footer">
                            <button className="ath-btn ath-btn--outline" onClick={() => setAddModal(false)}>{t('common.cancel')}</button>
                            <button className="ath-btn ath-btn--primary" style={{ padding: '10px 24px' }} onClick={saveNew}>{t('common.save')}</button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}
        </div>
    )
}