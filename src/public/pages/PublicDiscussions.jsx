import PublicHero from '../components/PublicHero'
import './publicPages.css'

/* Общественное обсуждение проектов НПА (ответ юротдела, 2026-07-02):
   обсуждение идёт не на сайте ГАФКиС, а на Едином портале Минюста КР.
   Решение заказчика — просто дать ссылку на портал (без своей формы приёма). */

const KOOMTALKUU = 'https://koomtalkuu.gov.kg/ru'

const IconExternal = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8, verticalAlign: '-3px' }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
)

export function PublicDiscussionsList() {
    return (
        <div className="pub-section">
            <PublicHero
                title="Общественное обсуждение проектов НПА"
                description="Проекты нормативных правовых актов ГАФКиС выносятся на общественное обсуждение на Едином портале Министерства юстиции Кыргызской Республики."
                variant="emerald"
                layoutMode="abstract"
            />

            <div className="pub-container pp-wrap" style={{ paddingTop: 8 }}>
                <div className="pub-card" style={{ padding: '28px 30px', maxWidth: 760, display: 'block' }}>
                    <h2 className="pp-block__title" style={{ marginTop: 0 }}>Где проходит обсуждение</h2>
                    <p style={{ color: 'var(--pub-text-secondary, #475569)', lineHeight: 1.6, marginBottom: 16 }}>
                        Проекты подзаконных актов, затрагивающие права и обязанности граждан и юридических лиц,
                        а также регулирующие предпринимательскую деятельность, публикуются на Едином портале
                        общественного обсуждения проектов НПА Кыргызской Республики.
                    </p>
                    <ul style={{ color: 'var(--pub-text-secondary, #475569)', lineHeight: 1.7, paddingLeft: 20, marginBottom: 22 }}>
                        <li>Срок обсуждения — не менее 15 календарных дней.</li>
                        <li>Оставить предложение можно после авторизации или регистрации на портале.</li>
                        <li>Все комментарии общедоступны; по итогам исполнитель формирует сводную таблицу об учёте или отклонении предложений.</li>
                    </ul>

                    <a href={KOOMTALKUU} target="_blank" rel="noopener noreferrer" className="pp-form__submit" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                        Перейти на портал общественного обсуждения <IconExternal />
                    </a>
                    <p className="pp-form__note" style={{ marginTop: 12 }}>koomtalkuu.gov.kg — Единый портал Министерства юстиции КР.</p>
                </div>
            </div>
        </div>
    )
}
