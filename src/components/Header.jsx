import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/paket-foto', label: 'Paket Foto' },
    { path: '/katalog-undangan', label: 'Katalog Undangan' },
    { path: '/artikel', label: 'Artikel' },
    { path: '/tentang-kami', label: 'Tentang Kami' },
]

function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
    }, [location])

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    return (
        <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
            <div className="container header__inner">
                <Link to="/" className="header__logo">
                    <img
                        src="/logo-280.png"
                        alt="Logo Berkesan Studio"
                        className="header__logo-img"
                        width="48"
                        height="48"
                        decoding="async"
                    />
                    <span className="header__logo-text">Berkesan<span className="text-gold"> Studio</span></span>
                </Link>

                <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`header__link ${location.pathname === link.path ? 'header__link--active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a
                        href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890'}?text=Halo%20Berkesan%20Studio%2C%20saya%20tertarik%20dengan%20layanan%20yang%20ditawarkan.%20Boleh%20minta%20info%20lebih%20lanjut%3F`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-gold btn-sm header__cta"
                        style={{ background: '#25D366', borderColor: '#25D366', color: '#fff' }}
                    >
                        WhatsApp
                    </a>
                </nav>


                <button
                    className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    )
}

export default Header
