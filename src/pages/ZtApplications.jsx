import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, StatusDot } from '../components/ui'
import ApprovalRoleSwitcher from './ApprovalRoleSwitcher'
import { loadZt, ZT_ROUTE, ZT_ROLES, ztStatus, loadZtActing, saveZtActing } from '../cabinet/ztStore'
import './registries.css'

/* Служебный портал: заявления на звание «Заслуженный тренер». Рассмотрение — /zt/:id. */

export default function ZtApplications() {
    const navigate = useNavigate()
    const [list] = useState(loadZt)
    const [acting, setActing] = useState(loadZtActing)
    const setActingRole = (r) => { setActing(r); saveZtActing(r) }

    const awaitsMe = (z) => !z.returned && z.step >= 1 && z.step < ZT_ROUTE.length && (acting === 'any' || ZT_ROUTE[z.step].role === acting)
    const inWork = list.filter(z => ztStatus(z).tone === 'amber').length
    const done = list.filter(z => ztStatus(z).tone === 'green').length
    const myQueue = acting === 'any' ? null : list.filter(awaitsMe).length

    return (
        <div className="reg">
            <Breadcrumbs current="Заслуженный тренер" />
            <PageHeader
                title="Заслуженный тренер КР"
                subtitle={`Заявления · на согласовании: ${inWork} · присвоено: ${done}${myQueue === null ? '' : ` · ожидают вашего решения: ${myQueue}`}`}
            />

            <ApprovalRoleSwitcher value={acting} onChange={setActingRole} roles={ZT_ROLES} />

            <div className="reg-table-wrap">
                <table className="reg-table">
                    <thead>
                        <tr>
                            <th>Номер</th>
                            <th>Тренер</th>
                            <th>Вид спорта</th>
                            <th>Стаж</th>
                            <th>Регион</th>
                            <th>Статус</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(z => {
                            const st = ztStatus(z)
                            return (
                                <tr key={z.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/zt/${z.id}`)}>
                                    <td style={{ fontWeight: 600 }}>{z.num}</td>
                                    <td>{z.coach}</td>
                                    <td>{z.sport}</td>
                                    <td>{z.experience} лет</td>
                                    <td>{z.region}</td>
                                    <td>
                                        <StatusDot tone={st.tone}>{st.label}</StatusDot>
                                        {acting !== 'any' && awaitsMe(z) && <div style={{ fontSize: 11.5, fontWeight: 700, color: '#1e40af', marginTop: 4 }}>Ваша очередь</div>}
                                    </td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <button className="reg-btn reg-btn--primary" onClick={() => navigate(`/zt/${z.id}`)}>Рассмотреть</button>
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
