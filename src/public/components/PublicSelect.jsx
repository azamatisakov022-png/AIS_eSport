import React, { useState, useRef, useEffect } from 'react'

export default function PublicSelect({ options, value, onChange, placeholder, style }) {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedOption = options.find(o => o.value === value)

    const containerStyle = {}
    if (style && style.width) containerStyle.width = style.width
    if (style && style.flex) containerStyle.flex = style.flex

    return (
        <div ref={ref} className="pub-select-container" style={containerStyle}>
            <div className={`pub-select-control ${isOpen ? 'open' : ''} ${value ? 'has-val' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <span className="pub-select-text">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="pub-select-arrow" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </div>
            
            {isOpen && (
                <div className="pub-select-menu staggered-menu fade-in">
                    {options.map(opt => (
                        <div 
                            key={opt.value} 
                            className={`pub-select-option ${opt.value === value ? 'selected' : ''}`}
                            onClick={() => { onChange(opt.value); setIsOpen(false) }}
                        >
                            <span className="pub-select-label">{opt.label}</span>
                            {opt.value === value && (
                                <span className="pub-select-check">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .pub-select-container {
                    position: relative;
                    width: 100%;
                    font-family: 'Inter', sans-serif;
                }
                .pub-select-control {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #fff;
                    border: 1px solid #E8EBF0;
                    border-radius: 12px;
                    padding: 0 16px;
                    height: 46px;
                    box-sizing: border-box;
                    font-size: 14px;
                    color: #86868B;
                    cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                    user-select: none;
                }
                .pub-select-control:hover {
                    border-color: #C7CBD1;
                }
                .pub-select-control.open {
                    border-color: #007AFF;
                    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
                }
                .pub-select-control.has-val {
                    color: #1D1D1F;
                    font-weight: 500;
                }
                .pub-select-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .pub-select-arrow {
                    color: #86868B;
                    display: flex;
                    transition: transform 0.25s ease;
                    flex-shrink: 0;
                    margin-left: 12px;
                }
                .pub-select-control.open .pub-select-arrow {
                    color: #007AFF;
                }

                .pub-select-menu {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    right: 0;
                    background: #ffffff;
                    border: 1px solid rgba(0,0,0,0.08);
                    box-shadow: 0 12px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04);
                    border-radius: 14px;
                    padding: 6px;
                    z-index: 1000;
                    max-height: 280px;
                    overflow-y: auto;
                    transform-origin: top center;
                }

                /* Modern Scrollbar */
                .pub-select-menu::-webkit-scrollbar { width: 6px; }
                .pub-select-menu::-webkit-scrollbar-track { background: transparent; }
                .pub-select-menu::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 6px; }
                .pub-select-menu::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }

                .pub-select-option {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 14px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #1D1D1F;
                    transition: background 0.15s ease, color 0.15s ease;
                }
                .pub-select-option:hover {
                    background: rgba(0,0,0,0.04);
                }
                .pub-select-option.selected {
                    background: rgba(0, 122, 255, 0.08);
                    color: #007AFF;
                    font-weight: 500;
                }
                .pub-select-check {
                    color: #007AFF;
                    display: flex;
                }

                .fade-in {
                    animation: selectMenuFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes selectMenuFadeIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* Dark mode overrides */
                .public-portal.dark-mode .pub-select-control {
                    background: #2c2c2e;
                    border-color: rgba(255,255,255,0.1);
                    color: #e5e5ea;
                }
                .public-portal.dark-mode .pub-select-control.has-val {
                    color: #ffffff;
                }
                .public-portal.dark-mode .pub-select-control:hover {
                    border-color: rgba(255,255,255,0.2);
                }
                .public-portal.dark-mode .pub-select-menu {
                    background: #2c2c2e;
                    border-color: rgba(255,255,255,0.1);
                }
                .public-portal.dark-mode .pub-select-option {
                    color: #e5e5ea;
                }
                .public-portal.dark-mode .pub-select-option:hover {
                    background: rgba(255,255,255,0.06);
                }
                .public-portal.dark-mode .pub-select-option.selected {
                    background: rgba(0, 122, 255, 0.2);
                    color: #8AB4F8;
                }
                .public-portal.dark-mode .pub-select-arrow {
                    color: #8e8e93;
                }
            `}</style>
        </div>
    )
}
