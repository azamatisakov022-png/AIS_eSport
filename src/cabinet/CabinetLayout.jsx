import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import CabinetSidebar from './CabinetSidebar'
import Header from '../components/Header'
import './cabinet.css'

export default function CabinetLayout() {
    const { t } = useTranslation()
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
        <div className="cab-layout">
            <div
                className={`overlay-backdrop ${sidebarOpen ? 'active' : ''}`}
                onClick={closeSidebar}
            />
            <CabinetSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            <div className="cab-layout__main">
                <Header onToggleSidebar={toggleSidebar} />
                <main className="cab-layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
