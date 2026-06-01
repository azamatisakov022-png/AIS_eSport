import { useState, useMemo } from 'react'
import { EMPLOYEES } from './data/intranetData'
import './intranet.css'

export default function IntranetDirectory() {
    const [q, setQ] = useState('')
    const [dept, setDept] = useState('all')

    const departments = useMemo(() => Array.from(new Set(EMPLOYEES.map(e => e.department))), [])

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase()
        return EMPLOYEES.filter(e =>
            (dept === 'all' || e.department === dept) &&
            (!ql || e.fio.toLowerCase().includes(ql) || e.position.toLowerCase().includes(ql) || e.department.toLowerCase().includes(ql))
        )
    }, [q, dept])

    return (
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">Справочник сотрудников</h1>
                    <p className="intra-page-head__sub">Контакты центрального аппарата ГАФКиС. Поиск по ФИО, должности и подразделению.</p>
                </div>
                <input className="intra-search" placeholder="Поиск…" value={q} onChange={e => setQ(e.target.value)} />
            </div>

            <div className="intra-chips">
                <button className={`intra-chip${dept === 'all' ? ' intra-chip--active' : ''}`} onClick={() => setDept('all')}>
                    Все <span className="intra-chip__count">{EMPLOYEES.length}</span>
                </button>
                {departments.map(d => (
                    <button key={d} className={`intra-chip${dept === d ? ' intra-chip--active' : ''}`} onClick={() => setDept(d)}>
                        {d} <span className="intra-chip__count">{EMPLOYEES.filter(e => e.department === d).length}</span>
                    </button>
                ))}
            </div>

            <div className="intra-dir-grid">
                {filtered.map(e => (
                    <div key={e.id} className="intra-dir-card">
                        <div className="intra-dir-card__avatar">{e.avatar}</div>
                        <div className="intra-dir-card__body">
                            <h3 className="intra-dir-card__name">{e.fio}</h3>
                            <div className="intra-dir-card__pos">{e.position}</div>
                            <div className="intra-dir-card__dept">{e.department}</div>
                            <div className="intra-dir-card__contact">
                                <a href={`tel:${e.phone}`}>{e.phone}</a>
                                <a href={`mailto:${e.email}`}>{e.email}</a>
                                <span>каб. {e.room}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
