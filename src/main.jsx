import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RoleProvider } from './context/RoleContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import App from './App'
import './i18n'
import './styles/variables.css'
import './styles/effects.css'
import './styles/Toast.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <RoleProvider>
                    <ToastProvider>
                        <App />
                    </ToastProvider>
                </RoleProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
)
