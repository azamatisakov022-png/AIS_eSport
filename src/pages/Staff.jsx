import { useState, useMemo } from 'react'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import Portal from '../components/Portal'
import Breadcrumbs from '../components/Breadcrumbs'
import './registries.css'

/* Реестр сотрудников (ТЗ 5.2): staff_id, ФИО, должность, подразделение,
   дата приёма, статус (активен/уволен/отпуск), роли доступа, привязка к AD/ЕСИ. */

const DEPARTMENTS = ['Руководство', 'Канцелярия', 'Отдел кадров', 'Юридический отдел', 'Финансовая служба', 'ИТ-служба', 'Аналитический отдел', 'Отдел спортшкол', 'Дирекция олимпийских видов']
const STATUSES = { active: 'Активен', vacation: 'Отпуск', dismissed: 'Уволен' }
const STATUS_BADGE = { active: 'reg-badge--green', vacation: 'reg-badge--orange', dismissed: 'reg-badge--gray' }
const ROLES = ['superadmin', 'admin', 'employee', 'readonly']
const ROLE_LABELS = { superadmin: 'Суперадмин', admin: 'Администратор', employee: 'Сотрудник', readonly: 'Просмотр' }
const COLORS = ['#2563EB', '#059669', '#7c3aed', '#d97706', '#e11d48', '#0d9488']

const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'
const getInitials = (n) => { const p = n.split(' '); return (p[0]?.[0] || '') + (p[1]?.[0] || '') }
const getColor = (id) => COLORS[id % COLORS.length]

const MOCK = [
    { id: 1, empNo: 'СТ-0001', name: 'Касымов Адил Турдубекович', birth: '1972-05-14', phone: '+996 312 21-00-01', email: 'kasymov@gafkis.gov.kg', position: 'Директор', dept: 'Руководство', hireDate: '2021-02-01', status: 'active', role: 'superadmin', adAccount: 'GAFKIS\\a.kasymov' },
    { id: 2, empNo: 'СТ-0002', name: 'Бекешов Марат Кубанычбекович', birth: '1978-09-22', phone: '+996 312 21-00-02', email: 'bekeshov@gafkis.gov.kg', position: 'Заместитель директора', dept: 'Руководство', hireDate: '2021-03-15', status: 'active', role: 'admin', adAccount: 'GAFKIS\\m.bekeshov' },
    { id: 3, empNo: 'СТ-0015', name: 'Алиева Айгуль Канатбековна', birth: '1985-11-03', phone: '+996 312 21-00-15', email: 'alieva@gafkis.gov.kg', position: 'Начальник отдела кадров', dept: 'Отдел кадров', hireDate: '2021-06-01', status: 'active', role: 'employee', adAccount: 'GAFKIS\\a.alieva' },
    { id: 4, empNo: 'СТ-0025', name: 'Джумабаев Айбек Мирланович', birth: '1983-04-18', phone: '+996 312 21-00-25', email: 'djumabaev@gafkis.gov.kg', position: 'Начальник ИТ-службы', dept: 'ИТ-служба', hireDate: '2022-01-10', status: 'active', role: 'admin', adAccount: 'GAFKIS\\a.djumabaev' },
    { id: 5, empNo: 'СТ-0026', name: 'Бекбоев Нурлан Турдубекович', birth: '1990-07-30', phone: '+996 312 21-00-26', email: 'bekboev@gafkis.gov.kg', position: 'Системный администратор', dept: 'ИТ-служба', hireDate: '2022-04-20', status: 'vacation', role: 'admin', adAccount: 'GAFKIS\\n.bekboev' },
    { id: 6, empNo: 'СТ-0035', name: 'Кулбаева Айдай Кубанычбековна', birth: '1980-02-12', phone: '+996 312 21-00-35', email: 'kulbaeva@gafkis.gov.kg', position: 'Главный бухгалтер', dept: 'Финансовая служба', hireDate: '2021-09-01', status: 'active', role: 'employee', adAccount: 'GAFKIS\\a.kulbaeva' },
    { id: 7, empNo: 'СТ-0045', name: 'Осмонова Гульнара Асылбековна', birth: '1987-12-25', phone: '+996 312 21-00-45', email: 'osmonova@gafkis.gov.kg', position: 'Юрисконсульт', dept: 'Юридический отдел', hireDate: '2022-03-14', status: 'active', role: 'employee', adAccount: 'GAFKIS\\g.osmonova' },
    { id: 8, empNo: 'СТ-0050', name: 'Турсунова Назгуль Анарбековна', birth: '1992-06-08', phone: '+996 312 21-00-50', email: 'tursunova@gafkis.gov.kg', position: 'Аналитик', dept: 'Аналитический отдел', hireDate: '2023-02-01', status: 'active', role: 'readonly', adAccount: 'GAFKIS\\n.tursunova' },
    { id: 9, empNo: 'СТ-0055', name: 'Асанов Мирлан Болотбекович', birth: '1995-03-19', phone: '+996 312 21-00-55', email: 'asanov@gafkis.gov.kg', position: 'Специалист', dept: 'Канцелярия', hireDate: '2026-04-01', status: 'active', role: 'employee', adAccount: 'GAFKIS\\m.asanov' },
    { id: 10, empNo: 'СТ-0060', name: 'Сатыбеков Нурлан Кубанычбекович', birth: '1976-08-11', phone: '+996 312 21-00-60', email: 'satybekov@gafkis.gov.kg', position: 'Начальник отдела спортшкол', dept: 'Отдел спортшкол', hireDate: '2021-05-12', status: 'active', role: 'employee', adAccount: 'GAFKIS\\n.satybekov' },
    { id: 11, empNo: 'СТ-0061', name: 'Усонова Айжамал Бекбоевна', birth: '1989-10-02', phone: '+996 312 21-00-61', email: 'usonova@gafkis.gov.kg', position: 'Методист', dept: 'Отдел спортшкол', hireDate: '2022-08-20', status: 'vacation', role: 'employee', adAccount: 'GAFKIS\\a.usonova' },
    { id: 12, empNo: 'СТ-0070', name: 'Иманкулов Эмир Талантбекович', birth: '1981-01-27', phone: '+996 312 21-00-70', email: 'imankulov@gafkis.gov.kg', position: 'Директор дирекции', dept: 'Дирекция олимпийских видов', hireDate: '2021-07-01', status: 'active', role: 'employee', adAccount: 'GAFKIS\\e.imankulov' },
    { id: 13, empNo: 'СТ-0033', name: 'Жумабеков Эрлан Канатович', birth: '1984-05-05', phone: '+996 312 21-00-33', email: 'zhumabekov@gafkis.gov.kg', position: 'Специалист', dept: 'Канцелярия', hireDate: '2021-11-15', status: 'dismissed', role: 'employee', adAccount: 'GAFKIS\\e.zhumabekov' },
]

const EMPTY = { name: '', birth: '', phone: '', email: '', position: '', dept: '', hireDate: '', status: 'active', role: 'employee' }

export default function Staff() {
    const toast = useToast()
    const [search, setSearch] = useState('')
    const [deptF, setDeptF] = useState('')
    const [statusF, setStatusF] = useState('all')
    const [drawer, setDrawer] = useState(null)
    const [addModal, setAddModal] = useState(false)
    const [form, setForm] = useState(EMPTY)

    const filtered = useMemo(() => MOCK.filter(s => {
        if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.empNo.toLowerCase().includes(search.toLowerCase())) return false
        if (deptF && s.dept !== deptF) return false
        if (statusF !== 'all' && s.status !== statusF) return false
        return true
    }), [search, deptF, statusF])

    const metrics = useMemo(() => ({
        total: MOCK.length,
        active: MOCK.filter(s => s.status === 'active').length,
        vacation: MOCK.filter(s => s.status === 'vacation').length,
        dismissed: MOCK.filter(s => s.status === 'dismissed').length,
    }), [])

    const cur = drawer != null ? MOCK.find(s => s.id === drawer) : null
    const setField = (k, v) => setForm(p => ({ ...p, [k]: v }))
    const badge = (s) => <span className={`reg-badge ${STATUS_BADGE[s]}`}>{STATUSES[s]}</span>

    return (
        <div className="reg-page">
            <Breadcrumbs current="Реестр сотрудников" />
            <div className="reg-header">
                <h1 className="reg-header__title">Реестр сотрудников</h1>
                <button className="reg-header__btn" onClick={() => { setForm(EMPTY); setAddModal(true) }}><span>+</span> Добавить сотрудника</button>
            </div>

            <div className="reg-metrics">
                <div className="reg-metric reg-metric--blue"><div className="reg-metric__icon">{MetricIcons.users()}</div><div><div className="reg-metric__value">{metrics.total}</div><div className="reg-metric__label">Всего сотрудников</div></div></div>
                <div className="reg-metric reg-metric--green"><div className="reg-metric__icon">{MetricIcons.active()}</div><div><div className="reg-metric__value">{metrics.active}</div><div className="reg-metric__label">Активны</div></div></div>
                <div className="reg-metric reg-metric--orange"><div className="reg-metric__icon">{MetricIcons.clock()}</div><div><div className="reg-metric__value">{metrics.vacation}</div><div className="reg-metric__label">В отпуске</div></div></div>
                <div className="reg-metric reg-metric--gray"><div className="reg-metric__icon">{MetricIcons.blocked()}</div><div><div className="reg-metric__value">{metrics.dismissed}</div><div className="reg-metric__label">Уволены</div></div></div>
            </div>

            <div className="reg-filters">
                <div className="reg-search">
                    <span className="reg-search__icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder="Поиск по ФИО или табельному №…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="reg-select" value={deptF} onChange={e => setDeptF(e.target.value)}>
                    <option value="">Все подразделения</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="reg-select" value={statusF} onChange={e => setStatusF(e.target.value)}>
                    <option value="all">Все статусы</option>
                    {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
            </div>

            <div className="reg-table-wrap">
                <table className="reg-table">
                    <thead><tr>
                        <th>Сотрудник</th><th>Табельный №</th><th>Должность</th><th>Подразделение</th><th>Дата приёма</th><th>Роль доступа</th><th>Статус</th><th></th>
                    </tr></thead>
                    <tbody>
                        {filtered.length === 0 && <tr><td colSpan={8} className="reg-table__empty">Сотрудники не найдены</td></tr>}
                        {filtered.map(s => (
                            <tr key={s.id}>
                                <td>
                                    <div className="reg-person">
                                        <div className="reg-avatar" style={{ background: getColor(s.id) }}>{getInitials(s.name)}</div>
                                        <div><div className="reg-person__name">{s.name}</div><div className="reg-person__sub">{fmt(s.birth)}</div></div>
                                    </div>
                                </td>
                                <td><span className="reg-mono">{s.empNo}</span></td>
                                <td>{s.position}</td>
                                <td style={{ fontSize: 13 }}>{s.dept}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{fmt(s.hireDate)}</td>
                                <td><span className="reg-badge reg-badge--blue">{ROLE_LABELS[s.role]}</span></td>
                                <td>{badge(s.status)}</td>
                                <td><button className="reg-btn reg-btn--primary" onClick={() => setDrawer(s.id)}>Просмотр</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {cur && (
                <Portal>
                    <div className="reg-overlay" onClick={() => setDrawer(null)}>
                        <div className="reg-drawer" onClick={e => e.stopPropagation()}>
                            <div className="reg-drawer__header">
                                <div className="reg-drawer__profile">
                                    <div className="reg-drawer__avatar" style={{ background: getColor(cur.id) }}>{getInitials(cur.name)}</div>
                                    <div><div className="reg-drawer__name">{cur.name}</div>{badge(cur.status)}</div>
                                </div>
                                <button className="reg-drawer__close" onClick={() => setDrawer(null)}>✕</button>
                            </div>
                            <div className="reg-drawer__body">
                                <div className="reg-section-title">Личные данные</div>
                                <div className="reg-info-grid">
                                    <div className="reg-info-item"><div className="reg-info-item__label">Табельный №</div><div className="reg-info-item__value reg-mono">{cur.empNo}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Дата рождения</div><div className="reg-info-item__value">{fmt(cur.birth)}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Телефон</div><div className="reg-info-item__value">{cur.phone}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Эл. почта</div><div className="reg-info-item__value">{cur.email}</div></div>
                                </div>
                                <div className="reg-section-title">Служебные данные</div>
                                <div className="reg-info-grid">
                                    <div className="reg-info-item"><div className="reg-info-item__label">Должность</div><div className="reg-info-item__value">{cur.position}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Подразделение</div><div className="reg-info-item__value">{cur.dept}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Дата приёма</div><div className="reg-info-item__value">{fmt(cur.hireDate)}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Статус</div><div className="reg-info-item__value">{STATUSES[cur.status]}</div></div>
                                </div>
                                <div className="reg-section-title">Доступ в систему</div>
                                <div className="reg-info-grid">
                                    <div className="reg-info-item"><div className="reg-info-item__label">Роль доступа</div><div className="reg-info-item__value">{ROLE_LABELS[cur.role]}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Учётная запись AD / ЕСИ</div><div className="reg-info-item__value reg-mono">{cur.adAccount}</div></div>
                                </div>
                            </div>
                            <div className="reg-drawer__footer">
                                <button className="reg-btn reg-btn--primary" onClick={() => toast('Редактирование (демо)')}>Редактировать</button>
                                <button className="reg-btn" onClick={() => toast('Сброс пароля (демо)')}>Сбросить пароль</button>
                                {cur.status !== 'dismissed' && <button className="reg-btn reg-btn--red" onClick={() => toast('Увольнение (демо)')}>Уволить</button>}
                            </div>
                        </div>
                    </div>
                </Portal>
            )}

            {addModal && (
                <Portal>
                    <div className="reg-modal-overlay" onClick={() => setAddModal(false)}>
                        <div className="reg-modal" onClick={e => e.stopPropagation()}>
                            <div className="reg-modal__header"><h2 className="reg-modal__title">Новый сотрудник</h2><button className="reg-modal__close" onClick={() => setAddModal(false)}>✕</button></div>
                            <div className="reg-modal__body">
                                <div className="reg-modal__grid">
                                    <div className="reg-field reg-field--full"><label>ФИО <span>*</span></label><input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Фамилия Имя Отчество" /></div>
                                    <div className="reg-field"><label>Дата рождения</label><input type="date" value={form.birth} onChange={e => setField('birth', e.target.value)} /></div>
                                    <div className="reg-field"><label>Телефон</label><input value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+996 ..." /></div>
                                    <div className="reg-field"><label>Эл. почта</label><input type="email" value={form.email} onChange={e => setField('email', e.target.value)} /></div>
                                    <div className="reg-field"><label>Должность <span>*</span></label><input value={form.position} onChange={e => setField('position', e.target.value)} /></div>
                                    <div className="reg-field"><label>Подразделение <span>*</span></label><select value={form.dept} onChange={e => setField('dept', e.target.value)}><option value="">Выберите</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                                    <div className="reg-field"><label>Дата приёма</label><input type="date" value={form.hireDate} onChange={e => setField('hireDate', e.target.value)} /></div>
                                    <div className="reg-field"><label>Роль доступа</label><select value={form.role} onChange={e => setField('role', e.target.value)}>{ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</select></div>
                                </div>
                            </div>
                            <div className="reg-modal__footer">
                                <button className="reg-btn reg-btn--outline" onClick={() => setAddModal(false)}>Отмена</button>
                                <button className="reg-btn reg-btn--primary" onClick={() => { toast('Сотрудник сохранён (демо)'); setAddModal(false) }}>Сохранить</button>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    )
}
