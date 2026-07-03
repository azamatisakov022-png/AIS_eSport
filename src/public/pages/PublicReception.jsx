import PublicHero from '../components/PublicHero'
import './publicPages.css'

/* Обращения и жалобы граждан (ответ заказчика, 2026-07-02):
   приём ведёт государственный портал «АИС Отзывы» (egov.kg); отвечает
   Отдел документационного обеспечения и контроля исполнения.
   Решение — просто ссылка на портал (без своей формы приёма). */

const OTZYVY = 'https://egov.kg/kg/ministry/sport'

const IconExternal = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8, verticalAlign: '-3px' }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
)

export default function PublicReception() {
    return (
        <div className="pub-section">
            <PublicHero
                title="Обращения и жалобы граждан"
                description="Приём обращений, жалоб и предложений ведётся через государственный портал «АИС Отзывы» на egov.kg."
                variant="indigo"
                layoutMode="abstract"
            />

            <div className="pub-container pp-wrap" style={{ paddingTop: 8 }}>
                <div className="pub-card" style={{ padding: '28px 30px', maxWidth: 760, display: 'block' }}>
                    <h2 className="pp-block__title" style={{ marginTop: 0 }}>Как подать обращение</h2>
                    <p style={{ color: 'var(--pub-text-secondary, #475569)', lineHeight: 1.6, marginBottom: 16 }}>
                        Обращения, жалобы и предложения граждан принимаются через государственный портал
                        «АИС Отзывы». Рассмотрением занимается Отдел документационного обеспечения и контроля
                        исполнения ГАФКиС.
                    </p>
                    <ul style={{ color: 'var(--pub-text-secondary, #475569)', lineHeight: 1.7, paddingLeft: 20, marginBottom: 22 }}>
                        <li>Обращения рассматриваются в порядке, установленном Законом КР «О порядке рассмотрения обращений граждан».</li>
                        <li>Подать обращение и отследить его статус можно на портале egov.kg.</li>
                    </ul>

                    <a href={OTZYVY} target="_blank" rel="noopener noreferrer" className="pp-form__submit" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                        Оставить обращение на портале egov.kg <IconExternal />
                    </a>
                    <p className="pp-form__note" style={{ marginTop: 12 }}>Отвечает Отдел документационного обеспечения и контроля исполнения ГАФКиС.</p>
                </div>
            </div>
        </div>
    )
}
