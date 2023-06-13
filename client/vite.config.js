import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://onthefly-server.up.railway.app/'
      },
      '/auth': {
        target: 'https://onthefly-server.up.railway.app/'
      }
    }
  }
})
