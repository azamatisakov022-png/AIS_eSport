import { useState } from 'react'
import { ROUTE_TEMPLATES } from './data/intranetData'
import './intranet.css'

const STAGE_TYPE = {
    approve: { label: 'Согласование', icon: '✓', color: '#1565c0', bg: '#e3f2fd' },
    attach: { label: 'Прикрепление документа', icon: '📎', color: '#ef6c00', bg: '#fff3e0' },
    final: { label: 'Исполнение', icon: '◉', color: '#2e7d32', bg: '#e8f5e9' },
}

export default function IntranetRoutes() {
    const [expanded, setExpanded] = useState(null)

    return (
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">Маршруты согласования</h1>
                    <p className="intra-page-head__sub">
                        Конструктор маршрутов. Каждый маршрут состоит из этапов: «согласование руководителем», «прикрепление документа исполнителем»
                        или «итоговое исполнение». Количество маршрутов не ограничено.
                    </p>
                </div>
                <button className="intra-doc__action intra-doc__action--primary">+ Новый маршрут</button>
            </div>

            <div className="intra-route-list">
                {ROUTE_TEMPLATES.map(r => {
                    const open = expanded === r.id
                    return (
                        <div key={r.id} className="intra-route">
                            <div className="intra-route__head" onClick={() => setExpanded(open ? null : r.id)}>
                                <div className="intra-route__head-l">
                                    <div className={`intra-route__dot intra-route__dot--${r.active ? 'on' : 'off'}`} />
                                    <div>
                                        <h3 className="intra-route__name">{r.name}</h3>
                                        <div className="intra-route__meta">
                                            {r.stages.length} этапов · использован {r.usageCount} раз{r.usageCount === 1 ? '' : (r.usageCount > 1 && r.usageCount < 5 ? 'а' : '')} · {r.active ? 'активен' : 'неактивен'}
                                        </div>
                                    </div>
                                </div>
                                <span className="intra-route__chev" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>⌄</span>
                            </div>

                            {open && (
                                <div className="intra-route__body">
                                    <div className="intra-route__steps">
                                        {r.stages.map((s, i) => {
                                            const meta = STAGE_TYPE[s.type] || STAGE_TYPE.approve
                                            return (
                                                <div key={i} className="intra-route__step">
                                                    <div className="intra-route__step-idx">{i + 1}</div>
                                                    <div className="intra-route__step-body">
                                                        <span className="intra-route__step-type" style={{ background: meta.bg, color: meta.color }}>
                                                            {meta.icon} {meta.label}
                                                        </span>
                                                        <div className="intra-route__step-role">{s.role}</div>
                                                        <div className="intra-route__step-sla">SLA: {s.sla}</div>
                                                    </div>
                                                    {i < r.stages.length - 1 && <div className="intra-route__step-arrow">→</div>}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="intra-route__actions">
                                        <button className="intra-doc__action">Редактировать</button>
                                        <button className="intra-doc__action">Дублировать</button>
                                        <button className="intra-doc__action">{r.active ? 'Деактивировать' : 'Активировать'}</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
