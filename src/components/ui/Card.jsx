/**
 * White surface card with optional title/actions header.
 */
export default function Card({ title, actions, className = '', children }) {
    return (
        <section className={`ui-card${className ? ' ' + className : ''}`}>
            {(title || actions) && (
                <div className="ui-card__head">
                    {title && <h2 className="ui-card__title">{title}</h2>}
                    {actions && <div className="ui-card__actions">{actions}</div>}
                </div>
            )}
            {children}
        </section>
    )
}
