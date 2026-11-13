import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Artikel.css'

function ArtikelCard({ artikel }) {
    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/artikel/${artikel.slug}`)
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateString).toLocaleDateString('id-ID', options)
    }

    // Get a brief excerpt from the first content paragraph
    const getExcerpt = (contentArray) => {
        if (!contentArray || contentArray.length === 0) return ''
        const firstPara = contentArray[0]
        return firstPara.length > 150 ? firstPara.substring(0, 150) + '...' : firstPara
    }

    return (
        <div className="artikel__card card" onClick={handleCardClick}>
            <div className="artikel__image">
                {artikel.image ? (
                    <img src={artikel.image} alt={artikel.title} className="artikel__image-img" />
                ) : (
                    <span style={{ fontSize: '3rem' }}>📝</span>
                )}
            </div>
            <div className="artikel__content">
                <div className="artikel__meta">
                    <span className="artikel__date">📅 {formatDate(artikel.created_at)}</span>
                    <div className="artikel__tags">
                        {artikel.tags && artikel.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="artikel__tag">#{tag}</span>
                        ))}
                    </div>
                </div>
                <h3 className="artikel__title">{artikel.title}</h3>
                <p className="artikel__excerpt">{getExcerpt(artikel.content)}</p>
                <div className="artikel__read-more">
                    Baca Selengkapnya <span>→</span>
                </div>
            </div>
        </div>
    )
}

function Artikel() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_ARTIKEL || 'http://localhost:3000/artikel'
                const response = await fetch(apiUrl)
                if (!response.ok) throw new Error('Failed to fetch data')
                const result = await response.json()
                setData(result)
            } catch (err) {
                console.error('Error fetching artikel:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="artikel">
                <section className="section">
                    <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div className="loading-spinner"></div>
                        <p>Memuat Artikel...</p>
                    </div>
                </section>
            </div>
        )
    }

    if (error) {
        return (
            <div className="artikel">
                <section className="section">
                    <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                        <p style={{ color: 'red' }}>Error: {error}</p>
                        <button onClick={() => window.location.reload()} className="btn btn-gold">Coba Lagi</button>
                    </div>
                </section>
            </div>
        )
    }

    // Pagination logic
    const totalPages = Math.ceil((data?.length || 0) / ITEMS_PER_PAGE)
    const currentData = data ? data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) : []

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="artikel">
            {/* Page Header */}
            <section className="page-hero" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="page-hero__overlay"></div>
                <div className="bg-pattern-dots" style={{ opacity: 0.6 }}></div>
                {/* Visual Decors */}
                <div className="decor-glow decor-glow--tl"></div>
                <div className="decor-cross decor-floating" style={{ top: '20%', right: '10%', animationDelay: '0s' }}></div>

                <div className="container page-hero__content" style={{ position: 'relative', zIndex: 2 }}>
                    <h1>Artikel & <span className="text-gradient">Inspirasi</span></h1>
                    <p>Tips, cerita, dan panduan seputar pernikahan dan fotografi</p>
                </div>
            </section>

            {/* Artikel Grid */}
            <section className="section" style={{ position: 'relative', overflow: 'hidden', paddingTop: '40px' }}>
                <div className="bg-grid"></div>
                {/* Visual Decors */}
                <div className="decor-glow decor-glow--br" style={{ opacity: 0.3 }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    {currentData && currentData.length > 0 ? (
                        <>
                            <div className="artikel__grid">
                                {currentData.map((artikel) => (
                                    <ArtikelCard key={artikel.id} artikel={artikel} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="artikel__pagination" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        style={{ minWidth: '40px' }}
                                    >
                                        &larr;
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            className={`btn btn-sm ${currentPage === i + 1 ? 'btn-gold' : 'btn-outline'}`}
                                            onClick={() => handlePageChange(i + 1)}
                                            style={{ minWidth: '40px' }}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        style={{ minWidth: '40px' }}
                                    >
                                        &rarr;
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <p>Belum ada artikel saat ini.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Artikel
