import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function copyRequestPageLivePlugin() {
  return {
    name: 'copy-request-page-live',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'request-page-live-same-system')
      const distDir = path.resolve(__dirname, 'dist/request-page-live-same-system')
      if (fs.existsSync(srcDir)) {
        fs.cpSync(srcDir, distDir, { recursive: true })
        console.log('[copy-request-page-live] Successfully copied request-page-live-same-system to dist/')
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), copyRequestPageLivePlugin()],
  server: {
    host: true,
    port: 8584,
    allowedHosts: true,
  },
})

