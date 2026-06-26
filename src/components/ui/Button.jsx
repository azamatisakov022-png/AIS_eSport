import { Link } from 'react-router-dom'

/**
 * Shared button. Renders a <Link> when `to` is given, an <a> when `href`,
 * otherwise a <button>.
 * variant: primary | outline | success | danger | ghost
 * size: md | sm
 */
export default function Button({ variant = 'primary', size = 'md', to, href, className = '', children, ...props }) {
    const cls = `ui-btn ui-btn--${variant} ui-btn--${size}${className ? ' ' + className : ''}`
    if (to) return <Link to={to} className={cls} {...props}>{children}</Link>
    if (href) return <a href={href} className={cls} {...props}>{children}</a>
    return <button className={cls} {...props}>{children}</button>
}
