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
import DesignPtKpc from './pages/DesignPtKpc'
import Design2PtKpc from './pages/Design2PtKpc'
import LiveRequestPage from './pages/LiveRequestPage'

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

                    {/* Specific Design Landing Page Routes */}
                    <Route path="/design-pt-kpc" element={<DesignPtKpc />} />
                    <Route path="/design2-pt-kpc" element={<Design2PtKpc />} />

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


