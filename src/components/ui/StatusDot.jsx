/* Сдержанный индикатор статуса: цветная точка + обычный текст (без «пилюль»). */
const COLORS = {
    green: '#16a34a',
    amber: '#d97706',
    red: '#dc2626',
    gray: '#94a3b8',
    blue: '#2563eb',
}

export default function StatusDot({ tone = 'gray', children }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--text-primary)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: COLORS[tone] || COLORS.gray, flex: 'none' }} />
            {children}
        </span>
    )
}
