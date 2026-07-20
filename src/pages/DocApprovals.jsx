import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, StatusDot } from '../components/ui'
import { loadApprovals, DOC_TYPES, routeFor, statusOf, loadActingRole, saveActingRole } from '../cabinet/approvalStore'
import ApprovalRoleSwitcher from './ApprovalRoleSwitcher'
import './registries.css'

/* Служебный портал: очередь документов одного типа (тарификация / план комплектования).
   Рассмотрение — на отдельной странице (не сбоку): клик по строке или «Рассмотреть». */

export default function DocApprovals({ type }) {
    const navigate = useNavigate()
    const [docs] = useState(loadApprovals)
    const [acting, setActing] = useState(loadActingRole)
    const meta = DOC_TYPES[type]

    const setActingRole = (r) => { setActing(r); saveActingRole(r) }
    const awaitsMe = (d) => {
        const route = routeFor(d.type)
        return !d.returned && d.step >= 2 && d.step < route.length
            && (acting === 'any' || route[d.step].role === acting)
    }

    const list = docs.filter(d => d.type === type)
    const inWork = list.filter(d => statusOf(d).tone === 'amber').length
    const done = list.filter(d => statusOf(d).tone === 'green').length
    const myQueue = acting === 'any' ? null : list.filter(awaitsMe).length

    return (
        <div className="reg">
            <Breadcrumbs current={meta.label} />
            <PageHeader
                title={meta.label}
                subtitle={`Заявления спортшкол · на согласовании: ${inWork} · утверждено: ${done}${myQueue === null ? '' : ` · ожидают вашего решения: ${myQueue}`}`}
            />

            <ApprovalRoleSwitcher value={acting} onChange={setActingRole} />

            <div className="reg-table-wrap">
                <table className="reg-table">
                    <thead>
                        <tr>
                            <th>Номер</th>
                            <th>Спортшкола</th>
                            <th>Регион</th>
                            <th>Год</th>
                            <th>Подан</th>
                            <th>Статус</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(d => {
                            const st = statusOf(d)
                            return (
                                <tr key={d.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`${meta.listPath}/${d.id}`)}>
                                    <td style={{ fontWeight: 600 }}>{d.num}</td>
                                    <td>{d.school}</td>
                                    <td>{d.region}</td>
                                    <td>{d.year}</td>
                                    <td>{d.submittedAt}</td>
                                    <td>
                                        <StatusDot tone={st.tone}>{st.label}</StatusDot>
                                        {acting !== 'any' && awaitsMe(d) && (
                                            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#1e40af', marginTop: 4 }}>Ваша очередь</div>
                                        )}
                                    </td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <button className="reg-btn reg-btn--primary" onClick={() => navigate(`${meta.listPath}/${d.id}`)}>Рассмотреть</button>
                                    </td>
                                </tr>
                            )
                        })}
                        {list.length === 0 && <tr><td colSpan={7} className="reg-table__empty">Заявлений нет</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
