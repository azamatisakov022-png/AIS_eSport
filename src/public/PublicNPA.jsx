import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PublicHero, { PublicHeroCounter } from './components/PublicHero'

/* ══════════════════════════════════════════════════════
   ДАННЫЕ - Нормативно-правовые акты
   ══════════════════════════════════════════════════════ */
const NPA_DOCUMENTS = [
    {
        id: 1,
        typeKey: 'npa.typeLaw',
        number: '№ 36',
        date: '21.01.2000',
        year: 2000,
        titleKey: 'npa.doc1Title',
        descKey: 'npa.doc1Desc',
        statusKey: 'npa.statusActive',
        categoryKey: 'npa.catBasicLaws',
        isMain: true,
        redactions: 12,
        lastUpdate: '21.01.2025',
        articles: 35,
        tagsKeys: ['npa.tagAthletes', 'npa.tagCoaches', 'npa.tagJudges', 'npa.tagFederations', 'npa.tagNationalTeams'],
    },
    {
        id: 2, typeKey: 'npa.typeLaw', number: '№ 219', date: '18.11.2011', year: 2011,
        titleKey: 'npa.doc2Title',
        statusKey: 'npa.statusActive', categoryKey: 'npa.catAmendments',
        tagsKeys: ['npa.tagAmendments'],
    },
    {
        id: 3, typeKey: 'npa.typeLaw', number: '№ 133', date: '25.07.2012', year: 2012,
        titleKey: 'npa.doc3Title',
        statusKey: 'npa.statusActive', categoryKey: 'npa.catAmendments',
        tagsKeys: ['npa.tagAmendments'],
    },
    {
        id: 4, typeKey: 'npa.typeLaw', number: '№ 134', date: '25.07.2012', year: 2012,
        titleKey: 'npa.doc4Title',
        statusKey: 'npa.statusActive', categoryKey: 'npa.catAmendments',
        tagsKeys: ['npa.tagAmendments'],
    },
    {
        id: 5, typeKey: 'npa.typeLaw', number: '№ 4', date: '15.01.2013', year: 2013,
        titleKey: 'npa.doc5Title',
        statusKey: 'npa.statusActive', categoryKey: 'npa.catAmendments',
        tagsKeys: ['npa.tagAmendments'],
    },
    {
        id: 6, typeKey: 'npa.typeLaw', number: '№ 87', date: '01.06.2013', year: 2013,
        titleKey: 'npa.doc6Title',
        statusKey: 'npa.statusActive', categoryKey: 'npa.catAmendments',
        tagsKeys: ['npa.tagAmendments'],
    },
    {
        id: 7, typeKey: 'npa.typeLaw', number: '№ 50', date: '23.04.2016', year: 2016,
        titleKey: 'npa.doc7Title',
        statusKey: 'npa.statusActive', categoryKey: 'npa.catAmendments',
        tagsKeys: ['npa.tagAmendments'],
    },
    {
        id: 8, typeKey: 'npa.typeLaw', number: '№ 23', date: '16.02.2018', year: 2018,
        titleKey: 'npa.doc8Title',
        statusKey: 'npa.statusActive', categoryKey: 'npa.catAmendments',
        tagsKeys: ['npa.tagAmendments'],
    },
    {
        id: 9, typeKey: 'npa.typeLaw', number: '№ 82', date: '18.07.2020', year: 2020,
        titleKey: 'npa.doc9Title',
        statusKey: 'npa.statusActive', categoryKey: 'npa.catAmendments',
        tagsKeys: ['npa.tagAmendments'],
    },
    {
        id: 10, typeKey: 'npa.typeLaw', number: '№ 90', date: '14.04.2023', year: 2023,
        titleKey: 'npa.doc10Title',
        statusKey: 'npa.statusActive', categoryKey: 'npa.catAmendments',
        tagsKeys: ['npa.tagAmendments'],
    },
    {
        id: 11, typeKey: 'npa.typeLaw', number: '№ 135', date: '22.07.2024', year: 2024,
        titleKey: 'npa.doc11Title',
        statusKey: 'npa.statusActive', categoryKey: 'npa.catAmendments',
        tagsKeys: ['npa.tagAmendments'],
    },
    {
        id: 12, typeKey: 'npa.typeLaw', number: '№ 21', date: '21.01.2025', year: 2025,
        titleKey: 'npa.doc12Title',
        statusKey: 'npa.statusActive', categoryKey: 'npa.catAmendments',
        tagsKeys: ['npa.tagAmendments'],
    },
    {
        id: 13,
        typeKey: 'npa.typeGovDecree',
        number: '№ 596',
        date: '11.11.2013',
        year: 2013,
        titleKey: 'npa.doc13Title',
        descKey: 'npa.doc13Desc',
        statusKey: 'npa.statusActive',
        categoryKey: 'npa.catGovDecrees',
        lastUpdate: '08.12.2025',
        tagsKeys: ['npa.tagCoaches', 'npa.tagRegistration', 'npa.tagCertificate'],
    },
    {
        id: 14,
        typeKey: 'npa.typeOrder',
        number: '№ 02/182',
        date: '30.06.2025',
        year: 2025,
        titleKey: 'npa.doc14Title',
        descKey: 'npa.doc14Desc',
        statusKey: 'npa.statusActive',
        categoryKey: 'npa.catOrders',
        validUntil: '2028',
        tagsKeys: ['npa.tagTitles', 'npa.tagRanks', 'npa.tagStandards', 'npa.tagClassification'],
    },
    {
        id: 15,
        typeKey: 'npa.typeDocForm',
        number: 'npa.doc15Number',
        date: '11.11.2013',
        year: 2013,
        titleKey: 'npa.doc15Title',
        descKey: 'npa.doc15Desc',
        statusKey: 'npa.statusActive',
        categoryKey: 'npa.catDocForms',
        tagsKeys: ['npa.tagCoaches', 'npa.tagForm', 'npa.tagCertificate'],
    },
]

const CATEGORY_KEYS = [
    'npa.catBasicLaws',
    'npa.catAmendments',
    'npa.catGovDecrees',
    'npa.catOrders',
    'npa.catDocForms',
]

/* SVG doc icon */
const DocIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
)

export default function PublicNPA() {
    const { t } = useTranslation()
    const [search, setSearch] = useState('')
    const [catFilter, setCatFilter] = useState('')
    const [expanded, setExpanded] = useState(null)
    const [searchFocused, setSearchFocused] = useState(false)

    const filtered = useMemo(() => {
        return NPA_DOCUMENTS.filter(n => {
            if (catFilter && n.categoryKey !== catFilter) return false
            if (search) {
                const q = search.toLowerCase()
                return t(n.titleKey).toLowerCase().includes(q)
                    || n.number.toLowerCase().includes(q)
                    || (n.descKey ? t(n.descKey) : '').toLowerCase().includes(q)
                    || n.tagsKeys.some(tk => t(tk).toLowerCase().includes(q))
            }
            return true
        })
    }, [search, catFilter, t])

    const catCounts = useMemo(() => {
        const m = {}
        CATEGORY_KEYS.forEach(c => { m[c] = 0 })
        NPA_DOCUMENTS.forEach(n => { if (m[n.categoryKey] !== undefined) m[n.categoryKey]++ })
        return m
    }, [])

    const lawCount = NPA_DOCUMENTS.filter(n => n.typeKey === 'npa.typeLaw').length

    return (
        <div className="pub-section">
            {/* ══ Header - домашний flush-hero (#0a0a0c) ══ */}
            <PublicHero title={t('public.npaTitle')} description={t('npa.headerSub')} variant="slate" layoutMode="abstract">
                {[
                    { val: NPA_DOCUMENTS.length, label: t('npa.statDocs') },
                    { val: lawCount, label: t('npa.statLaws') },
                    { val: catCounts['npa.catGovDecrees'], label: t('npa.statDecrees') },
                    { val: NPA_DOCUMENTS.length, label: t('npa.statActive') },
                ].map((st, i) => (
                    <PublicHeroCounter key={i} value={st.val} label={st.label} />
                ))}
            </PublicHero>

            {/* ══ Search + filters ══ */}
            <div className="pub-container" style={{ paddingTop: 28, paddingBottom: 0 }}>
                <div style={s.searchWrap}>
                    <svg style={s.searchSvg} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--theme-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder={t('public.searchDocs')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        style={{
                            ...s.searchInput,
                            ...(searchFocused ? s.searchFocus : {}),
                        }}
                    />
                </div>

                <div className="npa-tabs">
                    <button
                        className={catFilter === '' ? 'npa-tab npa-tab-active' : 'npa-tab'}
                        onClick={() => setCatFilter('')}
                    >
                        {t('public.allDocCategories')} <span className="npa-tab-count">{NPA_DOCUMENTS.length}</span>
                    </button>
                    {CATEGORY_KEYS.map(catKey => (
                        <button
                            key={catKey}
                            className={catFilter === catKey ? 'npa-tab npa-tab-active' : 'npa-tab'}
                            onClick={() => setCatFilter(catKey)}
                        >
                            {t(catKey)} <span className="npa-tab-count">{catCounts[catKey]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ══ Document list ══ */}
            <div className="pub-container" style={{ paddingTop: 20, paddingBottom: 48 }}>
                <div style={s.list}>
                    {filtered.map(npa => {
                        const isOpen = expanded === npa.id
                        const isActive = npa.statusKey === 'npa.statusActive'

                        return (
                            <div key={npa.id} className="pub-card npa-card" style={{ padding: 0, gap: 0 }}>
                                {/* ── Card header ── */}
                                <div style={s.cardHeader} onClick={() => setExpanded(isOpen ? null : npa.id)}>
                                    <div style={s.cardIcon}>
                                        <DocIcon />
                                    </div>
                                    <div style={s.cardCenter}>
                                        <div style={s.cardTopRow}>
                                            <span style={s.typeBadge}>{t(npa.typeKey)}</span>
                                            <span style={s.cardNum}>{npa.number.startsWith('npa.') ? t(npa.number) : npa.number} {t('npa.dateFrom')} {npa.date}</span>
                                        </div>
                                        <div style={s.cardTitle}>{t(npa.titleKey)}</div>
                                        {npa.isMain && (
                                            <span style={s.mainBadge}>{t('npa.mainDoc')}</span>
                                        )}
                                    </div>
                                    <div style={s.cardRight}>
                                        <div style={s.statusWrap}>
                                            <div style={{ ...s.statusDot, background: isActive ? 'var(--green, #30D158)' : 'var(--theme-text-secondary)' }} />
                                            <span style={{ ...s.statusText, color: isActive ? 'var(--theme-green, #30D158)' : 'var(--theme-text-secondary)' }}>
                                                {t(npa.statusKey)}
                                            </span>
                                        </div>
                                        <span style={s.chevron}>{isOpen ? '▲' : '▼'}</span>
                                    </div>
                                </div>

                                {/* ── Expanded body ── */}
                                {isOpen && (
                                    <div style={s.cardBody}>
                                        {npa.descKey && (
                                            <p style={s.cardDesc}>{t(npa.descKey)}</p>
                                        )}
                                        <div style={s.detailsRow}>
                                            <div style={s.detailItem}>
                                                <span style={s.detailLabel}>{t('npa.adopted')}:</span>
                                                <span style={s.detailValue}>{npa.date}</span>
                                            </div>
                                            {npa.articles && (
                                                <div style={s.detailItem}>
                                                    <span style={s.detailLabel}>{t('npa.articles')}:</span>
                                                    <span style={s.detailValue}>{npa.articles}</span>
                                                </div>
                                            )}
                                            {npa.lastUpdate && (
                                                <div style={s.detailItem}>
                                                    <span style={s.detailLabel}>{t('npa.lastEdition')}:</span>
                                                    <span style={s.detailValue}>{npa.lastUpdate}</span>
                                                </div>
                                            )}
                                            {npa.redactions && (
                                                <div style={s.detailItem}>
                                                    <span style={s.detailLabel}>{t('npa.editions')}:</span>
                                                    <span style={s.detailValue}>{npa.redactions}</span>
                                                </div>
                                            )}
                                            {npa.validUntil && (
                                                <div style={s.detailItem}>
                                                    <span style={s.detailLabel}>{t('npa.validUntil')}:</span>
                                                    <span style={s.detailValue}>{npa.validUntil} {t('npa.year')}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div style={s.tagsRow}>
                                            {npa.tagsKeys.map(tk => (
                                                <span key={tk} style={s.tag}>{t(tk)}</span>
                                            ))}
                                        </div>
                                        <div style={s.actionsRow}>
                                            <button style={s.actionBtn} onClick={() => alert(`${t('npa.downloadPdf')}: ${t(npa.titleKey)}`)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                                                {t('public.download')}
                                            </button>
                                            <button style={s.actionBtnOutline} onClick={() => alert(`${t('npa.opening')}: ${t(npa.titleKey)}`)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3z" /></svg>
                                                {t('npa.readFullText')}
                                            </button>
                                            {(npa.id === 13 || npa.id === 14) && (
                                                <Link to={npa.id === 13 ? '/public/trainer-registration' : '/public/award-application'} style={s.actionLink}>
                                                    {t('npa.relatedService')} →
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {filtered.length === 0 && (
                    <div style={s.empty}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--theme-text-secondary)" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--theme-text-main)', marginTop: 12 }}>{t('npa.nothingFound')}</div>
                        <div style={{ fontSize: 13, color: 'var(--theme-text-secondary)', marginTop: 4 }}>{t('npa.tryChangeSearch')}</div>
                    </div>
                )}

                {/* ── Reference block ── */}
                <div style={s.refBlock}>
                    <div style={s.refIconWrap}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                    </div>
                    <div>
                        <div style={s.refTitle}>{t('npa.officialSources')}</div>
                        <div style={s.refText}>
                            {t('npa.officialSourcesText')}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CSS ── */}
            <style>{`
                .npa-tabs {
                    display: flex; border-bottom: 1px solid var(--theme-border, #E8EBF0); margin-top: 18px;
                }
                .npa-tab {
                    padding: 10px 16px; font-size: 13px; font-weight: 400;
                    color: var(--theme-text-secondary); border: none; background: none;
                    border-bottom: 2px solid transparent;
                    margin-bottom: -1px; font-family: inherit;
                    cursor: pointer; transition: all 0.15s; white-space: nowrap;
                }
                .npa-tab:hover { color: var(--theme-text-main); }
                .npa-tab-active {
                    font-weight: 500; color: var(--theme-text-main);
                    border-bottom-color: var(--theme-text-main);
                }
                .npa-tab-count {
                    font-size: 11px; color: var(--theme-text-secondary); opacity: 0.6; margin-left: 2px;
                }
                .npa-card {
                    overflow: hidden;
                }
                @media (max-width: 768px) {
                    .npa-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
                    .npa-tab { flex-shrink: 0; }
                }
            `}</style>
        </div>
    )
}

/* ═══════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════ */
const s = {
    page: { background: 'var(--theme-bg-main)', minHeight: '100vh' },

    /* Header */
    header: {
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        padding: '36px 0 28px',
    },
    headerTitle: {
        fontSize: 28, fontWeight: 500, color: '#fff', margin: '0 0 8px',
    },
    headerSub: {
        fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 24px', lineHeight: 1.6, maxWidth: 600,
    },
    statsRow: {
        display: 'flex', gap: 12, flexWrap: 'wrap',
    },
    statBlock: {
        background: 'rgba(255,255,255,0.1)',
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 12, padding: '16px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        minWidth: 120,
    },
    statVal: { fontSize: 24, fontWeight: 500, color: '#fff' },
    statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },

    /* Search */
    searchWrap: { position: 'relative' },
    searchSvg: {
        position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none',
    },
    searchInput: {
        width: '100%', padding: '14px 16px 14px 44px',
        border: '1px solid var(--theme-border)', borderRadius: 12,
        fontSize: 14, fontFamily: 'inherit', outline: 'none',
        background: 'var(--theme-bg-card)', transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box',
    },
    searchFocus: {
        borderColor: 'var(--pub-navy, #1d3557)',
        boxShadow: '0 0 0 3px rgba(29,53,87,0.12)',
    },

    /* List */
    list: { display: 'flex', flexDirection: 'column', gap: 10 },

    /* Card */
    cardHeader: {
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '20px 24px', cursor: 'pointer',
    },
    cardIcon: {
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: 'var(--theme-bg-panel)', color: 'var(--theme-text-main)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    cardCenter: { flex: 1, minWidth: 0 },
    cardTopRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
    typeBadge: {
        display: 'inline-block', padding: '2px 8px', borderRadius: 8,
        fontSize: 11, fontWeight: 600,
        background: 'rgba(29, 53, 87, 0.1)', color: 'var(--pub-navy, #1d3557)',
    },
    cardNum: { fontSize: 13, color: 'var(--theme-text-secondary)' },
    cardTitle: {
        fontSize: 14, fontWeight: 500, color: 'var(--theme-text-main)', lineHeight: 1.45,
    },
    mainBadge: {
        display: 'inline-block', padding: '2px 8px', borderRadius: 8,
        background: 'rgba(46, 125, 50, 0.15)', color: 'var(--theme-text-main)', fontSize: 11, fontWeight: 600,
        marginTop: 6,
    },
    cardRight: {
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        gap: 8, flexShrink: 0, paddingTop: 2,
    },
    statusWrap: { display: 'flex', alignItems: 'center', gap: 6 },
    statusDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
    statusText: { fontSize: 12, fontWeight: 500 },
    chevron: { fontSize: 10, color: 'var(--theme-text-secondary)' },

    /* Expanded */
    cardBody: {
        padding: '0 24px 24px 78px',
    },
    cardDesc: {
        fontSize: 13, color: 'var(--theme-text-secondary)', lineHeight: 1.7, margin: '0 0 14px',
    },
    detailsRow: { display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 12 },
    detailItem: { display: 'flex', gap: 5, fontSize: 13 },
    detailLabel: { color: 'var(--theme-text-secondary)', fontWeight: 500 },
    detailValue: { color: 'var(--theme-text-main)', fontWeight: 600 },

    tagsRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 },
    tag: {
        display: 'inline-block', padding: '3px 10px', borderRadius: 16,
        background: 'var(--theme-bg-panel)', color: 'var(--theme-text-main)', fontSize: 11, fontWeight: 500,
    },

    actionsRow: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
    actionBtn: {
        padding: '9px 16px', background: 'var(--pub-navy, #1d3557)', color: '#fff', border: 'none',
        borderRadius: 10, fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
    },
    actionBtnOutline: {
        padding: '9px 16px', background: 'var(--theme-bg-card)', color: 'var(--theme-text-main)',
        border: '1px solid var(--theme-text-main)', borderRadius: 10, fontSize: 13, fontWeight: 500,
        fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
    },
    actionLink: {
        fontSize: 13, fontWeight: 500, color: 'var(--theme-text-main)', textDecoration: 'none',
        marginLeft: 4,
    },

    /* Empty */
    empty: {
        textAlign: 'center', padding: '60px 20px',
        background: 'var(--theme-bg-card)', borderRadius: 14,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
    },

    /* Reference */
    refBlock: {
        marginTop: 28, padding: '20px 24px', borderRadius: 14,
        background: 'var(--theme-bg-card)', display: 'flex', alignItems: 'flex-start', gap: 14,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
    },
    refIconWrap: {
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: 'var(--theme-bg-panel)', color: 'var(--theme-text-main)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    refTitle: { fontSize: 14, fontWeight: 600, color: 'var(--theme-text-main)', marginBottom: 4 },
    refText: { fontSize: 13, color: 'var(--theme-text-secondary)', lineHeight: 1.6 },
}
