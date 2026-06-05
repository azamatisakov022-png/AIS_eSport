import { useState, useMemo } from 'react'
import PublicHero, { PublicHeroCounter } from './components/PublicHero'
import PublicSelect from './components/PublicSelect'
import { useTranslation } from 'react-i18next'
import { useScrollReveal, useAnimatedCounter, useCardTilt } from './useDesignEffects'
import { ORGS_DATA } from '../pages/Organizations'
import KyrgyzstanMap from '../components/KyrgyzstanMap'

/* Region center coordinates for placing markers */
/* Region centers - chosen to be on land near the main city of each region,
   NOT geometric centroid of the region polygon (which can fall in mountains/lakes). */
const REGION_COORDS = {
    'Бишкек':      [42.8746, 74.5698],   // City center
    'Ош':          [40.5283, 72.7985],   // City center
    'Чуй':         [42.8390, 75.2939],   // Tokmok (Chuy region admin center area)
    'Нарын':       [41.4287, 75.9911],   // Naryn city
    'Иссык-Куль':  [42.4907, 78.3936],   // Karakol (regional centre - on land, NOT the lake)
    'Джалал-Абад': [40.9335, 73.0026],   // Jalal-Abad city
    'Баткен':      [40.0615, 70.8199],   // Batken city
    'Талас':       [42.5228, 72.2425],   // Talas city
    'Ош (обл.)':   [40.2500, 72.3000],   // Osh oblast (south of city)
}

const TYPES_MAP = {
    federation:  { labelKey: 'public.orgTypeFederation' },
    school:      { labelKey: 'public.orgTypeSchool' },
    club:        { labelKey: 'public.orgTypeClub' },
    association: { labelKey: 'public.orgTypeAssociation' },
    league:      { labelKey: 'public.orgTypeLeague' },
}

const REGIONS = ['Бишкек','Ош','Чуй','Нарын','Иссык-Куль','Джалал-Абад','Баткен','Талас']
const SPORTS = ['Бокс','Дзюдо','Борьба','Тхэквондо','Футбол','Волейбол','Плавание','Лёгкая атлетика','Стрельба','Многопрофильная']

export default function PublicOrganizations() {
    const { t } = useTranslation()
    const revealCards = useScrollReveal(0.08)
    const tilt = useCardTilt(5)
    const cntOrgs = useAnimatedCounter(ORGS_DATA.length)
    const [fType, setFType] = useState('')
    const [fSport, setFSport] = useState('')
    const [fRegion, setFRegion] = useState('')

    const filtered = useMemo(() => {
        return ORGS_DATA.filter(o => {
            if (fType && o.type !== fType) return false
            if (fSport && o.sport !== fSport) return false
            if (fRegion && o.region !== fRegion) return false
            return true
        })
    }, [fType, fSport, fRegion])

    const accredStyle = (status) => {
        if (status === 'Аккредитована') return { background: 'rgba(46, 125, 50, 0.15)', color: '#34C759' }
        if (status === 'На рассмотрении') return { background: 'rgba(230, 81, 0, 0.15)', color: '#FF9800' }
        return { background: 'rgba(220, 38, 38, 0.15)', color: '#EF5350' }
    }

    return (
        <>
            {/* Hero */}
            <PublicHero title={t('public.organizationsTitle')} description={t('public.organizationsHeroDesc')} variant="violet" layoutMode="abstract">
                <PublicHeroCounter animRef={cntOrgs.ref} value={cntOrgs.value} label={t('public.organizationsTotal')} />
                <PublicHeroCounter animRef={{current: null}} value={ORGS_DATA.filter(o => o.accreditation === 'Аккредитована').length} label={t('public.orgAccredited')} />
                <PublicHeroCounter animRef={{current: null}} value={new Set(ORGS_DATA.map(o => o.region)).size} label={t('public.orgRegions')} />
            </PublicHero>

            <div className="pub-section">
                {/* Map */}
            <div className="pub-container" style={{ marginBottom: 28 }}>
                <div style={{ background: 'var(--theme-bg-card)', borderRadius: 16, border: '1px solid #d2d2d7', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <KyrgyzstanMap
                        height={400}
                        showLegend={false}
                        fitToMarkers
                        markers={ORGS_DATA.map((o, i) => {
                            const coords = REGION_COORDS[o.region] || [41.2, 74.7]
                            // Slightly offset markers in same region so they don't overlap
                            const offset = i * 0.04
                            return {
                                lat: coords[0] + (offset % 0.12) - 0.04,
                                lng: coords[1] + ((offset * 1.5) % 0.15) - 0.05,
                                name: o.name,
                                type: o.type,
                                typeName: t(TYPES_MAP[o.type]?.labelKey) || o.type,
                                address: o.address,
                                phone: o.phone,
                                email: o.email,
                                website: o.website,
                                capacity: `${o.athletes} ${t('public.orgAthletes')}`,
                            }
                        })}
                    />
                </div>
            </div>

            <div className="pub-container">
                {/* Underline tabs for type */}
                <div className="org-tabs">
                    <button className={fType === '' ? 'org-tab org-tab-active' : 'org-tab'} onClick={() => setFType('')}>
                        {t('public.allTab')} <span className="org-tab-count">{ORGS_DATA.length}</span>
                    </button>
                    {Object.entries(TYPES_MAP).map(([k, v]) => {
                        const cnt = ORGS_DATA.filter(o => o.type === k).length
                        return (
                            <button key={k} className={fType === k ? 'org-tab org-tab-active' : 'org-tab'} onClick={() => setFType(k)}>
                                {t(v.labelKey)} <span className="org-tab-count">{cnt}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Secondary filters */}
                <div style={s.filtersRow}>
                    <PublicSelect style={{...s.filterSelect, width: 220}} value={fSport} onChange={setFSport} placeholder={t('public.allSports')} options={[{value:'', label: t('public.allSports')}, ...SPORTS.map(sp => ({value: sp, label: sp}))]} />
                    <PublicSelect style={{...s.filterSelect, width: 200}} value={fRegion} onChange={setFRegion} placeholder={t('public.allRegions')} options={[{value:'', label: t('public.allRegions')}, ...REGIONS.map(r => ({value: r, label: r}))]} />
                    {(fType || fSport || fRegion) && (
                        <button style={s.filterReset} onClick={() => { setFType(''); setFSport(''); setFRegion('') }}>{t('public.reset')}</button>
                    )}
                </div>

                {/* Cards */}
                {filtered.length === 0 ? (
                    <div style={s.empty}>
                        <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--theme-text-main)', marginTop: 12 }}>{t('public.orgNotFound')}</div>
                        <div style={{ fontSize: 13, color: 'var(--theme-text-secondary)', marginTop: 4 }}>{t('public.orgNotFoundHint')}</div>
                    </div>
                ) : (
                    <div ref={revealCards} className="org-grid scroll-reveal">
                        {filtered.map((o, idx) => {
                            return (
                                <div key={o.id} className="pub-card stagger-item card-tilt-3d" style={{ '--i': idx }} {...tilt}>
                                    <div style={s.cardTop}>
                                        <span style={{ ...s.accredBadge, ...accredStyle(o.accreditation) }}>{o.accreditation}</span>
                                        <span style={s.typeLbl}>{t(TYPES_MAP[o.type]?.labelKey)}</span>
                                    </div>

                                    <h3 style={s.cardName}>{o.name}</h3>
                                    <div style={s.cardMeta}>{o.sport} · {o.region} · {t(TYPES_MAP[o.type]?.labelKey)}</div>

                                    <div style={s.cardHead}>
                                        <span style={s.cardHeadAvatar}>{o.head.charAt(0)}</span>
                                        <div>
                                            <div style={s.cardHeadName}>{o.head}</div>
                                            <div style={s.cardHeadLabel}>{o.headTitle}</div>
                                        </div>
                                    </div>

                                    <div style={s.cardStats}>
                                        <div style={s.cardStat}>
                                            <span style={s.cardStatVal}>{o.athletes}</span>
                                            <span style={s.cardStatLbl}> {t('public.orgAthletes')}</span>
                                        </div>
                                        <span style={s.cardStatDot}>·</span>
                                        <div style={s.cardStat}>
                                            <span style={s.cardStatVal}>{o.coaches}</span>
                                            <span style={s.cardStatLbl}> {t('public.orgCoaches')}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <style>{`
                .org-tabs { display: flex; border-bottom: 1px solid #E8EBF0; margin-bottom: 20px; }
                .org-tab {
                    padding: 10px 16px; font-size: 13px; font-weight: 400;
                    color: #86868B; border: none; background: none;
                    border-bottom: 2px solid transparent; margin-bottom: -1px;
                    font-family: inherit; cursor: pointer; transition: all 0.15s; white-space: nowrap;
                }
                .org-tab:hover { color: #1D1D1F; }
                .org-tab-active { font-weight: 500; color: #1D1D1F; border-bottom-color: #1D1D1F; }
                .org-tab-count { font-size: 11px; color: #86868B; opacity: 0.6; margin-left: 2px; }
                .org-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
                @media (max-width: 1024px) { .org-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 768px) {
                    .org-grid { grid-template-columns: 1fr; }
                    .org-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
                    .org-tab { flex-shrink: 0; }
                }
            `}</style>
        </div>
        </>
    )
}

const s = {
    hero: {
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        padding: '36px 0 28px', marginBottom: 28, borderRadius: '0 0 20px 20px',
    },
    heroInner: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 24,
    },
    heroTitle: {
        fontSize: 28, fontWeight: 500, color: '#fff', margin: '0 0 8px',
    },
    heroDesc: {
        fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 520, lineHeight: 1.6, margin: 0,
    },
    heroCounters: {
        display: 'flex', gap: 16,
    },
    heroCounter: {
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 12, padding: '14px 22px', textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    heroCounterVal: {
        display: 'block', fontSize: 22, fontWeight: 500, color: '#fff',
    },
    heroCounterLbl: {
        display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2,
    },

    filtersRow: {
        display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center',
    },
    filterSelect: {
        padding: '10px 14px', border: '1px solid var(--theme-border)', borderRadius: 12,
        fontSize: 13, fontFamily: 'inherit', color: 'var(--theme-text-main)', outline: 'none',
        background: 'var(--theme-bg-card)', cursor: 'pointer',
    },
    filterReset: {
        padding: '10px 14px', border: '1px solid var(--theme-border)', borderRadius: 12,
        fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
        background: 'var(--theme-bg-card)', color: 'var(--theme-text-secondary)', cursor: 'pointer',
    },

    empty: {
        textAlign: 'center', padding: '60px 20px',
        background: 'var(--theme-bg-card)', border: '1px solid var(--theme-border)', borderRadius: 16,
    },

    cardTop: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    accredBadge: {
        display: 'inline-block', padding: '3px 10px', borderRadius: 12,
        fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
    },
    typeLbl: {
        fontSize: 11, color: 'var(--theme-text-secondary)',
    },
    cardName: {
        fontSize: 15, fontWeight: 500, color: 'var(--theme-text-main)', lineHeight: 1.4, margin: 0,
    },
    cardMeta: {
        fontSize: 12, color: 'var(--theme-text-secondary)',
    },
    cardHead: {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: 10, background: 'var(--theme-bg-panel)', borderRadius: 10,
    },
    cardHeadAvatar: {
        width: 30, height: 30, borderRadius: '50%',
        background: 'rgba(110, 110, 115, 0.15)', color: 'var(--theme-text-main)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 500, flexShrink: 0,
    },
    cardHeadName: {
        fontSize: 12, fontWeight: 500, color: 'var(--theme-text-main)',
    },
    cardHeadLabel: {
        fontSize: 11, color: '#AEAEB2',
    },
    cardStats: {
        display: 'flex', alignItems: 'baseline', gap: 4,
    },
    cardStat: {
        display: 'flex', alignItems: 'baseline',
    },
    cardStatVal: {
        fontSize: 18, fontWeight: 500, color: 'var(--theme-text-main)',
    },
    cardStatLbl: {
        fontSize: 11, color: 'var(--theme-text-secondary)',
    },
    cardStatDot: {
        fontSize: 12, color: 'var(--theme-text-secondary)', margin: '0 6px',
    },
}
