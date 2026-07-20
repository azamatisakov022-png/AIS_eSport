import { Navigate, useLocation } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

/**
 * Страж авторизации: юридически значимые действия (подача заявлений, кабинеты)
 * доступны только после входа. Гостя отправляем на страницу входа и после
 * авторизации возвращаем туда, откуда он пришёл (state.next).
 * Интеграции с «Түндүк» ЕСИ пока нет — вход имитируется демо-карточками ролей,
 * но сам порядок «сначала авторизация, потом действие» обязателен уже в макете.
 */
export default function RequireAuth({ children }) {
    const { isLoggedIn } = useRole()
    const location = useLocation()

    if (!isLoggedIn) {
        return <Navigate to="/public/login" state={{ next: location.pathname, reason: 'auth-required' }} replace />
    }
    return children
}
