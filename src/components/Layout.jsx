import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sidebar from './Sidebar'
import Header from './Header'
import AiAssistant from './AiAssistant/AiAssistantLazy'
import { titleKeyForPath } from './pageTitles'
import './Layout.css'

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    /* Свёрнутый сайдбар-рельса на десктопе (+~170px контенту), запоминается */
    const [navCollapsed, setNavCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === '1')
    const location = useLocation()
    const { t } = useTranslation()

    /* Заголовок вкладки браузера по текущему разделу (обновляется и при смене языка) */
    useEffect(() => {
        const key = titleKeyForPath(location.pathname)
        document.title = key ? `${t(key)} — АИС eSport` : 'АИС eSport — ГАФКиС'
        return () => { document.title = 'АИС eSport — ГАФКиС' }
    }, [location.pathname, t])

    const toggleCollapsed = useCallback(() => {
        setNavCollapsed(prev => {
            localStorage.setItem('sidebar-collapsed', prev ? '0' : '1')
            return !prev
        })
    }, [])

    useEffect(() => {
        setSidebarOpen(false)
    }, [location.pathname])

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setSidebarOpen(false)
        }
        document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [])

    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev)
    }, [])

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false)
    }, [])

    return (
        <div className={`layout${navCollapsed ? ' layout--rail' : ''}`}>
            <div
                className={`overlay-backdrop ${sidebarOpen ? 'active' : ''}`}
                onClick={closeSidebar}
            />
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} collapsed={navCollapsed} onToggleCollapse={toggleCollapsed} />
            <div className="layout__main">
                <Header onToggleSidebar={toggleSidebar} />
                <main className="layout__content">
                    <Outlet />
                </main>
            </div>
            <AiAssistant context="internal" />
        </div>
    )
}
