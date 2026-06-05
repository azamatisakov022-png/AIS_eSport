import { useState, useMemo } from 'react'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import Portal from '../components/Portal'
import Breadcrumbs from '../components/Breadcrumbs'
import './registries.css'

/* Реестр инвентаря (ТЗ 5.2): inventory_id, name, code, category, quantity,
   condition, location, assigned_to, purchase_date, warranty_end, documents. */

const CATEGORIES = ['Единоборства', 'Игровые виды', 'Лёгкая атлетика', 'Плавание', 'Тяжёлая атлетика', 'Общее оборудование', 'Экипировка']
const CONDITIONS = { new: 'Новое', working: 'Рабочее', repair: 'На ремонте', written_off: 'Списано' }
const COND_BADGE = { new: 'reg-badge--green', working: 'reg-badge--blue', repair: 'reg-badge--orange', written_off: 'reg-badge--gray' }
const LOCATIONS = ['Склад ЦА', 'СДЮСШОР №3 г. Бишкек', 'Ошская СДЮСШОР', 'Дворец спорта им. Кожомкула', 'Водный центр «Дельфин»', 'ДЮСШ Нарын']

const fmt = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '-'

const MOCK = [
    { id: 1, code: 'INV-2024-0012', name: 'Татами (комплект)', category: 'Единоборства', quantity: 8, condition: 'working', location: 'СДЮСШОР №3 г. Бишкек', assignedTo: 'Дзюдо (секция)', purchaseDate: '2024-02-15', warrantyEnd: '2027-02-15' },
    { id: 2, code: 'INV-2024-0028', name: 'Боксёрский ринг', category: 'Единоборства', quantity: 2, condition: 'working', location: 'Ошская СДЮСШОР', assignedTo: 'Бокс (секция)', purchaseDate: '2024-04-10', warrantyEnd: '2029-04-10' },
    { id: 3, code: 'INV-2025-0044', name: 'Штанга олимпийская (220 кг)', category: 'Тяжёлая атлетика', quantity: 6, condition: 'new', location: 'Склад ЦА', assignedTo: '-', purchaseDate: '2025-09-01', warrantyEnd: '2030-09-01' },
    { id: 4, code: 'INV-2023-0102', name: 'Беговая дорожка проф.', category: 'Лёгкая атлетика', quantity: 4, condition: 'repair', location: 'СДЮСШОР №3 г. Бишкек', assignedTo: 'Зал ОФП', purchaseDate: '2023-03-20', warrantyEnd: '2026-03-20' },
    { id: 5, code: 'INV-2024-0061', name: 'Мячи футбольные (комплект)', category: 'Игровые виды', quantity: 50, condition: 'working', location: 'ДЮСШ Нарын', assignedTo: 'Футбол (секция)', purchaseDate: '2024-08-12', warrantyEnd: '-' },
    { id: 6, code: 'INV-2025-0009', name: 'Стартовые тумбы для плавания', category: 'Плавание', quantity: 8, condition: 'new', location: 'Водный центр «Дельфин»', assignedTo: 'Плавание (секция)', purchaseDate: '2025-11-05', warrantyEnd: '2030-11-05' },
    { id: 7, code: 'INV-2022-0210', name: 'Гимнастические маты', category: 'Общее оборудование', quantity: 30, condition: 'written_off', location: 'Склад ЦА', assignedTo: '-', purchaseDate: '2020-01-10', warrantyEnd: '2023-01-10' },
    { id: 8, code: 'INV-2024-0077', name: 'Татами додянг (тхэквондо)', category: 'Единоборства', quantity: 5, condition: 'working', location: 'Дворец спорта им. Кожомкула', assignedTo: 'Тхэквондо (секция)', purchaseDate: '2024-06-18', warrantyEnd: '2027-06-18' },
    { id: 9, code: 'INV-2025-0033', name: 'Спортивная форма сборной (комплект)', category: 'Экипировка', quantity: 120, condition: 'new', location: 'Склад ЦА', assignedTo: 'Сборные команды', purchaseDate: '2025-12-20', warrantyEnd: '-' },
    { id: 10, code: 'INV-2023-0155', name: 'Гантельный ряд (2-50 кг)', category: 'Тяжёлая атлетика', quantity: 3, condition: 'working', location: 'СДЮСШОР №3 г. Бишкек', assignedTo: 'Зал ОФП', purchaseDate: '2023-07-30', warrantyEnd: '2028-07-30' },
    { id: 11, code: 'INV-2024-0090', name: 'Волейбольные сетки', category: 'Игровые виды', quantity: 12, condition: 'repair', location: 'ДЮСШ Нарын', assignedTo: 'Волейбол (секция)', purchaseDate: '2024-05-25', warrantyEnd: '-' },
    { id: 12, code: 'INV-2025-0050', name: 'Электронное табло', category: 'Общее оборудование', quantity: 2, condition: 'new', location: 'Дворец спорта им. Кожомкула', assignedTo: 'Главный зал', purchaseDate: '2025-10-15', warrantyEnd: '2028-10-15' },
]

const EMPTY = { name: '', code: '', category: '', quantity: 1, condition: 'new', location: '', assignedTo: '', purchaseDate: '' }

export default function Inventory() {
    const toast = useToast()
    const [search, setSearch] = useState('')
    const [catF, setCatF] = useState('')
    const [condF, setCondF] = useState('all')
    const [locF, setLocF] = useState('')
    const [drawer, setDrawer] = useState(null)
    const [addModal, setAddModal] = useState(false)
    const [form, setForm] = useState(EMPTY)

    const filtered = useMemo(() => MOCK.filter(i => {
        if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.code.toLowerCase().includes(search.toLowerCase())) return false
        if (catF && i.category !== catF) return false
        if (condF !== 'all' && i.condition !== condF) return false
        if (locF && i.location !== locF) return false
        return true
    }), [search, catF, condF, locF])

    const metrics = useMemo(() => ({
        positions: MOCK.length,
        units: MOCK.filter(i => i.condition !== 'written_off').reduce((a, i) => a + i.quantity, 0),
        repair: MOCK.filter(i => i.condition === 'repair').length,
        writtenOff: MOCK.filter(i => i.condition === 'written_off').length,
    }), [])

    const cur = drawer != null ? MOCK.find(i => i.id === drawer) : null
    const setField = (k, v) => setForm(p => ({ ...p, [k]: v }))
    const badge = (c) => <span className={`reg-badge ${COND_BADGE[c]}`}>{CONDITIONS[c]}</span>

    return (
        <div className="reg-page">
            <Breadcrumbs current="Реестр инвентаря" />
            <div className="reg-header">
                <h1 className="reg-header__title">Реестр инвентаря</h1>
                <button className="reg-header__btn" onClick={() => { setForm(EMPTY); setAddModal(true) }}><span>+</span> Добавить позицию</button>
            </div>

            <div className="reg-metrics">
                <div className="reg-metric reg-metric--blue"><div className="reg-metric__icon">{MetricIcons.wrench()}</div><div><div className="reg-metric__value">{metrics.positions}</div><div className="reg-metric__label">Позиций</div></div></div>
                <div className="reg-metric reg-metric--green"><div className="reg-metric__icon">{MetricIcons.active()}</div><div><div className="reg-metric__value">{metrics.units}</div><div className="reg-metric__label">Единиц в наличии</div></div></div>
                <div className="reg-metric reg-metric--orange"><div className="reg-metric__icon">{MetricIcons.warning()}</div><div><div className="reg-metric__value">{metrics.repair}</div><div className="reg-metric__label">На ремонте</div></div></div>
                <div className="reg-metric reg-metric--gray"><div className="reg-metric__icon">{MetricIcons.blocked()}</div><div><div className="reg-metric__value">{metrics.writtenOff}</div><div className="reg-metric__label">Списано</div></div></div>
            </div>

            <div className="reg-filters">
                <div className="reg-search">
                    <span className="reg-search__icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <input placeholder="Поиск по названию или коду…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="reg-select" value={catF} onChange={e => setCatF(e.target.value)}>
                    <option value="">Все категории</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="reg-select" value={condF} onChange={e => setCondF(e.target.value)}>
                    <option value="all">Любое состояние</option>
                    {Object.entries(CONDITIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select className="reg-select" value={locF} onChange={e => setLocF(e.target.value)}>
                    <option value="">Все локации</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>

            <div className="reg-table-wrap">
                <table className="reg-table">
                    <thead><tr>
                        <th>Наименование</th><th>Код</th><th>Категория</th><th>Кол-во</th><th>Локация</th><th>Назначено</th><th>Состояние</th><th></th>
                    </tr></thead>
                    <tbody>
                        {filtered.length === 0 && <tr><td colSpan={8} className="reg-table__empty">Инвентарь не найден</td></tr>}
                        {filtered.map(i => (
                            <tr key={i.id}>
                                <td><span style={{ fontWeight: 600 }}>{i.name}</span></td>
                                <td><span className="reg-mono">{i.code}</span></td>
                                <td style={{ fontSize: 13 }}>{i.category}</td>
                                <td style={{ fontWeight: 600 }}>{i.quantity}</td>
                                <td style={{ fontSize: 13 }}>{i.location}</td>
                                <td style={{ fontSize: 13 }}>{i.assignedTo}</td>
                                <td>{badge(i.condition)}</td>
                                <td><button className="reg-btn reg-btn--primary" onClick={() => setDrawer(i.id)}>Просмотр</button></td>
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
                                    <div className="reg-drawer__avatar" style={{ background: '#0d9488', fontSize: 22 }}>📦</div>
                                    <div><div className="reg-drawer__name">{cur.name}</div>{badge(cur.condition)}</div>
                                </div>
                                <button className="reg-drawer__close" onClick={() => setDrawer(null)}>✕</button>
                            </div>
                            <div className="reg-drawer__body">
                                <div className="reg-section-title">Карточка инвентаря</div>
                                <div className="reg-info-grid">
                                    <div className="reg-info-item"><div className="reg-info-item__label">Инвентарный код</div><div className="reg-info-item__value reg-mono">{cur.code}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Категория</div><div className="reg-info-item__value">{cur.category}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Количество</div><div className="reg-info-item__value">{cur.quantity} ед.</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Состояние</div><div className="reg-info-item__value">{CONDITIONS[cur.condition]}</div></div>
                                    <div className="reg-info-item reg-info-item--full"><div className="reg-info-item__label">Местоположение</div><div className="reg-info-item__value">{cur.location}</div></div>
                                    <div className="reg-info-item reg-info-item--full"><div className="reg-info-item__label">Кому назначено</div><div className="reg-info-item__value">{cur.assignedTo}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Дата закупки</div><div className="reg-info-item__value">{fmt(cur.purchaseDate)}</div></div>
                                    <div className="reg-info-item"><div className="reg-info-item__label">Гарантия до</div><div className="reg-info-item__value">{fmt(cur.warrantyEnd)}</div></div>
                                </div>
                                <div className="reg-section-title">Документы</div>
                                <button className="reg-btn" onClick={() => toast('Просмотр накладной (демо)')}>📄 Накладная / акт приёма</button>
                            </div>
                            <div className="reg-drawer__footer">
                                <button className="reg-btn reg-btn--primary" onClick={() => toast('Редактирование (демо)')}>Редактировать</button>
                                <button className="reg-btn" onClick={() => toast('Перемещение (демо)')}>Переместить</button>
                                {cur.condition !== 'written_off' && <button className="reg-btn reg-btn--red" onClick={() => toast('Списание (демо)')}>Списать</button>}
                            </div>
                        </div>
                    </div>
                </Portal>
            )}

            {addModal && (
                <Portal>
                    <div className="reg-modal-overlay" onClick={() => setAddModal(false)}>
                        <div className="reg-modal" onClick={e => e.stopPropagation()}>
                            <div className="reg-modal__header"><h2 className="reg-modal__title">Новая позиция инвентаря</h2><button className="reg-modal__close" onClick={() => setAddModal(false)}>✕</button></div>
                            <div className="reg-modal__body">
                                <div className="reg-modal__grid">
                                    <div className="reg-field reg-field--full"><label>Наименование <span>*</span></label><input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Например: Татами (комплект)" /></div>
                                    <div className="reg-field"><label>Инвентарный код</label><input value={form.code} onChange={e => setField('code', e.target.value)} placeholder="INV-2026-XXXX" /></div>
                                    <div className="reg-field"><label>Категория <span>*</span></label><select value={form.category} onChange={e => setField('category', e.target.value)}><option value="">Выберите</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                    <div className="reg-field"><label>Количество</label><input type="number" min="1" value={form.quantity} onChange={e => setField('quantity', e.target.value)} /></div>
                                    <div className="reg-field"><label>Состояние</label><select value={form.condition} onChange={e => setField('condition', e.target.value)}>{Object.entries(CONDITIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                                    <div className="reg-field"><label>Местоположение</label><select value={form.location} onChange={e => setField('location', e.target.value)}><option value="">Выберите</option>{LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
                                    <div className="reg-field"><label>Дата закупки</label><input type="date" value={form.purchaseDate} onChange={e => setField('purchaseDate', e.target.value)} /></div>
                                    <div className="reg-field reg-field--full"><label>Кому назначено</label><input value={form.assignedTo} onChange={e => setField('assignedTo', e.target.value)} placeholder="Секция / зал / команда" /></div>
                                </div>
                            </div>
                            <div className="reg-modal__footer">
                                <button className="reg-btn reg-btn--outline" onClick={() => setAddModal(false)}>Отмена</button>
                                <button className="reg-btn reg-btn--primary" onClick={() => { toast('Позиция сохранена (демо)'); setAddModal(false) }}>Сохранить</button>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    )
}
