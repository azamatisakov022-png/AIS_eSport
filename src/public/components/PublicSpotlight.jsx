import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ATHLETES_DATA } from '../PublicAthletes'
import { COACHES_DATA } from '../PublicCoaches'
import { JUDGES_DATA } from '../PublicJudges'
import { EVENTS_DATA } from '../PublicEvents'
import { FACILITIES_DATA } from '../../pages/Facilities'

export default function PublicSpotlight() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const inputRef = useRef(null)

    // Global keyboard listener for Cmd+K / Ctrl+K and Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen])

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100)
        } else {
            setQuery('')
        }
    }, [isOpen])

    // Aggregate data
    const allItems = useMemo(() => {
        const items = []
        
        ATHLETES_DATA.forEach(a => {
            items.push({
                id: `athlete-${a.id}`,
                title: a.name,
                subtitle: `${a.sport} • ${a.region}`,
                badge: 'Спортсмен',
                path: `/public/athletes/${a.id}`,
                icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            })
        })
        
        COACHES_DATA.forEach(c => {
            items.push({
                id: `coach-${c.id}`,
                title: c.name,
                subtitle: `${c.sport} • ${c.org}`,
                badge: 'Тренер',
                path: `/public/coaches?q=${encodeURIComponent(c.name)}`,
                icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 3a4 4 0 100 8 4 4 0 000-8z M23 21v-2a4 4 0 00-3-3.87'
            })
        })
        
        JUDGES_DATA.forEach(j => {
            items.push({
                id: `judge-${j.id}`,
                title: j.name,
                subtitle: `${j.sport} • ${j.cat}`,
                badge: 'Судья',
                path: `/public/judges?q=${encodeURIComponent(j.name)}`,
                icon: 'M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z M19 10v2a7 7 0 01-14 0v-2 M12 19v4 M8 23h8'
            })
        })
        
        EVENTS_DATA.forEach(e => {
            items.push({
                id: `evt-${e.id}`,
                title: e.title,
                subtitle: `${e.sport} • ${e.city}`,
                badge: 'Мероприятие',
                path: `/public/events/${e.id}`,
                icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
            })
        })
        
        FACILITIES_DATA.forEach(f => {
            items.push({
                id: `fac-${f.id}`,
                title: f.name,
                subtitle: `${f.type} • ${f.address}`,
                badge: 'Объект',
                path: `/public/facilities?q=${encodeURIComponent(f.name)}`,
                icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
            })
        })
        
        return items
    }, [])

    const filtered = useMemo(() => {
        if (!query.trim()) return []
        const q = query.toLowerCase()
        return allItems.filter(item => 
            item.title.toLowerCase().includes(q) || 
            item.subtitle.toLowerCase().includes(q) ||
            item.badge.toLowerCase().includes(q)
        ).slice(0, 8) // Show top 8 hits
    }, [query, allItems])

    if (!isOpen) return null

    return (
        <div className="pub-spotlight-overlay" onClick={() => setIsOpen(false)}>
            <div className="pub-spotlight-modal" onClick={e => e.stopPropagation()}>
                <div className="pub-spotlight-header">
                    <svg className="pub-spotlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        ref={inputRef}
                        type="text" 
                        className="pub-spotlight-input" 
                        placeholder={t('public.searchPlaceholder', 'Поиск по порталу... (Спортсмены, Тренеры, Объекты)')}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button className="pub-spotlight-esc">ESC</button>
                </div>
                
                {query && (
                    <div className="pub-spotlight-results">
                        {filtered.length > 0 ? (
                            filtered.map((item, idx) => (
                                <div 
                                    key={item.id} 
                                    className="pub-spotlight-item"
                                    style={{ animationDelay: `${idx * 0.03}s` }}
                                    onClick={() => {
                                        navigate(item.path)
                                        setIsOpen(false)
                                    }}
                                >
                                    <div className="pub-spotlight-item-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                        </svg>
                                    </div>
                                    <div className="pub-spotlight-item-body">
                                        <div className="pub-spotlight-item-title">{item.title}</div>
                                        <div className="pub-spotlight-item-desc">{item.subtitle}</div>
                                    </div>
                                    <div className="pub-spotlight-item-badge">{item.badge}</div>
                                </div>
                            ))
                        ) : (
                            <div className="pub-spotlight-empty">Ничего не найдено по запросу «{query}»</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
