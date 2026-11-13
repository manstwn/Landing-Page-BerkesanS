import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import ScrollToTop from './components/ScrollToTop'
import Seo from './components/Seo'

const Home = lazy(() => import('./pages/Home'))
const PaketFoto = lazy(() => import('./pages/PaketFoto'))
const PaketFotoDetail = lazy(() => import('./pages/PaketFotoDetail'))
const KatalogUndangan = lazy(() => import('./pages/KatalogUndangan'))
const TentangKami = lazy(() => import('./pages/TentangKami'))
const FormPage = lazy(() => import('./pages/FormPage'))
const SharePage = lazy(() => import('./pages/SharePage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const Artikel = lazy(() => import('./pages/Artikel'))
const ArtikelDetail = lazy(() => import('./pages/ArtikelDetail'))
const PtKpcShare = lazy(() => import('./pages/PtKpcShare'))
const PtKpcRsvp = lazy(() => import('./pages/PtKpcRsvp'))
const SumpahDokterShare = lazy(() => import('./pages/SumpahDokterShare'))
const SumpahDokterRsvp = lazy(() => import('./pages/SumpahDokterRsvp'))

const MAIN_ROUTES = [
    '/',
    '/paket-foto',
    '/katalog-undangan',
    '/tentang-kami',
    '/form',
    '/share',
    '/booking',
    '/artikel'
]

const TOOL_ROUTES = [
    /^\/form(\/|$)/,
    /^\/booking(\/|$)/,
    /^\/share(\/|$)/,
    /^\/pt-kpc-/,
    /^\/fkung-/,
    /^\/sumpahdokter-/
]

function toolTitle(pathname) {
    if (pathname.startsWith('/form')) return 'Form Pemesanan Undangan — Berkesan Studio'
    if (pathname.startsWith('/booking')) return 'Booking Paket Foto — Berkesan Studio'
    if (pathname.startsWith('/share')) return 'Generator Link Undangan — Berkesan Studio'
    return 'RSVP & Share — Berkesan Studio'
}

function RouteSeo() {
    const { pathname } = useLocation()
    const isTool = TOOL_ROUTES.some((pattern) => pattern.test(pathname))
    return (
        <Seo
            title={isTool ? toolTitle(pathname) : undefined}
            robots={isTool ? 'noindex, follow' : undefined}
            canonical={isTool ? pathname : undefined}
        />
    )
}

function App() {
    const location = useLocation()
    const isMainRoute =
        MAIN_ROUTES.includes(location.pathname) ||
        location.pathname.startsWith('/paket-foto/') ||
        location.pathname.startsWith('/share/') ||
        location.pathname.startsWith('/artikel/')

    const isStandalonePage = !isMainRoute

    return (
        <>
            <ScrollToTop />
            <RouteSeo />
            {!isStandalonePage && <Header />}
            <main>
                <Suspense fallback={<div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loading-spinner"></div></div>}>
                    <Routes>
                        {/* Main Website Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/paket-foto" element={<PaketFoto />} />
                        <Route path="/paket-foto/:id" element={<PaketFotoDetail />} />
                        <Route path="/katalog-undangan" element={<KatalogUndangan />} />
                        <Route path="/tentang-kami" element={<TentangKami />} />
                        <Route path="/form" element={<FormPage />} />
                        <Route path="/share" element={<SharePage />} />
                        <Route path="/share/:id" element={<SharePage />} />
                        <Route path="/booking" element={<BookingPage />} />
                        <Route path="/artikel" element={<Artikel />} />
                        <Route path="/artikel/:slug" element={<ArtikelDetail />} />

                        {/* Request-site admin tools. Invitation viewers are served
                            statically from request-site/<folder> at /<folder>. */}
                        <Route path="/pt-kpc-share" element={<PtKpcShare />} />
                        <Route path="/pt-kpc-rsvp" element={<PtKpcRsvp />} />
                        <Route path="/fkung-share" element={<SumpahDokterShare />} />
                        <Route path="/fkung-rsvp" element={<SumpahDokterRsvp />} />
                        <Route path="/sumpahdokter-fkung-2026-share" element={<SumpahDokterShare />} />
                        <Route path="/sumpahdokter-fkung-2026-rsvp" element={<SumpahDokterRsvp />} />
                    </Routes>
                </Suspense>
            </main>
            {!isStandalonePage && <Footer />}
            {!isStandalonePage && <WhatsAppFloat />}
        </>
    )
}

export default App
