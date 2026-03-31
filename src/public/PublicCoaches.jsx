import { useState, useMemo, useEffect } from 'react'
import { useScrollReveal, useAnimatedCounter, useCardTilt } from './useDesignEffects'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import PublicHero, { PublicHeroCounter } from './components/PublicHero'
import { PublicFiltersContainer, PublicFilterInput, PublicFilterSelect } from './components/PublicFilters'
import PublicPagination from './components/PublicPagination'

const SPORTS = ['Бокс', 'Борьба', 'Дзюдо', 'Футбол', 'Плавание', 'Лёгкая атлетика', 'Каратэ', 'Тхэквондо', 'Гимнастика', 'Шахматы']
const REGIONS = ['Бишкек', 'Ош', 'Чуйская', 'Иссык-Кульская', 'Джалал-Абадская', 'Нарынская', 'Баткенская', 'Таласская', 'Ошская']

export const COACHES_DATA = [
    { id: 1, name: 'Асанов Бакыт Маратович', sport: 'Дзюдо', region: 'Бишкек', cert: 'СВ-КР-2024-00142', status: 'active', date: '2024-03-15', org: 'СДЮСШОР №3 г. Бишкек' },
    { id: 2, name: 'Кулматова Айгерим Сагынбековна', sport: 'Лёгкая атлетика', region: 'Бишкек', cert: 'СВ-КР-2024-00198', status: 'active', date: '2024-05-20', org: 'ДЮСШ «Олимп»' },
    { id: 3, name: 'Джумабаев Эрлан Калыкович', sport: 'Бокс', region: 'Ош', cert: 'СВ-КР-2023-00087', status: 'active', date: '2023-11-10', org: 'Ошская СДЮСШОР' },
    { id: 4, name: 'Токтогулова Назира Асылбековна', sport: 'Плавание', region: 'Иссык-Кульская', cert: 'СВ-КР-2024-00215', status: 'active', date: '2024-06-01', org: 'СК «Иссык-Куль»' },
    { id: 5, name: 'Бейшеналиев Данияр Кубатович', sport: 'Борьба', region: 'Нарынская', cert: 'СВ-КР-2023-00054', status: 'active', date: '2023-08-22', org: 'ДЮСШ Нарынской области' },
    { id: 6, name: 'Абдылдаев Нурбек Турдумаматович', sport: 'Тхэквондо', region: 'Джалал-Абадская', cert: 'СВ-КР-2022-00312', status: 'annulled', date: '2022-04-18', org: 'Федерация тхэквондо КР' },
    { id: 7, name: 'Сатыбалдиева Мээрим Акжолтоевна', sport: 'Каратэ', region: 'Бишкек', cert: 'СВ-КР-2025-00018', status: 'active', date: '2025-01-12', org: 'СДЮСШОР «Кубат»' },
    { id: 8, name: 'Ормонов Алмаз Кайратович', sport: 'Футбол', region: 'Чуйская', cert: 'СВ-КР-2024-00176', status: 'active', date: '2024-04-30', org: 'ФК «Дордой» Академия' },
    { id: 9, name: 'Жумагулов Тимур Эркинович', sport: 'Шахматы', region: 'Бишкек', cert: 'СВ-КР-2023-00101', status: 'annulled', date: '2023-12-05', org: 'Шахматный клуб «Стратегия»' },
    { id: 10, name: 'Касымова Жылдыз Болотбековна', sport: 'Гимнастика', region: 'Бишкек', cert: 'СВ-КР-2024-00233', status: 'active', date: '2024-07-15', org: 'СДЮСШОР по гимнастике' },
    { id: 11, name: 'Турдалиев Марат Сапарбекович', sport: 'Дзюдо', region: 'Ошская', cert: 'СВ-КР-2024-00089', status: 'active', date: '2024-02-28', org: 'ДЮСШ №5 г. Ош' },
    { id: 12, name: 'Эсенгулова Айчурок Таалайбековна', sport: 'Плавание', region: 'Бишкек', cert: 'СВ-КР-2025-00031', status: 'active', date: '2025-02-10', org: 'Водный центр «Дельфин»' },
    { id: 13, name: 'Сыдыков Кубанычбек Жолдошевич', sport: 'Бокс', region: 'Баткенская', cert: 'СВ-КР-2023-00145', status: 'active', date: '2023-10-01', org: 'ДЮСШ Баткенской области' },
    { id: 14, name: 'Маматова Бегимай Ташболотовна', sport: 'Борьба', region: 'Таласская', cert: 'СВ-КР-2022-00278', status: 'annulled', date: '2022-09-14', org: 'Таласская ДЮСШ' },
    { id: 15, name: 'Алиев Руслан Бакытович', sport: 'Футбол', region: 'Бишкек', cert: 'СВ-КР-2025-00044', status: 'active', date: '2025-03-01', org: 'ФК «Абдыш-Ата» Академия' },
]

const PER_PAGE = 12

function getInitials(name) {
    const parts = name.split(' ')
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('ru-RU')
}

export default function PublicCoaches() {
    const { t } = useTranslation()
    const activeCount = COACHES_DATA.filter(c => c.status === 'active').length
    const revealCards = useScrollReveal(0.08)
    const tilt = useCardTilt(5)
    const counterActive = useAnimatedCounter(activeCount)
    const [searchParams, setSearchParams] = useSearchParams()

    const [search, setSearch] = useState(searchParams.get('q') || '')
    const [sport, setSport] = useState(searchParams.get('sport') || '')
    const [region, setRegion] = useState(searchParams.get('region') || '')
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
    const [modal, setModal] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const params = new URLSearchParams()
        if (search) params.set('q', search)
        if (sport) params.set('sport', sport)
        if (region) params.set('region', region)
        if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter)
        if (page > 1) params.set('page', page)
        setSearchParams(params, { replace: true })

        const t = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(t)
    }, [search, sport, region, statusFilter, page, setSearchParams])

    const filtered = useMemo(() => {
        return COACHES_DATA.filter(c => {
            if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
            if (sport && c.sport !== sport) return false
            if (region && c.region !== region) return false
            if (statusFilter === 'active' && c.status !== 'active') return false
            if (statusFilter === 'annulled' && c.status !== 'annulled') return false
            return true
        })
    }, [search, sport, region, statusFilter])

    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    const resetFilters = () => { setSearch(''); setSport(''); setRegion(''); setStatusFilter('all'); setPage(1) }
    const handleSearch = (e) => { e.preventDefault(); setPage(1) }

    return (
        <>
            {/* Hero */}
            <PublicHero title={t('public.coachesRegistryTitle')} description={t('public.coachesHeroSub')} variant="indigo" layoutMode="abstract">
                <PublicHeroCounter animRef={counterActive.ref} value={counterActive.value} label={t('public.registeredCoaches')} />
            </PublicHero>

            <div className="pub-section">
                <div className="pub-container">
                    <PublicFiltersContainer onSubmit={handleSearch} onReset={resetFilters}>
                        <PublicFilterInput placeholder={t('public.searchByName')} value={search} onChange={e => setSearch(e.target.value)} />
                        <PublicFilterSelect value={sport} onChange={e => setSport(e.target.value)} options={SPORTS} defaultOption={t('public.allSports')} />
                        <PublicFilterSelect value={region} onChange={e => setRegion(e.target.value)} options={REGIONS} defaultOption={t('public.allRegions')} />
                        <PublicFilterSelect
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            options={[{ value: 'all', label: t('public.allStatuses') }, { value: 'active', label: t('public.statusActive') }, { value: 'annulled', label: t('public.statusAnnulled') }]}
                        />
                    </PublicFiltersContainer>

                    <p style={st.resultsCount}>{t('public.found')} <strong>{filtered.length}</strong></p>

                    {loading ? (
                        <div style={st.grid}>
                            {Array(PER_PAGE).fill(0).map((_, i) => (
                                <div key={i} style={st.card}>
                                    <div style={st.cardTop}>
                                        <div className="skeleton-box" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <div className="skeleton-box skeleton-text" style={{ width: '70%', height: 16 }} />
                                            <div className="skeleton-box skeleton-text" style={{ width: '40%', height: 12, marginTop: 4 }} />
                                        </div>
                                    </div>
                                    <div style={st.cardDetails}>
                                        <div className="skeleton-box skeleton-text" style={{ width: '100%', height: 14 }} />
                                        <div className="skeleton-box skeleton-text" style={{ width: '100%', height: 14 }} />
                                        <div className="skeleton-box skeleton-text" style={{ width: '100%', height: 14 }} />
                                    </div>
                                    <div className="skeleton-box" style={{ width: '100%', height: 38, borderRadius: 10, marginTop: 'auto' }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div ref={revealCards} className="scroll-reveal" style={st.grid}>
                            {paged.map((coach, idx) => (
                                <div key={coach.id} style={{ '--i': idx }} className="pub-card stagger-item card-tilt-3d" {...tilt}>
                                    <div style={st.cardTop}>
                                        <div style={st.avatar}>{getInitials(coach.name)}</div>
                                        <div style={st.cardInfo}>
                                            <div style={st.cardName}>{coach.name}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={st.sportBadge}>{coach.sport}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={st.cardDetails}>
                                        <div style={st.cardRow}><span style={st.cardLabel}>{t('public.specialization')}</span><span style={st.cardValue}>{coach.sport}</span></div>
                                        <div style={st.cardRow}><span style={st.cardLabel}>{t('public.region')}</span><span style={st.cardValue}>{coach.region}</span></div>
                                        <div style={st.cardRow}><span style={st.cardLabel}>{t('public.certNumber')}</span><span style={{ ...st.cardValue, fontFamily: 'monospace', fontSize: 11 }}>{coach.cert}</span></div>
                                        <div style={st.cardRow}>
                                            <span style={st.cardLabel}>{t('public.status')}</span>
                                            <span style={coach.status === 'active' ? st.statusActive : st.statusAnnulled}>
                                                {coach.status === 'active' ? t('public.statusActive') : t('public.statusAnnulled')}
                                            </span>
                                        </div>
                                    </div>
                                    <button style={st.verifyBtn} onClick={() => setModal(coach)}>{t('public.verifyAuthenticity')}</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {filtered.length === 0 && (
                        <div style={st.empty}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#86868B" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <p style={{ marginTop: 12 }}>{t('public.coachesNotFound')}</p>
                        </div>
                    )}

                    <PublicPagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <div style={st.overlay} onClick={() => setModal(null)}>
                    <div style={st.modal} onClick={e => e.stopPropagation()}>
                        <div style={st.modalHeader}>
                            <h2 style={st.modalTitle}>{t('public.registrationCertificate')}</h2>
                            <button style={st.modalClose} onClick={() => setModal(null)}>✕</button>
                        </div>
                        <div style={st.modalCheck}>
                            {modal.status === 'active' ? (
                                <>
                                    <div style={st.checkCircle}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    <span style={st.checkText}>{t('public.docAuthentic')}</span>
                                </>
                            ) : (
                                <>
                                    <div style={st.checkCircleRed}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </div>
                                    <span style={st.checkTextRed}>{t('public.certAnnulled')}</span>
                                </>
                            )}
                        </div>
                        <table style={st.modalTable}>
                            <tbody>
                                <tr><td style={st.mtLabel}>{t('public.fullName')}</td><td style={st.mtValue}>{modal.name}</td></tr>
                                <tr><td style={st.mtLabel}>{t('public.certNumberLabel')}</td><td style={st.mtValue}>{modal.cert}</td></tr>
                                <tr><td style={st.mtLabel}>{t('public.issuedDate')}</td><td style={st.mtValue}>{formatDate(modal.date)}</td></tr>
                                <tr><td style={st.mtLabel}>{t('public.sportType')}</td><td style={st.mtValue}>{modal.sport}</td></tr>
                                <tr><td style={st.mtLabel}>{t('public.organization')}</td><td style={st.mtValue}>{modal.org}</td></tr>
                                <tr><td style={st.mtLabel}>{t('public.region')}</td><td style={st.mtValue}>{modal.region}</td></tr>
                                <tr><td style={st.mtLabel}>{t('public.status')}</td><td style={st.mtValue}>
                                    <span style={modal.status === 'active' ? st.statusActive : st.statusAnnulled}>
                                        {modal.status === 'active' ? t('public.statusActive') : t('public.statusAnnulled')}
                                    </span>
                                </td></tr>
                            </tbody>
                        </table>
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <button style={st.findBtn} onClick={() => setModal(null)}>{t('public.closeModal')}</button>
                        </div>
                    </div>
                </div>
            )}


        </>
    )
}

const st = {
    hero: { background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)', color: '#fff', padding: '36px 0 28px', textAlign: 'center', borderRadius: '0 0 20px 20px' },
    heroTitle: { fontSize: 28, fontWeight: 500, marginBottom: 8, lineHeight: 1.2 },
    heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24 },
    heroCounter: { display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 28px' },
    heroCounterValue: { fontSize: 22, fontWeight: 500 },
    heroCounterLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'left' },
    filters: { background: 'var(--theme-bg-card)', border: '1px solid var(--theme-border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 },
    filterRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 },
    input: { width: '100%', padding: '10px 14px', border: '1px solid var(--theme-border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', color: 'var(--theme-text-main)', outline: 'none', boxSizing: 'border-box' },
    filterActions: { display: 'flex', gap: 10, alignItems: 'center' },
    findBtn: { padding: '10px 20px', background: '#1C1C1E', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500 },
    resetBtn: { padding: '10px 20px', background: 'transparent', border: '1px solid var(--theme-border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', color: 'var(--theme-text-secondary)', cursor: 'pointer' },
    resultsCount: { fontSize: 13, color: 'var(--theme-text-secondary)', marginBottom: 16 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
    card: { background: 'var(--theme-bg-card)', border: '1px solid var(--theme-border)', borderRadius: 14, padding: 20, transition: 'all 0.25s ease', display: 'flex', flexDirection: 'column' },
    cardTop: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
    avatar: { width: 44, height: 44, borderRadius: '50%', background: 'var(--theme-bg-panel)', color: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, flexShrink: 0 },
    cardInfo: { flex: 1, minWidth: 0 },
    cardName: { fontSize: 14, fontWeight: 500, color: 'var(--theme-text-main)', marginBottom: 4, lineHeight: 1.3 },
    sportBadge: { display: 'inline-block', padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'rgba(21, 101, 192, 0.15)', color: '#1565C0' },
    cardDetails: { padding: '12px 0', borderTop: '1px solid #F2F3F5', borderBottom: '1px solid #F2F3F5', flex: 1, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 },
    cardRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12 },
    cardLabel: { color: 'var(--theme-text-secondary)' },
    cardValue: { color: 'var(--theme-text-main)', fontWeight: 500, textAlign: 'right' },
    statusActive: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'rgba(46, 125, 50, 0.15)', color: '#34C759' },
    statusAnnulled: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'rgba(110, 110, 115, 0.15)', color: 'var(--theme-text-secondary)' },
    verifyBtn: { width: '100%', padding: 10, background: 'none', border: '1px solid var(--theme-border)', borderRadius: 10, fontSize: 13, fontWeight: 500, fontFamily: 'inherit', color: 'var(--theme-text-main)', cursor: 'pointer', transition: 'all 0.2s' },
    empty: { textAlign: 'center', padding: '48px 0', color: 'var(--theme-text-secondary)', fontSize: 15 },
    pagination: { display: 'flex', justifyContent: 'center', gap: 6, marginTop: 28 },
    pageBtn: { padding: '8px 14px', border: '1px solid var(--theme-border)', borderRadius: 10, background: 'var(--theme-bg-card)', fontSize: 13, fontFamily: 'inherit', color: 'var(--theme-text-secondary)', cursor: 'pointer' },
    pageBtnActive: { background: '#1C1C1E', color: '#fff', borderColor: '#1C1C1E' },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
    modal: { background: 'var(--theme-bg-card)', borderRadius: 14, padding: '28px 32px', maxWidth: 520, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 500, color: 'var(--theme-text-main)' },
    modalClose: { width: 32, height: 32, border: '1px solid var(--theme-border)', borderRadius: 10, background: '#F8F9FB', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--theme-text-secondary)' },
    modalCheck: { textAlign: 'center', marginBottom: 24 },
    checkCircle: { width: 64, height: 64, borderRadius: '50%', background: '#E8F5E9', color: '#2E7D32', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    checkText: { display: 'block', fontSize: 16, fontWeight: 500, color: '#2E7D32' },
    checkCircleRed: { width: 64, height: 64, borderRadius: '50%', background: '#FFEBEE', color: '#C62828', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    checkTextRed: { display: 'block', fontSize: 16, fontWeight: 500, color: '#C62828' },
    modalTable: { width: '100%', borderCollapse: 'collapse', background: '#F8F9FB', borderRadius: 12, overflow: 'hidden' },
    mtLabel: { padding: '10px 14px', fontSize: 12, color: 'var(--theme-text-secondary)', borderBottom: '1px solid #F2F3F5', width: '40%' },
    mtValue: { padding: '10px 14px', fontSize: 12, color: 'var(--theme-text-main)', fontWeight: 500, borderBottom: '1px solid #F2F3F5' },
}
