import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, StatusDot } from '../components/ui'
import { loadReports, saveReports, reportStatus, periodLabel, rpToday, REPORT_SECTIONS } from '../cabinet/reportsStore'
import './registries.css'

/* Рассмотрение ежемесячного отчёта подведомственной организации.
   Отдел СВД принимает отчёт в свод или возвращает на доработку. */

const REVIEWER = 'Отдел СВД'

export default function ReportReview() {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()
    const [reports, setReports] = useState(loadReports)
    const r = reports.find(x => String(x.id) === String(id))

    if (!r) {
        return (
            <div className="reg">
                <Breadcrumbs current="Отчёт" />
                <PageHeader title="Отчёт не найден" />
                <Button onClick={() => navigate('/reports')}>К списку</Button>
            </div>
        )
    }

    const st = reportStatus(r)
    const persist = (next) => { setReports(next); saveReports(next) }

    const accept = () => {
        persist(reports.map(x => x.id === r.id ? { ...x, status: 'accepted', acceptedAt: rpToday(), reviewer: REVIEWER } : x))
        toast(`${r.num}: принят в свод за ${periodLabel(r.period)}`)
    }
    const sendBack = () => {
        persist(reports.map(x => x.id === r.id ? { ...x, status: 'returned', acceptedAt: '', reviewer: REVIEWER } : x))
        toast(`${r.num}: возвращён на доработку`)
    }

    return (
        <div className="reg">
            <Breadcrumbs current={`${r.num}`} />
            <PageHeader
                title={`${r.num} — отчёт за ${periodLabel(r.period)}`}
                subtitle={`${r.org} · ${r.orgType} · ${r.region} · подан ${r.submittedAt}`}
                actions={<Button onClick={() => navigate('/reports')}>К списку</Button>}
            />

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                <StatusDot tone={st.tone}>{st.label}</StatusDot>
                {r.status === 'accepted' && <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Принят {r.acceptedAt} · {r.reviewer}</span>}
            </div>

            {REPORT_SECTIONS.map(sec => {
                const rows = r[sec.key] || []
                return (
                    <div key={sec.key} style={sx.card}>
                        <div style={sx.cardTitle}>{sec.label} <span style={sx.count}>{rows.length}</span></div>
                        {rows.length === 0 ? (
                            <div style={sx.emptyRow}>Нет данных за период</div>
                        ) : (
                            <table className="reg-table" style={{ width: '100%' }}>
                                <thead><tr><th style={{ width: 34 }}>№</th>{sec.cols.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead>
                                <tbody>
                                    {rows.map((row, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            {sec.cols.map(c => <td key={c.key}>{row[c.key] || '—'}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )
            })}

            {r.note && (
                <div style={sx.card}>
                    <div style={sx.cardTitle}>Примечание организации</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{r.note}</div>
                </div>
            )}

            <div style={sx.actionBox}>
                {r.status === 'submitted' && (
                    <>
                        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 10 }}>
                            Проверьте данные и примите отчёт в свод либо верните на доработку.
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <Button variant="primary" onClick={accept}>Принять в свод</Button>
                            <Button onClick={sendBack}>Вернуть на доработку</Button>
                        </div>
                    </>
                )}
                {r.status === 'accepted' && <StatusDot tone="green">Отчёт принят в свод за {periodLabel(r.period)}. Учтён в сводке отдела СВД.</StatusDot>}
                {r.status === 'returned' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <StatusDot tone="red">Возвращён на доработку — ожидается повторная подача организацией.</StatusDot>
                        <div><Button variant="primary" onClick={accept}>Всё же принять в свод</Button></div>
                    </div>
                )}
            </div>
        </div>
    )
}

const sx = {
    card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 18px', marginBottom: 14 },
    cardTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 },
    count: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-panel)', borderRadius: 10, padding: '1px 8px' },
    emptyRow: { fontSize: 12.5, color: 'var(--text-muted)' },
    actionBox: { marginTop: 4, border: '1px solid var(--border-color)', borderRadius: 10, padding: '14px 16px', background: 'var(--bg-primary)' },
}
