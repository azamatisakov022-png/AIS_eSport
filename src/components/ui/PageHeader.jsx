/**
 * Page-level header: refined thin title + optional subtitle + actions slot.
 */
export default function PageHeader({ title, subtitle, actions, className = '' }) {
    return (
        <div className={`ui-page-header${className ? ' ' + className : ''}`}>
            <div>
                <h1 className="ui-page-header__title">{title}</h1>
                {subtitle && <p className="ui-page-header__subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="ui-page-header__actions">{actions}</div>}
        </div>
    )
}
