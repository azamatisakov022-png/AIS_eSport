import { useState, lazy, Suspense } from 'react'
import './aiAssistant.css'

/* Тело ассистента (движок + база знаний, ~50 КБ) грузится отдельным чанком
   только при первом клике — из main-бандла уезжает всё, кроме этой кнопки. */
const AssistantBody = lazy(() => import('./AiAssistant'))

export default function AiAssistantLazy(props) {
    const [activated, setActivated] = useState(false)

    if (!activated) {
        return (
            <button
                type="button"
                className="ai-launcher"
                onClick={() => setActivated(true)}
                aria-label="Открыть цифрового помощника"
                aria-expanded={false}
            >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <circle cx="8.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
                    <circle cx="12" cy="10.5" r="1" fill="currentColor" stroke="none" />
                    <circle cx="15.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                <span className="ai-launcher__pulse" aria-hidden="true" />
            </button>
        )
    }

    return (
        <Suspense fallback={null}>
            <AssistantBody {...props} initialOpen />
        </Suspense>
    )
}
