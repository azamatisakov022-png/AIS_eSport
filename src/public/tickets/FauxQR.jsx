/**
 * Deterministic QR-looking SVG (demo).
 * Not a real encoder - generates a stable module grid from `value`
 * with authentic-looking finder patterns in 3 corners.
 * Good enough to visually represent a ticket QR; swap for a real
 * QR library (e.g. `qrcode`) when wiring real verification.
 */
export default function FauxQR({ value = '', size = 132 }) {
    const N = 25 // module grid
    // seeded PRNG from the string
    let h = 2166136261
    for (let i = 0; i < value.length; i++) {
        h ^= value.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    const rand = () => {
        h += 0x6d2b79f5
        let t = h
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }

    const isFinder = (r, c) => {
        const inBox = (br, bc) => r >= br && r < br + 7 && c >= bc && c < bc + 7
        return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0)
    }
    const finderFill = (r, c) => {
        const local = (br, bc) => {
            const rr = r - br, cc = c - bc
            if (rr === 0 || rr === 6 || cc === 0 || cc === 6) return true // outer ring
            if (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4) return true // inner block
            return false
        }
        if (r < 7 && c < 7) return local(0, 0)
        if (r < 7 && c >= N - 7) return local(0, N - 7)
        if (r >= N - 7 && c < 7) return local(N - 7, 0)
        return false
    }

    const cells = []
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            if (isFinder(r, c)) {
                if (finderFill(r, c)) cells.push([r, c])
            } else if (rand() > 0.52) {
                cells.push([r, c])
            }
        }
    }

    const m = size / N
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="QR-код билета" style={{ display: 'block' }}>
            <rect width={size} height={size} fill="#fff" />
            {cells.map(([r, c], i) => (
                <rect key={i} x={c * m} y={r * m} width={m + 0.5} height={m + 0.5} fill="#0f1b2d" />
            ))}
        </svg>
    )
}
