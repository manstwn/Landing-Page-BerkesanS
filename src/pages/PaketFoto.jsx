import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './PaketFoto.css'

function PaketCard({ paket }) {
    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/paket-foto/${paket.id}`)
    }

    return (
        <div
            className="paket__card card"
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            {paket.is_popular && (
                <span className="paket__badge">Popular</span>
            )}
            <div className="paket__image">
                {paket.thumbnail ? (
                    <img src={paket.thumbnail} alt={paket.name} className="paket__image-img" />
                ) : (
                    <span>📸</span>
                )}
            </div>
            <div className="paket__info">
                <h3>{paket.name}</h3>
                <p className="paket__price">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(paket.price)}
                </p>
                <ul className="paket__features">
                    {paket.features.filter(f => f && f.trim() !== '').map((f, j) => (
                        <li key={j}>
                            <span className="paket__check">✦</span>
                            {f}
                        </li>
                    ))}
                </ul>
                <div
                    className="paket__card-actions"
                    style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Link
                        to={`/paket-foto/${paket.id}`}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%' }}
                    >
                        Lihat Detail
                    </Link>
                    <Link
                        to={`/booking?packageId=${paket.id}`}
                        className="btn btn-gold btn-sm"
                        style={{ width: '100%' }}
                    >
                        Booking Form
                    </Link>
                    <a
                        href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890'}?text=Halo%20Berkesan%20Studio%2C%20saya%20tertarik%20dengan%20paket%20${encodeURIComponent(paket.name)}%20(${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(paket.price)}).%20Apakah%20bisa%20dibantu%20untuk%20jadwalnya%3F`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-gold btn-sm"
                        style={{ width: '100%', background: '#25D366', borderColor: '#25D366', textAlign: 'center', justifyContent: 'center' }}
                    >
                        Booking via WhatsApp
                    </a>
                </div>
            </div>
        </div>
    )
}

function PaketFoto() {
    const [activeCategory, setActiveCategory] = useState('Semua')
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_PAKET_FOTO || 'http://localhost:3000/paket-foto')
                if (!response.ok) throw new Error('Failed to fetch data')
                const result = await response.json()
                setData(result)
            } catch (err) {
                console.error('Error fetching paket foto:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const categories = ['Semua', ...data.map(cat => cat.category_name)]

    if (loading) {
        return (
            <div className="paket-foto">
                <section className="section">
                    <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div className="loading-spinner"></div>
                        <p>Memuat Paket Foto...</p>
                    </div>
                </section>
            </div>
        )
    }

    if (error) {
        return (
            <div className="paket-foto">
                <section className="section">
                    <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                        <p style={{ color: 'red' }}>Error: {error}</p>
                        <button onClick={() => window.location.reload()} className="btn btn-gold">Coba Lagi</button>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="paket-foto">
            {/* Page Header */}
            <section className="page-hero">
                <div className="page-hero__overlay"></div>
                <div className="container page-hero__content">
                    <span className="hero__badge">📸 Foto Studio</span>
                    <h1>Paket <span className="text-gradient">Fotostudio</span></h1>
                    <p>Pilih paket yang sesuai kebutuhanmu</p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="katalog__categories">
                <div className="container">
                    <h3 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '1.1rem', fontWeight: '500' }}>Silakan Pilih Kategori</h3>
                    <div className="katalog__category-list">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`katalog__category-btn ${activeCategory === cat ? 'katalog__category-btn--active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Paket Grid */}
            <section className="section" style={{ paddingTop: '40px' }}>
                <div className="container">
                    {data.filter(cat => activeCategory === 'Semua' || cat.category_name === activeCategory).map((cat) => (
                        <div key={cat.category_id} className="paket__section">
                            <div className="paket__divider" style={{ marginBottom: '10px' }}>
                                <span className="paket__divider-line"></span>
                                <span className="paket__divider-label">{cat.category_name}</span>
                                <span className="paket__divider-line"></span>
                            </div>
                            {cat.category_description && (
                                <p className="paket__cat-desc" style={{ textAlign: 'center', color: '#64748b', margin: '0 auto 32px', maxWidth: '600px', fontSize: '0.95rem' }}>
                                    {cat.category_description}
                                </p>
                            )}
                            <div className="paket__grid">
                                {cat.packages.map((paket) => (
                                    <PaketCard key={paket.id} paket={paket} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default PaketFoto
