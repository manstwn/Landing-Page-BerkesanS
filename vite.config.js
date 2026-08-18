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

        // Copy standalone routes directly to dist root so static servers (npx serve / Nginx / Vercel) serve them natively
        const fkungSrc = path.join(srcDir, 'sumpahdokter-fkung-2026')
        if (fs.existsSync(fkungSrc)) {
          fs.cpSync(fkungSrc, path.resolve(__dirname, 'dist/fkung'), { recursive: true })
          fs.cpSync(fkungSrc, path.resolve(__dirname, 'dist/sumpahdokter-fkung-2026'), { recursive: true })
          console.log('[copy-request-page-live] Successfully created dist/fkung and dist/sumpahdokter-fkung-2026')
        }

        const ptkpcSrc = path.join(srcDir, 'design2-pt-kpc')
        if (fs.existsSync(ptkpcSrc)) {
          const ptKpcDist = path.resolve(__dirname, 'dist/pt-kpc')
          const design2Dist = path.resolve(__dirname, 'dist/design2-pt-kpc')
          fs.cpSync(ptkpcSrc, ptKpcDist, { recursive: true })
          fs.cpSync(ptkpcSrc, design2Dist, { recursive: true })
          if (fs.existsSync(path.join(ptKpcDist, 'code.html'))) {
            fs.copyFileSync(path.join(ptKpcDist, 'code.html'), path.join(ptKpcDist, 'index.html'))
          }
          if (fs.existsSync(path.join(design2Dist, 'code.html'))) {
            fs.copyFileSync(path.join(design2Dist, 'code.html'), path.join(design2Dist, 'index.html'))
          }
          console.log('[copy-request-page-live] Successfully created dist/pt-kpc and dist/design2-pt-kpc')
        }
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

