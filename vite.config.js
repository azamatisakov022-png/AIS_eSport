import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Вендоры в отдельные чанки: кэшируются браузером независимо от кода приложения
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-i18n': ['i18next', 'react-i18next'],
          'vendor-leaflet': ['leaflet', 'react-leaflet'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'yup'],
        },
      },
    },
  },
  server: {
    port: 5190,
    strictPort: true,
    open: true,
    proxy: {
      // Бэкенд Spring Boot (контекст /api) на 8082 - проксируем, чтобы не упираться в CORS
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        // dev-прокси: запрос идёт сервер->сервер, убираем браузерный Origin,
        // иначе CORS бэкенда (разрешены 5173/5180) отклоняет логин с 403
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
        },
      },
    },
  }
})
