import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, StatusDot } from '../components/ui'
import ApprovalRoleSwitcher from './ApprovalRoleSwitcher'
import { loadAwards, AWARD_LEVELS, AWARD_ROLES, awardRoute, awardStatus, loadAwardActing, saveAwardActing } from '../cabinet/awardsStore'
import './registries.css'

/* Служебный портал: заявления на присвоение званий и разрядов.
   Очередь; рассмотрение — на отдельной странице /awards/:id. */

const LEVEL_FILTERS = [
    { v: '', label: 'Все уровни' },
    { v: 'youth', label: 'Юношеские разряды' },
    { v: 'adult', label: 'Взрослые разряды' },
    { v: 'kms', label: 'КМС' },
    { v: 'title', label: 'МС / МСМК / ЗМС' },
]

export default function Awards() {
    const navigate = useNavigate()
    const [awards] = useState(loadAwards)
    const [acting, setActing] = useState(loadAwardActing)
    const [levelF, setLevelF] = useState('')

    const setActingRole = (r) => { setActing(r); saveAwardActing(r) }
    const awaitsMe = (a) => {
        const route = awardRoute(a)
        return !a.returned && a.step >= 1 && a.step < route.length && (acting === 'any' || route[a.step].role === acting)
    }

    const list = awards.filter(a => !levelF || a.level === levelF)
    const inWork = list.filter(a => awardStatus(a).tone === 'amber').length
    const done = list.filter(a => awardStatus(a).tone === 'green').length
    const myQueue = acting === 'any' ? null : list.filter(awaitsMe).length

    const selStyle = { padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit' }

    return (
        <div className="reg">
            <Breadcrumbs current="Звания и разряды" />
            <PageHeader
                title="Присвоение званий и разрядов"
                subtitle={`Заявления · на согласовании: ${inWork} · присвоено: ${done}${myQueue === null ? '' : ` · ожидают вашего решения: ${myQueue}`}`}
            />

            <ApprovalRoleSwitcher value={acting} onChange={setActingRole} roles={AWARD_ROLES} />

            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <select style={selStyle} value={levelF} onChange={e => setLevelF(e.target.value)}>
                    {LEVEL_FILTERS.map(f => <option key={f.v} value={f.v}>{f.label}</option>)}
                </select>
            </div>

            <div className="reg-table-wrap">
                <table className="reg-table">
                    <thead>
                        <tr>
                            <th>Номер</th>
                            <th>Спортсмен</th>
                            <th>Звание</th>
                            <th>Вид спорта</th>
                            <th>Регион</th>
                            <th>Статус</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(a => {
                            const st = awardStatus(a)
                            return (
                                <tr key={a.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/awards/${a.id}`)}>
                                    <td style={{ fontWeight: 600 }}>{a.num}</td>
                                    <td>{a.athlete}</td>
                                    <td><b>{a.title}</b> <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>({AWARD_LEVELS[a.level].by})</span></td>
                                    <td>{a.sport}</td>
                                    <td>{a.region}</td>
                                    <td>
                                        <StatusDot tone={st.tone}>{st.label}</StatusDot>
                                        {acting !== 'any' && awaitsMe(a) && <div style={{ fontSize: 11.5, fontWeight: 700, color: '#1e40af', marginTop: 4 }}>Ваша очередь</div>}
                                    </td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <button className="reg-btn reg-btn--primary" onClick={() => navigate(`/awards/${a.id}`)}>Рассмотреть</button>
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
