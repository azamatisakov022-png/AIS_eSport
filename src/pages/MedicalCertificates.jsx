import { useState, useMemo } from 'react'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import Portal from '../components/Portal'
import Breadcrumbs from '../components/Breadcrumbs'
import { PageHeader, Button, MetricCard } from '../components/ui'
import './registries.css'

/* Реестр медицинских справок (ТЗ 5.2): med_id, person, issued_by, issue/valid dates,
   certificate_type, diagnosis_codes (ICD10), file_ref, verified, source_system. */

const TYPES = ['Допуск к соревнованиям', 'Допуск к тренировкам', 'Периодический осмотр', 'Углублённое обследование']
const SOURCES = { minzdrav: 'Минздрав', upload: 'Загрузка', ekyzmat: 'Е-Кызмат' }
const SOURCE_BADGE = { minzdrav: 'reg-badge--blue', upload: 'reg-badge--gray', ekyzmat: 'reg-badge--green' }
const today = new Date(); today.setHours(0, 0, 0, 0)
const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '-'
const daysUntil = (d) => Math.ceil((new Date(d) - today) / 86400000)

function statusOf(c) {
    const d = daysUntil(c.validUntil)
    if (d <= 0) return 'expired'
    if (d <= 30) return 'expiring'
    return 'valid'
}
const STATUS_LABEL = { valid: 'Действительна', expiring: 'Истекает', expired: 'Просрочена' }
const STATUS_BADGE = { valid: 'reg-badge--green', expiring: 'reg-badge--orange', expired: 'reg-badge--red' }

const MOCK = [
    { id: 1, person: 'Асанов Бекболот Маратович', sport: 'Дзюдо', type: 'Допуск к соревнованиям', issuedBy: 'РЦСМ г. Бишкек', issueDate: '2025-08-10', validUntil: '2026-08-10', icd: ['Z02.5'], source: 'minzdrav', verified: true },
    { id: 2, person: 'Кулматова Айгерим Сагынбековна', sport: 'Лёгкая атлетика', type: 'Допуск к тренировкам', issuedBy: 'Городская поликлиника №3', issueDate: '2025-11-01', validUntil: '2026-06-15', icd: ['Z02.5'], source: 'upload', verified: true },
    { id: 3, person: 'Джумабаев Эрлан Калыкович', sport: 'Бокс', type: 'Углублённое обследование', issuedBy: 'РЦСМ г. Бишкек', issueDate: '2026-01-20', validUntil: '2027-01-20', icd: ['Z02.5', 'Z00.0'], source: 'minzdrav', verified: true },
    { id: 4, person: 'Токтогулова Назира Асылбековна', sport: 'Плавание', type: 'Допуск к соревнованиям', issuedBy: 'Е-Кызмат (импорт)', issueDate: '2025-06-05', validUntil: '2026-06-05', icd: ['Z02.5'], source: 'ekyzmat', verified: false },
    { id: 5, person: 'Бейшеналиев Данияр Кубатович', sport: 'Борьба', type: 'Периодический осмотр', issuedBy: 'Областная больница Нарын', issueDate: '2025-03-12', validUntil: '2026-03-12', icd: ['Z00.0'], source: 'upload', verified: true },
    { id: 6, person: 'Сатыбалдиева Мээрим Акжолтоевна', sport: 'Каратэ', type: 'Допуск к соревнованиям', issuedBy: 'РЦСМ г. Бишкек', issueDate: '2025-09-25', validUntil: '2026-09-25', icd: ['Z02.5'], source: 'minzdrav', verified: true },
    { id: 7, person: 'Ормонов Алмаз Кайратович', sport: 'Футбол', type: 'Допуск к тренировкам', issuedBy: 'Медцентр «Дордой»', issueDate: '2025-12-01', validUntil: '2026-06-08', icd: ['Z02.5'], source: 'upload', verified: false },
    { id: 8, person: 'Касымова Жылдыз Болотбековна', sport: 'Гимнастика', type: 'Допуск к соревнованиям', issuedBy: 'РЦСМ г. Бишкек', issueDate: '2024-05-15', validUntil: '2025-05-15', icd: ['Z02.5'], source: 'minzdrav', verified: true },
    { id: 9, person: 'Турдалиев Марат Сапарбекович', sport: 'Дзюдо', type: 'Периодический осмотр', issuedBy: 'Ошская поликлиника №1', issueDate: '2026-02-10', validUntil: '2027-02-10', icd: ['Z00.0'], source: 'ekyzmat', verified: true },
    { id: 10, person: 'Эсенгулова Айчурок Таалайбековна', sport: 'Плавание', type: 'Допуск к соревнованиям', issuedBy: 'РЦСМ г. Бишкек', issueDate: '2025-10-30', validUntil: '2026-10-30', icd: ['Z02.5'], source: 'minzdrav', verified: true },
]

const EMPTY = { person: '', sport: '', type: TYPES[0], issuedBy: '', issueDate: '', validUntil: '', icd: '', source: 'upload' }

export default function MedicalCertificates() {
    const toast = useToast()
    const [search, setSearch] = useState('')
    const [statusF, setStatusF] = useState('all')
    const [sourceF, setSourceF] = useState('')
    const [drawer, setDrawer] = useState(null)
    const [addModal, setAddModal] = useState(false)
    const [form, setForm] = useState(EMPTY)

    const enriched = useMemo(() => MOCK.map(c => ({ ...c, _status: statusOf(c) })), [])

    const filtered = useMemo(() => enriched.filter(c => {
        if (search && !c.person.toLowerCase().includes(search.toLowerCase())) return false
        if (statusF !== 'all' && c._status !== statusF) return false
        if (sourceF && c.source !== sourceF) return false
        return true
    }), [enriched, search, statusF, sourceF])

    const metrics = useMemo(() => ({
        total: enriched.length,
        valid: enriched.filter(c => c._status === 'valid').length,
        expiring: enriched.filter(c => c._status === 'expiring').length,
        unverified: enriched.filter(c => !c.verified).length,
    }), [enriched])

    const cur = drawer != null ? enriched.find(c => c.id === drawer) : null
    const setField = (k, v) => setForm(p => ({ ...p, [k]: v }))
    const badge = (s) => <span className={`reg-badge ${STATUS_BADGE[s]}`}>{STATUS_LABEL[s]}</span>

    return (
        <div className="reg-page">
            <Breadcrumbs current="Реестр медицинских справок" />
            <PageHeader
                title="Реестр медицинских справок"
                actions={<Button variant="primary" onClick={() => { setForm(EMPTY); setAddModal(true) }}><span>+</span> Добавить справку</Button>}
            />

            <div className="reg-metrics">
                <MetricCard tone="blue" icon={MetricIcons.hospital()} value={metrics.total} label="Всего справок" />
                <MetricCard tone="green" icon={MetricIcons.active()} value={metrics.valid} label="Действительны" />
                <MetricCard tone="orange" icon={MetricIcons.warning()} value={metrics.expiring} label="Истекают (≤30 дн)" />
                <MetricCard tone="red" icon={MetricIcons.rejected()} value={metrics.unverified} label="Не верифицированы" />
            </div>

            <div className="reg-filters">
                <div className="reg-search">
                    <span className="reg-search__icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder="Поиск по ФИО спортсмена…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="reg-select" value={statusF} onChange={e => setStatusF(e.target.value)}>
                    <option value="all">Все статусы</option>
                    {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select className="reg-select" value={sourceF} onChange={e => setSourceF(e.target.value)}>
                    <option value="">Все источники</option>
                    {Object.entries(SOURCES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
            </div>

            <div className="reg-table-wrap">
                <table className="reg-table">
                    <thead><tr>
                        <th>Спортсмен</th><th>Тип справки</th><th>Кем выдана</th><th>Действует до</th><th>Источник</th><th>Верификация</th><th>Статус</th><th></th>
                    </tr></thead>
                    <tbody>
                        {filtered.length === 0 && <tr><td colSpan={8} className="reg-table__empty">Справки не найдены</td></tr>}
                        {filtered.map(c => {
                            const d = daysUntil(c.validUntil)
                            return (
                                <tr key={c.id}>
                                    <td>
                                        <div className="reg-person">
                                            <div><div className="reg-person__name">{c.person}</div><div className="reg-person__sub">{c.sport}</div></div>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 13 }}>{c.type}</td>
                                    <td style={{ fontSize: 13 }}>{c.issuedBy}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{fmt(c.validUntil)}{c._status !== 'expired' && d <= 30 && <span className="reg-badge reg-badge--orange" style={{ marginLeft: 6 }}>{d} дн</span>}</td>
                                    <td><span className={`reg-badge ${SOURCE_BADGE[c.source]}`}>{SOURCES[c.source]}</span></td>
                                    <td>{c.verified ? <span className="reg-badge reg-badge--green">✓ Да</span> : <span className="reg-badge reg-badge--gray">Нет</span>}</td>
                                    <td>{badge(c._status)}</td>
                                    <td><button className="reg-btn reg-btn--primary" onClick={() => setDrawer(c.id)}>Просмотр</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {cur && (
                <Portal>
                    <div className="reg-overlay" onClick={() => setDrawer(null)}>
                        <div className="reg-drawer" onClick={e => e.stopPropagation()}>
                            <div className="reg-drawer__header">
                                <div className="reg-drawer__profile">
                                    <div><div className="reg-drawer__name">{cur.person}</div>{badge(cur._status)}</div>
                                </div>
                                <button className="reg-drawer__close" onClick={() => setDrawer(null)}>✕</button>
                            </div>
                            <div className="reg-drawer__body">
                                <div className="reg-section-title">Сведения о справке</div>
                                <div className="reg-info-grid">
                                    <div className="reg-info-item"><div className="reg-info-item__label">Вид спорта</div><div className="reg-info-item__value">{cur.sport}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Тип справки</div><div className="reg-info-item__value">{cur.type}</div></div>
                                    <div className="reg-info-item reg-info-item--full"><div className="reg-info-item__label">Кем выдана</div><div className="reg-info-item__value">{cur.issuedBy}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Дата выдачи</div><div className="reg-info-item__value">{fmt(cur.issueDate)}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Действует до</div><div className="reg-info-item__value">{fmt(cur.validUntil)}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Коды диагноза (ICD-10)</div><div className="reg-info-item__value reg-mono">{cur.icd.join(', ')}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Источник</div><div className="reg-info-item__value">{SOURCES[cur.source]}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Верификация</div><div className="reg-info-item__value">{cur.verified ? 'Подтверждена' : 'Не подтверждена'}</div></div>
                                </div>
                                <div className="reg-section-title">Скан-копия</div>
                                <button className="reg-btn" onClick={() => toast('Просмотр скан-копии (демо)')}>📄 Открыть скан справки</button>
                            </div>
                            <div className="reg-drawer__footer">
                                {!cur.verified && <button className="reg-btn reg-btn--primary" onClick={() => toast('Справка верифицирована (демо)')}>Верифицировать</button>}
                                <button className="reg-btn" onClick={() => toast('Редактирование (демо)')}>Редактировать</button>
                                <button className="reg-btn reg-btn--red" onClick={() => toast('Аннулирование (демо)')}>Аннулировать</button>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}

            {addModal && (
                <Portal>
                    <div className="reg-modal-overlay" onClick={() => setAddModal(false)}>
                        <div className="reg-modal" onClick={e => e.stopPropagation()}>
                            <div className="reg-modal__header"><h2 className="reg-modal__title">Новая медицинская справка</h2><button className="reg-modal__close" onClick={() => setAddModal(false)}>✕</button></div>
                            <div className="reg-modal__body">
                                <div className="reg-modal__grid">
                                    <div className="reg-field reg-field--full"><label>Спортсмен <span>*</span></label><input value={form.person} onChange={e => setField('person', e.target.value)} placeholder="Фамилия Имя Отчество" /></div>
                                    <div className="reg-field"><label>Вид спорта</label><input value={form.sport} onChange={e => setField('sport', e.target.value)} /></div>
                                    <div className="reg-field"><label>Тип справки</label><select value={form.type} onChange={e => setField('type', e.target.value)}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                                    <div className="reg-field reg-field--full"><label>Кем выдана <span>*</span></label><input value={form.issuedBy} onChange={e => setField('issuedBy', e.target.value)} placeholder="Медицинское учреждение" /></div>
                                    <div className="reg-field"><label>Дата выдачи</label><input type="date" value={form.issueDate} onChange={e => setField('issueDate', e.target.value)} /></div>
                                    <div className="reg-field"><label>Действует до</label><input type="date" value={form.validUntil} onChange={e => setField('validUntil', e.target.value)} /></div>
                                    <div className="reg-field"><label>Коды ICD-10</label><input value={form.icd} onChange={e => setField('icd', e.target.value)} placeholder="Z02.5" /></div>
                                    <div className="reg-field"><label>Источник</label><select value={form.source} onChange={e => setField('source', e.target.value)}>{Object.entries(SOURCES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                                </div>
                            </div>
                            <div className="reg-modal__footer">
                                <button className="reg-btn reg-btn--outline" onClick={() => setAddModal(false)}>Отмена</button>
                                <button className="reg-btn reg-btn--primary" onClick={() => { toast('Справка сохранена (демо)'); setAddModal(false) }}>Сохранить</button>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    )
}
