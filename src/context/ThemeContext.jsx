import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function useTheme() {
    return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {
    // Check localStorage or fallback to 'light'
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('app-theme')
        if (saved) return saved
        // Optional: Check system preference
        // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
        return 'light'
    })

    // Update body attribute and localStorage when theme changes
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark')
        } else {
            document.documentElement.removeAttribute('data-theme')
        }
        localStorage.setItem('app-theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
