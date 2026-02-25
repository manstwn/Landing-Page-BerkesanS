import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './PaketFotoDetail.css'

function PaketFotoDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [paket, setPaket] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeImage, setActiveImage] = useState(0)

    useEffect(() => {
        const fetchPaket = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_PAKET_FOTO || 'http://localhost:3000/paket-foto')
                if (!response.ok) throw new Error('Failed to fetch data')
                const result = await response.json()

                // Find paket in nested categories
                let foundPaket = null
                for (const cat of result) {
                    const p = cat.packages.find(item => item.id === id)
                    if (p) {
                        foundPaket = { ...p, category: cat.category_name }
                        break
                    }
                }

                if (foundPaket) {
                    setPaket(foundPaket)
                } else {
                    setError('Paket tidak ditemukan')
                }
            } catch (err) {
                console.error('Error fetching paket detail:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchPaket()
    }, [id])

    if (loading) {
        return (
            <div className="paket-detail">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="loading-spinner"></div>
                    <p>Memuat Detail Paket...</p>
                </div>
            </div>
        )
    }

    if (error || !paket) {
        return (
            <div className="detail-not-found">
                <div className="container">
                    <div className="detail-not-found__content">
                        <span className="detail-not-found__icon">📸</span>
                        <h2>Paket Tidak Ditemukan</h2>
                        <p>{error || 'Maaf, paket yang kamu cari tidak tersedia.'}</p>
                        <Link to="/paket-foto" className="btn btn-gold">
                            ← Kembali ke Paket
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const packageImages = paket.images && paket.images.length > 0
        ? paket.images.map(img => img.url)
        : [paket.thumbnail]

    return (
        <div className="paket-detail">
            {/* Breadcrumb */}
            <div className="detail-breadcrumb">
                <div className="container">
                    <nav className="detail-breadcrumb__nav">
                        <Link to="/">Beranda</Link>
                        <span className="detail-breadcrumb__sep">›</span>
                        <Link to="/paket-foto">Paket Foto</Link>
                        <span className="detail-breadcrumb__sep">›</span>
                        <span className="detail-breadcrumb__current">{paket.name}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <section className="detail-main">
                <div className="container">
                    <div className="detail-layout">
                        {/* Left — Gallery */}
                        <div className="detail-gallery">
                            <div className="detail-gallery__main">
                                {paket.is_popular && (
                                    <span className="detail-gallery__badge">Popular</span>
                                )}
                                <img
                                    src={packageImages[activeImage]}
                                    alt={`${paket.name} - Foto ${activeImage + 1}`}
                                    className="detail-gallery__image"
                                />
                            </div>
                            <div className="detail-gallery__thumbs">
                                {packageImages.map((img, i) => (
                                    <button
                                        key={i}
                                        className={`detail-gallery__thumb ${i === activeImage ? 'detail-gallery__thumb--active' : ''}`}
                                        onClick={() => setActiveImage(i)}
                                    >
                                        <img src={img} alt={`Thumbnail ${i + 1}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right — Info */}
                        <div className="detail-info">
                            <div className="detail-info__top">
                                <span className="detail-info__category">{paket.category}</span>
                                <h1 className="detail-info__name">{paket.name}</h1>
                                <p className="detail-info__price">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(paket.price)}
                                </p>
                            </div>

                            {/* Features */}
                            <div className="detail-features">
                                <h3 className="detail-features__title">Yang Kamu Dapatkan</h3>
                                <ul className="detail-features__list">
                                    {paket.features.filter(f => f && f.trim() !== '').map((f, j) => (
                                        <li key={j} className="detail-features__item">
                                            <span className="detail-features__icon">✦</span>
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="detail-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {/* <Link
                                    to={`/booking?packageId=${paket.id}`}
                                    className="btn btn-gold"
                                    style={{ width: '100%', padding: '16px' }}
                                >
                                    Booking Form
                                </Link> */}
                                <a
                                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890'}?text=Halo%20Berkesan%20Studio%2C%20saya%20tertarik%20dengan%20paket%20${encodeURIComponent(paket.name)}%20(${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(paket.price)}).%20Apakah%20bisa%20dibantu%20untuk%20jadwalnya%3F`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-gold"
                                    style={{ width: '100%', padding: '16px', background: '#25D366', borderColor: '#25D366', textAlign: 'center', justifyContent: 'center' }}
                                >
                                    Booking via WhatsApp
                                </a>
                                <button
                                    onClick={() => navigate('/paket-foto')}
                                    className="btn btn-outline"
                                    style={{ width: '100%', padding: '16px' }}
                                >
                                    ← Lihat Paket Lain
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PaketFotoDetail
