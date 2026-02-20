import { Link } from 'react-router-dom'
import './Home.css'

const highlights = [
    {
        icon: '📸',
        title: 'Foto Studio',
        desc: 'Prewedding, wedding, wisuda, keluarga, produk.',
    },
    {
        icon: '💌',
        title: 'Undangan Digital',
        desc: 'Template cantik dengan musik, RSVP, dan link demo.',
    },
    {
        icon: '🎨',
        title: 'Editing Rapi',
        desc: 'Retouching detail dan warna yang natural.',
    },
    {
        icon: '⚡',
        title: 'Pelayanan Ramah',
        desc: 'Respon cepat, revisi fleksibel.',
    },
]

const whyUs = [
    'Fotografer berpengalaman',
    'Studio nyaman',
    'Paket fleksibel',
    'Harga jelas, tanpa biaya tersembunyi',
    'Bisa request revisi',
    'Respon cepat via WhatsApp',
]

const previewPaket = [
    { name: 'Paket Silver', price: 'Rp 1.500.000', tag: 'Popular' },
    { name: 'Paket Gold', price: 'Rp 2.500.000', tag: 'Best Seller' },
    { name: 'Paket Platinum', price: 'Rp 4.000.000', tag: 'Premium' },
]

const previewUndangan = [
    { name: 'Lavender Romance', price: 'Rp 150.000' },
    { name: 'Golden Elegance', price: 'Rp 200.000' },
    { name: 'Rustic Garden', price: 'Rp 175.000' },
]

const testimonials = [
    {
        name: 'Rina & Adi',
        text: 'Hasil fotonya bagus banget, editingnya halus. Undangannya juga elegan! Sangat puas dengan pelayanannya.',
        role: 'Prewedding',
    },
    {
        name: 'Sarah',
        text: 'Paket wisudanya worth it banget! Fotonya profesional dan hasilnya cepat.',
        role: 'Wisuda',
    },
    {
        name: 'Budi & Maya',
        text: 'Undangan digitalnya keren, tamunya banyak yang muji. Recommended!',
        role: 'Wedding',
    },
]

function Home() {
    return (
        <div className="home">
            {/* ====== HERO ====== */}
            <section className="hero">
                <div className="hero__overlay"></div>
                <div className="hero__bg-pattern"></div>
                <div className="container hero__content">
                    <span className="hero__badge animate-fade-in-up">✦ KeceStudio</span>
                    <h1 className="hero__title animate-fade-in-up delay-1">
                        Foto Bagus,<br />
                        <span className="text-gradient">Harga Bersahabat</span>
                    </h1>
                    <p className="hero__subtitle animate-fade-in-up delay-2">
                        Jasa foto studio & undangan digital untuk momen spesialmu. Simpel, rapi, dan terjangkau.
                    </p>
                    <div className="hero__buttons animate-fade-in-up delay-3">
                        <Link to="/paket-foto" className="btn btn-gold">
                            Lihat Paket Foto
                        </Link>
                        <Link to="/katalog-undangan" className="btn btn-outline">
                            Katalog Undangan
                        </Link>
                    </div>
                    <div className="hero__stats animate-fade-in-up delay-4">
                        <div className="hero__stat">
                            <span className="hero__stat-number">200+</span>
                            <span className="hero__stat-label">Klien</span>
                        </div>
                        <div className="hero__stat-divider"></div>
                        <div className="hero__stat">
                            <span className="hero__stat-number">4</span>
                            <span className="hero__stat-label">Tahun</span>
                        </div>
                        <div className="hero__stat-divider"></div>
                        <div className="hero__stat">
                            <span className="hero__stat-number">20+</span>
                            <span className="hero__stat-label">Template</span>
                        </div>
                    </div>
                </div>
                <div className="hero__scroll-indicator">
                    <span></span>
                </div>
            </section>

            {/* ====== HIGHLIGHTS ====== */}
            <section className="section highlights">
                <div className="container">
                    <div className="section-header">
                        <div className="gold-line"></div>
                        <h2>Layanan Kami</h2>
                        <p>Yang bisa kami bantu untuk kamu</p>
                    </div>
                    <div className="highlights__grid">
                        {highlights.map((item, i) => (
                            <div key={i} className={`highlights__card card animate-fade-in-up delay-${i + 1}`}>
                                <div className="highlights__icon">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== WHY CHOOSE US ====== */}
            <section className="section why-us">
                <div className="container">
                    <div className="why-us__inner">
                        <div className="why-us__content">
                            <div className="gold-line" style={{ margin: '0 0 20px' }}></div>
                            <h2>Kenapa di KeceStudio?</h2>
                            <p className="why-us__text">
                                Udah 4 tahun kami melayani berbagai kebutuhan foto — dari prewedding, wisuda,
                                sampai foto keluarga. Kami ngga janji yang muluk-muluk, tapi kami pastikan
                                hasilnya rapi, prosesnya enak, dan harganya sesuai kantong.
                            </p>
                            <p className="why-us__text">
                                Sekarang kami juga sediakan undangan digital yang simpel dan bagus.
                                Jadi bisa sekalian, foto + undangan, satu tempat aja.
                            </p>
                            <ul className="why-us__list">
                                {whyUs.map((item, i) => (
                                    <li key={i}>
                                        <span className="why-us__check">✦</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="why-us__visual">
                            <div className="why-us__image-frame">
                                <div className="why-us__image-placeholder">
                                    <span>📸</span>
                                    <p>Studio Kami</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== PREVIEW CATALOG ====== */}
            <section className="section preview">
                <div className="container">
                    <div className="section-header">
                        <div className="gold-line"></div>
                        <h2>Paket & Template</h2>
                        <p>Beberapa pilihan yang paling sering dipilih klien</p>
                    </div>
                    <div className="preview__grid">
                        {/* Paket Foto */}
                        <div className="preview__column">
                            <h3 className="preview__col-title">📸 Paket Foto Studio</h3>
                            <div className="preview__cards">
                                {previewPaket.map((pkg, i) => (
                                    <div key={i} className="preview__card card">
                                        {pkg.tag && <span className="preview__tag">{pkg.tag}</span>}
                                        <h4>{pkg.name}</h4>
                                        <p className="preview__price text-gold">{pkg.price}</p>
                                    </div>
                                ))}
                            </div>
                            <Link to="/paket-foto" className="btn btn-outline btn-sm preview__see-all">
                                Lihat Semua Paket →
                            </Link>
                        </div>
                        {/* Undangan */}
                        <div className="preview__column">
                            <h3 className="preview__col-title">💌 Katalog Undangan</h3>
                            <div className="preview__cards">
                                {previewUndangan.map((tpl, i) => (
                                    <div key={i} className="preview__card card">
                                        <h4>{tpl.name}</h4>
                                        <p className="preview__price text-gold">{tpl.price}</p>
                                    </div>
                                ))}
                            </div>
                            <Link to="/katalog-undangan" className="btn btn-outline btn-sm preview__see-all">
                                Lihat Semua Template →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== TESTIMONIALS ====== */}
            <section className="section testimonials">
                <div className="container">
                    <div className="section-header">
                        <div className="gold-line"></div>
                        <h2>Kata Klien</h2>
                        <p>Review jujur dari yang sudah pakai jasa kami</p>
                    </div>
                    <div className="testimonials__grid">
                        {testimonials.map((t, i) => (
                            <div key={i} className="testimonials__card card">
                                <div className="testimonials__stars">★★★★★</div>
                                <p className="testimonials__text">"{t.text}"</p>
                                <div className="testimonials__author">
                                    <div className="testimonials__avatar">{t.name[0]}</div>
                                    <div>
                                        <h4>{t.name}</h4>
                                        <span>{t.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== CTA BANNER ====== */}
            <section className="cta-banner">
                <div className="cta-banner__overlay"></div>
                <div className="container cta-banner__content">
                    <h2>Mau Tanya-Tanya Dulu?<br /><span className="text-gradient">Boleh Banget!</span></h2>
                    <p>Chat kami aja via WhatsApp, gratis konsultasi dan ngga ada paksaan.</p>
                    <div className="cta-banner__buttons">
                        <a
                            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890'}?text=Halo%20Berkesan%20Studio%2C%20saya%20ingin%20tanya-tanya%20dulu%20mengenai%20layanannya.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-gold"
                            style={{ background: '#25D366', borderColor: '#25D366', color: '#fff' }}
                        >
                            💬 Chat via WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
