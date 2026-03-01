import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'
import InfiniteMarquee from '../components/InfiniteMarquee'
import './Home.css'

const highlights = [
    {
        icon: '📸',
        title: 'Studio Foto',
        desc: 'Abadikan momen spesial Anda untuk prewedding, wedding, wisuda, keluarga, dan lainnya.',
    },
    {
        icon: '👗',
        title: 'Kostum & Baju',
        desc: 'Koleksi gaun pernikahan, kebaya, dan busana formal dengan desain anggun dan modern untuk menyempurnakan hari istimewa Anda.',
    },
    {
        icon: '📸',
        title: 'Paket Foto Wedding',
        desc: 'Pilihan paket lengkap dengan harga terbaik, dokumentasi maksimal, dan hasil foto yang berkesan.',
    },
    {
        icon: '💌',
        title: 'Undangan Digital',
        desc: 'Template cantik dengan musik, RSVP, dan link demo.',
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
    const [highlightsRef, highlightsVisible] = useInView()
    const [whyRef, whyVisible] = useInView()
    const [previewRef, previewVisible] = useInView()
    const [testimonialsRef, testimonialsVisible] = useInView()
    const [ctaRef, ctaVisible] = useInView()

    return (
        <div className="home">
            {/* ====== HERO ====== */}
            <section className="hero">
                <div className="hero__overlay"></div>
                <div className="hero__bg-pattern"></div>

                <div className="hero__huge-text">BERKESAN</div>

                {/* Floating decorative orbs */}
                <div className="hero__orb hero__orb--1"></div>
                <div className="hero__orb hero__orb--2"></div>
                <div className="hero__orb hero__orb--3"></div>

                {/* ✦ Twinkling sparkles */}
                <div className="hero__sparkles" aria-hidden="true">
                    <span className="hero__sparkle hero__sparkle--1">✦</span>
                    <span className="hero__sparkle hero__sparkle--2">✦</span>
                    <span className="hero__sparkle hero__sparkle--3">✦</span>
                    <span className="hero__sparkle hero__sparkle--4">✦</span>
                    <span className="hero__sparkle hero__sparkle--5">✦</span>
                    <span className="hero__sparkle hero__sparkle--6">✦</span>
                    <span className="hero__sparkle hero__sparkle--7">✦</span>
                    <span className="hero__sparkle hero__sparkle--8">✦</span>
                    <span className="hero__sparkle hero__sparkle--9">✦</span>
                    <span className="hero__sparkle hero__sparkle--10">✦</span>
                    <span className="hero__sparkle hero__sparkle--11">✦</span>
                    <span className="hero__sparkle hero__sparkle--12">✦</span>
                </div>

                {/* Geometric decorations */}
                <div className="hero__geo" aria-hidden="true">
                    <div className="hero__geo-ring hero__geo-ring--1" />
                    <div className="hero__geo-ring hero__geo-ring--2" />
                    <div className="hero__geo-diamond hero__geo-diamond--1" />
                    <div className="hero__geo-diamond hero__geo-diamond--2" />
                    <div className="hero__geo-cross hero__geo-cross--1" />
                </div>

                <div className="container hero__content">
                    <h1 className="hero__title hero-anim hero-anim--2">
                        Foto Bagus,<br />
                        <span className="text-gradient">Harga Bersahabat</span>
                    </h1>
                    <p className="hero__subtitle hero-anim hero-anim--3">
                        Jasa foto studio & undangan digital untuk momen spesialmu. Simpel, rapi, dan terjangkau.
                    </p>
                    <div className="hero__buttons hero-anim hero-anim--4">
                        <Link to="/paket-foto" className="btn btn-gold">
                            Lihat Paket Foto
                        </Link>
                        <Link to="/katalog-undangan" className="btn btn-outline">
                            Katalog Undangan
                        </Link>
                    </div>
                    <div className="hero__stats hero-anim hero-anim--5">
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
            <section className="section highlights" ref={highlightsRef} style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="bg-grid"></div>
                {/* Visual Decors */}
                <div className="decor-glow decor-glow--br"></div>
                <div className="decor-ring" style={{ top: '-100px', left: '-100px', width: '400px', height: '400px' }}></div>
                <div className="decor-cross decor-floating" style={{ top: '15%', right: '10%' }}></div>
                <div className="decor-cross decor-floating" style={{ bottom: '15%', left: '15%', animationDelay: '1s' }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className={`section-header reveal-up ${highlightsVisible ? 'is-visible' : ''}`}>
                        <div className="gold-line"></div>
                        <h2>Layanan Kami</h2>
                        <p>Yang bisa kami bantu untuk kamu</p>
                    </div>
                    <div className="highlights__grid">
                        {highlights.map((item, i) => (
                            <div
                                key={i}
                                className={`highlights__card card reveal-up ${highlightsVisible ? 'is-visible' : ''}`}
                                style={{ transitionDelay: `${i * 0.1}s` }}
                            >
                                <div className="highlights__icon">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== TICKER 1 ====== */}
            <div className="text-ticker" aria-hidden="true">
                <div className="text-ticker__inner">
                    <span>✦ BERKESAN STUDIO ✦ FOTO & UNDANGAN DIGITAL ✦ HARGA BERSAHABAT ✦ BERKESAN STUDIO ✦ FOTO & UNDANGAN DIGITAL ✦ HARGA BERSAHABAT ✦ BERKESAN STUDIO ✦ FOTO & UNDANGAN DIGITAL ✦ HARGA BERSAHABAT </span>
                    <span>✦ BERKESAN STUDIO ✦ FOTO & UNDANGAN DIGITAL ✦ HARGA BERSAHABAT ✦ BERKESAN STUDIO ✦ FOTO & UNDANGAN DIGITAL ✦ HARGA BERSAHABAT ✦ BERKESAN STUDIO ✦ FOTO & UNDANGAN DIGITAL ✦ HARGA BERSAHABAT </span>
                </div>
            </div>

            {/* ====== WHY CHOOSE US ====== */}
            <section className="section why-us" ref={whyRef} style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="bg-dots"></div>
                {/* Visual Decors */}
                <div className="decor-glow decor-glow--tl"></div>
                <div className="decor-ring" style={{ bottom: '-150px', right: '-50px', width: '300px', height: '300px' }}></div>
                <div className="hero__geo-cross hero__geo-cross--1" style={{ top: '10%', left: '5%' }}></div>
                <div className="decor-cross decor-floating" style={{ bottom: '25%', right: '8%', animationDelay: '2s' }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="why-us__inner">
                        <div className={`why-us__visual reveal-left ${whyVisible ? 'is-visible' : ''}`}>
                            <div className="why-us__image-frame">
                                <div className="why-us__image-placeholder">
                                    <span>📸</span>
                                    <p>Studio Kami</p>
                                </div>
                            </div>
                        </div>
                        <div className={`why-us__content reveal-right ${whyVisible ? 'is-visible' : ''}`}>
                            <div className="gold-line" style={{ margin: '0 0 20px' }}></div>
                            <h2>Kenapa di Berkesan Studio?</h2>
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
                                    <li
                                        key={i}
                                        className={`reveal-up ${whyVisible ? 'is-visible' : ''}`}
                                        style={{ transitionDelay: `${0.2 + i * 0.08}s` }}
                                    >
                                        <span className="why-us__check">✦</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== PREVIEW: PAKET FOTO ====== */}
            <section className="section preview" ref={previewRef} style={{ paddingTop: '60px', paddingBottom: '28px', position: 'relative', overflow: 'hidden' }}>
                {/* Visual Decors */}
                <div className="decor-glow decor-glow--tc"></div>
                <div className="decor-line" style={{ top: '30%', left: '0', width: '150px' }}></div>
                <div className="decor-line" style={{ bottom: '20%', right: '0', width: '150px' }}></div>
                <div className="decor-cross decor-floating" style={{ top: '15%', right: '8%' }}></div>
                <div className="decor-cross decor-floating" style={{ bottom: '20%', left: '5%', animationDelay: '0.5s' }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className={`section-header reveal-up ${previewVisible ? 'is-visible' : ''}`}>
                        <div className="gold-line"></div>
                        <h2>Paket Foto Studio</h2>
                        <p>Abadikan momen spesialmu dengan sesi foto profesional</p>
                    </div>
                </div>
                <div className={`preview__marquee-wrap reveal-up ${previewVisible ? 'is-visible' : ''}`}
                    style={{ transitionDelay: '0.2s', position: 'relative', zIndex: 2 }}>
                    <InfiniteMarquee type="foto" direction="left" />
                </div>
                <div className={`container preview__cta-row reveal-up ${previewVisible ? 'is-visible' : ''}`}
                    style={{ transitionDelay: '0.35s', position: 'relative', zIndex: 2 }}>
                    <Link to="/paket-foto" className="btn btn-outline btn-sm">📸 Lihat Semua Paket Foto →</Link>
                </div>
            </section>

            {/* ====== PREVIEW: KATALOG UNDANGAN ====== */}
            <section className="section preview preview--alt" style={{ paddingTop: '36px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
                <div className="bg-pattern-dots"></div>
                {/* Visual Decors */}
                <div className="decor-glow decor-glow--br"></div>
                <div className="decor-ring" style={{ top: '-80px', right: '-80px', width: '250px', height: '250px' }}></div>
                <div className="decor-cross decor-floating" style={{ top: '25%', left: '8%', animationDelay: '1.5s' }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className={`section-header reveal-up ${previewVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0.1s' }}>
                        <div className="gold-line"></div>
                        <h2>Katalog Undangan Digital</h2>
                        <p>Template undangan cantik untuk hari spesialmu</p>
                    </div>
                </div>
                <div className={`preview__marquee-wrap reveal-up ${previewVisible ? 'is-visible' : ''}`}
                    style={{ transitionDelay: '0.25s', position: 'relative', zIndex: 2 }}>
                    <InfiniteMarquee type="undangan" direction="right" />
                </div>
                <div className={`container preview__cta-row reveal-up ${previewVisible ? 'is-visible' : ''}`}
                    style={{ transitionDelay: '0.4s', position: 'relative', zIndex: 2 }}>
                    <Link to="/katalog-undangan" className="btn btn-outline btn-sm">💌 Lihat Semua Katalog →</Link>
                </div>
            </section>

            {/* ====== TICKER 2 ====== */}
            <div className="text-ticker text-ticker--alt" aria-hidden="true">
                <div className="text-ticker__inner">
                    <span>✦ SIMPEL ✦ RAPI ✦ TERJANGKAU ✦ SIMPEL ✦ RAPI ✦ TERJANGKAU ✦ SIMPEL ✦ RAPI ✦ TERJANGKAU ✦ SIMPEL ✦ RAPI ✦ TERJANGKAU ✦ SIMPEL ✦ RAPI ✦ TERJANGKAU ✦ </span>
                    <span>✦ SIMPEL ✦ RAPI ✦ TERJANGKAU ✦ SIMPEL ✦ RAPI ✦ TERJANGKAU ✦ SIMPEL ✦ RAPI ✦ TERJANGKAU ✦ SIMPEL ✦ RAPI ✦ TERJANGKAU ✦ SIMPEL ✦ RAPI ✦ TERJANGKAU ✦ </span>
                </div>
            </div>

            {/* ====== TESTIMONIALS ====== */}
            <section className="section testimonials" ref={testimonialsRef} style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="bg-grid" style={{ opacity: 0.5 }}></div>
                {/* Visual Decors */}
                <div className="decor-glow decor-glow--tl"></div>
                <div className="decor-ring" style={{ bottom: '-100px', left: '-50px', width: '400px', height: '400px' }}></div>
                <div className="decor-cross decor-floating" style={{ top: '15%', right: '15%', animationDelay: '0.8s' }}></div>
                <div className="decor-cross decor-floating" style={{ bottom: '20%', right: '5%', animationDelay: '2.2s' }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className={`section-header reveal-up ${testimonialsVisible ? 'is-visible' : ''}`}>
                        <div className="gold-line"></div>
                        <h2>Kata Klien</h2>
                        <p>Review jujur dari yang sudah pakai jasa kami</p>
                    </div>
                    <div className="testimonials__grid">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className={`testimonials__card card reveal-up ${testimonialsVisible ? 'is-visible' : ''}`}
                                style={{ transitionDelay: `${i * 0.15}s` }}
                            >
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
            <section className="cta-banner" ref={ctaRef}>
                <div className="cta-banner__overlay"></div>
                <div className="bg-grid bg-grid--light"></div>
                {/* Visual Decors */}
                <div className="decor-ring border-white" style={{ top: '-150px', right: '-150px', width: '500px', height: '500px', opacity: 0.5 }}></div>
                <div className="decor-cross decor-floating bg-white" style={{ top: '25%', left: '10%' }}></div>
                <div className="decor-cross decor-floating bg-white" style={{ bottom: '25%', right: '10%', animationDelay: '1s' }}></div>

                {/* White sparkles on dark bg */}
                <div className="cta-sparkles" aria-hidden="true">
                    <span className="cta-sparkle cta-sparkle--1">✦</span>
                    <span className="cta-sparkle cta-sparkle--2">✦</span>
                    <span className="cta-sparkle cta-sparkle--3">✦</span>
                    <span className="cta-sparkle cta-sparkle--4">✦</span>
                    <span className="cta-sparkle cta-sparkle--5">✦</span>
                    <span className="cta-sparkle cta-sparkle--6">✦</span>
                </div>
                <div className={`container cta-banner__content reveal-up ${ctaVisible ? 'is-visible' : ''}`}>
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
