import { useState, useMemo } from 'react'
import { ACTIVE_DOCS, ROUTE_TEMPLATES } from './data/intranetData'
import './intranet.css'

const STATUS_LABEL = { pending: 'В работе', approved: 'Утверждено', rejected: 'Отклонено' }
const STATUS_COLOR = {
    pending: { bg: '#fff3e0', fg: '#ef6c00' },
    approved: { bg: '#e8f5e9', fg: '#2e7d32' },
    rejected: { bg: '#ffebee', fg: '#c62828' },
}

export default function IntranetApprovals() {
    const [status, setStatus] = useState('all')
    const [q, setQ] = useState('')

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase()
        return ACTIVE_DOCS.filter(d => (status === 'all' || d.status === status) &&
            (!ql || d.id.toLowerCase().includes(ql) || d.kind.toLowerCase().includes(ql) || d.initiator.toLowerCase().includes(ql)))
    }, [status, q])

    const counts = {
        all: ACTIVE_DOCS.length,
        pending: ACTIVE_DOCS.filter(d => d.status === 'pending').length,
        approved: ACTIVE_DOCS.filter(d => d.status === 'approved').length,
        rejected: ACTIVE_DOCS.filter(d => d.status === 'rejected').length,
    }

    return (
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">Согласование документов</h1>
                    <p className="intra-page-head__sub">
                        Внутренние документы по маршрутам - инициатор сотрудник. Примеры: заявки на закупку, заявления на отпуск, командировки.
                        Внешние заявления (от спортсменов / тренеров / судей) - в разделе «Заявления».
                    </p>
                </div>
                <button className="intra-doc__action intra-doc__action--primary">+ Новый документ</button>
            </div>

            <div className="intra-stats-row">
                <div className="intra-stat-card"><div className="intra-stat-card__val">{counts.pending}</div><div className="intra-stat-card__label">В работе</div></div>
                <div className="intra-stat-card"><div className="intra-stat-card__val">{counts.approved}</div><div className="intra-stat-card__label">Утверждено</div></div>
                <div className="intra-stat-card"><div className="intra-stat-card__val">{counts.rejected}</div><div className="intra-stat-card__label">Отклонено</div></div>
                <div className="intra-stat-card"><div className="intra-stat-card__val">{ROUTE_TEMPLATES.filter(r => r.active).length}</div><div className="intra-stat-card__label">Активных маршрутов</div></div>
            </div>

            <div className="intra-chips" style={{ marginTop: 20 }}>
                {['all', 'pending', 'approved', 'rejected'].map(s => (
                    <button key={s} className={`intra-chip${status === s ? ' intra-chip--active' : ''}`} onClick={() => setStatus(s)}>
                        {s === 'all' ? 'Все' : STATUS_LABEL[s]} <span className="intra-chip__count">{counts[s]}</span>
                    </button>
                ))}
                <input className="intra-search" style={{ maxWidth: 280, marginLeft: 'auto' }} placeholder="Поиск по № / типу / инициатору" value={q} onChange={e => setQ(e.target.value)} />
            </div>

            <div className="intra-doc-list">
                {filtered.map(d => {
                    const c = STATUS_COLOR[d.status]
                    const pct = Math.round((d.stage / d.total) * 100)
                    return (
                        <div key={d.id} className="intra-doc">
                            <div className="intra-doc__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                            <div className="intra-doc__body">
                                <div className="intra-doc__meta">
                                    <span className="intra-doc__cat">{d.id}</span>
                                    <span>{d.kind}</span>
                                    <span>· инициатор: {d.initiator}</span>
                                </div>
                                <h3 className="intra-doc__title">
                                    {d.status === 'pending' ? `На этапе: ${d.current}` : (d.status === 'approved' ? 'Полностью утверждено' : 'Отклонено')}
                                </h3>
                                <div className="intra-doc-progress">
                                    <div className="intra-doc-progress__bar"><span style={{ width: `${pct}%` }} /></div>
                                    <span className="intra-doc-progress__val">{d.stage} / {d.total}</span>
                                </div>
                                {d.deadline !== '-' && <div className="intra-doc__issuer">Дедлайн: {d.deadline}</div>}
                            </div>
                            <span className="intra-doc__badge" style={{ background: c.bg, color: c.fg }}>{STATUS_LABEL[d.status]}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
