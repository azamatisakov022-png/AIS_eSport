/**
 * Presentational table shell: consistent surface card + base table styling.
 * Pages supply their own <thead>/<tbody> as children (no column-config rewrite).
 * Use <td className="ui-table__empty"> for the empty state row.
 */
export default function Table({ children, className = '', wrapClassName = '' }) {
    return (
        <div className={`ui-table-wrap${wrapClassName ? ' ' + wrapClassName : ''}`}>
            <table className={`ui-table${className ? ' ' + className : ''}`}>{children}</table>
        </div>
    )
}
