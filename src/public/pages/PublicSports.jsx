import { useState, useMemo } from 'react'
import PublicHero, { PublicHeroCounter } from '../components/PublicHero'
import { useAnimatedCounter } from '../useDesignEffects'
import { SPORTS, SPORT_CATS } from './publicContent'
import './publicPages.css'

export default function PublicSports() {
    const [cat, setCat] = useState('all')
    const [q, setQ] = useState('')

    const cntSports = useAnimatedCounter(SPORTS.length)
    const cntCats = useAnimatedCounter(Object.keys(SPORT_CATS).length)

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase()
        return SPORTS.filter(s => (cat === 'all' || s.cat === cat) && (!ql || s.name.toLowerCase().includes(ql)))
    }, [cat, q])

    return (
        <div className="pub-section">
            <PublicHero title="Виды спорта" description="Признанные виды спорта в Кыргызской Республике: олимпийские, неолимпийские, национальные и адаптивные." variant="violet" layoutMode="abstract">
                <PublicHeroCounter animRef={cntSports.ref} value={cntSports.value} label="видов спорта" />
                <PublicHeroCounter animRef={cntCats.ref} value={cntCats.value} label="категорий" />
            </PublicHero>

            <div className="pub-container pp-wrap">
                <div className="pp-toolbar">
                    <input className="pp-search" placeholder="Поиск вида спорта…" value={q} onChange={e => setQ(e.target.value)} />
                    <div className="pp-chips">
                        <button className={`pp-chip${cat === 'all' ? ' pp-chip--active' : ''}`} onClick={() => setCat('all')}>Все</button>
                        {Object.entries(SPORT_CATS).map(([k, label]) => (
                            <button key={k} className={`pp-chip${cat === k ? ' pp-chip--active' : ''}`} onClick={() => setCat(k)}>
                                {label} <span className="pp-chip__count">{SPORTS.filter(s => s.cat === k).length}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pp-grid pp-grid--4">
                    {filtered.map((s, i) => (
                        <div key={i} className="pp-sport">
                            <div className="pp-sport__icon">{s.icon}</div>
                            <div className="pp-sport__name">{s.name}</div>
                            <div className="pp-sport__cat">{SPORT_CATS[s.cat]}</div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="pp-empty"><div className="pp-empty__icon">🎯</div>Ничего не найдено.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
