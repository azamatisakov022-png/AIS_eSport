/**
 * Status / label pill.
 * variant: gray | blue | green | amber | red | purple
 */
export default function Badge({ variant = 'gray', className = '', children, ...rest }) {
    return <span className={`ui-badge ui-badge--${variant}${className ? ' ' + className : ''}`} {...rest}>{children}</span>
}
