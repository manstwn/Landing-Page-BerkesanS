import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SITE_DIR = path.resolve(__dirname, 'request-site')
const DIST_DIR = path.resolve(__dirname, 'dist')

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.map': 'application/json',
}

function discoverSites() {
    if (!fs.existsSync(SITE_DIR)) return []
    return fs.readdirSync(SITE_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
        .map((d) => d.name)
        .filter((name) => fs.existsSync(path.join(SITE_DIR, name, 'index.html')))
}

function serveStatic(req, res, file) {
    let stat
    try {
        stat = fs.statSync(file)
    } catch {
        return false
    }
    if (!stat.isFile()) return false

    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream'
    const range = req.headers.range
    if (range) {
        const match = /bytes=(\d*)-(\d*)/.exec(range)
        if (match) {
            const start = match[1] ? parseInt(match[1], 10) : 0
            const end = match[2] ? parseInt(match[2], 10) : stat.size - 1
            if (start >= stat.size || end >= stat.size || start > end) {
                res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` })
                res.end()
                return true
            }
            res.writeHead(206, {
                'Content-Type': type,
                'Accept-Ranges': 'bytes',
                'Content-Range': `bytes ${start}-${end}/${stat.size}`,
                'Content-Length': end - start + 1,
            })
            fs.createReadStream(file, { start, end }).pipe(res)
            return true
        }
    }

    res.writeHead(200, {
        'Content-Type': type,
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes',
    })
    if (req.method === 'HEAD') {
        res.end()
        return true
    }
    fs.createReadStream(file).pipe(res)
    return true
}

// Serves /<folder>[/...] from `<baseDir>/<folder>`.
// flatten=true -> assets live directly under the folder (dist output).
// flatten=false -> assets live under `<folder>/public` (source layout).
function createSiteMiddleware(baseDir, flatten) {
    return (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()

        const [pathname, query = ''] = req.url.split('?')
        const seg = pathname.split('/')[1]
        if (!seg || seg.includes('..') || seg.includes('\\')) return next()

        const segDir = path.join(baseDir, seg)
        if (!fs.existsSync(path.join(segDir, 'index.html'))) return next()

        // Relative URLs inside index.html require a trailing slash.
        if (pathname === `/${seg}`) {
            res.writeHead(301, { Location: `/${seg}/${query ? `?${query}` : ''}` })
            res.end()
            return
        }

        let file
        if (pathname === `/${seg}/` || pathname === `/${seg}/index.html`) {
            file = path.join(segDir, 'index.html')
        } else {
            const rest = pathname.slice(seg.length + 1)
            file = flatten
                ? path.join(segDir, rest)
                : path.join(segDir, 'public', rest)
        }

        // Never escape the site directory.
        if (!path.resolve(file).startsWith(path.resolve(segDir))) {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('Not found')
            return
        }

        if (serveStatic(req, res, file)) return

        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not found')
    }
}

function requestSitePlugin() {
    return {
        name: 'request-site',
        configureServer(server) {
            server.middlewares.use(createSiteMiddleware(SITE_DIR, false))
        },
        configurePreviewServer(server) {
            server.middlewares.use(createSiteMiddleware(DIST_DIR, true))
        },
        closeBundle() {
            for (const name of discoverSites()) {
                const src = path.join(SITE_DIR, name)
                const dest = path.join(DIST_DIR, name)
                fs.mkdirSync(dest, { recursive: true })
                fs.copyFileSync(path.join(src, 'index.html'), path.join(dest, 'index.html'))
                const pub = path.join(src, 'public')
                if (fs.existsSync(pub)) fs.cpSync(pub, dest, { recursive: true })
            }
            console.log(`[request-site] emitted ${discoverSites().length} site(s) to dist/`)
        },
    }
}

export default defineConfig({
    plugins: [react(), requestSitePlugin()],
    server: {
        host: true,
        port: 8584,
        allowedHosts: true,
    },
})
