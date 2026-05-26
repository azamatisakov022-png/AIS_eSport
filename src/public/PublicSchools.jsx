import { useState, useMemo, useEffect } from 'react'
import { useScrollReveal, useAnimatedCounter, useCardTilt } from './useDesignEffects'
import PublicPagination from './components/PublicPagination'
import PublicSelect from './components/PublicSelect'

import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import KyrgyzstanMap from '../components/KyrgyzstanMap'
import PublicHero, { PublicHeroCounter } from './components/PublicHero'

/* ── Demo data ── */
const SCHOOLS_DATA = [
    { id: 1, name: 'РДЮСШ олимпийского резерва', city: 'г. Бишкек', region: 'Бишкек', sports: ['Борьба', 'Бокс', 'Дзюдо', 'Тхэквондо'], students: 430, coaches: 55, lat: 42.87, lng: 74.59, type: 'rdyush' },
    { id: 2, name: 'ДЮСШ №3', city: 'г. Ош', region: 'Ош', sports: ['Борьба', 'Лёгкая атлетика', 'Плавание'], students: 280, coaches: 30, lat: 40.53, lng: 72.80, type: 'dyush' },
    { id: 3, name: 'ДЮСШ №1 «Кожомкул»', city: 'г. Бишкек', region: 'Бишкек', sports: ['Борьба', 'Тяжёлая атлетика'], students: 310, coaches: 28, lat: 42.88, lng: 74.62, type: 'dyush' },
    { id: 4, name: 'СДЮШОР по лёгкой атлетике', city: 'г. Бишкек', region: 'Бишкек', sports: ['Лёгкая атлетика'], students: 200, coaches: 18, lat: 42.86, lng: 74.56, type: 'sdyushor' },
    { id: 5, name: 'ДЮСШ г. Каракол', city: 'г. Каракол', region: 'Иссык-Куль', sports: ['Лыжный спорт', 'Плавание', 'Волейбол'], students: 175, coaches: 16, lat: 42.49, lng: 78.39, type: 'dyush' },
    { id: 6, name: 'РСДЮШОР по борьбе', city: 'г. Бишкек', region: 'Бишкек', sports: ['Борьба вольная', 'Борьба греко-римская'], students: 260, coaches: 22, lat: 42.85, lng: 74.61, type: 'sdyushor' },
    { id: 7, name: 'ДЮСШ г. Джалал-Абад', city: 'г. Джалал-Абад', region: 'Джалал-Абад', sports: ['Бокс', 'Тхэквондо', 'Футбол'], students: 190, coaches: 15, lat: 41.03, lng: 73.0, type: 'dyush' },
    { id: 8, name: 'ДЮСШ г. Нарын', city: 'г. Нарын', region: 'Нарын', sports: ['Борьба', 'Волейбол'], students: 120, coaches: 10, lat: 41.43, lng: 76.0, type: 'dyush' },
    { id: 9, name: 'ДЮСШ г. Талас', city: 'г. Талас', region: 'Талас', sports: ['Борьба', 'Лёгкая атлетика'], students: 95, coaches: 8, lat: 42.52, lng: 72.24, type: 'dyush' },
    { id: 10, name: 'ДЮСШ г. Баткен', city: 'г. Баткен', region: 'Баткен', sports: ['Бокс', 'Тхэквондо'], students: 85, coaches: 7, lat: 40.06, lng: 70.82, type: 'dyush' },
    { id: 11, name: 'Школа олимпийского резерва г. Ош', city: 'г. Ош', region: 'Ош', sports: ['Борьба', 'Дзюдо', 'Бокс'], students: 320, coaches: 32, lat: 40.54, lng: 72.82, type: 'rdyush' },
    { id: 12, name: 'ДЮСШ №2 по плаванию', city: 'г. Бишкек', region: 'Бишкек', sports: ['Плавание', 'Водное поло'], students: 150, coaches: 14, lat: 42.875, lng: 74.58, type: 'dyush' },
]

const TYPE_LABELS = {
    dyush: 'ДЮСШ',
    sdyushor: 'СДЮШОР',
    rdyush: 'РДЮСШ',
}

const REGIONS = ['Бишкек', 'Ош', 'Иссык-Куль', 'Джалал-Абад', 'Нарын', 'Талас', 'Баткен']
const ALL_SPORTS = [...new Set(SCHOOLS_DATA.flatMap(s => s.sports))].sort()

export default function PublicSchools() {
    const { t } = useTranslation()
    const revealCards = useScrollReveal(0.08)
    const tilt = useCardTilt(5)
    const totalStudents = SCHOOLS_DATA.reduce((a, s) => a + s.students, 0)
    const totalRegions = new Set(SCHOOLS_DATA.map(s => s.region)).size
    const cntSchools = useAnimatedCounter(SCHOOLS_DATA.length)
    const cntStudents = useAnimatedCounter(totalStudents)
    const cntRegions = useAnimatedCounter(totalRegions)
    const [searchParams, setSearchParams] = useSearchParams()
    const [fType, setFType] = useState(searchParams.get('type') || '')
    const [fRegion, setFRegion] = useState(searchParams.get('region') || '')
    const [fSport, setFSport] = useState(searchParams.get('sport') || '')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const params = new URLSearchParams()
        if (fType) params.set('type', fType)
        if (fRegion) params.set('region', fRegion)
        if (fSport) params.set('sport', fSport)
        setSearchParams(params, { replace: true })

        const t = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(t)
    }, [fType, fRegion, fSport, setSearchParams])

    const filtered = useMemo(() => {
        return SCHOOLS_DATA.filter(s => {
            if (fType && s.type !== fType) return false
            if (fRegion && s.region !== fRegion) return false
            if (fSport && !s.sports.includes(fSport)) return false
            return true
        })
    }, [fType, fRegion, fSport])



    const mapMarkers = filtered.map(s => ({
        lat: s.lat, lng: s.lng, name: s.name, type: 'dyush',
        typeName: TYPE_LABELS[s.type] || 'Спортшкола',
        address: s.city,
        capacity: `${s.students} ${t('public.students')}`,
        extra: s.sports.slice(0, 3).join(', '),
    }))

    return (
        <div className="pub-section">
            {/* Hero */}
            <PublicHero
                title={t('public.schoolsTitle')}
                description="Республиканские и региональные спортивные школы, ДЮСШ и СДЮШОР, подготовка спортивного резерва Кыргызской Республики."
                variant="emerald"
                layoutMode="abstract"
            >
                <PublicHeroCounter animRef={cntSchools.ref} value={cntSchools.value} label={t('public.schoolsTotal')} />
                <PublicHeroCounter animRef={cntStudents.ref} value={cntStudents.value.toLocaleString('ru-RU')} label={t('public.studentsTotal')} />
                <PublicHeroCounter animRef={cntRegions.ref} value={cntRegions.value} label={t('public.coachesTotal')} />
            </PublicHero>

            {/* Map */}
            <div className="pub-container" style={{ marginBottom: 28 }}>
                <div style={st.mapWrap}>
                    <KyrgyzstanMap markers={mapMarkers} height={450} showLegend={false} fitToMarkers />
                </div>
            </div>

            <div className="pub-container" style={{ paddingBottom: 48 }}>
                {/* Underline tabs for type */}
                <div className="sch-tabs">
                    <button className={fType === '' ? 'sch-tab sch-tab-active' : 'sch-tab'} onClick={() => setFType('')}>
                        {t('public.allSchoolTypes')} <span className="sch-tab-count">{SCHOOLS_DATA.length}</span>
                    </button>
                    {Object.entries(TYPE_LABELS).map(([k, v]) => {
                        const cnt = SCHOOLS_DATA.filter(s => s.type === k).length
                        return (
                            <button key={k} className={fType === k ? 'sch-tab sch-tab-active' : 'sch-tab'} onClick={() => setFType(k)}>
                                {v} <span className="sch-tab-count">{cnt}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Secondary filters */}
                <div style={st.filtersRow}>
                    <PublicSelect style={{...st.select, width: 200}} value={fRegion} onChange={setFRegion} placeholder="Все регионы" options={[{value:'', label:'Все регионы'}, ...REGIONS.map(r => ({value: r, label: r}))]} />
                    <PublicSelect style={{...st.select, width: 220}} value={fSport} onChange={setFSport} placeholder="Все виды спорта" options={[{value:'', label:'Все виды спорта'}, ...ALL_SPORTS.map(s => ({value: s, label: s}))]} />
                    {(fType || fRegion || fSport) && (
                        <button style={st.resetBtn} onClick={() => { setFType(''); setFRegion(''); setFSport('') }}>Сбросить</button>
                    )}
                    <span style={st.resultsCount}>Найдено: {filtered.length}</span>
                </div>

                {/* Cards */}
                {loading ? (
                    <div className="sch-grid">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="sch-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <div className="skeleton-box" style={{ width: 60, height: 22, borderRadius: 8 }} />
                                    <div className="skeleton-box" style={{ width: 80, height: 22, borderRadius: 8 }} />
                                </div>
                                <div className="skeleton-box skeleton-text" style={{ width: '80%', height: 18 }} />
                                <div className="skeleton-box skeleton-text" style={{ width: '50%', height: 14 }} />
                                <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                                    <div className="skeleton-box" style={{ width: 50, height: 18, borderRadius: 8 }} />
                                    <div className="skeleton-box" style={{ width: 60, height: 18, borderRadius: 8 }} />
                                </div>
                                <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                                    <div className="skeleton-box" style={{ width: 120, height: 16, borderRadius: 4 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={st.empty}>
                        <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--theme-text-main)', marginTop: 12 }}>Школы не найдены</div>
                        <div style={{ fontSize: 13, color: 'var(--theme-text-secondary)', marginTop: 4 }}>Попробуйте изменить параметры фильтрации</div>
                    </div>
                ) : (
                    <div ref={revealCards} className="sch-grid scroll-reveal">
                        {filtered.map((s, idx) => (
                            <div key={s.id} className="pub-card stagger-item card-tilt-3d" style={{ '--i': idx }} {...tilt}>
                                <div style={st.cardTop}>
                                    <span style={st.typeBadge}>{TYPE_LABELS[s.type]}</span>
                                    <span style={st.regionBadge}>{s.region}</span>
                                </div>

                                <h3 style={st.cardName}>{s.name}</h3>
                                <div style={st.cardCity}>{s.city}</div>

                                <div style={st.sportsTags}>
                                    {s.sports.map(sp => (
                                        <span key={sp} style={st.sportTag}>{sp}</span>
                                    ))}
                                </div>

                                <div style={st.cardStats}>
                                    <span style={st.cardStatVal}>{s.students}</span>
                                    <span style={st.cardStatLbl}> {t('public.students')}</span>
                                    <span style={st.cardStatDot}>·</span>
                                    <span style={st.cardStatVal}>{s.coaches}</span>
                                    <span style={st.cardStatLbl}> тренеров</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .sch-tabs { display: flex; border-bottom: 1px solid #E8EBF0; margin-bottom: 20px; }
                .sch-tab {
                    padding: 10px 16px; font-size: 13px; font-weight: 400;
                    color: #86868B; border: none; background: none;
                    border-bottom: 2px solid transparent; margin-bottom: -1px;
                    font-family: inherit; cursor: pointer; transition: all 0.15s; white-space: nowrap;
                }
                .sch-tab:hover { color: #1D1D1F; }
                .sch-tab-active { font-weight: 500; color: #1D1D1F; border-bottom-color: #1D1D1F; }
                .sch-tab-count { font-size: 11px; color: #86868B; opacity: 0.6; margin-left: 2px; }
                .sch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
                @media (max-width: 1024px) { .sch-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 768px) {
                    .sch-grid { grid-template-columns: 1fr; }
                    .sch-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
                    .sch-tab { flex-shrink: 0; }
                }
            `}</style>
        </div>
    )
}

/* ── Styles ── */
const st = {
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
    heroCounters: { display: 'flex', gap: 16 },
    heroCounter: {
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 12, padding: '14px 22px', textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    heroCounterVal: { display: 'block', fontSize: 22, fontWeight: 500, color: '#fff' },
    heroCounterLbl: { display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },

    mapWrap: {
        background: 'var(--theme-bg-card)', borderRadius: 16, border: '1px solid var(--theme-border)',
        overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },

    filtersRow: {
        display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center',
    },
    select: {
        padding: '10px 14px', border: '1px solid var(--theme-border)', borderRadius: 12,
        fontSize: 13, fontFamily: 'inherit', color: 'var(--theme-text-main)', outline: 'none',
        background: 'var(--theme-bg-card)', cursor: 'pointer',
    },
    resetBtn: {
        padding: '10px 14px', border: '1px solid var(--theme-border)', borderRadius: 12,
        fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
        background: 'var(--theme-bg-card)', color: 'var(--theme-text-secondary)', cursor: 'pointer',
    },
    resultsCount: {
        marginLeft: 'auto', fontSize: 13, color: 'var(--theme-text-secondary)', fontWeight: 500,
    },

    empty: {
        textAlign: 'center', padding: '60px 20px',
        background: 'var(--theme-bg-card)', border: '1px solid var(--theme-border)', borderRadius: 16,
    },

    cardTop: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    typeBadge: {
        display: 'inline-block', padding: '3px 10px', borderRadius: 8,
        fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
        background: 'rgba(27, 58, 107, 0.15)', color: '#8AB4F8',
    },
    regionBadge: {
        display: 'inline-block', padding: '2px 8px', borderRadius: 8,
        fontSize: 11, background: 'rgba(110, 110, 115, 0.15)', color: 'var(--theme-text-secondary)',
    },
    cardName: {
        fontSize: 15, fontWeight: 500, color: 'var(--theme-text-main)', lineHeight: 1.4, margin: 0,
    },
    cardCity: {
        fontSize: 12, color: 'var(--theme-text-secondary)',
    },
    sportsTags: {
        display: 'flex', flexWrap: 'wrap', gap: 4,
    },
    sportTag: {
        display: 'inline-block', padding: '2px 8px', borderRadius: 8,
        fontSize: 11, background: 'rgba(110, 110, 115, 0.15)', color: 'var(--theme-text-secondary)',
    },
    cardStats: {
        display: 'flex', alignItems: 'baseline', marginTop: 'auto', paddingTop: 8,
    },
    cardStatVal: {
        fontSize: 13, fontWeight: 500, color: 'var(--theme-text-main)',
    },
    cardStatLbl: {
        fontSize: 11, color: 'var(--theme-text-secondary)',
    },
    cardStatDot: {
        fontSize: 12, color: 'var(--theme-text-secondary)', margin: '0 6px',
    },
}
