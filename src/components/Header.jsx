import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/paket-foto', label: 'Paket Foto' },
    { path: '/katalog-undangan', label: 'Katalog Undangan' },
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
                    <span className="header__logo-icon">✦</span>
                    <span className="header__logo-text">Kece<span className="text-gold">Studio</span></span>
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
                    <Link
                        to="/booking"
                        className="btn btn-gold btn-sm header__cta"
                    >
                        Booking Sekarang
                    </Link>
                    <a
                        href={import.meta.env.VITE_BACKEND_URL || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Backend Admin"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            fontSize: '1.1rem',
                            opacity: 0.5,
                            color: 'var(--color-gray-dark, #555)',
                            textDecoration: 'none',
                            transition: 'opacity 0.2s, transform 0.3s',
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'rotate(60deg)' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.transform = 'rotate(0deg)' }}
                    >
                        ⚙
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
