import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Cuando el frontend vea una ruta que empiece con '/static'
      '/static': {
        target: 'http://127.0.0.1:8000', // Redirige al Backend Django/Python
        changeOrigin: true,
        secure: false,
      },
      // Si también tienes rutas de API, agrégalas aquí
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  }
})
