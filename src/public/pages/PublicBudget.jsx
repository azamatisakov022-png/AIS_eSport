import { useState } from 'react'
import PublicHero from '../components/PublicHero'
import { BUDGET_YEARS, BUDGET_DATA } from './publicContent'
import './publicPages.css'

const fmtSom = (n) => (n / 1_000_000).toLocaleString('ru-RU') + ' млн сом'

export default function PublicBudget() {
    const [year, setYear] = useState(BUDGET_YEARS[0])
    const data = BUDGET_DATA[year]
    const max = Math.max(...data.programs.map(p => p.value))

    return (
        <div className="pub-section">
            <PublicHero title="Программный бюджет" description="Бюджетные программы и финансовая отчётность ГАФКиС. Открытые данные о распределении средств по направлениям." variant="emerald" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-chips" style={{ marginBottom: 28 }}>
                    {BUDGET_YEARS.map(y => (
                        <button key={y} className={`pp-chip${year === y ? ' pp-chip--active' : ''}`} onClick={() => setYear(y)}>{y} год</button>
                    ))}
                </div>

                <div className="pp-stats">
                    <div className="pp-stat">
                        <div className="pp-stat__val">{fmtSom(data.total)}</div>
                        <div className="pp-stat__label">Всего на {year} год</div>
                    </div>
                    <div className="pp-stat">
                        <div className="pp-stat__val">{data.programs.length}</div>
                        <div className="pp-stat__label">Программ</div>
                    </div>
                </div>

                <div className="pp-block">
                    <h2 className="pp-block__title">Распределение по программам</h2>
                    <div className="pp-info">
                        {data.programs.map((p, i) => (
                            <div key={i} className="pp-budget-bar">
                                <div className="pp-budget-bar__top">
                                    <span className="pp-budget-bar__name">{p.name}</span>
                                    <span className="pp-budget-bar__val">{fmtSom(p.value)} · {Math.round(p.value / data.total * 100)}%</span>
                                </div>
                                <div className="pp-budget-bar__track">
                                    <div className="pp-budget-bar__fill" style={{ width: `${Math.round(p.value / max * 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="pp-form__note">Данные приведены в справочных целях. Официальная отчётность публикуется в соответствии с законодательством Кыргызской Республики о доступе к информации.</p>
            </div>
        </div>
    )
}
