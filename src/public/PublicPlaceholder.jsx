/**
 * Placeholder component for public portal sub-pages - Apple Pro style
 */
import { useTranslation } from 'react-i18next'

export default function PublicPlaceholder({ title, icon, description }) {
    const { t } = useTranslation()

    return (
        <div style={{
            maxWidth: 600,
            margin: '80px auto',
            textAlign: 'center',
            padding: '0 24px',
        }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>{icon}</div>
            <h2 style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: '#000',
                letterSpacing: '-1px',
                marginBottom: 8,
            }}>
                {title}
            </h2>
            <p style={{
                fontSize: 15,
                color: '#6e6e73',
                lineHeight: 1.7,
                marginBottom: 28,
            }}>
                {description || t('public.placeholderText')}
            </p>
            <span style={{
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: 980,
                background: '#f5f5f7',
                color: '#6e6e73',
                fontSize: 13,
                fontWeight: 700,
                border: '1px solid #d2d2d7',
            }}>
                {t('public.placeholderTitle')}
            </span>
        </div>
    )
}
