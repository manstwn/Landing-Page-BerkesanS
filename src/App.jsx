import { Routes, Route } from 'react-router-dom'
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

function App() {
    return (
        <>
            <ScrollToTop />
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/paket-foto" element={<PaketFoto />} />
                    <Route path="/paket-foto/:id" element={<PaketFotoDetail />} />
                    <Route path="/katalog-undangan" element={<KatalogUndangan />} />
                    <Route path="/tentang-kami" element={<TentangKami />} />
                    <Route path="/form" element={<FormPage />} />
                    <Route path="/share" element={<SharePage />} />
                    <Route path="/share/:id" element={<SharePage />} />
                    <Route path="/booking" element={<BookingPage />} />
                </Routes>
            </main>
            <Footer />
            <WhatsAppFloat />
        </>
    )
}

export default App
