import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './KatalogUndangan.css'

function KatalogUndangan() {
    const [activeCategory, setActiveCategory] = useState('Semua')
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_KATALOG_UNDANGAN || 'http://localhost:3000/katalog-undangan')
                if (!response.ok) throw new Error('Failed to fetch data')
                const result = await response.json()
                setData(result)
            } catch (err) {
                console.error('Error fetching katalog undangan:', err)
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
            <div className="katalog">
                <section className="section">
                    <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div className="loading-spinner"></div>
                        <p>Memuat Katalog...</p>
                    </div>
                </section>
            </div>
        )
    }

    if (error) {
        return (
            <div className="katalog">
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
        <div className="katalog">
            {/* Page Header */}
            <section className="page-hero">
                <div className="page-hero__overlay"></div>
                <div className="container page-hero__content">
                    <span className="hero__badge">💌 Undangan Digital</span>
                    <h1>Katalog <span className="text-gradient">Undangan</span></h1>
                    <p>Pilih template undangan digital untuk acara spesialmu</p>
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

            {/* Template Gallery */}
            <section className="section" style={{ paddingTop: '40px' }}>
                <div className="container">
                    {data.filter(cat => activeCategory === 'Semua' || cat.category_name === activeCategory).map((cat) => (
                        <div key={cat.category_id} className="paket__section">
                            <div className="paket__divider">
                                <span className="paket__divider-line"></span>
                                <span className="paket__divider-label">{cat.category_name}</span>
                                <span className="paket__divider-line"></span>
                            </div>
                            <div className="katalog__grid">
                                {cat.items.map((tpl) => (
                                    <div
                                        key={tpl.id}
                                        className="katalog__card card"
                                        onClick={() => window.open(tpl.demo_url || '#', '_blank')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="katalog__preview">
                                            {tpl.thumbnail ? (
                                                <img src={tpl.thumbnail} alt={tpl.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span>💌</span>
                                            )}
                                        </div>
                                        <div className="katalog__info">
                                            <span className="katalog__category-tag">{cat.category_name}</span>
                                            <h3>{tpl.name}</h3>
                                            <p className="katalog__price">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(tpl.price)}
                                            </p>
                                            <div className="katalog__actions" onClick={(e) => e.stopPropagation()}>
                                                <a href={tpl.demo_url || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                                    👁 Demo
                                                </a>
                                                <Link
                                                    to={`/form?template=${encodeURIComponent(tpl.name)}`}
                                                    className="btn btn-gold btn-sm"
                                                >
                                                    📝 Pesan
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default KatalogUndangan
