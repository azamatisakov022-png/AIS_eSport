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

    // Группировка по подразделению с сохранением порядка из EMPLOYEES
    const groups = useMemo(() => {
        const map = new Map()
        filtered.forEach(e => {
            if (!map.has(e.department)) map.set(e.department, [])
            map.get(e.department).push(e)
        })
        return Array.from(map.entries())
    }, [filtered])

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

            <div className="intra-dir-list">
                {groups.map(([deptName, people]) => (
                    <section className="intra-dir-group" key={deptName}>
                        <div className="intra-dir-group__head">
                            <span className="intra-dir-group__name">{deptName}</span>
                            <span className="intra-dir-group__count">{people.length}</span>
                        </div>
                        <div className="intra-dir-group__rows">
                            {people.map(e => (
                                <div key={e.id} className="intra-dir-row">
                                    <div className="intra-dir-row__avatar">{e.avatar}</div>
                                    <div className="intra-dir-row__person">
                                        <span className="intra-dir-row__name">{e.fio}</span>
                                        <span className="intra-dir-row__pos">{e.position}</span>
                                    </div>
                                    <a className="intra-dir-row__phone" href={`tel:${e.phone}`}>{e.phone}</a>
                                    <a className="intra-dir-row__email" href={`mailto:${e.email}`}>{e.email}</a>
                                    <span className="intra-dir-row__room">каб. {e.room}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
                {filtered.length === 0 && <div className="intra-dir-empty">Ничего не найдено</div>}
            </div>
        </div>
    )
}
