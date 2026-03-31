import './Placeholder.css'

export default function Applications() {
    return (
        <div className="placeholder-page">
            <div className="placeholder-page__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
            <h2 className="placeholder-page__title">Заявления</h2>
            <p className="placeholder-page__desc">
                Онлайн приём и обработка заявлений, маршруты согласования, импорт из СМЭВ «Түндүк».
            </p>
            <span className="placeholder-page__badge">В разработке</span>
        </div>
    )
}
