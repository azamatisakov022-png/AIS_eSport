import React from 'react'
import { useTranslation } from 'react-i18next'
import PublicSelect from './PublicSelect'

const s = {
    filters: { 
        background: 'var(--theme-bg-card)', 
        border: '1px solid var(--theme-border)', 
        borderRadius: 14, 
        padding: '20px 24px', 
        marginBottom: 20 
    },
    filterRow: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 12, 
        marginBottom: 16 
    },
    filterActions: { 
        display: 'flex', 
        gap: 10, 
        alignItems: 'center' 
    },
    findBtn: { 
        padding: '10px 20px', 
        background: '#1C1C1E', 
        color: '#fff', 
        border: 'none', 
        borderRadius: 10, 
        fontSize: 13, 
        fontFamily: 'inherit', 
        cursor: 'pointer', 
        fontWeight: 500 
    },
    resetBtn: { 
        padding: '10px 20px', 
        background: 'transparent', 
        border: '1px solid var(--theme-border)', 
        borderRadius: 10, 
        fontSize: 13, 
        fontFamily: 'inherit', 
        color: 'var(--theme-text-secondary)', 
        cursor: 'pointer' 
    },
    input: { 
        width: '100%', 
        height: '46px',
        padding: '12px 16px', 
        border: '1px solid var(--theme-border)', 
        borderRadius: 12, 
        fontSize: 14, 
        fontFamily: 'inherit', 
        color: 'var(--theme-text-main)', 
        outline: 'none', 
        boxSizing: 'border-box' 
    }
}

/**
 * Filter form container with glass-panel styling.
 */
export function PublicFiltersContainer({ onSubmit, onReset, children, hideControls = false }) {
    const { t } = useTranslation()
    
    return (
        <form onSubmit={onSubmit || (e => e.preventDefault())} className="glass-panel" style={s.filters}>
            <div style={s.filterRow}>
                {children}
            </div>
            {!hideControls && (
                <div style={s.filterActions}>
                    {onSubmit && <button type="submit" style={s.findBtn}>{t('public.find')}</button>}
                    {onReset && <button type="button" onClick={onReset} style={s.resetBtn}>{t('public.reset')}</button>}
                </div>
            )}
        </form>
    )
}

/**
 * Filter text input.
 */
export function PublicFilterInput({ type = 'text', placeholder, value, onChange }) {
    return (
        <div>
            <input 
                type={type} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                className="pub-filter-input"
                style={s.input}
            />
        </div>
    )
}

/**
 * Filter select dropdown.
 */
export function PublicFilterSelect({ value, onChange, options, defaultOption }) {
    const formattedOptions = defaultOption ? [{ value: '', label: defaultOption }] : []
    options.forEach(opt => {
        formattedOptions.push({ value: opt.value || opt, label: opt.label || opt })
    })

    return (
        <div>
            <PublicSelect 
                value={value} 
                onChange={v => onChange({ target: { value: v } })}
                style={s.input}
                placeholder={defaultOption || '...'}
                options={formattedOptions}
            />
        </div>
    )
}
