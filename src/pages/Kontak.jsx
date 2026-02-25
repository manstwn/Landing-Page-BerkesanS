import './Kontak.css'

const contactInfo = [
    {
        icon: '📍',
        title: 'Alamat Studio',
        content: 'Jl. Contoh No. 123, Kota Anda, Indonesia',
    },
    {
        icon: '📞',
        title: 'Telepon / WhatsApp',
        content: '+62 812-3456-7890',
        link: 'https://wa.me/6281234567890',
    },
    {
        icon: '📧',
        title: 'Email',
        content: 'info@studiofoto.com',
        link: 'mailto:info@studiofoto.com',
    },
    {
        icon: '📸',
        title: 'Instagram',
        content: '@studiofoto',
        link: 'https://instagram.com/studiofoto',
    },
    {
        icon: '🕐',
        title: 'Jam Operasional',
        content: 'Senin – Sabtu, 09:00 – 18:00 WIB',
    },
]

function Kontak() {
    return (
        <div className="kontak">
            {/* Page Header */}
            <section className="page-hero">
                <div className="page-hero__overlay"></div>
                <div className="container page-hero__content">
                    <h1>Hubungi <span className="text-gradient">Kami</span></h1>
                    <p>Kami siap membantu Anda. Hubungi kami kapan saja!</p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="section">
                <div className="container">
                    <div className="kontak__grid">
                        {/* Contact Cards */}
                        <div className="kontak__info">
                            <div className="kontak__cards">
                                {contactInfo.map((item, i) => (
                                    <div key={i} className="kontak__card card">
                                        <span className="kontak__icon">{item.icon}</span>
                                        <div>
                                            <h4>{item.title}</h4>
                                            {item.link ? (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                    {item.content}
                                                </a>
                                            ) : (
                                                <p>{item.content}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="kontak__cta">
                                <h3>Konsultasi Langsung?</h3>
                                <p>Chat kami via WhatsApp untuk respon yang lebih cepat.</p>
                                <a
                                    href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20konsultasi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-gold"
                                >
                                    💬 Chat WhatsApp Sekarang
                                </a>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="kontak__map">
                            <div className="kontak__map-frame">
                                <iframe
                                    title="Lokasi Studio"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.194741299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Kontak
