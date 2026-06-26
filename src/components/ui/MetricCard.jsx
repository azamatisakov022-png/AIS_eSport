/**
 * Metric tile: soft tinted icon tile + value + label (+ optional trend).
 * No colored accent stripe (per the design cleanup).
 * tone: blue | green | amber | orange | red | cyan | violet | purple | (default neutral)
 */
export default function MetricCard({ icon, value, label, trend, tone = 'neutral', className = '' }) {
    return (
        <div className={`ui-metric ui-metric--${tone}${className ? ' ' + className : ''}`}>
            <div className="ui-metric__icon">{icon}</div>
            <div className="ui-metric__body">
                <span className="ui-metric__value">{value}</span>
                <span className="ui-metric__label">{label}</span>
            </div>
            {trend != null && <span className="ui-metric__trend">{trend}</span>}
        </div>
    )
}
