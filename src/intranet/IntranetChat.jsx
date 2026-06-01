import { useState, useRef, useEffect } from 'react'
import { CHAT_CONVERSATIONS } from './data/intranetData'
import './intranet.css'

export default function IntranetChat() {
    const [activeId, setActiveId] = useState(CHAT_CONVERSATIONS[0].id)
    const [draft, setDraft] = useState('')
    const [localMessages, setLocalMessages] = useState({})
    const bodyRef = useRef(null)

    const active = CHAT_CONVERSATIONS.find(c => c.id === activeId)
    const messages = [...active.messages, ...(localMessages[activeId] || [])]

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
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">Внутренний чат</h1>
                    <p className="intra-page-head__sub">Сообщения между сотрудниками и подразделениями.</p>
                </div>
            </div>

            <div className="intra-chat">
                <aside className="intra-chat__list">
                    {CHAT_CONVERSATIONS.map(c => (
                        <button key={c.id}
                            className={`intra-chat__item${c.id === activeId ? ' intra-chat__item--active' : ''}`}
                            onClick={() => setActiveId(c.id)}>
                            <div className="intra-chat__avatar">{c.avatar}</div>
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
                </aside>

                <section className="intra-chat__main">
                    <header className="intra-chat__header">
                        <div className="intra-chat__avatar">{active.avatar}</div>
                        <div>
                            <div className="intra-chat__item-name">{active.with}</div>
                            <div className="intra-chat__item-dept">{active.dept}</div>
                        </div>
                    </header>
                    <div className="intra-chat__body" ref={bodyRef}>
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
                        <button className="intra-chat__send" onClick={send} disabled={!draft.trim()}>
                            Отправить
                        </button>
                    </footer>
                </section>
            </div>
        </div>
    )
}
