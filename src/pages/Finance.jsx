import { useMemo } from 'react'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, MetricCard, Table } from '../components/ui'
import './registries.css'

/* Финансы — мониторинг исполнения расходов (ответы фин. опросника, 2026-07-02):
   интеграции с Казначейством нет → данные загружаются выгрузкой из Excel;
   показываем ФАКТ (сколько потрачено) по 4 направлениям за полугодие и год,
   общими суммами (без разбивки по каждой школе / виду спорта). */

const DIRECTIONS = [
    { key: 'schools',  label: 'Спортшколы',       half: 24_800_000, year: 51_300_000 },
    { key: 'teams',    label: 'Сборные команды',  half: 41_600_000, year: 88_200_000 },
    { key: 'reserve',  label: 'Резерв',           half: 6_200_000,  year: 12_000_000 },
    { key: 'stipends', label: 'Стипендии',        half: 3_900_000,  year: 8_100_000 },
]
const LAST_UPLOAD = '01.07.2026'

const money = (n) => n.toLocaleString('ru-RU') + ' сом'
const mln = (n) => (n / 1_000_000).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' млн'

export default function Finance() {
    const toast = useToast()

    const totals = useMemo(() => ({
        half: DIRECTIONS.reduce((a, d) => a + d.half, 0),
        year: DIRECTIONS.reduce((a, d) => a + d.year, 0),
    }), [])

    return (
        <div className="reg-page">
            <Breadcrumbs current="Финансы" />
            <PageHeader
                title="Финансы — исполнение расходов"
                subtitle="Фактические расходы по направлениям за полугодие и год"
                actions={<Button variant="primary" onClick={() => toast('Загрузка выгрузки Excel (демо)')}><span>+</span> Загрузить выгрузку (Excel)</Button>}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', margin: '0 0 16px', background: 'var(--info-bg, #EFF6FF)', border: '1px solid var(--info-border, #B0C4DE)', borderRadius: 10, fontSize: 13, color: 'var(--info-text, #1d4ed8)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                <span>Данные о расходах загружаются выгрузкой из <b>Excel</b>. Прямой интеграции с Казначейством нет.</span>
            </div>

            <div className="reg-metrics">
                <MetricCard tone="blue"   icon={MetricIcons.building()} value={mln(totals.half)} label="Итого за полугодие" />
                <MetricCard tone="violet" icon={MetricIcons.building()} value={mln(totals.year)}  label="Итого за год" />
                <MetricCard tone="amber"  icon={MetricIcons.clipboard()} value={DIRECTIONS.length} label="Направлений расходов" />
                <MetricCard tone="green"  icon={MetricIcons.clock()}    value={LAST_UPLOAD}       label="Последняя выгрузка" />
            </div>

            <Table>
                <thead><tr>
                    <th>Направление</th>
                    <th style={{ textAlign: 'right' }}>За полугодие (6 мес.)</th>
                    <th style={{ textAlign: 'right' }}>За год</th>
                    <th style={{ width: '26%' }}>Доля за год</th>
                </tr></thead>
                <tbody>
                    {DIRECTIONS.map(d => {
                        const pct = Math.round(d.year / totals.year * 100)
                        return (
                            <tr key={d.key}>
                                <td><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.label}</span></td>
                                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{money(d.half)}</td>
                                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{money(d.year)}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ flex: 1, height: 8, background: 'var(--badge-gray-bg)', borderRadius: 4, overflow: 'hidden' }}>
                                            <div style={{ width: pct + '%', height: '100%', background: 'var(--accent)', borderRadius: 4 }} />
                                        </div>
                                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 34, textAlign: 'right' }}>{pct}%</span>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Итого</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap' }}>{money(totals.half)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap' }}>{money(totals.year)}</td>
                        <td />
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}
