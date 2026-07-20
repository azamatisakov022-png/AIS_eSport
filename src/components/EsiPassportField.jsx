import { useState } from 'react'

/* Компонент «Паспорт из ЕСИ Түндүк» — единый для всех заявлений (звания, ЗТ,
   тренерское свидетельство). Вместо ручной копии паспорта: одна кнопка тянет
   подтверждённые данные из ЕСИ (демо-имитация). Ручной скан — опционально. */

const DEMO = {
    lastName: 'Асанов', firstName: 'Бекболот', middleName: 'Маратович',
    inn: '20415199800101', birthDate: '15.04.1998', sex: 'М', issued: 'МКК 20419, 12.05.2016',
}

export default function EsiPassportField({ value, onChange, allowScan = true }) {
    const [loading, setLoading] = useState(false)
    const [scanName, setScanName] = useState('')
    const data = value || null

    const pull = () => {
        setLoading(true)
        // имитация обращения к ЕСИ; в продуктиве — OIDC + userinfo по ИНН
        setTimeout(() => {
            setLoading(false)
            onChange && onChange({ ...DEMO, source: 'esi' })
        }, 600)
    }

    return (
        <div style={s.wrap}>
            <div style={s.head}>
                <span style={s.title}>Паспортные данные</span>
                {data && <span style={s.badge}>✓ подтверждено ЕСИ Түндүк</span>}
            </div>

            {!data ? (
                <div>
                    <p style={s.hint}>
                        Копию паспорта загружать не нужно — данные подтягиваются из ЕСИ «Түндүк» по вашему
                        согласию, данному при регистрации.
                    </p>
                    <button type="button" style={s.btn} onClick={pull} disabled={loading}>
                        {loading ? 'Загрузка из ЕСИ…' : 'Подтянуть паспорт из ЕСИ Түндүк'}
                    </button>
                </div>
            ) : (
                <div>
                    <div style={s.grid}>
                        <Field label="Фамилия" v={data.lastName} />
                        <Field label="Имя" v={data.firstName} />
                        <Field label="Отчество" v={data.middleName} />
                        <Field label="ИНН" v={data.inn} mono />
                        <Field label="Дата рождения" v={data.birthDate} />
                        <Field label="Пол" v={data.sex === 'М' ? 'Мужской' : 'Женский'} />
                        <Field label="Кем выдан" v={data.issued} wide />
                    </div>
                    <button type="button" style={s.linkBtn} onClick={() => onChange && onChange(null)}>Сбросить</button>
                </div>
            )}

            {allowScan && (
                <div style={s.scanRow}>
                    <label style={s.scanLabel}>
                        Скан паспорта (необязательно, если требуется твёрдая копия):
                    </label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setScanName(e.target.files?.[0]?.name || '')} style={{ fontSize: 12.5 }} />
                    {scanName && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{scanName}</span>}
                </div>
            )}
        </div>
    )
}

function Field({ label, v, mono, wide }) {
    return (
        <div style={{ gridColumn: wide ? '1 / -1' : undefined }}>
            <div style={s.fLabel}>{label}</div>
            <div style={{ ...s.fValue, ...(mono ? { fontFamily: 'monospace' } : {}) }}>{v}</div>
        </div>
    )
}

const s = {
    wrap: { border: '1px solid var(--border-color, #e2e8f0)', borderRadius: 12, padding: '14px 16px', background: 'var(--bg-card, #fff)' },
    head: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 },
    title: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary, #1a1a1a)' },
    badge: { fontSize: 11.5, fontWeight: 700, color: '#166534', background: '#dcfce7', borderRadius: 12, padding: '4px 10px' },
    hint: { fontSize: 12.5, color: 'var(--text-secondary, #64748b)', margin: '0 0 10px', lineHeight: 1.5 },
    btn: {
        padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        background: 'linear-gradient(135deg, #1B3A6B, #2B5EA7)', color: '#fff', fontSize: 13.5, fontWeight: 700,
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 },
    fLabel: { fontSize: 11.5, color: 'var(--text-muted, #94a3b8)', marginBottom: 2 },
    fValue: { fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary, #1a1a1a)' },
    linkBtn: { marginTop: 10, background: 'none', border: 'none', color: '#2563EB', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'inherit' },
    scanRow: { marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: 6 },
    scanLabel: { fontSize: 12, color: 'var(--text-muted, #94a3b8)' },
}
