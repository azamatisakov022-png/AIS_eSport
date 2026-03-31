import { useState, useMemo, useEffect } from 'react'
import { useScrollReveal, useAnimatedCounter, useCardTilt } from './useDesignEffects'
import { useTranslation } from 'react-i18next'
import PublicHero, { PublicHeroCounter } from './components/PublicHero'
import { PublicFiltersContainer, PublicFilterInput, PublicFilterSelect } from './components/PublicFilters'
import PublicPagination from './components/PublicPagination'

const SPORTS = ['Бокс', 'Борьба', 'Дзюдо', 'Футбол', 'Плавание', 'Лёгкая атлетика', 'Каратэ', 'Тхэквондо', 'Гимнастика', 'Шахматы', 'Тяжёлая атлетика', 'Стрельба']
const REGIONS = ['Бишкек', 'Ош', 'Чуйская', 'Иссык-Кульская', 'Джалал-Абадская', 'Нарынская', 'Баткенская', 'Таласская', 'Ошская']
const CATS = ['Международная категория', 'Национальная категория', 'I категория', 'Судья по спорту']

const CAT_BADGE = {
    'Международная категория': { bg: 'rgba(198, 40, 40, 0.15)', color: '#EF5350' },
    'Национальная категория': { bg: 'rgba(88, 86, 214, 0.15)', color: '#5856D6' },
    'I категория': { bg: 'rgba(21, 101, 192, 0.15)', color: '#42A5F5' },
    'Судья по спорту': { bg: 'rgba(110, 110, 115, 0.15)', color: 'var(--theme-text-secondary)' },
}

export const JUDGES_DATA = [
    { id: 1, name: 'Исмаилов Рустам Камилович', sport: 'Дзюдо', cat: 'Международная категория', region: 'Бишкек', cert: 'УС-КР-2023-00012', date: '2023-02-15', endDate: '2027-02-15', status: 'active', org: 'ГАФКиС КР' },
    { id: 2, name: 'Карабекова Салтанат Жолдошевна', sport: 'Лёгкая атлетика', cat: 'Национальная категория', region: 'Бишкек', cert: 'УС-КР-2023-00034', date: '2023-05-20', endDate: '2027-05-20', status: 'active', org: 'Федерация л/а КР' },
    { id: 3, name: 'Тологонов Бакыт Маратбекович', sport: 'Бокс', cat: 'Международная категория', region: 'Ош', cert: 'УС-КР-2022-00087', date: '2022-11-10', endDate: '2026-11-10', status: 'active', org: 'АИБА / ГАФКиС КР' },
    { id: 4, name: 'Айтбаева Жыпар Кубанычбековна', sport: 'Плавание', cat: 'I категория', region: 'Иссык-Кульская', cert: 'УС-КР-2024-00102', date: '2024-01-12', endDate: '2028-01-12', status: 'active', org: 'Федерация плавания КР' },
    { id: 5, name: 'Мамбетов Нурлан Сагынбекович', sport: 'Борьба', cat: 'Национальная категория', region: 'Нарынская', cert: 'УС-КР-2023-00054', date: '2023-08-22', endDate: '2027-08-22', status: 'active', org: 'Федерация борьбы КР' },
    { id: 6, name: 'Кожоматова Айнура Токтосуновна', sport: 'Тхэквондо', cat: 'I категория', region: 'Джалал-Абадская', cert: 'УС-КР-2024-00118', date: '2024-03-15', endDate: '2028-03-15', status: 'active', org: 'Федерация тхэквондо КР' },
    { id: 7, name: 'Сулайманов Эмир Кайратович', sport: 'Каратэ', cat: 'Судья по спорту', region: 'Бишкек', cert: 'УС-КР-2024-00135', date: '2024-06-01', endDate: '2028-06-01', status: 'active', org: 'Федерация каратэ КР' },
    { id: 8, name: 'Жороев Канат Алмазбекович', sport: 'Футбол', cat: 'Международная категория', region: 'Бишкек', cert: 'УС-КР-2022-00045', date: '2022-04-10', endDate: '2026-04-10', status: 'active', org: 'КФС / ФИФА' },
    { id: 9, name: 'Бекташева Гульнара Маратовна', sport: 'Гимнастика', cat: 'Национальная категория', region: 'Бишкек', cert: 'УС-КР-2023-00078', date: '2023-09-05', endDate: '2027-09-05', status: 'active', org: 'Федерация гимнастики КР' },
    { id: 10, name: 'Абдуллаев Тимур Рустамович', sport: 'Шахматы', cat: 'Международная категория', region: 'Бишкек', cert: 'УС-КР-2022-00091', date: '2022-12-20', endDate: '2026-12-20', status: 'active', org: 'ФИДЕ / ГАФКиС КР' },
    { id: 11, name: 'Токтоматова Айсулуу Бактыбековна', sport: 'Борьба', cat: 'I категория', region: 'Ошская', cert: 'УС-КР-2024-00155', date: '2024-07-15', endDate: '2028-07-15', status: 'active', org: 'Федерация борьбы КР' },
    { id: 12, name: 'Калматов Данияр Эркинбекович', sport: 'Бокс', cat: 'Судья по спорту', region: 'Баткенская', cert: 'УС-КР-2024-00168', date: '2024-09-01', endDate: '2028-09-01', status: 'active', org: 'Федерация бокса КР' },
    { id: 13, name: 'Осмоналиев Бекзат Турдубекович', sport: 'Тяжёлая атлетика', cat: 'Национальная категория', region: 'Ош', cert: 'УС-КР-2023-00065', date: '2023-06-18', endDate: '2027-06-18', status: 'active', org: 'Федерация т/а КР' },
    { id: 14, name: 'Шаршеева Мадина Жаныбековна', sport: 'Дзюдо', cat: 'I категория', region: 'Таласская', cert: 'УС-КР-2022-00312', date: '2022-03-28', endDate: '2026-03-28', status: 'annulled', org: 'Федерация дзюдо КР' },
    { id: 15, name: 'Кадырбеков Азамат Нурланович', sport: 'Стрельба', cat: 'Судья по спорту', region: 'Чуйская', cert: 'УС-КР-2024-00180', date: '2024-10-10', endDate: '2028-10-10', status: 'active', org: 'Федерация стрельбы КР' },
]

const PER_PAGE = 12

function getInitials(n) { const p = n.split(' '); return (p[0]?.[0] || '') + (p[1]?.[0] || '') }
function fmt(d) { return new Date(d).toLocaleDateString('ru-RU') }

export default function PublicJudges() {
    const { t } = useTranslation()
    const intlCount = JUDGES_DATA.filter(j => j.cat === 'Международная категория').length
    const revealCards = useScrollReveal(0.08)
    const tilt = useCardTilt(5)
    const cntAll = useAnimatedCounter(186)
    const cntIntl = useAnimatedCounter(intlCount)
    const cntSports = useAnimatedCounter(38)
    const [search, setSearch] = useState('')
    const [sport, setSport] = useState('')
    const [cat, setCat] = useState('')
    const [region, setRegion] = useState('')
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const t = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(t)
    }, [search, sport, cat, region, page])

    const filtered = useMemo(() => JUDGES_DATA.filter(j => {
        if (search && !j.name.toLowerCase().includes(search.toLowerCase())) return false
        if (sport && j.sport !== sport) return false
        if (cat && j.cat !== cat) return false
        if (region && j.region !== region) return false
        return true
    }), [search, sport, cat, region])

    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
    const reset = () => { setSearch(''); setSport(''); setCat(''); setRegion(''); setPage(1) }

    return (
        <>
            {/* Hero */}
            <PublicHero title={t('public.judgesRegistryTitle')} description={t('public.judgesHeroSub')} variant="gold" layoutMode="abstract">
                <PublicHeroCounter animRef={cntAll.ref} value={cntAll.value} label={t('public.judgesOf')} />
                <PublicHeroCounter animRef={cntIntl.ref} value={cntIntl.value} label={t('public.intlCategoryShort')} />
                <PublicHeroCounter animRef={cntSports.ref} value={cntSports.value} label={t('public.sportsOf')} />
            </PublicHero>

            <div className="pub-section">
                <div className="pub-container">
                    <PublicFiltersContainer onSubmit={e => { e.preventDefault(); setPage(1) }} onReset={reset}>
                        <PublicFilterInput placeholder={t('public.searchByName')} value={search} onChange={e => setSearch(e.target.value)} />
                        <PublicFilterSelect value={sport} onChange={e => setSport(e.target.value)} options={SPORTS} defaultOption={t('public.allSports')} />
                        <PublicFilterSelect value={cat} onChange={e => setCat(e.target.value)} options={CATS} defaultOption={t('public.allJudgeCategories')} />
                        <PublicFilterSelect value={region} onChange={e => setRegion(e.target.value)} options={REGIONS} defaultOption={t('public.allRegions')} />
                    </PublicFiltersContainer>

                    <p style={s.resultsCount}>{t('public.found')} <strong>{filtered.length}</strong></p>

                    {loading ? (
                        <div style={s.grid}>
                            {Array(PER_PAGE).fill(0).map((_, i) => (
                                <div key={i} style={s.card}>
                                    <div style={s.cardTop}>
                                        <div className="skeleton-box" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <div className="skeleton-box skeleton-text" style={{ width: '70%', height: 16 }} />
                                            <div className="skeleton-box skeleton-text" style={{ width: '40%', height: 12, marginTop: 4 }} />
                                        </div>
                                    </div>
                                    <div style={s.cardDetails}>
                                        <div className="skeleton-box skeleton-text" style={{ width: '100%', height: 14 }} />
                                        <div className="skeleton-box skeleton-text" style={{ width: '100%', height: 14 }} />
                                        <div className="skeleton-box skeleton-text" style={{ width: '100%', height: 14 }} />
                                    </div>
                                    <div className="skeleton-box" style={{ width: '100%', height: 38, borderRadius: 10, marginTop: 'auto' }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div ref={revealCards} className="scroll-reveal" style={s.grid}>
                            {paged.map((j, idx) => {
                                const cb = CAT_BADGE[j.cat] || CAT_BADGE['Судья по спорту']
                                return (
                                    <div key={j.id} style={{ '--i': idx }} className="pub-card stagger-item card-tilt-3d" {...tilt}>
                                        <div style={s.cardTop}>
                                            <div style={s.avatar}>{getInitials(j.name)}</div>
                                            <div style={s.cardInfo}>
                                                <div style={s.cardName}>{j.name}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                    <span style={{ ...s.badge, background: cb.bg, color: cb.color }}>{j.cat}</span>
                                                    <span style={s.sportLabel}>{j.sport}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={s.cardDetails}>
                                            <div style={s.cardRow}><span style={s.cl}>{t('public.category')}</span><span style={s.cv}>{j.cat}</span></div>
                                            <div style={s.cardRow}><span style={s.cl}>{t('public.region')}</span><span style={s.cv}>{j.region}</span></div>
                                            <div style={s.cardRow}><span style={s.cl}>{t('public.certificate')}</span><span style={{ ...s.cv, fontFamily: 'monospace', fontSize: 11 }}>{j.cert}</span></div>
                                            <div style={s.cardRow}>
                                                <span style={s.cl}>{t('public.status')}</span>
                                                <span style={j.status === 'active' ? s.stActive : s.stAnnulled}>
                                                    {j.status === 'active' ? t('public.statusActive') : t('public.statusAnnulled')}
                                                </span>
                                            </div>
                                        </div>
                                        <button style={s.verifyBtn} onClick={() => setModal(j)}>{t('public.verifyAuthenticity')}</button>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {filtered.length === 0 && (
                        <div style={s.empty}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#86868B" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <p style={{ marginTop: 12 }}>{t('public.judgesNotFound')}</p>
                        </div>
                    )}

                    <PublicPagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <div className="apple-modal-overlay" style={s.overlay} onClick={() => setModal(null)}>
                    <div className="apple-modal-content" style={s.modal} onClick={e => e.stopPropagation()}>
                        <div style={s.modalHeader}>
                            <h2 style={s.modalTitle}>{t('public.judgeCertificate')}</h2>
                            <button style={s.modalClose} onClick={() => setModal(null)}>✕</button>
                        </div>
                        <div style={s.modalCheck}>
                            {modal.status === 'active' ? (
                                <>
                                    <div style={s.checkCircle}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg></div>
                                    <span style={s.checkText}>{t('public.certAuthentic')}</span>
                                </>
                            ) : (
                                <>
                                    <div style={s.checkCircleRed}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></div>
                                    <span style={s.checkTextRed}>{t('public.certAnnulledJudge')}</span>
                                </>
                            )}
                        </div>
                        <table style={s.modalTable}>
                            <tbody>
                                <tr><td style={s.mtL}>{t('public.fullName')}</td><td style={s.mtV}>{modal.name}</td></tr>
                                <tr><td style={s.mtL}>{t('public.certIdLabel')}</td><td style={s.mtV}>{modal.cert}</td></tr>
                                <tr><td style={s.mtL}>{t('public.category')}</td><td style={s.mtV}>{modal.cat}</td></tr>
                                <tr><td style={s.mtL}>{t('public.sportType')}</td><td style={s.mtV}>{modal.sport}</td></tr>
                                <tr><td style={s.mtL}>{t('public.organization')}</td><td style={s.mtV}>{modal.org}</td></tr>
                                <tr><td style={s.mtL}>{t('public.issuedDate')}</td><td style={s.mtV}>{fmt(modal.date)}</td></tr>
                                <tr><td style={s.mtL}>{t('public.validUntilDate')}</td><td style={s.mtV}>{fmt(modal.endDate)}</td></tr>
                                <tr><td style={s.mtL}>{t('public.region')}</td><td style={s.mtV}>{modal.region}</td></tr>
                                <tr><td style={s.mtL}>{t('public.status')}</td><td style={s.mtV}>
                                    <span style={modal.status === 'active' ? s.stActive : s.stAnnulled}>
                                        {modal.status === 'active' ? t('public.statusActive') : t('public.statusAnnulled')}
                                    </span>
                                </td></tr>
                            </tbody>
                        </table>
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <button style={s.findBtn} onClick={() => setModal(null)}>{t('public.closeModal')}</button>
                        </div>
                    </div>
                </div>
            )}


        </>
    )
}

const s = {
    hero: { background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)', color: '#fff', padding: '36px 0 28px', textAlign: 'center', borderRadius: '0 0 20px 20px' },
    heroTitle: { fontSize: 28, fontWeight: 500, marginBottom: 8, lineHeight: 1.2 },
    heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 28 },
    heroCounters: { display: 'inline-flex', gap: 16 },
    heroStat: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 28px', minWidth: 120 },
    heroStatVal: { fontSize: 22, fontWeight: 500 },
    heroStatLbl: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
    filters: { background: 'var(--theme-bg-card)', border: '1px solid var(--theme-border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 },
    filterRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 },
    input: { width: '100%', padding: '10px 14px', border: '1px solid var(--theme-border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', color: 'var(--theme-text-main)', outline: 'none', boxSizing: 'border-box' },
    filterActions: { display: 'flex', gap: 10 },
    findBtn: { padding: '10px 20px', background: '#1C1C1E', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500 },
    resetBtn: { padding: '10px 20px', background: 'transparent', border: '1px solid var(--theme-border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', color: 'var(--theme-text-secondary)', cursor: 'pointer' },
    resultsCount: { fontSize: 13, color: 'var(--theme-text-secondary)', marginBottom: 16 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
    cardTop: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
    avatar: { width: 44, height: 44, borderRadius: '50%', background: 'var(--theme-bg-panel)', color: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, flexShrink: 0 },
    cardInfo: { flex: 1, minWidth: 0 },
    cardName: { fontSize: 14, fontWeight: 500, color: 'var(--theme-text-main)', marginBottom: 4, lineHeight: 1.3 },
    badge: { display: 'inline-block', padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 500 },
    sportLabel: { fontSize: 11, color: 'var(--theme-text-secondary)' },
    cardDetails: { padding: '12px 0', borderTop: '1px solid #F2F3F5', borderBottom: '1px solid #F2F3F5', flex: 1, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 },
    cardRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12 },
    cl: { color: 'var(--theme-text-secondary)' },
    cv: { color: 'var(--theme-text-main)', fontWeight: 500, textAlign: 'right' },
    stActive: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'rgba(46, 125, 50, 0.15)', color: '#34C759' },
    stAnnulled: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'rgba(110, 110, 115, 0.15)', color: 'var(--theme-text-secondary)' },
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
    mtL: { padding: '10px 14px', fontSize: 12, color: 'var(--theme-text-secondary)', borderBottom: '1px solid #F2F3F5', width: '40%' },
    mtV: { padding: '10px 14px', fontSize: 12, color: 'var(--theme-text-main)', fontWeight: 500, borderBottom: '1px solid #F2F3F5' },
}
