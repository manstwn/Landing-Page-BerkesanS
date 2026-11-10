import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import PaketFoto from './pages/PaketFoto'
import PaketFotoDetail from './pages/PaketFotoDetail'
import KatalogUndangan from './pages/KatalogUndangan'
import TentangKami from './pages/TentangKami'
import FormPage from './pages/FormPage'
import SharePage from './pages/SharePage'
import BookingPage from './pages/BookingPage'
import Artikel from './pages/Artikel'
import ArtikelDetail from './pages/ArtikelDetail'
import PtKpcShare from './pages/PtKpcShare'
import PtKpcRsvp from './pages/PtKpcRsvp'
import SumpahDokterShare from './pages/SumpahDokterShare'
import SumpahDokterRsvp from './pages/SumpahDokterRsvp'

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
            {!isStandalonePage && <Header />}
            <main>
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
            </main>
            {!isStandalonePage && <Footer />}
            {!isStandalonePage && <WhatsAppFloat />}
        </>
    )
}

export default App
