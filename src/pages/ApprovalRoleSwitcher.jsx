import { APPROVAL_ROLES } from '../cabinet/approvalStore'

/* Демо-переключатель «Вы вошли как» для маршрутов согласования.
   В продуктиве у каждого участника — собственный кабинет (вход через ЕСИ);
   здесь роль выбирается вручную, чтобы показать разграничение шагов.
   roles можно передать (напр. роли маршрута званий); по умолчанию — роли тарификации/комплектования. */

export default function ApprovalRoleSwitcher({ value, onChange, roles = APPROVAL_ROLES }) {
    return (
        <div style={s.wrap}>
            <span style={s.label}>Вы вошли как:</span>
            <select style={s.select} value={value} onChange={e => onChange(e.target.value)}>
                <option value="any">Демо: любой участник маршрута</option>
                {roles.map(r => (
                    <option key={r.role} value={r.role}>{r.role}{r.name && r.name !== '—' ? ` — ${r.name}` : ''} ({r.level})</option>
                ))}
            </select>
            <span style={s.hint}>в продуктиве роль определяется входом через ЕСИ</span>
        </div>
    )
}

const s = {
    wrap: {
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: 10, padding: '10px 14px', marginBottom: 16,
    },
    label: { fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' },
    select: {
        flex: '0 1 520px', minWidth: 260, padding: '8px 10px', borderRadius: 8,
        border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
        color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit',
    },
    hint: { fontSize: 11.5, color: 'var(--text-muted)' },
}
