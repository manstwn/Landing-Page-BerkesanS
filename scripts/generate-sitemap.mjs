import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SITE_URL = 'https://www.berkesanstudio.com'
const TODAY = new Date().toISOString().slice(0, 10)

for (const file of ['.env', '.env.local']) {
    try {
        process.loadEnvFile(path.join(ROOT, file))
    } catch {
        // optional env file
    }
}

function apiBase() {
    if (process.env.SEO_API_BASE) return process.env.SEO_API_BASE.replace(/\/$/, '')
    if (process.env.VITE_API_PAKET_FOTO) {
        try {
            return new URL(process.env.VITE_API_PAKET_FOTO).origin
        } catch {
            // fall through
        }
    }
    return 'http://localhost:3026'
}

async function fetchJson(url) {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`)
    return response.json()
}

const escapeXml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const entries = [
    { loc: `${SITE_URL}/`, lastmod: TODAY, priority: '1.0', changefreq: 'weekly' },
    { loc: `${SITE_URL}/paket-foto`, lastmod: TODAY, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/katalog-undangan`, lastmod: TODAY, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/tentang-kami`, lastmod: TODAY, priority: '0.6', changefreq: 'monthly' },
    { loc: `${SITE_URL}/artikel`, lastmod: TODAY, priority: '0.7', changefreq: 'weekly' },
]

const seen = new Set(entries.map((entry) => entry.loc))
const add = (loc, lastmod, priority, changefreq) => {
    if (!loc || seen.has(loc)) return
    seen.add(loc)
    entries.push({ loc, lastmod, priority, changefreq })
}

const base = apiBase()
let apiOk = false

try {
    const categories = await fetchJson(`${base}/paket-foto`)
    apiOk = true
    for (const category of categories) {
        for (const paket of category.packages || []) {
            if (String(paket.status).toLowerCase() === 'inactive') continue
            if (!paket.id) continue
            add(`${SITE_URL}/paket-foto/${encodeURIComponent(paket.id)}`, TODAY, '0.8', 'weekly')
        }
    }
    console.log(`[sitemap] paket foto dari ${base}`)
} catch (error) {
    console.warn(`[sitemap] lewati paket foto: ${error.message}`)
}

try {
    const articles = await fetchJson(`${base}/artikel`)
    apiOk = true
    for (const article of articles) {
        if (!article.slug) continue
        const lastmod = article.updated_at || article.created_at
            ? new Date(article.updated_at || article.created_at)
            : null
        add(
            `${SITE_URL}/artikel/${encodeURIComponent(article.slug)}`,
            lastmod && !Number.isNaN(lastmod.getTime()) ? lastmod.toISOString().slice(0, 10) : TODAY,
            '0.6',
            'monthly'
        )
    }
    console.log(`[sitemap] ${articles.length} artikel dari ${base}`)
} catch (error) {
    console.warn(`[sitemap] lewati artikel: ${error.message}`)
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

const target = path.join(ROOT, 'public', 'sitemap.xml')
if (!apiOk && fs.existsSync(target)) {
    console.warn('[sitemap] API tidak tersedia — sitemap lama dipertahankan')
} else {
    fs.writeFileSync(target, xml)
    console.log(`[sitemap] wrote ${entries.length} URLs`)
}
