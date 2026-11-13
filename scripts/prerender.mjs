import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const SITE_URL = 'https://www.berkesanstudio.com'

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
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.mp4': 'video/mp4',
}

function findChrome() {
    const candidates = [
        process.env.CHROME_PATH,
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
    ].filter(Boolean)
    return candidates.find((candidate) => {
        try {
            return fs.statSync(candidate).isFile()
        } catch {
            return false
        }
    })
}

function routesFromSitemap() {
    const file = path.join(DIST, 'sitemap.xml')
    const fallback = ['/', '/paket-foto', '/katalog-undangan', '/tentang-kami', '/artikel']
    if (!fs.existsSync(file)) return fallback
    const xml = fs.readFileSync(file, 'utf8')
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map((match) => match[1].replace(/&amp;/g, '&'))
        .filter((url) => url.startsWith(SITE_URL))
        .map((url) => new URL(url).pathname)
    return urls.length ? [...new Set(urls)] : fallback
}

function startServer() {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const pathname = decodeURIComponent((req.url || '/').split('?')[0])
            let file = path.join(DIST, pathname)
            if (pathname.endsWith('/')) file = path.join(file, 'index.html')
            if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
                file = path.join(DIST, 'index.html')
            }
            const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream'
            res.writeHead(200, { 'Content-Type': type })
            if (req.method === 'HEAD') return res.end()
            fs.createReadStream(file).pipe(res)
        })
        server.listen(0, '127.0.0.1', () => resolve(server))
    })
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function connectCdp(port, retries = 60) {
    for (let i = 0; i < retries; i++) {
        try {
            const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
            const page = targets.find((target) => target.type === 'page')
            if (page) return page
        } catch {
            // browser not ready yet
        }
        await sleep(200)
    }
    throw new Error('Chrome DevTools tidak tersedia')
}

function createClient(webSocketUrl) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(webSocketUrl)
        const pending = new Map()
        let id = 0
        ws.onopen = () => resolve({
            send(method, params = {}) {
                return new Promise((res, rej) => {
                    const messageId = ++id
                    pending.set(messageId, { resolve: res, reject: rej })
                    ws.send(JSON.stringify({ id: messageId, method, params }))
                })
            },
            close() {
                ws.close()
            },
        })
        ws.onerror = reject
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data)
            if (message.id && pending.has(message.id)) {
                const { resolve: res, reject: rej } = pending.get(message.id)
                pending.delete(message.id)
                if (message.error) rej(new Error(JSON.stringify(message.error)))
                else res(message.result)
            }
        }
    })
}

async function main() {
    if (!fs.existsSync(path.join(DIST, 'index.html'))) {
        console.log('[prerender] dist/index.html tidak ada, lewati')
        return
    }

    const chromePath = findChrome()
    if (!chromePath) {
        console.log('[prerender] Chrome/Edge tidak ditemukan, lewati (SPA tetap berfungsi)')
        return
    }

    const routes = routesFromSitemap()
    const server = await startServer()
    const port = server.address().port
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'berkesan-prerender-'))
    const debugPort = 9400 + Math.floor(Math.random() * 400)
    const chrome = spawn(chromePath, [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--hide-scrollbars',
        '--window-size=1280,900',
        `--remote-debugging-port=${debugPort}`,
        `--user-data-dir=${profile}`,
        'about:blank',
    ], { stdio: 'ignore' })

    let written = 0
    try {
        const target = await connectCdp(debugPort)
        const client = await createClient(target.webSocketDebuggerUrl)
        await client.send('Page.enable')
        await client.send('Runtime.enable')

        for (const route of routes) {
            const evalValue = async (expression) => {
                const result = await client.send('Runtime.evaluate', {
                    expression,
                    returnByValue: true,
                    awaitPromise: true,
                })
                return result.result?.value
            }

            try {
                await client.send('Page.navigate', { url: `http://127.0.0.1:${port}${route}` })

                let ready = false
                for (let attempt = 0; attempt < 60; attempt++) {
                    await sleep(250)
                    ready = await evalValue(`document.readyState === 'complete' && !!document.querySelector('h1')`)
                    if (ready) break
                }
                if (!ready) {
                    console.warn(`[prerender] lewati ${route} (tidak selesai render)`)
                    continue
                }

                await sleep(1200)
                const body = await evalValue('document.body.innerText.slice(0, 4000)')
                if (/Memuat |Error:|Oops!|Tidak Ditemukan|tidak ditemukan/i.test(body)) {
                    console.warn(`[prerender] lewati ${route} (konten gagal dimuat)`)
                    continue
                }

                const html = await evalValue('document.documentElement.outerHTML')
                const outDir = route === '/'
                    ? DIST
                    : path.join(DIST, route.replace(/^\/|\/$/g, ''))
                fs.mkdirSync(outDir, { recursive: true })
                fs.writeFileSync(path.join(outDir, 'index.html'), `<!DOCTYPE html>\n${html}`)
                written++
                console.log(`[prerender] ${route}`)
            } catch (error) {
                console.warn(`[prerender] lewati ${route}: ${error.message}`)
            }
        }

        client.close()
    } finally {
        chrome.kill()
        server.close()
        try {
            fs.rmSync(profile, { recursive: true, force: true })
        } catch {
            // best effort
        }
    }

    console.log(`[prerender] ${written}/${routes.length} halaman menjadi HTML statis`)
}

main().catch((error) => {
    console.warn(`[prerender] gagal: ${error.message}`)
    process.exit(0)
})
