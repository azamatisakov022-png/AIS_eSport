import { sectorAvailable } from './ticketsData'

/**
 * Visual, clickable venue scheme.
 * Renders sector zones positioned by schemeType (stadium / arena / hippodrome).
 * Sold-out sectors are dimmed & non-clickable. Selected sector is highlighted.
 *
 * Props:
 *   schemeType: 'stadium' | 'arena' | 'hippodrome'
 *   sectors: [{id,name,price,color,total,sold}]
 *   selectedId, onSelect(id)
 */

/* Sector zone positions per scheme (percentages within the 16:10 stage). */
const LAYOUTS = {
    stadium: {
        field: { label: '⚽ ПОЛЕ', x: 30, y: 34, w: 40, h: 32 },
        zones: {
            north: { x: 30, y: 6, w: 40, h: 22 },
            south: { x: 30, y: 72, w: 40, h: 22 },
            west: { x: 4, y: 20, w: 22, h: 60 },
            east: { x: 74, y: 20, w: 22, h: 60 },
            vip: { x: 30, y: 28, w: 40, h: 5 },
        },
    },
    arena: {
        field: { label: '🟩 АРЕНА', x: 34, y: 38, w: 32, h: 24 },
        zones: {
            vip: { x: 34, y: 30, w: 32, h: 6 },
            parter: { x: 30, y: 64, w: 40, h: 10 },
            tribA: { x: 6, y: 24, w: 22, h: 52 },
            tribB: { x: 72, y: 24, w: 22, h: 52 },
            balcony: { x: 30, y: 8, w: 40, h: 14 },
        },
    },
    hippodrome: {
        field: { label: '🏟 ПОЛЕ', x: 8, y: 30, w: 84, h: 34 },
        zones: {
            vip: { x: 30, y: 70, w: 40, h: 6 },
            central: { x: 26, y: 78, w: 48, h: 14 },
            left: { x: 4, y: 70, w: 20, h: 22 },
            right: { x: 76, y: 70, w: 20, h: 22 },
        },
    },
}

export default function ArenaScheme({ schemeType = 'arena', sectors, selectedId, onSelect }) {
    const layout = LAYOUTS[schemeType] || LAYOUTS.arena

    return (
        <div className="tk-scheme" role="group" aria-label="Схема зала — выберите сектор">
            <div className="tk-scheme__stage">
                {/* Field / playing area */}
                {layout.field && (
                    <div
                        className="tk-scheme__field"
                        style={{
                            left: `${layout.field.x}%`, top: `${layout.field.y}%`,
                            width: `${layout.field.w}%`, height: `${layout.field.h}%`,
                        }}
                    >
                        {layout.field.label}
                    </div>
                )}

                {/* Sector zones */}
                {sectors.map(sec => {
                    const pos = layout.zones[sec.id]
                    if (!pos) return null
                    const avail = sectorAvailable(sec)
                    const soldOut = avail === 0
                    const selected = selectedId === sec.id
                    return (
                        <button
                            key={sec.id}
                            type="button"
                            className={`tk-zone${selected ? ' is-selected' : ''}${soldOut ? ' is-soldout' : ''}`}
                            style={{
                                left: `${pos.x}%`, top: `${pos.y}%`,
                                width: `${pos.w}%`, height: `${pos.h}%`,
                                '--zone-color': sec.color,
                            }}
                            onClick={() => !soldOut && onSelect(sec.id)}
                            disabled={soldOut}
                            aria-pressed={selected}
                            title={soldOut ? `${sec.name} — мест нет` : `${sec.name} — ${sec.price} сом, свободно ${avail}`}
                        >
                            <span className="tk-zone__name">{sec.name}</span>
                            <span className="tk-zone__price">{soldOut ? 'Мест нет' : `${sec.price} сом`}</span>
                        </button>
                    )
                })}
            </div>
            <p className="tk-scheme__hint">Нажмите на сектор, чтобы выбрать места</p>
        </div>
    )
}
