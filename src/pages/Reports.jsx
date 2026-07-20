import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, StatusDot } from '../components/ui'
import {
    loadReports, reportStatus, periodLabel, reportPeriods, sectionCount, buildSvod,
    REPORT_SECTIONS,
} from '../cabinet/reportsStore'
import './registries.css'

/* Служебный портал, отдел СВД: входящие ежемесячные отчёты подведомственных
   организаций + свод за выбранный период. Рассмотрение — на /reports/:id. */

export default function Reports() {
    const navigate = useNavigate()
    const [reports] = useState(loadReports)
    const periods = reportPeriods(reports)
    const [period, setPeriod] = useState(periods[0] || '')
    const [statusF, setStatusF] = useState('')

    const list = reports.filter(r => (!period || r.period === period) && (!statusF || r.status === statusF))
    const pending = list.filter(r => r.status === 'submitted').length
    const accepted = list.filter(r => r.status === 'accepted').length
    const svod = buildSvod(reports, period)

    const selStyle = { padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit' }

    return (
        <div className="reg">
            <Breadcrumbs current="Отчётность подведомственных" />
            <PageHeader
                title="Отчётность подведомственных организаций"
                subtitle={`Ежемесячные отчёты · на проверке: ${pending} · принято в свод: ${accepted}`}
            />

            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <select style={selStyle} value={period} onChange={e => setPeriod(e.target.value)}>
                    {periods.map(p => <option key={p} value={p}>{periodLabel(p)}</option>)}
                </select>
                <select style={selStyle} value={statusF} onChange={e => setStatusF(e.target.value)}>
                    <option value="">Все статусы</option>
                    <option value="submitted">На проверке</option>
                    <option value="accepted">Приняты в свод</option>
                    <option value="returned">Возвращены</option>
                </select>
            </div>

            {/* Свод за период — по принятым отчётам */}
            <div style={sx.svod}>
                <div style={sx.svodHead}>Свод за {period ? periodLabel(period) : '—'} <span style={sx.svodSub}>по {svod.orgs} принятым отчётам</span></div>
                <div style={sx.svodGrid}>
                    {REPORT_SECTIONS.map(sec => (
                        <div key={sec.key} style={sx.svodCell}>
                            <b>{svod.totals[sec.key]}</b>
                            <span>{sec.unit}</span>
                        </div>
                    ))}
                </div>
                <div style={sx.medalRow}>
                    Медали:
                    <span style={sx.medal}><i style={{ ...sx.dot, background: '#d4af37' }} /> Золото {svod.medalsByKind['Золото']}</span>
                    <span style={sx.medal}><i style={{ ...sx.dot, background: '#9ca3af' }} /> Серебро {svod.medalsByKind['Серебро']}</span>
                    <span style={sx.medal}><i style={{ ...sx.dot, background: '#b45309' }} /> Бронза {svod.medalsByKind['Бронза']}</span>
                </div>
            </div>

            <div className="reg-table-wrap">
                <table className="reg-table">
                    <thead>
                        <tr>
                            <th>Номер</th>
                            <th>Организация</th>
                            <th>Регион</th>
                            <th>Период</th>
                            <th>Звания</th>
                            <th>Медали</th>
                            <th>Меропр.</th>
                            <th>УТС</th>
                            <th>Статус</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(r => {
                            const st = reportStatus(r)
                            return (
                                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/reports/${r.id}`)}>
                                    <td style={{ fontWeight: 600 }}>{r.num}</td>
                                    <td>{r.org}<div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{r.orgType}</div></td>
                                    <td>{r.region}</td>
                                    <td>{periodLabel(r.period)}</td>
                                    <td>{sectionCount(r, 'titles')}</td>
                                    <td>{sectionCount(r, 'medals')}</td>
                                    <td>{sectionCount(r, 'events')}</td>
                                    <td>{sectionCount(r, 'camps')}</td>
                                    <td><StatusDot tone={st.tone}>{st.label}</StatusDot></td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <button className="reg-btn reg-btn--primary" onClick={() => navigate(`/reports/${r.id}`)}>Открыть</button>
                                    </td>
                                </tr>
                            )
                        })}
                        {list.length === 0 && <tr><td colSpan={10} className="reg-table__empty">Отчётов нет</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const sx = {
    svod: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 18px', marginBottom: 18 },
    svodHead: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 },
    svodSub: { fontSize: 12, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 },
    svodGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 },
    svodCell: { display: 'flex', flexDirection: 'column', gap: 2, background: 'var(--bg-panel)', borderRadius: 10, padding: '12px 14px' },
    medalRow: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 14, fontSize: 12.5, color: 'var(--text-secondary)' },
    medal: { display: 'inline-flex', alignItems: 'center', gap: 6 },
    dot: { width: 9, height: 9, borderRadius: '50%', display: 'inline-block' },
}
