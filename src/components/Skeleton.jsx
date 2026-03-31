import './Skeleton.css'

export function Skeleton({ variant = 'text', width, height, style, className = '' }) {
    const baseClass = `skeleton skeleton--${variant} ${className}`
    const inlineStyle = { width, height, ...style }
    return <div className={baseClass} style={inlineStyle} />
}

export function TableSkeleton({ rows = 5, columns = 6 }) {
    return (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} style={{ padding: '16px' }}>
                                <Skeleton variant="text" width="60%" style={{ marginBottom: 0 }} />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td key={colIndex} style={{ padding: '16px' }}>
                                    {colIndex === 0 ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Skeleton variant="circular" width="36px" height="36px" style={{ flexShrink: 0 }} />
                                            <div style={{ flex: 1 }}>
                                                <Skeleton variant="text" width="80%" />
                                                <Skeleton variant="text" width="50%" style={{ marginTop: '4px' }} />
                                            </div>
                                        </div>
                                    ) : colIndex === columns - 1 ? (
                                         <Skeleton variant="rectangular" width="80px" height="32px" style={{ borderRadius: '8px' }} />
                                    ) : (
                                        <Skeleton variant="text" width={colIndex % 2 === 0 ? "60%" : "40%"} style={{ marginBottom: 0 }} />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export function CardSkeleton({ count = 6 }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '16px' }}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <Skeleton variant="circular" width="48px" height="48px" />
                        <Skeleton variant="rectangular" width="60px" height="24px" style={{ borderRadius: '12px' }} />
                    </div>
                    <Skeleton variant="text" width="80%" height="20px" style={{ marginBottom: '12px' }} />
                    <Skeleton variant="text" width="40%" height="16px" style={{ marginBottom: '24px' }} />
                    <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                        <Skeleton variant="text" width="30%" height="14px" />
                        <Skeleton variant="text" width="30%" height="14px" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function MetricSkeleton({ count = 4 }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px', marginBottom: '24px' }}>
             {Array.from({ length: count }).map((_, i) => (
                 <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border-color)' }}>
                     <Skeleton variant="circular" width="48px" height="48px" />
                     <div style={{ flex: 1 }}>
                         <Skeleton variant="text" width="40%" height="24px" style={{ marginBottom: '8px' }} />
                         <Skeleton variant="text" width="70%" height="14px" />
                     </div>
                 </div>
             ))}
        </div>
    )
}
