import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useScrollReveal, useAnimatedCounter, useCardTilt } from './useDesignEffects'
import PublicHero, { PublicHeroCounter } from './components/PublicHero'
import PublicSelect from './components/PublicSelect'
import { FACILITIES_DATA } from '../pages/Facilities'
import KyrgyzstanMap from '../components/KyrgyzstanMap'

const TYPE_LABEL_KEYS = {
    stadium: 'public.facTypeStadium', pool: 'public.facTypePool', gym: 'public.facTypeGym',
    field: 'public.facTypeField', fitness: 'public.facTypeFitness',
    dyush: 'public.facTypeDyush', uor: 'public.facTypeUor', manege: 'public.facTypeManege', arena: 'public.facTypeArena',
}

const STATUS_LABEL_KEYS = {
    active: { labelKey: 'public.facStatusActive', color: '#2E7D32', dot: '#4CAF50' },
    reconstruction: { labelKey: 'public.facStatusReconstruction', color: '#E65100', dot: '#FF9800' },
    closed: { labelKey: 'public.facStatusClosed', color: '#dc2626', dot: '#ef4444' },
}

const TYPE_OPTIONS = [
    { value: '', labelKey: 'public.allFacilityTypes' },
    { value: 'stadium', labelKey: 'public.facTypeStadium' },
    { value: 'arena', labelKey: 'public.facTypeArena' },
    { value: 'pool', labelKey: 'public.facTypePool' },
    { value: 'gym', labelKey: 'public.facTypeGym' },
    { value: 'dyush', labelKey: 'public.facTypeDyush' },
    { value: 'uor', labelKey: 'public.facTypeUor' },
    { value: 'manege', labelKey: 'public.facTypeManege' },
]

const REGIONS = ['', 'Бишкек', 'Чуйская', 'Ош', 'Иссык-Кульская', 'Джалал-Абадская', 'Нарынская', 'Баткенская', 'Таласская']

/* SVG icons per facility type */
const FacilityIcon = ({ type }) => {
    const paths = {
        stadium: <><path d="M2 17L12 22L22 17" /><path d="M2 12L12 17L22 12" /><path d="M12 2L2 7L12 12L22 7L12 2Z" /></>,
        arena: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M12 7V3" /><path d="M7 7V5" /><path d="M17 7V5" /></>,
        pool: <><path d="M2 12C4 10 6 14 8 12C10 10 12 14 14 12C16 10 18 14 20 12C22 10 22 12 22 12" /><path d="M2 17C4 15 6 19 8 17C10 15 12 19 14 17C16 15 18 19 20 17C22 15 22 17 22 17" /></>,
        gym: <><rect x="1" y="10" width="4" height="4" rx="1" /><rect x="19" y="10" width="4" height="4" rx="1" /><line x1="5" y1="12" x2="19" y2="12" /><rect x="6" y="8" width="3" height="8" rx="1" /><rect x="15" y="8" width="3" height="8" rx="1" /></>,
        default: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
    }
    return (
        <div style={s.iconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {paths[type] || paths.default}
            </svg>
        </div>
    )
}

const PinIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
)

const s = {
    hero: { background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)', borderRadius: '0 0 20px 20px', padding: '36px 40px 28px', marginBottom: 28, color: '#fff' },
    heroTitle: { fontSize: 28, fontWeight: 500, margin: '0 0 8px' },
    heroDesc: { fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 },
    heroCounter: { display: 'inline-block', marginTop: 14, padding: '6px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 14, fontWeight: 500 },

    filtersRow: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' },
    select: { padding: '10px 14px', border: '1px solid var(--theme-border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', background: 'var(--theme-bg-card)', cursor: 'pointer', outline: 'none', minWidth: 160, color: 'var(--theme-text-main)' },
    resetBtn: { padding: '10px 16px', border: '1px solid var(--theme-border)', borderRadius: 10, background: 'var(--theme-bg-card)', fontSize: 12, fontWeight: 500, color: 'var(--theme-text-secondary)', cursor: 'pointer', fontFamily: 'inherit' },

    mapWrap: { borderRadius: 14, overflow: 'hidden', border: '1px solid var(--theme-border)', marginBottom: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },

    iconWrap: {
        width: 40, height: 40, borderRadius: 10, background: 'var(--theme-bg-panel)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    cardHeader: { display: 'flex', gap: 12, alignItems: 'flex-start' },
    cardHeaderText: { flex: 1 },
    cardName: { fontSize: 15, fontWeight: 500, color: 'var(--theme-text-main)', margin: 0, lineHeight: 1.3 },
    cardTypeBadge: { display: 'inline-block', padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'var(--theme-bg-panel)', color: '#6E6E73', marginLeft: 8, verticalAlign: 'middle' },
    cardAddr: { fontSize: 12, color: 'var(--theme-text-secondary)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 },
    cardCharacteristics: { fontSize: 13, fontWeight: 500, color: 'var(--theme-text-main)', marginTop: 10 },
    cardStatus: (status) => ({
        display: 'flex', alignItems: 'center', gap: 6, marginTop: 12,
        fontSize: 12, color: STATUS_LABEL_KEYS[status]?.color || '#86868B',
    }),
    statusDot: (status) => ({
        width: 8, height: 8, borderRadius: '50%',
        background: STATUS_LABEL_KEYS[status]?.dot || '#ccc', flexShrink: 0,
    }),
}

export default function PublicFacilities() {
    const { t } = useTranslation()
    const revealCards = useScrollReveal(0.08)
    const tilt = useCardTilt(5)
    const cntTotal = useAnimatedCounter(FACILITIES_DATA.length)
    const [searchParams, setSearchParams] = useSearchParams()
    const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '')
    const [regionFilter, setRegionFilter] = useState(searchParams.get('region') || '')

    useEffect(() => {
        const params = new URLSearchParams()
        if (typeFilter) params.set('type', typeFilter)
        if (regionFilter) params.set('region', regionFilter)
        setSearchParams(params, { replace: true })
    }, [typeFilter, regionFilter, setSearchParams])

    const filtered = FACILITIES_DATA.filter(f => {
        if (typeFilter && f.type !== typeFilter) return false
        if (regionFilter && f.region !== regionFilter) return false
        return true
    })

    const mapMarkers = filtered.map(f => ({
        lat: f.lat, lng: f.lng, name: f.name, type: f.type,
        typeName: t(TYPE_LABEL_KEYS[f.type]) || f.type,
        address: `${f.address}, ${f.city}`,
        capacity: `${t('public.capacity')}: ${f.capacity.toLocaleString()}`,
    }))

    return (
        <>
            {/* Hero */}
            <PublicHero title={t('public.facilitiesTitle')} description={t('public.facilitiesHeroDesc')} variant="emerald" layoutMode="abstract">
                <PublicHeroCounter animRef={cntTotal.ref} value={cntTotal.value} label={t('public.facilitiesTotal')} />
            </PublicHero>

            <div className="pub-section">
                <div className="pub-container" style={{ paddingBottom: 40 }}>
                    {/* Underline tabs for type */}
            <div className="fac-tabs">
                <button className={typeFilter === '' ? 'fac-tab fac-tab-active' : 'fac-tab'} onClick={() => setTypeFilter('')}>
                    {t('public.allTab')} <span className="fac-tab-count">{FACILITIES_DATA.length}</span>
                </button>
                {TYPE_OPTIONS.slice(1).map(o => {
                    const cnt = FACILITIES_DATA.filter(f => f.type === o.value).length
                    return (
                        <button key={o.value} className={typeFilter === o.value ? 'fac-tab fac-tab-active' : 'fac-tab'} onClick={() => setTypeFilter(o.value)}>
                            {t(o.labelKey)} <span className="fac-tab-count">{cnt}</span>
                        </button>
                    )
                })}
            </div>

            {/* Secondary filters */}
            <div style={s.filtersRow}>
                <PublicSelect style={{...s.select, width: 200}} value={regionFilter} onChange={setRegionFilter} placeholder={t('public.allRegions')} options={[{value:'', label: t('public.allRegions')}, ...REGIONS.slice(1).map(r => ({value: r, label: r}))]} />
                {(typeFilter || regionFilter) && (
                    <button style={s.resetBtn} onClick={() => { setTypeFilter(''); setRegionFilter('') }}>{t('public.reset')}</button>
                )}
            </div>

            {/* Map */}
            <div style={s.mapWrap}>
                <KyrgyzstanMap markers={mapMarkers} height={550} fitToMarkers />
            </div>

            {/* Cards */}
            <div ref={revealCards} className="fac-grid scroll-reveal">
                {filtered.map((f, idx) => (
                    <div key={f.id} className="pub-card stagger-item card-tilt-3d" style={{ '--i': idx }} {...tilt}>
                        <div style={s.cardHeader}>
                            <FacilityIcon type={f.type} />
                            <div style={s.cardHeaderText}>
                                <div style={s.cardName}>
                                    {f.name}
                                    <span style={s.cardTypeBadge}>{t(TYPE_LABEL_KEYS[f.type])}</span>
                                </div>
                            </div>
                        </div>
                        <div style={s.cardAddr}>
                            <PinIcon />
                            <span>{f.address}, {f.city}, {f.region}</span>
                        </div>
                        <div style={s.cardCharacteristics}>
                            {f.capacity.toLocaleString('ru-RU')} {t('public.seatsUnit')} · {f.area.toLocaleString('ru-RU')} {t('public.sqmUnit')}
                        </div>
                        <div style={s.cardStatus(f.status)}>
                            <span style={s.statusDot(f.status)} />
                            {t(STATUS_LABEL_KEYS[f.status].labelKey)}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--theme-text-secondary)', fontSize: 14 }}>
                    {t('public.noFacilitiesFound')}
                </div>
            )}

            <style>{`
                .fac-tabs { display: flex; border-bottom: 1px solid #E8EBF0; margin-bottom: 20px; }
                .fac-tab {
                    padding: 10px 16px; font-size: 13px; font-weight: 400;
                    color: #86868B; border: none; background: none;
                    border-bottom: 2px solid transparent; margin-bottom: -1px;
                    font-family: inherit; cursor: pointer; transition: all 0.15s; white-space: nowrap;
                }
                .fac-tab:hover { color: #1D1D1F; }
                .fac-tab-active { font-weight: 500; color: #1D1D1F; border-bottom-color: #1D1D1F; }
                .fac-tab-count { font-size: 11px; color: #86868B; opacity: 0.6; margin-left: 2px; }
                .fac-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
                @media (max-width: 1024px) { .fac-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 768px) {
                    .fac-grid { grid-template-columns: 1fr; }
                    .fac-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
                    .fac-tab { flex-shrink: 0; }
                }
            `}</style>
                </div>
            </div>
        </>
    )
}
