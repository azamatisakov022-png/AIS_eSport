import './intranet.css'

/**
 * Универсальный «scaffold» для подразделов интранета,
 * содержательное наполнение которых придёт в следующих этапах.
 * Сохраняет полную навигацию интранета работоспособной уже сейчас.
 */
export default function IntranetPlaceholder({ icon = '🛠️', title, description }) {
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
