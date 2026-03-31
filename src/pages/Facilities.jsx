import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../context/ToastContext'
import { MetricIcons } from '../components/CabinetIcons'
import './Facilities.css'
import Breadcrumbs from '../components/Breadcrumbs'
import Portal from '../components/Portal'

/* ══════════════════════════════════════════════════════
   MOCK DATA - 14 facilities across KR
   ══════════════════════════════════════════════════════ */
export const FACILITIES_DATA = [
    { id: 1, name: 'Стадион «Спартак»', type: 'stadium', address: 'ул. Токтогула 125', region: 'Бишкек', city: 'Бишкек', lat: 42.8746, lng: 74.5698, capacity: 22000, area: 18500, owner: 'ГАФКиС КР', status: 'active', equipment: ['трибуны', 'раздевалки', 'медпункт', 'парковка', 'освещение'], schedule: { Пн: '08:00–20:00', Вт: '08:00–20:00', Ср: '08:00–20:00', Чт: '08:00–20:00', Пт: '08:00–20:00', Сб: '09:00–18:00', Вс: '09:00–16:00' }, events: ['Чемпионат КР по лёгкой атлетике 2026', 'Кубок Президента КР 2026'] },
    { id: 2, name: 'Дворец спорта им. Кожомкулова', type: 'arena', address: 'бул. Молодой Гвардии 42', region: 'Бишкек', city: 'Бишкек', lat: 42.8700, lng: 74.5900, capacity: 7000, area: 12000, owner: 'ГАФКиС КР', status: 'active', equipment: ['трибуны', 'раздевалки', 'медпункт', 'парковка', 'освещение', 'табло'], schedule: { Пн: '07:00–21:00', Вт: '07:00–21:00', Ср: '07:00–21:00', Чт: '07:00–21:00', Пт: '07:00–21:00', Сб: '08:00–20:00', Вс: '08:00–18:00' }, events: ['Чемпионат КР по боксу 2026', 'Международный турнир по дзюдо 2026'] },
    { id: 3, name: 'Бассейн «Динамо»', type: 'pool', address: 'ул. Панфилова 78', region: 'Бишкек', city: 'Бишкек', lat: 42.8650, lng: 74.6100, capacity: 500, area: 3200, owner: 'МО КР', status: 'active', equipment: ['раздевалки', 'медпункт', 'парковка'], schedule: { Пн: '06:00–22:00', Вт: '06:00–22:00', Ср: '06:00–22:00', Чт: '06:00–22:00', Пт: '06:00–22:00', Сб: '07:00–20:00', Вс: '07:00–18:00' }, events: ['Чемпионат КР по плаванию 2025'] },
    { id: 4, name: 'Стадион «Ала-Тоо»', type: 'stadium', address: 'просп. Чуй 180', region: 'Бишкек', city: 'Бишкек', lat: 42.8400, lng: 74.6200, capacity: 10000, area: 14000, owner: 'Мэрия г. Бишкек', status: 'reconstruction', equipment: ['трибуны', 'раздевалки', 'парковка'], schedule: {}, events: [] },
    { id: 5, name: 'Стадион г. Ош', type: 'stadium', address: 'ул. Курманджан Датки 15', region: 'Ош', city: 'Ош', lat: 40.5283, lng: 72.7985, capacity: 15000, area: 16000, owner: 'Мэрия г. Ош', status: 'active', equipment: ['трибуны', 'раздевалки', 'медпункт', 'освещение'], schedule: { Пн: '08:00–19:00', Вт: '08:00–19:00', Ср: '08:00–19:00', Чт: '08:00–19:00', Пт: '08:00–19:00', Сб: '09:00–17:00', Вс: 'выходной' }, events: ['Спартакиада школьников Юг 2026'] },
    { id: 6, name: 'ДЮСШ Токмок', type: 'dyush', address: 'ул. Ибраимова 34', region: 'Чуйская', city: 'Токмок', lat: 42.8347, lng: 75.2939, capacity: 200, area: 1800, owner: 'Управление образования ЧО', status: 'active', equipment: ['раздевалки', 'медпункт'], schedule: { Пн: '09:00–18:00', Вт: '09:00–18:00', Ср: '09:00–18:00', Чт: '09:00–18:00', Пт: '09:00–18:00', Сб: '10:00–16:00', Вс: 'выходной' }, events: [] },
    { id: 7, name: 'Спорткомплекс Каракол', type: 'arena', address: 'ул. Гебзе 5', region: 'Иссык-Кульская', city: 'Каракол', lat: 42.4900, lng: 78.3936, capacity: 3000, area: 5500, owner: 'Мэрия г. Каракол', status: 'active', equipment: ['трибуны', 'раздевалки', 'медпункт', 'парковка'], schedule: { Пн: '08:00–19:00', Вт: '08:00–19:00', Ср: '08:00–19:00', Чт: '08:00–19:00', Пт: '08:00–19:00', Сб: '09:00–17:00', Вс: '09:00–15:00' }, events: ['Первенство ИКО по борьбе 2026'] },
    { id: 8, name: 'Стадион Джалал-Абад', type: 'stadium', address: 'ул. Ленина 90', region: 'Джалал-Абадская', city: 'Джалал-Абад', lat: 40.9335, lng: 73.0000, capacity: 8000, area: 11000, owner: 'Мэрия г. Джалал-Абад', status: 'active', equipment: ['трибуны', 'раздевалки', 'освещение'], schedule: { Пн: '08:00–18:00', Вт: '08:00–18:00', Ср: '08:00–18:00', Чт: '08:00–18:00', Пт: '08:00–18:00', Сб: '09:00–16:00', Вс: 'выходной' }, events: [] },
    { id: 9, name: 'Спорткомплекс Нарын', type: 'arena', address: 'ул. Сагынбай Орозбакова 12', region: 'Нарынская', city: 'Нарын', lat: 41.4286, lng: 75.9908, capacity: 2000, area: 4000, owner: 'ОМС г. Нарын', status: 'reconstruction', equipment: ['трибуны', 'раздевалки'], schedule: {}, events: [] },
    { id: 10, name: 'Стадион Талас', type: 'stadium', address: 'ул. Бердике Баатыра 25', region: 'Таласская', city: 'Талас', lat: 42.5200, lng: 72.2400, capacity: 5000, area: 9000, owner: 'Мэрия г. Талас', status: 'active', equipment: ['трибуны', 'раздевалки', 'медпункт'], schedule: { Пн: '08:00–18:00', Вт: '08:00–18:00', Ср: '08:00–18:00', Чт: '08:00–18:00', Пт: '08:00–18:00', Сб: '09:00–15:00', Вс: 'выходной' }, events: [] },
    { id: 11, name: 'ДЮСШ Баткен', type: 'dyush', address: 'ул. Махмуда Кашгари 8', region: 'Баткенская', city: 'Баткен', lat: 40.0631, lng: 70.8188, capacity: 150, area: 1200, owner: 'Управление образования БО', status: 'active', equipment: ['раздевалки'], schedule: { Пн: '09:00–17:00', Вт: '09:00–17:00', Ср: '09:00–17:00', Чт: '09:00–17:00', Пт: '09:00–17:00', Сб: '10:00–14:00', Вс: 'выходной' }, events: [] },
    { id: 12, name: 'УОР Бишкек', type: 'uor', address: 'ул. Ахунбаева 145', region: 'Бишкек', city: 'Бишкек', lat: 42.8900, lng: 74.5500, capacity: 1200, area: 6800, owner: 'ГАФКиС КР', status: 'active', equipment: ['трибуны', 'раздевалки', 'медпункт', 'парковка', 'освещение'], schedule: { Пн: '06:00–21:00', Вт: '06:00–21:00', Ср: '06:00–21:00', Чт: '06:00–21:00', Пт: '06:00–21:00', Сб: '07:00–19:00', Вс: '07:00–17:00' }, events: ['Отборочные на Азиатские игры 2026'] },
    { id: 13, name: 'Манеж КНУ', type: 'manege', address: 'ул. Фрунзе 547', region: 'Бишкек', city: 'Бишкек', lat: 42.8750, lng: 74.6050, capacity: 800, area: 2400, owner: 'КНУ им. Ж. Баласагына', status: 'active', equipment: ['раздевалки', 'медпункт', 'освещение'], schedule: { Пн: '07:00–20:00', Вт: '07:00–20:00', Ср: '07:00–20:00', Чт: '07:00–20:00', Пт: '07:00–20:00', Сб: '08:00–16:00', Вс: 'выходной' }, events: ['Первенство КНУ по лёгкой атлетике 2026'] },
    { id: 14, name: 'Зал борьбы Кара-Балта', type: 'gym', address: 'ул. Жаманбаева 11', region: 'Чуйская', city: 'Кара-Балта', lat: 42.8200, lng: 73.8400, capacity: 300, area: 900, owner: 'СК «Кара-Балта»', status: 'closed', equipment: ['раздевалки'], schedule: {}, events: [] },
]

const TYPE_LABEL_KEYS = {
    stadium: 'facilities.types.stadium', pool: 'facilities.types.pool', gym: 'facilities.types.combatHall',
    field: 'facilities.types.gymHall', fitness: 'facilities.types.gymHall',
    arena: 'facilities.types.complex',
}
const TYPE_LABELS_STATIC = {
    dyush: 'ДЮСШ', uor: 'УОР', manege: 'Манеж',
}

const TYPE_OPTIONS = [
    { value: '', labelKey: 'common.all' },
    { value: 'stadium', labelKey: 'facilities.types.stadium' },
    { value: 'arena', labelKey: 'facilities.types.complex' },
    { value: 'pool', labelKey: 'facilities.types.pool' },
    { value: 'gym', labelKey: 'facilities.types.combatHall' },
    { value: 'dyush', label: 'ДЮСШ' },
    { value: 'uor', label: 'УОР' },
    { value: 'manege', label: 'Манеж' },
]

const REGIONS = ['', 'Бишкек', 'Чуйская', 'Ош', 'Иссык-Кульская', 'Джалал-Абадская', 'Нарынская', 'Баткенская', 'Таласская']
const STATUS_MAP = { active: { labelKey: 'facilities.statusActive', cls: 'fc-status--active' }, reconstruction: { labelKey: 'facilities.statusReconstruction', cls: 'fc-status--recon' }, closed: { labelKey: 'facilities.statusClosed', cls: 'fc-status--closed' } }
const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export default function Facilities() {
    const { t } = useTranslation()
    const toast = useToast()
    const [view, setView] = useState('list')
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [regionFilter, setRegionFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [drawer, setDrawer] = useState(null)
    const [drawerTab, setDrawerTab] = useState('main')
    const [showAdd, setShowAdd] = useState(false)
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)

    const filtered = FACILITIES_DATA.filter(f => {
        if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.address.toLowerCase().includes(search.toLowerCase())) return false
        if (typeFilter && f.type !== typeFilter) return false
        if (regionFilter && f.region !== regionFilter) return false
        if (statusFilter && f.status !== statusFilter) return false
        return true
    })

    const activeCount = FACILITIES_DATA.filter(f => f.status === 'active').length
    const reconCount = FACILITIES_DATA.filter(f => f.status === 'reconstruction').length
    const regionsCount = new Set(FACILITIES_DATA.map(f => f.region)).size

    /* ── Leaflet map init ── */
    useEffect(() => {
        if (view !== 'map') return
        if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize()
            return
        }

        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
            document.head.appendChild(link)
        }

        const initMap = () => {
            if (!window.L || !mapRef.current) return
            const map = window.L.map(mapRef.current).setView([42.8746, 74.5698], 7)
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(map)

            FACILITIES_DATA.forEach(f => {
                const color = f.status === 'active' ? '#16a34a' : f.status === 'reconstruction' ? '#d97706' : '#ef4444'
                const marker = window.L.circleMarker([f.lat, f.lng], {
                    radius: 8, fillColor: color, color: '#fff', weight: 2, fillOpacity: 0.9,
                })
                marker.bindPopup(`
                    <div style="font-family:inherit;min-width:200px">
                        <div style="font-size:15px;font-weight:700;margin-bottom:4px;color:var(--text-primary, #1a1a1a)">${f.name}</div>
                        <div style="font-size:12px;color:var(--text-secondary, #6e6e73);margin-bottom:2px">${TYPE_LABEL_KEYS[f.type] ? t(TYPE_LABEL_KEYS[f.type]) : (TYPE_LABELS_STATIC[f.type] || f.type)}</div>
                        <div style="font-size:12px;color:var(--text-secondary, #6e6e73);margin-bottom:8px">${f.address}, ${f.city}</div>
                        <div style="font-size:11px;padding:3px 10px;border-radius:10px;display:inline-block;background:${f.status === 'active' ? '#dcfce7' : f.status === 'reconstruction' ? '#fef3c7' : '#fee2e2'};color:${f.status === 'active' ? '#16a34a' : f.status === 'reconstruction' ? '#d97706' : '#ef4444'};font-weight:600">${t(STATUS_MAP[f.status].labelKey)}</div>
                    </div>
                `)
                marker.addTo(map)
            })

            mapInstanceRef.current = map
        }

        if (window.L) {
            initMap()
        } else {
            const script = document.createElement('script')
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
            script.onload = initMap
            document.head.appendChild(script)
        }
    }, [view])

    /* ── Drawer mini-map ── */
    const miniMapRef = useRef(null)
    const miniMapInstance = useRef(null)
    useEffect(() => {
        if (!drawer || drawerTab !== 'main') return
        const timer = setTimeout(() => {
            if (!window.L || !miniMapRef.current) return
            if (miniMapInstance.current) { miniMapInstance.current.remove(); miniMapInstance.current = null }
            const mm = window.L.map(miniMapRef.current).setView([drawer.lat, drawer.lng], 15)
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(mm)
            window.L.circleMarker([drawer.lat, drawer.lng], { radius: 10, fillColor: '#2563EB', color: '#fff', weight: 3, fillOpacity: 0.9 }).addTo(mm)
            miniMapInstance.current = mm
        }, 100)
        return () => clearTimeout(timer)
    }, [drawer, drawerTab])

    const openDrawer = (f) => { setDrawer(f); setDrawerTab('main') }

    return (
        <div className="fc">
            <Breadcrumbs current={t('facilities.registryTitle')} />
            <div className="fc-header">
                <div className="fc-header__left">
                    <h1 className="fc-header__title">{t('facilities.registryTitle')}</h1>
                    <button className="fc-add-btn" onClick={() => setShowAdd(true)}>+ {t('facilities.addNew')}</button>
                </div>
                <div className="fc-view-toggle">
                    <button className={`fc-view-btn ${view === 'list' ? 'fc-view-btn--active' : ''}`} onClick={() => setView('list')}>{t('facilities.viewList')}</button>
                    <button className={`fc-view-btn ${view === 'map' ? 'fc-view-btn--active' : ''}`} onClick={() => setView('map')}>{t('facilities.viewMap')}</button>
                </div>
            </div>

            {/* ── Metrics ── */}
            <div className="fc-metrics">
                <div className="fc-metric"><span className="fc-metric__icon fc-metric__icon--blue">{MetricIcons.stadium()}</span><div className="fc-metric__info"><span className="fc-metric__val">{FACILITIES_DATA.length}</span><span className="fc-metric__lbl">{t('facilities.metricsTotal')}</span></div></div>
                <div className="fc-metric"><span className="fc-metric__icon fc-metric__icon--green">{MetricIcons.active()}</span><div className="fc-metric__info"><span className="fc-metric__val">{activeCount}</span><span className="fc-metric__lbl">{t('facilities.metricsActive')}</span></div></div>
                <div className="fc-metric"><span className="fc-metric__icon fc-metric__icon--amber">{MetricIcons.wrench()}</span><div className="fc-metric__info"><span className="fc-metric__val">{reconCount}</span><span className="fc-metric__lbl">{t('facilities.metricsReconstruction')}</span></div></div>
                <div className="fc-metric"><span className="fc-metric__icon fc-metric__icon--violet">{MetricIcons.mapPin()}</span><div className="fc-metric__info"><span className="fc-metric__val">{regionsCount}</span><span className="fc-metric__lbl">{t('facilities.metricsRegions')}</span></div></div>
            </div>

            {/* ── Filters ── */}
            <div className="fc-filters">
                <input className="fc-filter-input" placeholder="Поиск по названию или адресу..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="fc-filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.labelKey ? t(o.labelKey) : o.label}</option>)}
                </select>
                <select className="fc-filter-select" value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
                    <option value="">Все регионы</option>
                    {REGIONS.slice(1).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select className="fc-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">{t('common.allStatuses')}</option>
                    <option value="active">{t('facilities.statusActive')}</option>
                    <option value="reconstruction">{t('facilities.statusReconstruction')}</option>
                    <option value="closed">{t('facilities.statusClosed')}</option>
                </select>
            </div>

            {/* ── List View ── */}
            {view === 'list' && (
                <div className="fc-table-wrap">
                    <table className="fc-table">
                        <thead>
                            <tr>
                                <th>{t('facilities.table.nameType')}</th>
                                <th>{t('facilities.table.regionCity')}</th>
                                <th>{t('facilities.table.capacity')}</th>
                                <th>{t('facilities.table.organization')}</th>
                                <th>{t('facilities.table.status')}</th>
                                <th>{t('facilities.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(f => (
                                <tr key={f.id} onClick={() => openDrawer(f)} className="fc-table__row">
                                    <td>
                                        <div className="fc-table__name">{f.name}</div>
                                        <div className="fc-table__type">{TYPE_LABEL_KEYS[f.type] ? t(TYPE_LABEL_KEYS[f.type]) : (TYPE_LABELS_STATIC[f.type] || f.type)}</div>
                                    </td>
                                    <td>{f.region}, {f.city}</td>
                                    <td>{f.capacity.toLocaleString('ru-RU')}</td>
                                    <td className="fc-table__owner">{f.owner}</td>
                                    <td><span className={`fc-status ${STATUS_MAP[f.status].cls}`}>{t(STATUS_MAP[f.status].labelKey)}</span></td>
                                    <td>
                                        <button className="fc-table__action" onClick={e => { e.stopPropagation(); openDrawer(f) }}>Открыть</button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan="6" className="fc-table__empty">Нет объектов по заданным фильтрам</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Map View ── */}
            {view === 'map' && (
                <div className="fc-map-container">
                    <div id="facilities-map" ref={mapRef} style={{ height: 500, borderRadius: 12, overflow: 'hidden' }} />
                </div>
            )}

            {/* ── Drawer ── */}
            {drawer && (
                <Portal>
                    <div className="fc-overlay" onClick={() => { setDrawer(null); if (miniMapInstance.current) { miniMapInstance.current.remove(); miniMapInstance.current = null } }} />
                    <div className="fc-drawer">
                        <div className="fc-drawer__header">
                            <div>
                                <h2 className="fc-drawer__title">{drawer.name}</h2>
                                <div className="fc-drawer__subtitle">{TYPE_LABEL_KEYS[drawer.type] ? t(TYPE_LABEL_KEYS[drawer.type]) : (TYPE_LABELS_STATIC[drawer.type] || drawer.type)} · {drawer.city}</div>
                            </div>
                            <button className="fc-drawer__close" onClick={() => { setDrawer(null); if (miniMapInstance.current) { miniMapInstance.current.remove(); miniMapInstance.current = null } }}>✕</button>
                        </div>

                        <div className="fc-drawer__tabs">
                            {['main', 'schedule', 'events', 'photos'].map(tab => (
                                <button key={tab} className={`fc-drawer__tab ${drawerTab === tab ? 'fc-drawer__tab--active' : ''}`}
                                    onClick={() => setDrawerTab(tab)}>
                                    {{ main: t('facilities.tabs.main'), schedule: t('facilities.tabs.schedule'), events: t('facilities.tabs.events'), photos: t('facilities.tabs.photos') }[tab]}
                                </button>
                            ))}
                        </div>

                        <div className="fc-drawer__body">
                            {/* TAB: Main */}
                            {drawerTab === 'main' && (
                                <div>
                                    <span className={`fc-status ${STATUS_MAP[drawer.status].cls}`} style={{ marginBottom: 16, display: 'inline-block' }}>{t(STATUS_MAP[drawer.status].labelKey)}</span>
                                    <div className="fc-info-grid">
                                        <div className="fc-info-item"><div className="fc-info-label">{t('facilities.drawer.address')}</div><div className="fc-info-value">{drawer.address}, {drawer.city}</div></div>
                                        <div className="fc-info-item"><div className="fc-info-label">{t('fields.region')}</div><div className="fc-info-value">{drawer.region}</div></div>
                                        <div className="fc-info-item"><div className="fc-info-label">{t('facilities.drawer.capacity')}</div><div className="fc-info-value">{drawer.capacity.toLocaleString('ru-RU')} чел.</div></div>
                                        <div className="fc-info-item"><div className="fc-info-label">{t('facilities.drawer.area')}</div><div className="fc-info-value">{drawer.area.toLocaleString('ru-RU')} м²</div></div>
                                        <div className="fc-info-item"><div className="fc-info-label">{t('facilities.table.organization')}</div><div className="fc-info-value">{drawer.owner}</div></div>
                                        <div className="fc-info-item"><div className="fc-info-label">{t('facilities.drawer.coordinates')}</div><div className="fc-info-value" style={{ fontFamily: 'monospace', fontSize: 12 }}>{drawer.lat}, {drawer.lng}</div></div>
                                    </div>
                                    <div className="fc-info-label" style={{ marginTop: 16 }}>{t('facilities.drawer.equipment')}</div>
                                    <div className="fc-tags">
                                        {drawer.equipment.map(e => <span key={e} className="fc-tag">{e}</span>)}
                                    </div>
                                    <div className="fc-info-label" style={{ marginTop: 20, marginBottom: 8 }}>{t('facilities.drawer.location')}</div>
                                    <div ref={miniMapRef} style={{ height: 200, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-color)' }} />
                                </div>
                            )}

                            {/* TAB: Schedule */}
                            {drawerTab === 'schedule' && (
                                <div>
                                    {Object.keys(drawer.schedule).length === 0 ? (
                                        <div className="fc-empty-state">
                                            <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 10 }}>{t('facilities.schedule.unavailable')}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Объект на реконструкции или закрыт</div>
                                        </div>
                                    ) : (
                                        <table className="fc-schedule-table">
                                            <thead><tr><th>{t('facilities.schedule.day')}</th><th>{t('facilities.schedule.hours')}</th></tr></thead>
                                            <tbody>
                                                {DAYS.map(day => (
                                                    <tr key={day}>
                                                        <td className="fc-schedule-day">{day}</td>
                                                        <td className={drawer.schedule[day] === 'выходной' ? 'fc-schedule-off' : ''}>
                                                            {drawer.schedule[day] || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}

                            {/* TAB: Events */}
                            {drawerTab === 'events' && (
                                <div>
                                    {drawer.events.length === 0 ? (
                                        <div className="fc-empty-state">
                                            <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 7H4a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3h1"/><path d="M17 7h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3h-1"/></svg></div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 10 }}>{t('facilities.noPlannedEvents')}</div>
                                        </div>
                                    ) : (
                                        <div className="fc-events-list">
                                            {drawer.events.map((ev, i) => (
                                                <div key={i} className="fc-event-card">
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/></svg></span>
                                                    <span className="fc-event-name">{ev}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: Photos */}
                            {drawerTab === 'photos' && (
                                <div className="fc-photos-grid">
                                    {[
                                        'linear-gradient(135deg, #667eea, #764ba2)',
                                        'linear-gradient(135deg, #f093fb, #f5576c)',
                                        'linear-gradient(135deg, #4facfe, #00f2fe)',
                                        'linear-gradient(135deg, #43e97b, #38f9d7)',
                                        'linear-gradient(135deg, #fa709a, #fee140)',
                                        'linear-gradient(135deg, #a18cd1, #fbc2eb)',
                                    ].map((bg, i) => (
                                        <div key={i} className="fc-photo-placeholder" style={{ background: bg }}>
                                            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="fc-drawer__footer">
                            <button className="fc-btn fc-btn--primary" onClick={() => toast('Редактирование')}>{t('facilities.actions.edit')}</button>
                            {drawer.status === 'active' && (
                                <button className="fc-btn fc-btn--warn" onClick={() => toast('На реконструкцию')}>{t('facilities.actions.reconstruct')}</button>
                            )}
                            {drawer.status !== 'closed' && (
                                <button className="fc-btn fc-btn--danger" onClick={() => toast('Закрытие объекта')}>{t('facilities.actions.closeFacility')}</button>
                            )}
                        </div>
                    </div>
                </Portal>
            )}

            {/* ── Add Modal ── */}
            {showAdd && (
                <Portal>
                    <div className="fc-overlay" onClick={() => setShowAdd(false)} />
                    <div className="fc-modal">
                        <div className="fc-modal__header">
                            <h2 className="fc-modal__title">+ Новый спортивный объект</h2>
                            <button className="fc-drawer__close" onClick={() => setShowAdd(false)}>✕</button>
                        </div>
                        <div className="fc-modal__body">
                            <div className="fc-form-grid">
                                <div className="fc-form-group">
                                    <label className="fc-form-label">{t('facilities.form.name')} *</label>
                                    <input className="fc-form-input" placeholder="Стадион «Пример»" />
                                </div>
                                <div className="fc-form-group">
                                    <label className="fc-form-label">{t('facilities.form.type')} *</label>
                                    <select className="fc-form-input">
                                        {TYPE_OPTIONS.slice(1).map(o => <option key={o.value} value={o.value}>{o.labelKey ? t(o.labelKey) : o.label}</option>)}
                                    </select>
                                </div>
                                <div className="fc-form-group">
                                    <label className="fc-form-label">{t('fields.region')} *</label>
                                    <select className="fc-form-input">
                                        {REGIONS.slice(1).map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="fc-form-group">
                                    <label className="fc-form-label">{t('facilities.form.city')} *</label>
                                    <input className="fc-form-input" placeholder="Бишкек" />
                                </div>
                                <div className="fc-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="fc-form-label">{t('fields.address')} *</label>
                                    <input className="fc-form-input" placeholder="ул. Примерная 1" />
                                </div>
                                <div className="fc-form-group">
                                    <label className="fc-form-label">{t('facilities.form.latitude')}</label>
                                    <input className="fc-form-input" type="number" step="0.0001" placeholder="42.8746" />
                                </div>
                                <div className="fc-form-group">
                                    <label className="fc-form-label">{t('facilities.form.longitude')}</label>
                                    <input className="fc-form-input" type="number" step="0.0001" placeholder="74.5698" />
                                </div>
                                <div className="fc-form-group">
                                    <label className="fc-form-label">{t('facilities.form.capacity')}</label>
                                    <input className="fc-form-input" type="number" placeholder="5000" />
                                </div>
                                <div className="fc-form-group">
                                    <label className="fc-form-label">{t('facilities.form.area')}</label>
                                    <input className="fc-form-input" type="number" placeholder="10000" />
                                </div>
                                <div className="fc-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="fc-form-label">{t('facilities.form.owner')}</label>
                                    <input className="fc-form-input" placeholder="ГАФКиС КР" />
                                </div>
                                <div className="fc-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="fc-form-label">{t('facilities.form.equipment')}</label>
                                    <input className="fc-form-input" placeholder="трибуны, раздевалки, медпункт, парковка, освещение" />
                                </div>
                            </div>
                        </div>
                        <div className="fc-modal__footer">
                            <button className="fc-btn fc-btn--secondary" onClick={() => setShowAdd(false)}>{t('common.cancel')}</button>
                            <button className="fc-btn fc-btn--primary" onClick={() => { toast('Объект добавлен (демо)'); setShowAdd(false) }}>{t('common.save')}</button>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    )
}
