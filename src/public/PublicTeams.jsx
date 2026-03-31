import React, { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal, useCardTilt } from './useDesignEffects'
import PublicHero, { PublicHeroCounter } from './components/PublicHero'
import { PublicFiltersContainer, PublicFilterInput, PublicFilterSelect } from './components/PublicFilters'
import PublicPagination from './components/PublicPagination'

const SPORTS = ['Бокс', 'Вольная борьба', 'Греко-римская борьба', 'Женская борьба', 'Дзюдо', 'Лёгкая атлетика', 'Тхэквондо', 'Тяжёлая атлетика', 'Плавание']
const CATEGORIES = ['Национальная', 'U-23 (Молодёжная)', 'U-20 (Юниорская)', 'U-17 (Юношеская)']

const MOCK = [
    { id: 1, sport: 'Вольная борьба', category: 'Национальная', gender: 'Мужская', coach: 'Толепбергенов Руслан', athletes: 10 },
    { id: 2, sport: 'Женская борьба', category: 'Национальная', gender: 'Женская', coach: 'Изабеков Нурбек', athletes: 8 },
    { id: 3, sport: 'Дзюдо', category: 'Национальная', gender: 'Мужская', coach: 'Абдужалил уулу Абдурахим', athletes: 14 },
    { id: 4, sport: 'Бокс', category: 'Национальная', gender: 'Мужская', coach: 'Асанов Данияр', athletes: 13 },
    { id: 5, sport: 'Вольная борьба', category: 'U-23 (Молодёжная)', gender: 'Мужская', coach: 'Махмудов Азат', athletes: 15 },
    { id: 6, sport: 'Лёгкая атлетика', category: 'Национальная', gender: 'Смешанная', coach: 'Борисов Виктор', athletes: 12 },
    { id: 7, sport: 'Тхэквондо', category: 'Национальная', gender: 'Мужская', coach: 'Пон Вадим', athletes: 10 },
]

export default function PublicTeams() {
    const { t } = useTranslation()
    const revealCards = useScrollReveal()
    const tilt = useCardTilt()

    const [search, setSearch] = useState('')
    const [sport, setSport] = useState('')
    const [cat, setCat] = useState('')
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    const PER_PAGE = 8

    useEffect(() => {
        setLoading(true)
        const timeout = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(timeout)
    }, [search, sport, cat, page])

    const filtered = useMemo(() => MOCK.filter(tm => {
        if (search && !tm.sport.toLowerCase().includes(search.toLowerCase()) && !tm.coach.toLowerCase().includes(search.toLowerCase())) return false
        if (sport && tm.sport !== sport) return false
        if (cat && tm.category !== cat) return false
        return true
    }), [search, sport, cat])

    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    const reset = () => { setSearch(''); setSport(''); setCat(''); setPage(1) }

    const s = {
        grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
        card: { background: 'var(--theme-bg-card)', borderRadius: 16, border: '1px solid var(--theme-border)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, cursor: 'pointer' },
        cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
        sportTitle: { fontSize: 18, fontWeight: 700, color: 'var(--theme-text-main)', marginBottom: 6, lineHeight: 1.2 },
        badge: { display: 'inline-block', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: 'rgba(110, 110, 115, 0.15)', color: 'var(--theme-text-main)' },
        badgeAccent: { display: 'inline-block', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: 'rgba(29, 78, 216, 0.15)', color: '#8AB4F8' },
        row: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #F2F2F7', fontSize: 13 },
        rowLbl: { color: 'var(--theme-text-secondary)' },
        rowVal: { color: 'var(--theme-text-main)', fontWeight: 500 },
        resultsCount: { fontSize: 14, color: 'var(--theme-text-secondary)', marginBottom: 20 }
    }

    return (
        <>
            <PublicHero title="Сборные команды" description="Составы национальных и резервных сборных команд Кыргызской Республики по олимпийским и неолимпийским видам спорта." variant="blue" layoutMode="abstract">
                <PublicHeroCounter animRef={{ current: null }} value={MOCK.length} label="Сборных команд" />
                <PublicHeroCounter animRef={{ current: null }} value="250+" label="Спортсменов" />
                <PublicHeroCounter animRef={{ current: null }} value={8} label="Видов спорта" />
            </PublicHero>

            <div className="pub-section">
                <div className="pub-container">
                    <PublicFiltersContainer onSubmit={e => { e.preventDefault(); setPage(1) }} onReset={reset}>
                        <PublicFilterInput placeholder="Поиск по виду спорта или тренеру..." value={search} onChange={e => setSearch(e.target.value)} />
                        <PublicFilterSelect value={sport} onChange={e => setSport(e.target.value)} options={SPORTS} defaultOption="Все виды спорта" />
                        <PublicFilterSelect value={cat} onChange={e => setCat(e.target.value)} options={CATEGORIES} defaultOption="Все составы" />
                    </PublicFiltersContainer>

                    <p style={s.resultsCount}>{t('public.found')} <strong>{filtered.length}</strong></p>

                    {loading ? (
                        <div style={s.grid}>
                            {Array(PER_PAGE).fill(0).map((_, i) => (
                                <div key={i} style={s.card}>
                                    <div className="skeleton-box" style={{ width: 160, height: 24, borderRadius: 6, marginBottom: 8 }} />
                                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                                        <div className="skeleton-box" style={{ width: 90, height: 22, borderRadius: 8 }} />
                                        <div className="skeleton-box" style={{ width: 70, height: 22, borderRadius: 8 }} />
                                    </div>
                                    <div className="skeleton-box skeleton-text" style={{ width: '100%', height: 16, marginTop: 12 }} />
                                    <div className="skeleton-box skeleton-text" style={{ width: '100%', height: 16 }} />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--theme-text-main)', marginTop: 12 }}>Команды не найдены</div>
                            <div style={{ fontSize: 13, color: 'var(--theme-text-secondary)', marginTop: 4 }}>Попробуйте изменить параметры фильтрации</div>
                        </div>
                    ) : (
                        <div ref={revealCards} className="scroll-reveal" style={s.grid}>
                            {paged.map((team, idx) => (
                                <div key={team.id} style={{ '--i': idx }} className="pub-card stagger-item card-tilt-3d" {...tilt}>
                                    <div style={s.cardTop}>
                                        <div style={s.sportTitle}>{team.sport}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <span style={s.badgeAccent}>{team.category}</span>
                                        <span style={s.badge}>{team.gender}</span>
                                    </div>
                                    <div style={{ marginTop: 8 }}>
                                        <div style={s.row}><span style={s.rowLbl}>Главный / Старший тренер</span><span style={s.rowVal}>{team.coach}</span></div>
                                        <div style={s.row}><span style={s.rowLbl}>Спортсменов в составе</span><span style={s.rowVal}>{team.athletes}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <PublicPagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
                </div>
            </div>
        </>
    )
}
