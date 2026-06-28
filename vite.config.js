import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars so we can read VITE_API_BASE_URL for the dev proxy
  const env = loadEnv(mode, process.cwd(), '')

  // Extract just the origin (protocol + host) from VITE_API_BASE_URL
  // e.g. "http://localhost:8080/api" → "http://localhost:8080"
  const apiUrl = env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  const backendOrigin = apiUrl.replace(/\/api\/?$/, '')

  const port = parseInt(env.VITE_PORT || env.PORT) || 5173

  return {
    plugins: [react()],
    server: {
      port: port,
      watch: {
        usePolling: true,
      },
      proxy: {
        // Any request to /api/* is forwarded to the backend server
        '^/api/': {
          target: backendOrigin,
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      // Split heavy libraries into separate cached chunks (Vite 8 rolldown style)
      rolldownOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') ||
                id.includes('node_modules/react-dom') ||
                id.includes('node_modules/react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/framer-motion')) return 'motion';
            if (id.includes('node_modules/exceljs') ||
                id.includes('node_modules/file-saver') ||
                id.includes('node_modules/jszip')) {
              return 'excel';
            }
            if (id.includes('node_modules/lucide-react') ||
                id.includes('node_modules/react-icons')) {
              return 'icons';
            }
          }
        }
      },
      // Inline tiny assets as base64 to save HTTP requests
      assetsInlineLimit: 4096,
      // No source maps in production (keeps bundle lean)
      sourcemap: false,
    }
  }
})

