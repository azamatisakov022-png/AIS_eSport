import './intranet.css'

/**
 * Универсальный «scaffold» для подразделов интранета,
 * содержательное наполнение которых придёт в следующих этапах.
 * Сохраняет полную навигацию интранета работоспособной уже сейчас.
 */
const DEFAULT_ICON = <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z"/></svg>

export default function IntranetPlaceholder({ icon = DEFAULT_ICON, title, description }) {
    return (
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">{title}</h1>
                    <p className="intra-page-head__sub">{description}</p>
                </div>
            </div>

            <div className="intra-soon">
                <div className="intra-soon__icon">{icon}</div>
                <h2 className="intra-soon__title">Скоро</h2>
                <p className="intra-soon__sub">
                    Раздел запланирован к реализации в следующих этапах модуля «Интранет / документооборот».
                    Структура навигации, права доступа и стилистика уже встроены.
                </p>
            </div>
        </div>
    )
}
