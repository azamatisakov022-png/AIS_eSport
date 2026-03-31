import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import './Layout.css'

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

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
        <div className="layout">
            <div
                className={`overlay-backdrop ${sidebarOpen ? 'active' : ''}`}
                onClick={closeSidebar}
            />
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            <div className="layout__main">
                <Header onToggleSidebar={toggleSidebar} />
                <main className="layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
