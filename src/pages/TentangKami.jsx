import './TentangKami.css'

const missions = [
    {
        icon: '🎯',
        text: 'Memberikan hasil berkualitas tinggi di setiap proyek',
    },
    {
        icon: '💎',
        text: 'Pelayanan terbaik dari awal konsultasi hingga selesai',
    },
    {
        icon: '💰',
        text: 'Harga terjangkau dengan kualitas premium',
    },
    {
        icon: '🤝',
        text: 'Membangun hubungan jangka panjang dengan klien',
    },
]

const values = [
    { icon: '📸', title: 'Kualitas', desc: 'Hasil foto berkualitas tinggi dengan peralatan profesional' },
    { icon: '⏰', title: 'Ketepatan Waktu', desc: 'Komitmen penyelesaian tepat waktu sesuai jadwal' },
    { icon: '💬', title: 'Komunikatif', desc: 'Selalu responsif dan terbuka untuk diskusi' },
    { icon: '🎨', title: 'Kreativitas', desc: 'Sentuhan artistik unik di setiap karya' },
]

function TentangKami() {
    return (
        <div className="tentang">
            {/* Page Header */}
            <section className="page-hero">
                <div className="page-hero__overlay"></div>
                <div className="container page-hero__content">
                    <span className="hero__badge">👤 About Us</span>
                    <h1>Tentang <span className="text-gradient">Kami</span></h1>
                    <p>Mengenal lebih dekat tim di balik karya-karya terbaik kami</p>
                </div>
            </section>

            {/* Story */}
            <section className="section tentang__story">
                <div className="container">
                    <div className="tentang__story-inner">
                        <div className="tentang__story-content">
                            <div className="gold-line" style={{ margin: '0 0 20px' }}></div>
                            <h2>Cerita Kami</h2>
                            <p className="tentang__story-text">
                                Berawal dari kecintaan terhadap fotografi, kami membangun studio ini untuk
                                membantu setiap orang mengabadikan momen berharganya. Dengan pengalaman
                                lebih dari 5 tahun, kami telah melayani ratusan klien dari berbagai acara —
                                mulai dari prewedding, wedding, wisuda, hingga foto keluarga.
                            </p>
                            <p className="tentang__story-text">
                                Kami percaya bahwa setiap momen memiliki cerita yang layak diabadikan.
                                Dengan sentuhan profesional dan pendekatan yang personal, kami berusaha
                                menghadirkan karya yang tidak hanya indah, tetapi juga bermakna.
                            </p>
                            <p className="tentang__story-text">
                                Kini, kami juga hadir dengan layanan undangan digital premium — solusi
                                modern untuk membantu Anda menyiapkan acara yang lebih praktis, elegan,
                                dan berkesan. Semuanya dalam satu tempat.
                            </p>
                        </div>
                        <div className="tentang__story-visual">
                            <div className="tentang__story-frame">
                                <div className="tentang__story-placeholder">
                                    <span>✦</span>
                                    <p>Studio Kami</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision */}
            <section className="section tentang__vision">
                <div className="container">
                    <div className="tentang__vision-card">
                        <div className="tentang__vision-icon">🔭</div>
                        <h2>Visi</h2>
                        <p>
                            Menjadi studio foto dan penyedia undangan digital terpercaya yang menghadirkan
                            karya berkualitas tinggi, inovatif, dan bermakna bagi setiap klien.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="section tentang__mission">
                <div className="container">
                    <div className="section-header">
                        <div className="gold-line"></div>
                        <h2>Misi Kami</h2>
                    </div>
                    <div className="tentang__mission-grid">
                        {missions.map((m, i) => (
                            <div key={i} className="tentang__mission-card card">
                                <span className="tentang__mission-icon">{m.icon}</span>
                                <p>{m.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section tentang__values">
                <div className="container">
                    <div className="section-header">
                        <div className="gold-line"></div>
                        <h2>Nilai Kami</h2>
                        <p>Prinsip yang kami pegang dalam setiap karya</p>
                    </div>
                    <div className="tentang__values-grid">
                        {values.map((v, i) => (
                            <div key={i} className="tentang__value-card card">
                                <span className="tentang__value-icon">{v.icon}</span>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TentangKami
