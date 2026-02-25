import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './Artikel.css'

function ArtikelDetail() {
    const { slug } = useParams()
    const [artikel, setArtikel] = useState(null)
    const [otherArticles, setOtherArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchArtikelDetail = async () => {
            try {
                // Fetch all articles then find by slug
                // In a real app, you might want an endpoint like /artikel/:slug
                const apiUrl = import.meta.env.VITE_API_ARTIKEL || 'http://localhost:3000/artikel'
                const response = await fetch(apiUrl)
                if (!response.ok) throw new Error('Failed to fetch data')
                const data = await response.json()

                const foundArtikel = data.find(item => item.slug === slug)
                if (!foundArtikel) {
                    throw new Error('Artikel tidak ditemukan')
                }

                setArtikel(foundArtikel)
                // Get up to 10 other random articles
                const others = data.filter(item => item.slug !== slug)
                const shuffled = others.sort(() => 0.5 - Math.random())
                setOtherArticles(shuffled.slice(0, 10))
            } catch (err) {
                console.error('Error fetching artikel detail:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchArtikelDetail()
    }, [slug])

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateString).toLocaleDateString('id-ID', options)
    }

    if (loading) {
        return (
            <div className="artikel-detail">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="loading-spinner"></div>
                    <p>Memuat Artikel...</p>
                </div>
            </div>
        )
    }

    if (error || !artikel) {
        return (
            <div className="artikel-detail">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Link to="/artikel" className="artikel-detail__back">
                        ← Kembali ke Artikel
                    </Link>
                    <h2 style={{ marginTop: '20px' }}>Oops!</h2>
                    <p style={{ color: 'red' }}>{error || 'Artikel tidak ditemukan'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="artikel-detail">
            <div className="container">
                <div className="artikel-detail__back-wrapper">
                    <Link to="/artikel" className="artikel-detail__back">
                        ← Kembali ke Artikel
                    </Link>
                </div>

                <div className="artikel-detail__layout">
                    {/* Main Content Area */}
                    <div className="artikel-detail__main">
                        <header className="artikel-detail__header reveal-up is-visible">
                            <h1 className="artikel-detail__title">{artikel.title}</h1>
                            <div className="artikel-detail__meta">
                                <span>📅 {formatDate(artikel.created_at)}</span>
                                <span style={{ color: '#ccc' }}>•</span>
                                <div className="artikel__tags" style={{ display: 'inline-flex' }}>
                                    {artikel.tags && artikel.tags.map((tag, idx) => (
                                        <span key={idx} className="artikel__tag">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </header>

                        {artikel.image && (
                            <div className="artikel-detail__image-wrapper reveal-up is-visible" style={{ transitionDelay: '0.1s' }}>
                                <img src={artikel.image} alt={artikel.title} className="artikel-detail__image" />
                            </div>
                        )}

                        <div className="artikel-detail__content reveal-up is-visible" style={{ transitionDelay: '0.2s' }}>
                            <div className="artikel-detail__text">
                                {artikel.content && artikel.content.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    {otherArticles && otherArticles.length > 0 && (
                        <aside className="artikel-detail__sidebar reveal-up is-visible" style={{ transitionDelay: '0.3s' }}>
                            <h3 className="artikel-detail__sidebar-title">Artikel Lainnya</h3>
                            <div className="artikel-detail__sidebar-list">
                                {otherArticles.map((item) => (
                                    <Link to={`/artikel/${item.slug}`} className="artikel-sidebar-item" key={item.id}>
                                        <div className="artikel-sidebar-item__img-wrapper">
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} className="artikel-sidebar-item__img" />
                                            ) : (
                                                <span style={{ fontSize: '1.5rem' }}>📝</span>
                                            )}
                                        </div>
                                        <div className="artikel-sidebar-item__content">
                                            <h4 className="artikel-sidebar-item__title">{item.title}</h4>
                                            <span className="artikel-sidebar-item__date">{formatDate(item.created_at)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ArtikelDetail
