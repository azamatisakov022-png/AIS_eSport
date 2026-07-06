import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { askAssistant } from './assistantEngine'
import './aiAssistant.css'

/**
 * Floating AI assistant widget.
 * Mounts on both portals; `context` switches suggestions/answers.
 *
 * Props:
 *   context: 'public' | 'internal'
 */
const WELCOME = {
    public: {
        text: 'Здравствуйте! Я цифровой помощник АИС eSport. Помогу сориентироваться на портале, расскажу о госуслугах и проверке документов.',
        suggestions: ['Как подать заявку на звание?', 'Где проверить документ?', 'Найти спортобъект', 'Госуслуги'],
    },
    internal: {
        text: 'Здравствуйте! Я помощник по внутреннему порталу. Подскажу, где найти реестры, как работать с заявками и где смотреть аналитику.',
        suggestions: ['Где реестр спортсменов?', 'Заявки на рассмотрении', 'Открыть аналитику', 'Настройки'],
    },
}

let msgId = 0
const nextId = () => `m${++msgId}`

export default function AiAssistant({ context = 'public', initialOpen = false }) {
    const navigate = useNavigate()
    const [open, setOpen] = useState(!!initialOpen)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [thinking, setThinking] = useState(false)

    const scrollRef = useRef(null)
    const inputRef = useRef(null)
    const panelRef = useRef(null)
    const launcherRef = useRef(null)

    /* Seed welcome message on first open */
    useEffect(() => {
        if (open && messages.length === 0) {
            const w = WELCOME[context] || WELCOME.public
            setMessages([{ id: nextId(), role: 'bot', text: w.text, suggestions: w.suggestions }])
        }
    }, [open, context, messages.length])

    /* Auto-scroll to newest message */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, thinking])

    /* Focus input when opening; ESC closes; return focus to launcher */
    useEffect(() => {
        if (!open) return
        const t = setTimeout(() => inputRef.current?.focus(), 80)
        const onKey = (e) => { if (e.key === 'Escape') closePanel() }
        document.addEventListener('keydown', onKey)
        return () => { clearTimeout(t); document.removeEventListener('keydown', onKey) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const closePanel = useCallback(() => {
        setOpen(false)
        setTimeout(() => launcherRef.current?.focus(), 50)
    }, [])

    const send = useCallback(async (raw) => {
        const text = (raw ?? input).trim()
        if (!text || thinking) return
        setInput('')
        setMessages(prev => [...prev, { id: nextId(), role: 'user', text }])
        setThinking(true)
        try {
            const res = await askAssistant(text, { context })
            setMessages(prev => [...prev, {
                id: nextId(), role: 'bot',
                text: res.text, links: res.links, suggestions: res.suggestions,
            }])
        } catch {
            setMessages(prev => [...prev, {
                id: nextId(), role: 'bot',
                text: 'Извините, сейчас не получается ответить. Попробуйте позже или воспользуйтесь меню сайта.',
            }])
        } finally {
            setThinking(false)
        }
    }, [input, thinking, context])

    const onLink = useCallback((to) => {
        closePanel()
        navigate(to)
    }, [navigate, closePanel])

    return (
        <>
            {/* Launcher button */}
            <button
                ref={launcherRef}
                type="button"
                className={`ai-launcher${open ? ' is-hidden' : ''}`}
                onClick={() => setOpen(true)}
                aria-label="Открыть цифрового помощника"
                aria-expanded={open}
            >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <circle cx="8.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
                    <circle cx="12" cy="10.5" r="1" fill="currentColor" stroke="none" />
                    <circle cx="15.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                <span className="ai-launcher__pulse" aria-hidden="true" />
            </button>

            {/* Chat panel */}
            <div
                ref={panelRef}
                className={`ai-panel${open ? ' is-open' : ''}`}
                role="dialog"
                aria-label="Цифровой помощник АИС eSport"
                aria-hidden={!open}
            >
                <header className="ai-panel__header">
                    <div className="ai-panel__title">
                        <span className="ai-panel__avatar" aria-hidden="true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z" />
                                <path d="M5 21v-1a7 7 0 0 1 14 0v1" />
                            </svg>
                        </span>
                        <div>
                            <strong>Цифровой помощник</strong>
                            <small>АИС eSport · {context === 'internal' ? 'внутренний портал' : 'портал ГАФКиС'}</small>
                        </div>
                    </div>
                    <button type="button" className="ai-panel__close" onClick={closePanel} aria-label="Свернуть помощника">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </header>

                <div className="ai-panel__messages" ref={scrollRef}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`ai-msg ai-msg--${msg.role}`}>
                            <div className="ai-msg__bubble">
                                {msg.text.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                            </div>
                            {msg.links && msg.links.length > 0 && (
                                <div className="ai-msg__links">
                                    {msg.links.map((lnk, i) => (
                                        <button key={i} type="button" className="ai-msg__link" onClick={() => onLink(lnk.to)}>
                                            {lnk.label}
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {msg.suggestions && msg.suggestions.length > 0 && (
                                <div className="ai-msg__chips">
                                    {msg.suggestions.map((s, i) => (
                                        <button key={i} type="button" className="ai-chip" onClick={() => send(s)}>{s}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {thinking && (
                        <div className="ai-msg ai-msg--bot">
                            <div className="ai-msg__bubble ai-msg__bubble--typing" aria-label="Помощник печатает">
                                <span /><span /><span />
                            </div>
                        </div>
                    )}
                </div>

                <form className="ai-panel__input" onSubmit={(e) => { e.preventDefault(); send() }}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Напишите вопрос…"
                        aria-label="Сообщение помощнику"
                        disabled={thinking}
                    />
                    <button type="submit" disabled={!input.trim() || thinking} aria-label="Отправить">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </form>
                <div className="ai-panel__disclaimer">ИИ-помощник может ошибаться. Проверяйте важную информацию.</div>
            </div>
        </>
    )
}
