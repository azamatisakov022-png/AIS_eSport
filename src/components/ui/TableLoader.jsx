/**
 * Скелетон строк таблицы на время первой загрузки данных из API.
 * Отличает «грузится» от «данных нет» — пустая таблица больше не выглядит сломанной.
 */
export default function TableLoader({ cols, rows = 6 }) {
    return (
        <>
            {Array.from({ length: rows }, (_, i) => (
                <tr key={i} className="ui-skel-tr" aria-hidden="true">
                    <td colSpan={cols}>
                        <div className="ui-skel-bar" style={{ width: `${88 - (i % 3) * 14}%` }} />
                    </td>
                </tr>
            ))}
        </>
    )
}
