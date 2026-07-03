import { useState, useMemo, useEffect } from 'react'
import { useScrollReveal, useAnimatedCounter, useCardTilt } from './useDesignEffects'
import PublicPagination from './components/PublicPagination'
import PublicSelect from './components/PublicSelect'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PublicHero, { PublicHeroCounter } from './components/PublicHero'
import { publicApi } from '../api/esport'

const SPORTS = ['Бокс', 'Борьба', 'Дзюдо', 'Футбол', 'Плавание', 'Лёгкая атлетика', 'Каратэ', 'Тхэквондо', 'Гимнастика', 'Шахматы', 'Тяжёлая атлетика', 'Стрельба']
const REGIONS = ['Бишкек', 'Ош', 'Чуйская', 'Иссык-Кульская', 'Джалал-Абадская', 'Нарынская', 'Баткенская', 'Таласская', 'Ошская']
const RANKS_LIST = ['ЗМС КР', 'МСМК', 'МС КР', 'КМС', 'I разряд', 'II разряд', 'III разряд', 'I юн.', 'II юн.', 'III юн.']

const RANK_BADGE = {
    'ЗМС КР': { bg: 'rgba(255, 59, 48, 0.15)', color: '#FF3B30' },
    'МСМК': { bg: 'rgba(88, 86, 214, 0.15)', color: '#5856D6' },
    'МС КР': { bg: 'rgba(0, 122, 255, 0.15)', color: '#007AFF' },
    'КМС': { bg: 'rgba(52, 199, 89, 0.15)', color: '#34C759' },
}
const RANK_DEFAULT = { bg: 'rgba(142, 142, 147, 0.15)', color: '#8E8E93' }

function getRankStyle(rank) {
    return RANK_BADGE[rank] || RANK_DEFAULT
}

export const ATHLETES_DATA = [
    { id: 1, name: 'Тыныстанов Айбек Маратович', birth: 1998, sex: 'М', sport: 'Дзюдо', rank: 'ЗМС КР', region: 'Бишкек', coach: 'Асанов Б.М.', org: 'СДЮСШОР №3', team: 'Сборная КР по дзюдо', certNo: 'УД-КР-2024-00012', certDate: '2024-01-15', medals: [{ place: 1, event: 'Чемпионат Азии', year: 2023 }, { place: 2, event: 'Гран-при Ташкент', year: 2024 }, { place: 1, event: 'Чемпионат КР', year: 2024 }] },
    { id: 2, name: 'Алымбекова Айпери Нурлановна', birth: 2001, sex: 'Ж', sport: 'Лёгкая атлетика', rank: 'МСМК', region: 'Бишкек', coach: 'Кулматова А.С.', org: 'ДЮСШ «Олимп»', team: 'Сборная КР по л/а', certNo: 'УД-КР-2024-00034', certDate: '2024-03-20', medals: [{ place: 1, event: 'Чемпионат ЦА', year: 2024 }, { place: 3, event: 'Азиатские игры', year: 2023 }] },
    { id: 3, name: 'Сыдыков Нурбек Кубанычбекович', birth: 1996, sex: 'М', sport: 'Бокс', rank: 'МС КР', region: 'Ош', coach: 'Джумабаев Э.К.', org: 'Ошская СДЮСШОР', team: 'Сборная КР по боксу', certNo: 'УД-КР-2023-00087', certDate: '2023-06-10', medals: [{ place: 1, event: 'Чемпионат КР', year: 2023 }, { place: 2, event: 'Кубок Азии', year: 2024 }] },
    { id: 4, name: 'Маматова Жаркынай Эмилбековна', birth: 2003, sex: 'Ж', sport: 'Борьба', rank: 'КМС', region: 'Нарынская', coach: 'Бейшеналиев Д.К.', org: 'ДЮСШ Нарынской обл.', team: null, certNo: 'УД-КР-2024-00112', certDate: '2024-05-15', medals: [{ place: 3, event: 'Первенство КР', year: 2024 }] },
    { id: 5, name: 'Кулов Эрлан Бактыбекович', birth: 2000, sex: 'М', sport: 'Тхэквондо', rank: 'МС КР', region: 'Джалал-Абадская', coach: 'Абдылдаев Н.Т.', org: 'Федерация тхэквондо', team: 'Сборная КР по тхэквондо', certNo: 'УД-КР-2023-00145', certDate: '2023-09-01', medals: [{ place: 1, event: 'Открытый Чемпионат Азии', year: 2023 }, { place: 1, event: 'Чемпионат КР', year: 2024 }] },
    { id: 6, name: 'Орозбекова Нуриза Сагынбековна', birth: 2005, sex: 'Ж', sport: 'Каратэ', rank: 'I разряд', region: 'Бишкек', coach: 'Сатыбалдиева М.А.', org: 'СДЮСШОР «Кубат»', team: null, certNo: 'УД-КР-2025-00018', certDate: '2025-01-20', medals: [{ place: 2, event: 'Первенство КР (юн.)', year: 2024 }] },
    { id: 7, name: 'Жапаров Данияр Талантбекович', birth: 1999, sex: 'М', sport: 'Футбол', rank: 'КМС', region: 'Чуйская', coach: 'Ормонов А.К.', org: 'ФК «Дордой»', team: 'Сборная КР по футболу', certNo: 'УД-КР-2024-00176', certDate: '2024-04-10', medals: [] },
    { id: 8, name: 'Асанбекова Мээрим Кайратовна', birth: 2002, sex: 'Ж', sport: 'Плавание', rank: 'МС КР', region: 'Иссык-Кульская', coach: 'Токтогулова Н.А.', org: 'СК «Иссык-Куль»', team: 'Сборная КР по плаванию', certNo: 'УД-КР-2024-00215', certDate: '2024-06-01', medals: [{ place: 1, event: 'Чемпионат КР', year: 2024 }, { place: 2, event: 'Кубок ЦА', year: 2023 }] },
    { id: 9, name: 'Бекмуратов Тимур Алмазович', birth: 1997, sex: 'М', sport: 'Борьба', rank: 'ЗМС КР', region: 'Бишкек', coach: 'Бейшеналиев Д.К.', org: 'СДЮСШОР №3', team: 'Сборная КР по борьбе', certNo: 'УД-КР-2022-00054', certDate: '2022-08-22', medals: [{ place: 1, event: 'Чемпионат Азии', year: 2022 }, { place: 1, event: 'Чемпионат КР', year: 2023 }, { place: 3, event: 'Чемпионат мира', year: 2023 }] },
    { id: 10, name: 'Токтосунова Айдай Бакытбековна', birth: 2004, sex: 'Ж', sport: 'Гимнастика', rank: 'КМС', region: 'Бишкек', coach: 'Касымова Ж.Б.', org: 'СДЮСШОР по гимнастике', team: null, certNo: 'УД-КР-2024-00233', certDate: '2024-07-15', medals: [{ place: 2, event: 'Кубок КР', year: 2024 }] },
    { id: 11, name: 'Эсенов Руслан Маратович', birth: 1995, sex: 'М', sport: 'Тяжёлая атлетика', rank: 'МСМК', region: 'Ош', coach: 'Турдалиев М.С.', org: 'ДЮСШ №5 г. Ош', team: 'Сборная КР по т/а', certNo: 'УД-КР-2023-00089', certDate: '2023-03-28', medals: [{ place: 1, event: 'Чемпионат ЦА', year: 2023 }, { place: 2, event: 'Чемпионат Азии', year: 2024 }] },
    { id: 12, name: 'Калыкова Бурул Жумабековна', birth: 2006, sex: 'Ж', sport: 'Дзюдо', rank: 'II разряд', region: 'Таласская', coach: 'Асанов Б.М.', org: 'Таласская ДЮСШ', team: null, certNo: 'УД-КР-2025-00044', certDate: '2025-02-01', medals: [] },
    { id: 13, name: 'Омуралиев Бакыт Эркинбекович', birth: 2001, sex: 'М', sport: 'Стрельба', rank: 'МС КР', region: 'Бишкек', coach: 'Абдылдаев Н.Т.', org: 'Стрелковый клуб КР', team: 'Сборная КР по стрельбе', certNo: 'УД-КР-2024-00067', certDate: '2024-02-14', medals: [{ place: 1, event: 'Чемпионат КР', year: 2024 }] },
    { id: 14, name: 'Сагынбаева Нурайым Талантовна', birth: 2007, sex: 'Ж', sport: 'Лёгкая атлетика', rank: 'III юн.', region: 'Баткенская', coach: 'Кулматова А.С.', org: 'ДЮСШ Баткенской обл.', team: null, certNo: 'УД-КР-2025-00055', certDate: '2025-02-10', medals: [] },
    { id: 15, name: 'Турсунбаев Азамат Кубатович', birth: 1994, sex: 'М', sport: 'Бокс', rank: 'МС КР', region: 'Ошская', coach: 'Джумабаев Э.К.', org: 'Ошская СДЮСШОР', team: 'Сборная КР по боксу', certNo: 'УД-КР-2023-00101', certDate: '2023-05-05', medals: [{ place: 1, event: 'Чемпионат КР', year: 2023 }, { place: 3, event: 'Кубок Азии', year: 2024 }] },
    { id: 16, name: 'Шамшиева Дамира Маратовна', birth: 2003, sex: 'Ж', sport: 'Шахматы', rank: 'I разряд', region: 'Бишкек', coach: 'Жумагулов Т.Э.', org: 'Шахматный клуб «Стратегия»', team: null, certNo: 'УД-КР-2024-00198', certDate: '2024-08-20', medals: [{ place: 2, event: 'Первенство ЦА (юн.)', year: 2024 }] },
    { id: 17, name: 'Кадыров Нурлан Бакытович', birth: 2000, sex: 'М', sport: 'Каратэ', rank: 'КМС', region: 'Бишкек', coach: 'Сатыбалдиева М.А.', org: 'СДЮСШОР «Кубат»', team: 'Сборная КР по каратэ', certNo: 'УД-КР-2024-00210', certDate: '2024-09-05', medals: [{ place: 1, event: 'Чемпионат КР', year: 2024 }] },
    { id: 18, name: 'Абдрахманова Элиза Кайратовна', birth: 2005, sex: 'Ж', sport: 'Плавание', rank: 'I юн.', region: 'Бишкек', coach: 'Эсенгулова А.Т.', org: 'Водный центр «Дельфин»', team: null, certNo: 'УД-КР-2025-00031', certDate: '2025-01-12', medals: [] },
]

const PER_PAGE = 12

function getInitials(name) {
    const p = name.split(' ')
    return (p[0]?.[0] || '') + (p[1]?.[0] || '')
}

function countMedals(medals) {
    let g = 0, s = 0, b = 0
    medals.forEach(m => { if (m.place === 1) g++; else if (m.place === 2) s++; else if (m.place === 3) b++ })
    return { g, s, b, total: g + s + b }
}

const MEDAL_STYLES = {
    gold: { bg: '#FFD700', color: '#8B6914' },
    silver: { bg: '#C0C0C0', color: '#666666' },
    bronze: { bg: '#CD7F32', color: '#5C3A1E' },
}

export default function PublicAthletes() {
    const { t } = useTranslation()
    const msCount = ATHLETES_DATA.filter(a => ['ЗМС КР', 'МСМК', 'МС КР'].includes(a.rank)).length
    const revealCards = useScrollReveal(0.08)
    const tilt = useCardTilt(5)
    const counter1 = useAnimatedCounter(3847)
    const counter2 = useAnimatedCounter(64)
    const counter3 = useAnimatedCounter(msCount)
    const [searchParams, setSearchParams] = useSearchParams()

    const [search, setSearch] = useState(searchParams.get('q') || '')
    const [sport, setSport] = useState(searchParams.get('sport') || '')
    const [rank, setRank] = useState(searchParams.get('rank') || '')
    const [region, setRegion] = useState(searchParams.get('region') || '')
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

    // Данные из публичного API (только подтверждённые); при недоступности - демо
    const [items, setItems] = useState(ATHLETES_DATA)
    useEffect(() => {
        let alive = true
        publicApi.athletes()
            .then(list => {
                if (!alive || !list.length) return
                setItems(list.map(a => ({
                    ...a,
                    birth: a.birth ? String(a.birth).slice(0, 4) : '',
                    medals: a.medals || [],
                })))
            })
            .catch(() => { /* остаёмся на демо-данных */ })
        return () => { alive = false }
    }, [])

    useEffect(() => {
        const params = new URLSearchParams()
        if (search) params.set('q', search)
        if (sport) params.set('sport', sport)
        if (rank) params.set('rank', rank)
        if (region) params.set('region', region)
        if (page > 1) params.set('page', page)
        setSearchParams(params, { replace: true })
    }, [search, sport, rank, region, page, setSearchParams])

    const filtered = useMemo(() => {
        return items.filter(a => {
            if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
            if (sport && a.sport !== sport) return false
            if (rank && a.rank !== rank) return false
            if (region && a.region !== region) return false
            return true
        })
    }, [items, search, sport, rank, region])

    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
    const resetFilters = () => { setSearch(''); setSport(''); setRank(''); setRegion(''); setPage(1) }
    const handleSearch = (e) => { e.preventDefault(); setPage(1) }

    return (
        <>
            {/* Hero */}
            <PublicHero title={t('public.registryTitle')} description={t('public.athletesHeroSub')} variant="slate" layoutMode="abstract">
                <PublicHeroCounter animRef={counter1.ref} value={counter1.value.toLocaleString('ru-RU')} label={t('public.registryAthletes')} />
                <PublicHeroCounter animRef={counter2.ref} value={counter2.value} label={t('public.registrySports')} />
                <PublicHeroCounter animRef={counter3.ref} value={counter3.value} label={t('public.registryMasters')} />
            </PublicHero>

            {/* Filters + Results */}
            <div className="pub-section">
                <div className="pub-container">
                    <form onSubmit={handleSearch} className="glass-panel" style={s.filters}>
                        <div style={s.filterRow}>
                            <div><input type="text" placeholder={t('public.searchByName')} value={search} onChange={e => setSearch(e.target.value)} style={s.input} /></div>
                            <div>
                                <PublicSelect value={sport} onChange={setSport} style={s.input} placeholder={t('public.allSports')} options={[{value:'', label: t('public.allSports')}, ...SPORTS.map(sp => ({value: sp, label: sp}))]} />
                            </div>
                            <div>
                                <PublicSelect value={rank} onChange={setRank} style={s.input} placeholder={t('public.allRanks')} options={[{value:'', label: t('public.allRanks')}, ...RANKS_LIST.map(r => ({value: r, label: r}))]} />
                            </div>
                            <div>
                                <PublicSelect value={region} onChange={setRegion} style={s.input} placeholder={t('public.allRegions')} options={[{value:'', label: t('public.allRegions')}, ...REGIONS.map(r => ({value: r, label: r}))]} />
                            </div>
                        </div>
                        <div style={s.filterActions}>
                            <button type="submit" style={s.findBtn}>{t('public.find')}</button>
                            <button type="button" onClick={resetFilters} style={s.resetBtn}>{t('public.reset')}</button>
                        </div>
                    </form>

                    <p style={s.resultsCount}>{t('public.found')} <strong>{filtered.length}</strong></p>

                    <div ref={revealCards} className="scroll-reveal" style={s.grid}>
                        {paged.map((a, idx) => {
                            const rc = getRankStyle(a.rank)
                            const mc = countMedals(a.medals)
                            return (
                                <Link to={`/public/athletes/${a.id}`} key={a.id} style={{ '--i': idx, textDecoration: 'none', color: 'inherit' }} className="pub-card stagger-item card-tilt-3d" {...tilt}>
                                    {/* Header */}
                                    <div style={s.cardTop}>
                                        <div style={s.avatar}>{getInitials(a.name)}</div>
                                        <div style={s.cardInfo}>
                                            <div style={s.cardName}>{a.name}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                <span style={{ ...s.badge, background: rc.bg, color: rc.color }}>{a.rank}</span>
                                                <span style={s.sportLabel}>{a.sport}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Data */}
                                    <div style={s.cardDetails}>
                                        <div style={s.cardRow}><span style={s.cardLabel}>{t('public.region')}</span><span style={s.cardValue}>{a.region}</span></div>
                                        <div style={s.cardRow}><span style={s.cardLabel}>{t('public.coach')}</span><span style={s.cardValue}>{a.coach}</span></div>
                                        <div style={s.cardRow}><span style={s.cardLabel}>{t('public.birthYear')}</span><span style={s.cardValue}>{a.birth}</span></div>
                                    </div>
                                    {/* Medals */}
                                    {mc.total > 0 && (
                                        <div style={s.cardMedals}>
                                            {mc.g > 0 && <span style={{ ...s.medalCircle, ...MEDAL_STYLES.gold }}>{mc.g}</span>}
                                            {mc.s > 0 && <span style={{ ...s.medalCircle, ...MEDAL_STYLES.silver, background: MEDAL_STYLES.silver.bg, color: MEDAL_STYLES.silver.color }}>{mc.s}</span>}
                                            {mc.b > 0 && <span style={{ ...s.medalCircle, background: MEDAL_STYLES.bronze.bg, color: MEDAL_STYLES.bronze.color }}>{mc.b}</span>}
                                            <span style={s.medalTotal}>{mc.total} медал{mc.total === 1 ? 'ь' : mc.total < 5 ? 'и' : 'ей'}</span>
                                        </div>
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div style={s.empty}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#86868B" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <p style={{ marginTop: 12 }}>{t('public.athletesNotFound')}</p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div style={s.pagination}>
                            <button style={{ ...s.pageBtn, opacity: page <= 1 ? 0.4 : 1 }} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{t('public.prev')}</button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button key={i + 1} style={{ ...s.pageBtn, ...(page === i + 1 ? s.pageBtnActive : {}) }} onClick={() => setPage(i + 1)}>{i + 1}</button>
                            ))}
                            <button style={{ ...s.pageBtn, opacity: page >= totalPages ? 0.4 : 1 }} disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>{t('public.forward')}</button>
                        </div>
                    )}
                </div>
            </div>


        </>
    )
}

const s = {
    filters: { background: 'var(--theme-bg-card)', border: '1px solid var(--theme-border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 },
    filterRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 },
    input: { width: '100%', height: '46px', padding: '12px 16px', border: '1px solid var(--theme-border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', color: 'var(--theme-text-main)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.25s ease' },
    filterActions: { display: 'flex', gap: 10, alignItems: 'center' },
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
    cardDetails: { padding: '12px 0', borderTop: '1px solid #F2F3F5', borderBottom: '1px solid #F2F3F5', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 },
    cardRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12 },
    cardLabel: { color: 'var(--theme-text-secondary)' },
    cardValue: { color: 'var(--theme-text-main)', fontWeight: 500, textAlign: 'right' },
    cardMedals: { display: 'flex', alignItems: 'center', gap: 4, marginTop: 12 },
    medalCircle: { width: 20, height: 20, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 },
    medalTotal: { marginLeft: 'auto', fontSize: 11, color: 'var(--theme-text-secondary)' },
    empty: { textAlign: 'center', padding: '48px 0', color: 'var(--theme-text-secondary)', fontSize: 15 },
    pagination: { display: 'flex', justifyContent: 'center', gap: 6, marginTop: 28 },
    pageBtn: { padding: '8px 14px', border: '1px solid var(--theme-border)', borderRadius: 10, background: 'var(--theme-bg-card)', fontSize: 13, fontFamily: 'inherit', color: 'var(--theme-text-secondary)', cursor: 'pointer' },
    pageBtnActive: { background: '#1C1C1E', color: '#fff', borderColor: '#1C1C1E' },
}
