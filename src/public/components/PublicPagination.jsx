import React from 'react'
import { useTranslation } from 'react-i18next'

const s = {
    pagination: { 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 6, 
        marginTop: 28 
    },
    pageBtn: { 
        padding: '8px 14px', 
        border: '1px solid var(--theme-border)', 
        borderRadius: 10, 
        background: 'var(--theme-bg-card)', 
        fontSize: 13, 
        fontFamily: 'inherit', 
        color: 'var(--theme-text-secondary)', 
        cursor: 'pointer',
        transition: 'all 0.15s'
    },
    pageBtnActive: { 
        background: '#1C1C1E', 
        color: '#fff', 
        borderColor: '#1C1C1E' 
    },
}

export default function PublicPagination({ totalPages, currentPage, onPageChange }) {
    const { t } = useTranslation()
    
    if (totalPages <= 1) return null

    return (
        <div style={s.pagination}>
            <button 
                style={{ ...s.pageBtn, opacity: currentPage <= 1 ? 0.4 : 1 }} 
                disabled={currentPage <= 1} 
                onClick={() => onPageChange(currentPage - 1)}
            >
                {t('public.prev')}
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
                <button 
                    key={i + 1} 
                    style={{ ...s.pageBtn, ...(currentPage === i + 1 ? s.pageBtnActive : {}) }} 
                    onClick={() => onPageChange(i + 1)}
                >
                    {i + 1}
                </button>
            ))}
            
            <button 
                style={{ ...s.pageBtn, opacity: currentPage >= totalPages ? 0.4 : 1 }} 
                disabled={currentPage >= totalPages} 
                onClick={() => onPageChange(currentPage + 1)}
            >
                {t('public.forward')}
            </button>
        </div>
    )
}
