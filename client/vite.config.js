import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Default configuration
const defaultConfig = {
  plugins: [react()],
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    const isDev = mode === 'development'

    return {
      ...defaultConfig,
      server: {
        proxy: {
          '/api': {
            target: isDev ? 'http://localhost:3001' : 'https://onthefly-server.up.railway.app',
          },
          '/auth': {
            target: isDev ? 'http://localhost:3001' : 'https://onthefly-server.up.railway.app',
          }
        }
      }
    }
  } else {
    return defaultConfig
  }
})
