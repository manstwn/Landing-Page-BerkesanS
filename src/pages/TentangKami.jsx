import './TentangKami.css'

const missions = [
    {
        icon: '🎯',
        text: 'Menghadirkan hasil foto dan desain undangan digital dengan standar kualitas tinggi, detail yang rapi, dan sentuhan kreatif di setiap proyek.',
    },
    {
        icon: '💎',
        text: 'Memberikan pelayanan yang ramah, responsif, dan komunikatif mulai dari konsultasi hingga hasil akhir, sehingga setiap klien merasa nyaman dan dihargai.',
    },
    {
        icon: '💰',
        text: 'Menyediakan layanan dengan harga di bawah rata-rata tanpa mengorbankan kualitas hasil, sehingga lebih banyak orang dapat mengabadikan momen berharga mereka.',
    },
    {
        icon: '🤝',
        text: 'Menjalin hubungan yang baik dengan setiap pelanggan agar tidak hanya menjadi klien sekali pakai, tetapi mitra jangka panjang untuk berbagai momen spesial.',
    },
]



function TentangKami() {
    return (
        <div className="tentang">
            {/* Page Header */}
            <section className="page-hero" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="page-hero__overlay"></div>
                <div className="bg-pattern-dots" style={{ opacity: 0.6 }}></div>
                {/* Visual Decors */}
                <div className="decor-glow decor-glow--tl"></div>
                <div className="decor-cross decor-floating" style={{ top: '20%', right: '10%', animationDelay: '0s' }}></div>

                <div className="container page-hero__content" style={{ position: 'relative', zIndex: 2 }}>
                    <h1>Tentang <span className="text-gradient">Kami</span></h1>
                    <p>Mengenal lebih dekat tim di balik karya-karya terbaik kami</p>
                </div>
            </section>

            {/* Story */}
            <section className="section tentang__story" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="bg-grid"></div>
                {/* Visual Decors */}
                <div className="decor-glow decor-glow--br"></div>
                <div className="decor-ring" style={{ top: '-100px', left: '-100px', width: '400px', height: '400px' }}></div>
                <div className="decor-cross decor-floating" style={{ top: '15%', right: '10%' }}></div>
                <div className="decor-cross decor-floating" style={{ bottom: '15%', left: '15%', animationDelay: '1s' }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
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
            <section className="section tentang__vision" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="bg-dots"></div>
                {/* Visual Decors */}
                <div className="decor-glow decor-glow--tl"></div>
                <div className="decor-ring" style={{ bottom: '-150px', right: '-50px', width: '300px', height: '300px' }}></div>
                <div className="decor-cross decor-floating" style={{ bottom: '25%', right: '8%', animationDelay: '2s' }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="tentang__vision-card">
                        <div className="tentang__vision-icon">🔭</div>
                        <h2>Visi</h2>
                        <p>
                            Menjadi studio foto rumahan dan penyedia undangan digital yang terpercaya, dikenal karena kualitas karya yang profesional, harga yang terjangkau, serta pelayanan yang hangat dan berorientasi pada kepuasan pelanggan.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="section tentang__mission" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="bg-pattern-dots"></div>
                {/* Visual Decors */}
                <div className="decor-glow decor-glow--br"></div>
                <div className="decor-ring" style={{ top: '-80px', right: '-80px', width: '250px', height: '250px' }}></div>
                <div className="decor-cross decor-floating" style={{ top: '25%', left: '8%', animationDelay: '1.5s' }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
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


        </div>
    )
}

export default TentangKami
