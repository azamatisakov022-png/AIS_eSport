import { useState } from 'react'
import PublicHero from '../components/PublicHero'
import { BUDGET_YEARS, BUDGET_DATA } from './publicContent'
import './publicPages.css'
import './ppRich.css'

const PAL = ['#0f1b2d', '#1d3557', '#274a78', '#3a5f93', '#6c84a6', '#9fb2c8']
const mln = (n) => (n / 1_000_000).toLocaleString('ru-RU')

function Donut({ programs, total }) {
    const R = 64, C = 2 * Math.PI * R
    let off = 0
    return (
        <svg viewBox="0 0 160 160" className="pb-donut" aria-hidden>
            <g transform="rotate(-90 80 80)">
                {programs.map((p, i) => {
                    const pct = p.value / total
                    const len = pct * C
                    const el = <circle key={i} cx="80" cy="80" r={R} fill="none" stroke={PAL[i % PAL.length]} strokeWidth="24" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} />
                    off += len
                    return el
                })}
            </g>
            <text x="80" y="76" textAnchor="middle" className="pb-donut__t1">{mln(total)}</text>
            <text x="80" y="95" textAnchor="middle" className="pb-donut__t2">МЛН СОМ</text>
        </svg>
    )
}

export default function PublicBudget() {
    const [year, setYear] = useState(BUDGET_YEARS[0])
    const data = BUDGET_DATA[year]
    const prevYear = BUDGET_YEARS[BUDGET_YEARS.indexOf(year) + 1]
    const prev = prevYear ? BUDGET_DATA[prevYear] : null

    const yoyOf = (name, value) => {
        if (!prev) return null
        const p = prev.programs.find(x => x.name === name)
        if (!p || !p.value) return null
        return Math.round((value - p.value) / p.value * 100)
    }

    return (
        <div className="pub-section pp-rich">
            <PublicHero title="Программный бюджет" description="Бюджетные программы и финансовая отчётность ГАФКиС. Открытые данные о распределении средств по направлениям." variant="emerald" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-chips" style={{ marginBottom: 24 }}>
                    {BUDGET_YEARS.map(y => (
                        <button key={y} className={`pp-chip${year === y ? ' pp-chip--active' : ''}`} onClick={() => setYear(y)}>{y} год</button>
                    ))}
                </div>

                <div className="pb-card">
                    <div className="pb-left">
                        <span className="pp-eyebrow"><i />FY{year}</span>
                        <Donut programs={data.programs} total={data.total} />
                        <span className="pb-progs">{data.programs.length} программ</span>
                    </div>
                    <div className="pb-ledger">
                        <div className="pb-thead">
                            <span>ПРОГРАММА</span><span>МЛН СОМ</span><span>ДОЛЯ</span><span>Г/Г</span>
                        </div>
                        {data.programs.map((p, i) => {
                            const pct = Math.round(p.value / data.total * 100)
                            const yoy = yoyOf(p.name, p.value)
                            return (
                                <div key={i} className="pb-row">
                                    <span className="pb-name"><i style={{ background: PAL[i % PAL.length] }} />{p.name}</span>
                                    <span className="pb-sum">{mln(p.value)}</span>
                                    <span className="pb-pct">
                                        <span className="pb-bar"><b style={{ width: `${Math.min(100, pct * 2.6)}%`, background: PAL[i % PAL.length] }} /></span>
                                        <em>{pct}%</em>
                                    </span>
                                    <span className={`pb-yoy ${yoy == null ? '' : yoy < 0 ? 'is-neg' : 'is-pos'}`}>
                                        {yoy == null ? '-' : `${yoy > 0 ? '+' : ''}${yoy}%`}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <p className="pp-form__note">Данные приведены в справочных целях. Динамика «Г/Г» рассчитана к предыдущему году. Официальная отчётность публикуется в соответствии с законодательством Кыргызской Республики о доступе к информации.</p>
            </div>
        </div>
    )
}
