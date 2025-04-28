import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://atfplatform.tw1.ru',
        changeOrigin: true,
        secure: false,
      },
      '/storage': {
        target: 'https://atfplatform.tw1.ru',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
