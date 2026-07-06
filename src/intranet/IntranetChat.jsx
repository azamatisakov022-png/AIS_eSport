import { useState, useRef, useEffect, useMemo } from 'react'
import { CHAT_CONVERSATIONS } from './data/intranetData'
import './intranet.css'

/* Нейтральный аватар: группа — иконка, человек — инициалы (без цветных кружков) */
function Avatar({ conv }) {
    const isGroup = conv.dept === 'Группа'
    return (
        <div className="intra-chat__avatar" aria-hidden>
            {isGroup
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                : conv.avatar}
        </div>
    )
}

export default function IntranetChat() {
    const [activeId, setActiveId] = useState(CHAT_CONVERSATIONS[0].id)
    const [draft, setDraft] = useState('')
    const [q, setQ] = useState('')
    const [localMessages, setLocalMessages] = useState({})
    const bodyRef = useRef(null)

    const active = CHAT_CONVERSATIONS.find(c => c.id === activeId)
    const messages = [...active.messages, ...(localMessages[activeId] || [])]

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase()
        if (!ql) return CHAT_CONVERSATIONS
        return CHAT_CONVERSATIONS.filter(c =>
            c.with.toLowerCase().includes(ql) || c.dept.toLowerCase().includes(ql) || c.last.toLowerCase().includes(ql))
    }, [q])

    useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }, [activeId, localMessages])

    const send = () => {
        const t = draft.trim()
        if (!t) return
        setLocalMessages(prev => ({
            ...prev,
            [activeId]: [...(prev[activeId] || []), { from: 'me', text: t, time: 'сейчас' }]
        }))
        setDraft('')
    }

    return (
        /* Полноэкранный режим: чат занимает всю контентную зону без полей */
        <div className="intra intra--chat">
            <div className="intra-chat">
                <aside className="intra-chat__list">
                    <div className="intra-chat__search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Поиск…" aria-label="Поиск по диалогам" />
                    </div>
                    {filtered.map(c => (
                        <button key={c.id}
                            className={`intra-chat__item${c.id === activeId ? ' intra-chat__item--active' : ''}`}
                            onClick={() => setActiveId(c.id)}>
                            <Avatar conv={c} />
                            <div className="intra-chat__item-body">
                                <div className="intra-chat__item-top">
                                    <span className="intra-chat__item-name">{c.with}</span>
                                    <span className="intra-chat__item-time">{c.lastTime}</span>
                                </div>
                                <div className="intra-chat__item-bot">
                                    <span className="intra-chat__item-last">{c.last}</span>
                                    {c.unread > 0 && <span className="intra-chat__item-unread">{c.unread}</span>}
                                </div>
                                <div className="intra-chat__item-dept">{c.dept}</div>
                            </div>
                        </button>
                    ))}
                    {filtered.length === 0 && (
                        <div className="intra-chat__empty">Диалоги не найдены</div>
                    )}
                </aside>

                <section className="intra-chat__main">
                    <header className="intra-chat__header">
                        <Avatar conv={active} />
                        <div>
                            <div className="intra-chat__item-name">{active.with}</div>
                            <div className="intra-chat__item-dept">{active.dept}</div>
                        </div>
                    </header>
                    <div className="intra-chat__body" ref={bodyRef}>
                        <div className="intra-chat__day"><span>Сегодня</span></div>
                        {messages.map((m, i) => (
                            <div key={i} className={`intra-chat__msg intra-chat__msg--${m.from}`}>
                                <div className="intra-chat__bubble">{m.text}</div>
                                <div className="intra-chat__msg-time">{m.time}</div>
                            </div>
                        ))}
                    </div>
                    <footer className="intra-chat__compose">
                        <input
                            value={draft}
                            onChange={e => setDraft(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') send() }}
                            placeholder="Сообщение…"
                            className="intra-chat__input"
                        />
                        <button className="intra-chat__send" onClick={send} disabled={!draft.trim()} aria-label="Отправить">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        </button>
                    </footer>
                </section>
            </div>
        </div>
    )
}
