import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/FormStyles.css'

const BookingPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        email: '',
        date: '',
        time: '',
        packageId: '',
        notes: ''
    })

    const [paketList, setPaketList] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeImage, setActiveImage] = useState(0)
    const [selectedPackage, setSelectedPackage] = useState(null)

    const [touched, setTouched] = useState({})
    const [errors, setErrors] = useState({})
    const [submitStatus, setSubmitStatus] = useState('idle') // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('')
    const location = useLocation()

    // Fetch Paket Data
    useEffect(() => {
        const fetchPaket = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_PAKET_FOTO || 'http://localhost:3000/paket-foto')
                if (!response.ok) throw new Error('Failed to fetch packages')
                const result = await response.json()

                // Flatten nested packages into a single list for the dropdown
                const flattened = result.reduce((acc, cat) => {
                    return acc.concat(cat.packages || [])
                }, [])

                setPaketList(flattened)
            } catch (err) {
                console.error('Error fetching packages for booking:', err)
                setErrorMessage('Gagal memuat daftar paket.')
            } finally {
                setLoading(false)
            }
        }
        fetchPaket()
    }, [])

    // Handle package selection via URL params
    useEffect(() => {
        if (loading || paketList.length === 0) return

        const params = new URLSearchParams(location.search)
        const pkgId = params.get('packageId')

        if (pkgId) {
            const pkg = paketList.find(p => p.id === pkgId)
            if (pkg) {
                setFormData(prev => ({ ...prev, packageId: pkgId }))
                setSelectedPackage(pkg)
                setActiveImage(0)
            }
        }
    }, [location.search, loading, paketList])

    // Auto-slide effect
    useEffect(() => {
        if (!selectedPackage) return;
        const images = getPackageImages(selectedPackage)
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            nextImage();
        }, 3000);

        return () => clearInterval(interval);
    }, [selectedPackage, activeImage]);

    const getPackageImages = (pkg) => {
        if (!pkg) return []
        if (pkg.images && pkg.images.length > 0) return pkg.images.map(img => img.url)
        return [pkg.thumbnail]
    }

    const validate = (name, value) => {
        let error = ''
        if (name === 'whatsapp') {
            if (!value.startsWith('08')) {
                error = 'Nomor WhatsApp harus berawalan 08...'
            } else if (value.length < 10) {
                error = 'Nomor WhatsApp terlalu pendek'
            }
        }
        return error
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (name === 'packageId') {
            const pkg = paketList.find(p => p.id === value)
            setSelectedPackage(pkg)
            setActiveImage(0)
        }

        if (touched[name]) {
            setErrors(prev => ({ ...prev, [name]: validate(name, value) }))
        }
    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        setTouched(prev => ({ ...prev, [name]: true }))
        setErrors(prev => ({ ...prev, [name]: validate(name, value) }))
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price || 0)
    }

    const generateEmailHtml = (data, packageName) => {
        return `
            <h2>Data Booking Foto</h2>
            <p><strong>Nama:</strong> ${data.name || '-'}</p>
            <p><strong>WhatsApp:</strong> ${data.whatsapp || '-'}</p>
            <p><strong>Email:</strong> ${data.email || '-'}</p>
            <hr>

            <h2>Rencana Jadwal</h2>
            <p><strong>Tanggal:</strong> ${data.date || '-'}</p>
            <p><strong>Jam:</strong> ${data.time ? data.time + ' WIB' : '-'}</p>
            <hr>

            <h2>Detail Paket</h2>
            <p><strong>Paket:</strong> ${packageName || '-'}</p>
            <hr>

            <h2>Catatan Tambahan</h2>
            <p>${data.notes ? data.notes.replace(/\n/g, '<br>') : '-'}</p>
        `
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newErrors = {}
        Object.keys(formData).forEach(key => {
            if (key === 'notes') return
            const error = validate(key, formData[key])
            if (error) newErrors[key] = error
        })

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setTouched(Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {}))
            alert('Mohon periksa kembali data Anda.')
            return
        }

        const pkg = paketList.find(p => p.id === formData.packageId)
        const packageName = pkg ? `${pkg.name} - ${formatPrice(pkg.price)}` : 'Belum dipilih'

        const htmlBody = generateEmailHtml(formData, packageName)

        const payload = {
            email_body: htmlBody,
            Data: {
                ...formData,
                packageName
            }
        }

        setSubmitStatus('loading')

        try {
            const webhookUrl = import.meta.env.VITE_WEBHOOK_BOOKING_URL
            if (!webhookUrl) throw new Error('Booking Webhook URL belum disetting!')

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                throw new Error(`Webhook Failed: ${response.status}`)
            }

            setSubmitStatus('success')

            // Fire booking-specific backup webhooks (fire and forget)
            const backupWebhooks = [
                import.meta.env.VITE_WEBHOOK_BOOKING_URL_2,
                import.meta.env.VITE_WEBHOOK_BOOKING_URL_3,
                import.meta.env.VITE_WEBHOOK_BOOKING_URL_4,
                import.meta.env.VITE_WEBHOOK_BOOKING_URL_5,
            ].filter(url => url && url.trim() !== '')

            if (backupWebhooks.length > 0) {
                Promise.allSettled(backupWebhooks.map(url =>
                    fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    })
                ))
            }
        } catch (error) {
            console.error('Error sending booking:', error)
            setErrorMessage(error.message)
            setSubmitStatus('error')
        }
    }

    const nextImage = () => {
        if (!selectedPackage) return
        const images = getPackageImages(selectedPackage)
        setActiveImage((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        if (!selectedPackage) return
        const images = getPackageImages(selectedPackage)
        setActiveImage((prev) => (prev - 1 + images.length) % images.length)
    }

    const timeOptions = []
    for (let i = 8; i <= 20; i++) {
        const hour = i.toString().padStart(2, '0')
        timeOptions.push(`${hour}:00`)
        if (i !== 20) timeOptions.push(`${hour}:30`)
    }

    return (
        <div className="form-page-wrapper">
            <div className="form-container">
                {submitStatus !== 'idle' && submitStatus !== 'loading' && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center', zIndex: 1000
                    }}>
                        <div className="modal-box" style={{
                            backgroundColor: 'white', padding: '2rem', borderRadius: '16px',
                            maxWidth: '400px', width: '90%', textAlign: 'center',
                            color: '#333', boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                        }}>
                            {submitStatus === 'success' ? (
                                <>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                                    <h2 style={{ marginBottom: '0.5rem', color: '#4caf50' }}>Booking Terkirim!</h2>
                                    <p style={{ marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                        Data booking Anda telah berhasil dikirim.<br />
                                        Kami akan segera menghubungi Anda.
                                    </p>
                                    <button onClick={() => setSubmitStatus('idle')} className="btn btn-gold" style={{ width: '100%' }}>Tutup</button>
                                </>
                            ) : (
                                <>
                                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>❌</div>
                                    <h2 style={{ marginBottom: '0.5rem', color: '#ef4444' }}>Gagal Mengirim</h2>
                                    <p style={{ marginBottom: '1.5rem' }}>{errorMessage}</p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => setSubmitStatus('idle')} className="btn btn-outline" style={{ flex: 1 }}>Tutup</button>
                                        <button onClick={handleSubmit} className="btn btn-gold" style={{ flex: 1 }}>Coba Lagi</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {submitStatus === 'loading' && (
                    <div className="loading-overlay" style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center', zIndex: 1000
                    }}>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                            <div className="loading-spinner"></div>
                            <p>Mengirim Data...</p>
                        </div>
                    </div>
                )}

                <header className="form-header">
                    <h1>Berkesan Studio Booking</h1>
                    <p>Selamat datang! Silakan isi formulir di bawah ini untuk mengamankan jadwal sesi foto Anda.</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <section className="form-section">
                        <h2 className="section-title">👤 Data Diri</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nama Panggilan *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Nomor WhatsApp *</label>
                                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} onBlur={handleBlur} required />
                                {errors.whatsapp && <span className="error-text">{errors.whatsapp}</span>}
                            </div>
                            <div className="form-group full-width">
                                <label>Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>
                    </section>

                    <section className="form-section">
                        <h2 className="section-title">📅 Rencana Jadwal Foto</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Tanggal *</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Jam (WIB) *</label>
                                <select name="time" value={formData.time} onChange={handleChange} required>
                                    <option value="">-- Pilih Jam --</option>
                                    {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="form-section">
                        <h2 className="section-title">📦 Detail Paket</h2>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Pilih Paket *</label>
                                <select name="packageId" value={formData.packageId} onChange={handleChange} required disabled={loading}>
                                    <option value="">{loading ? 'Memuat Paket...' : '-- Pilih Paket --'}</option>
                                    {paketList.map(paket => (
                                        <option key={paket.id} value={paket.id}>
                                            {paket.name} - {formatPrice(paket.price)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedPackage && (
                                <div className="package-preview full-width">
                                    <div className="slider-container">
                                        <button type="button" className="slider-btn prev" onClick={prevImage}>‹</button>
                                        <div className="slider-image-wrapper">
                                            <img src={getPackageImages(selectedPackage)[activeImage]} alt={selectedPackage.name} className="slider-image" />
                                        </div>
                                        <button type="button" className="slider-btn next" onClick={nextImage}>›</button>
                                        <div className="slider-dots">
                                            {getPackageImages(selectedPackage).map((_, i) => (
                                                <span key={i} className={`dot ${i === activeImage ? 'active' : ''}`} onClick={() => setActiveImage(i)}></span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="package-details-grid">
                                        <div className="package-info-box">
                                            <h3>{selectedPackage.name}</h3>
                                            <p className="price-tag">{formatPrice(selectedPackage.price)}</p>
                                        </div>
                                        <div className="package-features-box">
                                            <h4>Fitur Paket:</h4>
                                            <ul>{(selectedPackage.features || []).filter(f => f && f.trim() !== '').map((f, i) => <li key={i}>✦ {f}</li>)}</ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="form-section">
                        <h2 className="section-title">📝 Catatan Tambahan</h2>
                        <div className="form-group full-width">
                            <textarea name="notes" placeholder="Permintaan khusus..." value={formData.notes} onChange={handleChange} rows="4"></textarea>
                        </div>
                    </section>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={submitStatus === 'loading'}>Kirim Pesanan</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BookingPage
