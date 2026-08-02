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
import PtKpc from './pages/PtKpc'
import PtKpcShare from './pages/PtKpcShare'
import PtKpcRsvp from './pages/PtKpcRsvp'
import LiveRequestPage from './pages/LiveRequestPage'
import SumpahDokterPage from './pages/SumpahDokterPage'
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

    const isStandalonePage =
        !isMainRoute ||
        location.pathname === '/pt-kpc' ||
        location.pathname === '/pt-kpc-share' ||
        location.pathname === '/pt-kpc-rsvp' ||
        location.pathname === '/design2-pt-kpc' ||
        location.pathname === '/design-pt-kpc' ||
        location.pathname === '/sumpahdokter-fkung-2026' ||
        location.pathname === '/sumpahdokter-fkung-2026-share' ||
        location.pathname === '/sumpahdokter-fkung-2026-rsvp'

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

                    {/* Specific Design Landing Page Routes */}
                    <Route path="/pt-kpc" element={<PtKpc />} />
                    <Route path="/pt-kpc-share" element={<PtKpcShare />} />
                    <Route path="/pt-kpc-rsvp" element={<PtKpcRsvp />} />
                    <Route path="/sumpahdokter-fkung-2026" element={<SumpahDokterPage />} />
                    <Route path="/sumpahdokter-fkung-2026-share" element={<SumpahDokterShare />} />
                    <Route path="/sumpahdokter-fkung-2026-rsvp" element={<SumpahDokterRsvp />} />

                    {/* Dynamic Fallback for any /foldername inside request-page-live-same-system/ */}
                    <Route path="/request-page-live-same-system/:folderName" element={<LiveRequestPage />} />
                    <Route path="/:folderName" element={<LiveRequestPage />} />
                </Routes>
            </main>
            {!isStandalonePage && <Footer />}
            {!isStandalonePage && <WhatsAppFloat />}
        </>
    )
}

export default App


