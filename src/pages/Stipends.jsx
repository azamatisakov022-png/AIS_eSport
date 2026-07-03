import { useState, useMemo } from 'react'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import Portal from '../components/Portal'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, MetricCard, Badge, Table } from '../components/ui'
import './registries.css'

/* Стипендии ведущим спортсменам (ответы АиРСВД: ПП КР №554 от 23.11.2018).
   Назначаются коллегиально, приказом ГАФКиС на 1 год, бесплатно. */

const STATUS = {
    submitted: { label: 'Подана',                    variant: 'blue' },
    collegium: { label: 'На рассмотрении Комиссии',    variant: 'amber' },
    granted:   { label: 'Назначена',                  variant: 'green' },
    rejected:  { label: 'Отклонена',                  variant: 'red' },
}

// Процесс назначения — 6 уровней (ответ D2)
const LEVELS = [
    'Подача заявления (спортсмен или рапорт гл. тренера)',
    'Рассмотрение исполнителем',
    'Рассмотрение Комиссией по выдаче стипендии',
    'Подготовка проекта приказа',
    'Утверждение приказа (директор ГАФКиС)',
    'Перевод средств бухгалтерией',
]
const LEVEL_BY_STATUS = { submitted: 1, collegium: 3, granted: 6, rejected: 3 }

const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'
const money = (n) => n.toLocaleString('ru-RU') + ' сом/мес'

const MOCK = [
    { id: 1, person: 'Асанов Бекболот Маратович',    sport: 'Дзюдо',            rank: 'ЗМС КР', amount: 20000, status: 'granted',   orderNo: 'ГАФКиС-2026-СТ-012', period: '2026', basis: '1 место, Чемпионат Азии 2025' },
    { id: 2, person: 'Алымбекова Айпери Нурлановна', sport: 'Лёгкая атлетика',  rank: 'МСМК',   amount: 15000, status: 'granted',   orderNo: 'ГАФКиС-2026-СТ-013', period: '2026', basis: '3 место, Азиатские игры 2023' },
    { id: 3, person: 'Сыдыков Нурбек Кубанычбекович', sport: 'Бокс',            rank: 'МС КР',  amount: 10000, status: 'collegium', orderNo: '—',                  period: '2026', basis: '1 место, Чемпионат КР 2025' },
    { id: 4, person: 'Маматова Жаркынай Эмилбековна', sport: 'Борьба',          rank: 'МС КР',  amount: 10000, status: 'submitted', orderNo: '—',                  period: '2026', basis: 'Отбор на Чемпионат Азии' },
    { id: 5, person: 'Асанбекова Мээрим Кайратовна',  sport: 'Плавание',        rank: 'МС КР',  amount: 12000, status: 'granted',   orderNo: 'ГАФКиС-2026-СТ-009', period: '2026', basis: '1 место, Чемпионат КР 2025' },
    { id: 6, person: 'Эсенов Руслан Маратович',       sport: 'Тяжёлая атлетика', rank: 'МСМК',  amount: 15000, status: 'collegium', orderNo: '—',                  period: '2026', basis: '2 место, Чемпионат Азии 2024' },
    { id: 7, person: 'Омуралиев Бакыт Эркинбекович',  sport: 'Стрельба',        rank: 'МС КР',  amount: 8000,  status: 'rejected',  orderNo: '—',                  period: '2026', basis: 'Не выполнен норматив' },
]

export default function Stipends() {
    const toast = useToast()
    const [search, setSearch] = useState('')
    const [statusF, setStatusF] = useState('all')
    const [drawer, setDrawer] = useState(null)

    const filtered = useMemo(() => MOCK.filter(s => {
        if (search && !s.person.toLowerCase().includes(search.toLowerCase())) return false
        if (statusF !== 'all' && s.status !== statusF) return false
        return true
    }), [search, statusF])

    const metrics = useMemo(() => ({
        total: MOCK.length,
        collegium: MOCK.filter(s => s.status === 'collegium').length,
        granted: MOCK.filter(s => s.status === 'granted').length,
        fund: MOCK.filter(s => s.status === 'granted').reduce((a, s) => a + s.amount, 0),
    }), [])

    const cur = drawer != null ? MOCK.find(s => s.id === drawer) : null
    const curLevel = cur ? LEVEL_BY_STATUS[cur.status] : 0

    return (
        <div className="reg-page">
            <Breadcrumbs current="Стипендии ведущим спортсменам" />
            <PageHeader
                title="Стипендии ведущим спортсменам"
                subtitle="Назначает Комиссия по выдаче стипендии (по Положению), приказом ГАФКиС на 1 год · осн. ПП КР №554 от 23.11.2018 · услуга бесплатна"
                actions={<Button variant="primary" onClick={() => toast('Назначение стипендии (демо)')}><span>+</span> Назначить стипендию</Button>}
            />

            <div className="reg-metrics">
                <MetricCard tone="blue"   icon={MetricIcons.users()}    value={metrics.total}     label="Всего получателей" />
                <MetricCard tone="amber"  icon={MetricIcons.search()}   value={metrics.collegium} label="На рассмотрении Комиссии" />
                <MetricCard tone="green"  icon={MetricIcons.active()}   value={metrics.granted}   label="Назначено" />
                <MetricCard tone="violet" icon={MetricIcons.building()} value={metrics.fund.toLocaleString('ru-RU')} label="Фонд, сом/мес" />
            </div>

            <div className="reg-filters">
                <div className="reg-search">
                    <span className="reg-search__icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder="Поиск по ФИО спортсмена…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="reg-select" value={statusF} onChange={e => setStatusF(e.target.value)}>
                    <option value="all">Все статусы</option>
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
            </div>

            <Table>
                <thead><tr>
                    <th>Спортсмен</th><th>Вид спорта</th><th>Звание/разряд</th><th>Сумма</th><th>Период</th><th>Статус</th><th></th>
                </tr></thead>
                <tbody>
                    {filtered.length === 0 && <tr><td colSpan={7} className="ui-table__empty">Стипендии не найдены</td></tr>}
                    {filtered.map(s => (
                        <tr key={s.id}>
                            <td><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.person}</span></td>
                            <td>{s.sport}</td>
                            <td>{s.rank}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{money(s.amount)}</td>
                            <td>{s.period}</td>
                            <td><Badge variant={STATUS[s.status].variant}>{STATUS[s.status].label}</Badge></td>
                            <td><button className="reg-btn reg-btn--primary" onClick={() => setDrawer(s.id)}>Просмотр</button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {cur && (
                <Portal>
                    <div className="reg-overlay" onClick={() => setDrawer(null)}>
                        <div className="reg-drawer" onClick={e => e.stopPropagation()}>
                            <div className="reg-drawer__header">
                                <div className="reg-drawer__profile">
                                    <div><div className="reg-drawer__name">{cur.person}</div><Badge variant={STATUS[cur.status].variant}>{STATUS[cur.status].label}</Badge></div>
                                </div>
                                <button className="reg-drawer__close" onClick={() => setDrawer(null)}>✕</button>
                            </div>
                            <div className="reg-drawer__body">
                                <div className="reg-section-title">Сведения о стипендии</div>
                                <div className="reg-info-grid">
                                    <div className="reg-info-item"><div className="reg-info-item__label">Вид спорта</div><div className="reg-info-item__value">{cur.sport}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Звание/разряд</div><div className="reg-info-item__value">{cur.rank}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Сумма</div><div className="reg-info-item__value">{money(cur.amount)}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Период</div><div className="reg-info-item__value">{cur.period} (1 год)</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">№ приказа</div><div className="reg-info-item__value reg-mono">{cur.orderNo}</div></div>
                                    <div className="reg-info-item reg-info-item--full"><div className="reg-info-item__label">Основание</div><div className="reg-info-item__value">{cur.basis}</div></div>
                                </div>
                                <div className="reg-section-title">Процесс назначения</div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {LEVELS.map((lvl, i) => {
                                        const n = i + 1
                                        const done = cur.status !== 'rejected' && n <= curLevel
                                        const active = cur.status !== 'rejected' && cur.status !== 'granted' && n === curLevel
                                        return (
                                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0' }}>
                                                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                                                    background: done ? 'var(--green-light)' : active ? 'var(--accent-light)' : 'var(--badge-gray-bg)',
                                                    color: done ? 'var(--green)' : active ? 'var(--accent)' : 'var(--text-muted)' }}>{n}</span>
                                                <span style={{ fontSize: 13, color: (done || active) ? 'var(--text-primary)' : 'var(--text-muted)', paddingTop: 2 }}>{lvl}{active ? ' — сейчас' : ''}</span>
                                            </div>
                                        )
                                    })}
                                    {cur.status === 'rejected' && <div style={{ fontSize: 13, color: 'var(--rose)', marginTop: 6 }}>Отклонено на этапе рассмотрения.</div>}
                                </div>
                            </div>
                            <div className="reg-drawer__footer">
                                {cur.status === 'collegium' && <button className="reg-btn reg-btn--primary" onClick={() => toast('Одобрено Комиссией (демо)')}>Одобрить (Комиссия)</button>}
                                <button className="reg-btn" onClick={() => toast('Загрузка скана приказа (демо)')}>Загрузить приказ</button>
                                <button className="reg-btn" onClick={() => toast('Печать приказа (демо)')}>Приказ</button>
                                <button className="reg-btn reg-btn--red" onClick={() => toast('Прекращение стипендии (демо)')}>Прекратить</button>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    )
}
