import { Link } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

/**
 * Плашка «Вы вошли как …» над формами госуслуг: показывает, от чьего имени
 * совершается действие, и напоминает, что личность подтверждена при входе
 * (в продуктиве — через «Түндүк» ЕСИ; в макете — демо-вход).
 */
export default function AuthBanner() {
    const { role, isLoggedIn, logout } = useRole()
    if (!isLoggedIn) return null
    return (
        <div style={st.wrap}>
            <span style={st.badge} aria-hidden="true">✓</span>
            <span style={st.text}>
                Вы вошли как: <b>{role.name || role.label}</b> · {role.label}.
                Заявление будет подано от вашего имени — личность подтверждена при входе
                (имитация авторизации «Түндүк» ЕСИ).
            </span>
            <Link to="/public/login" style={st.link} onClick={logout}>Сменить пользователя</Link>
        </div>
    )
}

const st = {
    wrap: {
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10,
        padding: '10px 14px', margin: '0 0 18px', fontSize: 14, color: '#065f46',
    },
    badge: {
        flex: 'none', width: 22, height: 22, borderRadius: '50%',
        background: '#10b981', color: '#fff', display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
    },
    text: { flex: '1 1 300px', lineHeight: 1.45 },
    link: { color: '#047857', fontWeight: 600, whiteSpace: 'nowrap' },
}
