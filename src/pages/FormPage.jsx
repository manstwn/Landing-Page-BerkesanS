import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/FormStyles.css';

const INITIAL_STATE = {
    // 1. Data Pemesan
    orderName: '',
    orderEmail: '',
    orderWhatsapp: '',
    templateName: '',
    customSong: '',

    // 2. Data Mempelai Pria
    groomName: '',
    groomNickname: '',
    groomFather: '',
    groomMother: '',
    groomOrderInFamily: '',

    // 3. Data Mempelai Wanita
    brideName: '',
    brideNickname: '',
    brideFather: '',
    brideMother: '',
    brideOrderInFamily: '',

    // 4. Data Akad
    akadDate: '',
    akadTime: '',
    akadPlace: '',
    akadMaps: '',
    akadAddress: '',

    // 5. Data Resepsi
    receptionDate: '',
    receptionTime: '',
    receptionPlace: '',
    receptionMaps: '',
    receptionAddress: '',

    // 6. Data Pelengkap
    groomWhatsapp: '',
    groomInstagram: '',
    brideWhatsapp: '',
    brideInstagram: '',
    photoVideoLink: '',

    // 6. Love Story
    loveStories: [{ imageCode: '', title: '', date: '', story: '' }],

    // 7. Amplop Digital
    digitalEnvelopes: [{ bank: '', number: '', owner: '' }],

    // 8. Catatan Tambahan
    additionalNotes: ''
};

const FormPage = () => {
    const location = useLocation();

    // Initialize state from LocalStorage + URL Params
    const [formData, setFormData] = useState(() => {
        const INITIAL_LOCAL_STATE = { ...INITIAL_STATE };

        // 1. Load from local storage
        try {
            const saved = localStorage.getItem('weddingFormData');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Check if data is older than 24 hours
                const isRecent = (Date.now() - parsed.timestamp) < 24 * 60 * 60 * 1000;
                if (isRecent) {
                    Object.assign(INITIAL_LOCAL_STATE, parsed.data);
                } else {
                    localStorage.removeItem('weddingFormData'); // Expired
                }
            }
        } catch (e) {
            console.error("Failed to parse saved form data", e);
        }

        // 2. Handle Query Params (Template Name)
        const params = new URLSearchParams(location.search);
        const templateParam = params.get('template');
        if (templateParam) {
            INITIAL_LOCAL_STATE.templateName = templateParam;
        }

        return INITIAL_LOCAL_STATE;
    });

    const [submitStatus, setSubmitStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    // Handle incoming template param changes (e.g., if navigating between templates)
    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const templateParam = params.get('template');
        if (templateParam) {
            setFormData(prev => ({
                ...prev,
                templateName: templateParam
            }));
        }
    }, [location.search]);

    // Save to local storage on change
    React.useEffect(() => {
        const dataToSave = {
            timestamp: Date.now(),
            data: formData
        };
        localStorage.setItem('weddingFormData', JSON.stringify(dataToSave));
    }, [formData]);

    const handleReset = () => {
        if (window.confirm("Apakah Anda yakin ingin mereset formulir? Semua data yang tersimpan akan dihapus.")) {
            setFormData(INITIAL_STATE);
            localStorage.removeItem('weddingFormData');
            window.scrollTo(0, 0);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEnvelopeChange = (index, field, value) => {
        const newEnvelopes = [...formData.digitalEnvelopes];
        newEnvelopes[index] = {
            ...newEnvelopes[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            digitalEnvelopes: newEnvelopes
        }));
    };

    const addEnvelope = () => {
        if (formData.digitalEnvelopes.length < 4) {
            setFormData(prev => ({
                ...prev,
                digitalEnvelopes: [...prev.digitalEnvelopes, { bank: '', number: '', owner: '' }]
            }));
        }
    };

    const removeEnvelope = (index) => {
        const newEnvelopes = formData.digitalEnvelopes.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            digitalEnvelopes: newEnvelopes
        }));
    };

    // Love Story Handlers
    const handleLoveStoryChange = (index, field, value) => {
        const newStories = [...formData.loveStories];
        newStories[index] = {
            ...newStories[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            loveStories: newStories
        }));
    };

    const addLoveStory = () => {
        if (formData.loveStories.length < 3) {
            setFormData(prev => ({
                ...prev,
                loveStories: [...prev.loveStories, { imageCode: '', title: '', date: '', story: '' }]
            }));
        }
    };

    const removeLoveStory = (index) => {
        const newStories = formData.loveStories.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            loveStories: newStories
        }));
    };

    const copyAkadToReception = () => {
        setFormData(prev => ({
            ...prev,
            receptionDate: prev.akadDate,
            receptionTime: prev.akadTime,
            receptionPlace: prev.akadPlace,
            receptionMaps: prev.akadMaps,
            receptionAddress: prev.akadAddress
        }));
        alert('Data Akad berhasil disalin ke Resepsi. Silakan cek kembali data yang telah disalin.');
    };

    // Helper to generate HTML for email
    const generateEmailHtml = (data) => {
        let html = `
            <h2>Data Pemesan</h2>
            <p><strong>Nama:</strong> ${data.orderName}</p>
            <p><strong>Email:</strong> ${data.orderEmail}</p>
            <p><strong>WhatsApp:</strong> ${data.orderWhatsapp}</p>
            <p><strong>Template:</strong> ${data.templateName}</p>
            <p><strong>Lagu Custom:</strong> ${data.customSong || '-'}</p>
            <hr>

            <h2>Mempelai Pria</h2>
            <p><strong>Nama Lengkap:</strong> ${data.groomName || '-'}</p>
            <p><strong>Nama Panggilan:</strong> ${data.groomNickname || '-'}</p>
            <p><strong>Ortu:</strong> ${data.groomFather || '-'} & ${data.groomMother || '-'}</p>
            <p><strong>Anak Ke:</strong> ${data.groomOrderInFamily || '-'}</p>
            <p><strong>Kontak:</strong> ${data.groomWhatsapp || '-'} / ${data.groomInstagram || '-'}</p>
            <hr>

            <h2>Mempelai Wanita</h2>
            <p><strong>Nama Lengkap:</strong> ${data.brideName || '-'}</p>
            <p><strong>Nama Panggilan:</strong> ${data.brideNickname || '-'}</p>
            <p><strong>Ortu:</strong> ${data.brideFather || '-'} & ${data.brideMother || '-'}</p>
            <p><strong>Anak Ke:</strong> ${data.brideOrderInFamily || '-'}</p>
            <p><strong>Kontak:</strong> ${data.brideWhatsapp || '-'} / ${data.brideInstagram || '-'}</p>
            <hr>

            <h2>Akad Nikah</h2>
        <p><strong>Hari/Tanggal:</strong> ${data.akadDate || '-'}</p>
        <p><strong>Waktu:</strong> ${data.akadTime || '-'}</p>
        <p><strong>Tempat:</strong> ${data.akadPlace || '-'}</p>
        <p><strong>Alamat:</strong> ${data.akadAddress || '-'}</p>
        <p><strong>Maps:</strong> ${data.akadMaps || '-'}</p>
        <hr>

        <h2>Resepsi Pernikahan</h2>
        <p><strong>Hari/Tanggal:</strong> ${data.receptionDate || '-'}</p>
        <p><strong>Waktu:</strong> ${data.receptionTime || '-'}</p>
        <p><strong>Tempat:</strong> ${data.receptionPlace || '-'}</p>
        <p><strong>Alamat:</strong> ${data.receptionAddress || '-'}</p>
        <p><strong>Maps:</strong> ${data.receptionMaps || '-'}</p>
        <hr>

            <h2>Data Pelengkap</h2>
            <p><strong>Foto/Video Link:</strong> ${data.photoVideoLink || '-'}</p>
            <hr>

            <h2>Amplop Digital</h2>
            <ul>
                ${data.digitalEnvelopes.map((env, i) => `
                    <li><strong>#${i + 1}:</strong> ${env.bank || '-'} ${env.number} a.n ${env.owner}</li>
                `).join('')}
            </ul>
            <hr>

            <h2>Love Story</h2>
            <ul>
                ${data.loveStories.map((story, i) => `
                    <li>
                        <strong>#${i + 1} ${story.title || 'Story'} (${story.date || '-'})</strong><br>
                        <em>Image: ${story.imageCode || '-'}</em><br>
                        ${story.story || '-'}
                    </li>
                `).join('')}
            </ul>
            <hr>

            <h2>Catatan Tambahan</h2>
            <p>${data.additionalNotes ? data.additionalNotes.replace(/\n/g, '<br>') : '-'}</p>
        `;
        return html;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const targetEmails = import.meta.env.VITE_TARGET_EMAILS;
        const emailArray = targetEmails ? targetEmails.split(',').map(email => email.trim()) : [];
        const htmlBody = generateEmailHtml(formData);

        const payload = {
            email_body: htmlBody,
            Data: formData
        };

        setSubmitStatus('loading');

        try {
            // 1. Primary Webhook
            const primaryWebhook = import.meta.env.VITE_WEBHOOK_URL;
            if (!primaryWebhook) throw new Error("Primary Webhook URL belum disetting!");

            console.log("Sending to Primary Webhook...");

            const primaryResponse = await fetch(primaryWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!primaryResponse.ok) {
                throw new Error(`Primary Webhook Failed: ${primaryResponse.status}`);
            }

            console.log("Primary Webhook Success!");

            // Explicitly save one last time on success to be 100% sure
            const finalDataToSave = {
                timestamp: Date.now(),
                data: formData
            };
            localStorage.setItem('weddingFormData', JSON.stringify(finalDataToSave));

            setSubmitStatus('success');

            // 2. Backup Webhooks (Fire and Forget)
            const backupWebhooks = [
                import.meta.env.VITE_WEBHOOK_URL_2,
                import.meta.env.VITE_WEBHOOK_URL_3,
                import.meta.env.VITE_WEBHOOK_URL_4,
                import.meta.env.VITE_WEBHOOK_URL_5
            ].filter(url => url && url.trim() !== '');

            if (backupWebhooks.length > 0) {
                console.log(`Sending to ${backupWebhooks.length} backup webhooks...`);
                Promise.allSettled(backupWebhooks.map(url =>
                    fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    })
                )).then(results => {
                    console.log("Backup Webhooks Results:", results);
                });
            }

        } catch (error) {
            console.error('Error sending data:', error);

            // Show detailed error message
            let msg = error.message;
            if (msg === 'Failed to fetch') {
                msg = 'Gagal terhubung (Network Error). Cek koneksi internet Anda.';
            }

            setErrorMessage(msg);
            setSubmitStatus('error');
        }
    };

    const handleCloseModal = () => {
        setSubmitStatus('idle');
    };

    return (
        <div className="form-page-wrapper">
            <div className="form-container">
                {/* Modal Overlay */}
                {submitStatus !== 'idle' && submitStatus !== 'loading' && (
                    <div className="modal-overlay" style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div className="modal-content" style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '16px',
                            maxWidth: '400px',
                            width: '90%',
                            textAlign: 'center',
                            color: 'var(--text-main)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            border: '1px solid var(--border-color)'
                        }}>
                            {submitStatus === 'success' ? (
                                <>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                                    <h2 style={{ marginBottom: '0.5rem', color: '#4caf50' }}>Berhasil Terkirim!</h2>
                                    <p style={{ marginBottom: '1.5rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                                        Data form Anda telah berhasil dikirim. <br />
                                        Kami akan segera memproses pesanan Anda.
                                    </p>
                                    <button
                                        onClick={handleCloseModal}
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            width: '100%'
                                        }}
                                    >
                                        Kirim Form Lagi / Edit Data
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div style={{
                                        fontSize: '3.5rem',
                                        marginBottom: '1rem',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem auto'
                                    }}>❌</div>
                                    <h2 style={{ marginBottom: '0.5rem', color: '#ef4444', fontWeight: '800' }}>Gagal Mengirim</h2>
                                    <p style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: 'var(--text-main)', opacity: 0.9 }}>
                                        {errorMessage}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                        <button
                                            onClick={handleCloseModal}
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: 'var(--text-main)',
                                                padding: '12px 24px',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border-color)',
                                                fontSize: '1rem',
                                                cursor: 'pointer',
                                                flex: 1,
                                                fontWeight: '500',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            Tutup
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            style={{
                                                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                                                color: 'white',
                                                padding: '12px 24px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                fontSize: '1rem',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                flex: 1,
                                                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                                            }}
                                        >
                                            Coba Lagi
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {submitStatus === 'loading' && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: '#333'
                        }}>
                            <div className="spinner" style={{
                                width: '40px',
                                height: '40px',
                                border: '4px solid #f3f3f3',
                                borderTop: '4px solid #764ba2',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginBottom: '1rem'
                            }}></div>
                            <p style={{ fontWeight: 'bold' }}>Mengirim Data...</p>
                            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        </div>
                    </div>
                )}
                <header className="form-header">
                    <h1>Form Pemesanan Undangan Digital</h1>
                    <p>Lengkapi data di bawah ini untuk pembuatan undangan pernikahan Anda.</p>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="reset-button"
                            style={{
                                background: '#ff4d4d',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            🗑️ Reset Form
                        </button>
                    </div>

                </header>

                <form onSubmit={handleSubmit}>

                    {/* Section 1: Data Pemesan */}
                    <section className="form-section">
                        <h2 className="section-title">👤 1. Data Pemesan Undangan</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nama Pemesan *</label>
                                <input
                                    type="text"
                                    name="orderName"
                                    placeholder="Isikan Nama Pemesan Jasa"
                                    value={formData.orderName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Pemesan *</label>
                                <input
                                    type="text"
                                    name="orderEmail"
                                    placeholder="Isikan Email Aktif Pemesan"
                                    value={formData.orderEmail}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>No. Whatsapp Pemesan *</label>
                                <input
                                    type="text"
                                    name="orderWhatsapp"
                                    placeholder="Isikan Nomor Whatsapp Pemesan"
                                    value={formData.orderWhatsapp}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nama Template Undangan *</label>
                                <input
                                    type="text"
                                    name="templateName"
                                    placeholder="Contoh: Berkesan Premium - 01"
                                    value={formData.templateName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Custom Lagu</label>
                                <input
                                    type="text"
                                    name="customSong"
                                    placeholder="Contoh: Sinarengan - Denny Caknan"
                                    value={formData.customSong}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </section>

                    <div className="info-banner">
                        <div>
                            <strong>Catatan:</strong>
                            <ul>
                                <li>- Semua data di bawah ini <strong>bersifat opsional</strong>.</li>
                                <li>- Silakan <strong>dikosongkan</strong> jika tidak ingin mengisi.</li>
                                <li>- Jika tidak berkenan atau tidak ingin mengisi, cukup <strong>biarkan kosong</strong>.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 2: Data Mempelai Pria */}
                    <section className="form-section">
                        <h2 className="section-title">🤵 2. Data Mempelai Pria</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nama Lengkap</label>
                                <input type="text" name="groomName" placeholder="Contoh: Budi Setiawan" value={formData.groomName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Nama Panggilan</label>
                                <input type="text" name="groomNickname" placeholder="Contoh: Budi" value={formData.groomNickname} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Nama Ayah</label>
                                <input type="text" name="groomFather" placeholder="Ayah Mempelai Pria" value={formData.groomFather} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Nama Ibu</label>
                                <input type="text" name="groomMother" placeholder="Ibu Mempelai Pria" value={formData.groomMother} onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Anak keberapa</label>
                                <input
                                    type="text"
                                    name="groomOrderInFamily"
                                    placeholder="Contoh: Anak ke-1"
                                    value={formData.groomOrderInFamily}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>No. WA Mempelai Pria</label>
                                <input type="tel" name="groomWhatsapp" placeholder="Contoh: 081234567890" value={formData.groomWhatsapp} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Instagram Mempelai Pria</label>
                                <input type="text" name="groomInstagram" placeholder="Contoh: @budisetiawan" value={formData.groomInstagram} onChange={handleChange} />
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Data Mempelai Wanita */}
                    <section className="form-section">
                        <h2 className="section-title">👰 3. Data Mempelai Wanita</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nama Lengkap</label>
                                <input type="text" name="brideName" placeholder="Contoh: Siti Aminah" value={formData.brideName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Nama Panggilan</label>
                                <input type="text" name="brideNickname" placeholder="Contoh: Siti" value={formData.brideNickname} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Nama Ayah</label>
                                <input type="text" name="brideFather" placeholder="Ayah Mempelai Wanita" value={formData.brideFather} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Nama Ibu</label>
                                <input type="text" name="brideMother" placeholder="Ibu Mempelai Wanita" value={formData.brideMother} onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Anak keberapa</label>
                                <input
                                    type="text"
                                    name="brideOrderInFamily"
                                    placeholder="Contoh: Anak ke-1"
                                    value={formData.brideOrderInFamily}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>No. WA Mempelai Wanita</label>
                                <input type="tel" name="brideWhatsapp" placeholder="Contoh: 081234567890" value={formData.brideWhatsapp} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Instagram Mempelai Wanita</label>
                                <input type="text" name="brideInstagram" placeholder="Contoh: @sitiaminah" value={formData.brideInstagram} onChange={handleChange} />
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Data Acara Pernikahan (Akad & Resepsi) */}
                    <section className="form-section">
                        <h2 className="section-title">💍 🎉 4. Data Acara Pernikahan</h2>

                        <h3 className="subsection-title">Akad Nikah</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Hari & Tanggal</label>
                                <input
                                    type="text"
                                    name="akadDate"
                                    placeholder="Senin, 31 Januari 2025"
                                    value={formData.akadDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Waktu Acara</label>
                                <input type="text" name="akadTime" placeholder="Contoh: 08.00 WIB s/d Selesai" value={formData.akadTime} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Nama Tempat</label>
                                <input type="text" name="akadPlace" placeholder="Contoh: Kediaman Mempelai Wanita" value={formData.akadPlace} onChange={handleChange} />
                                <ul className="helper-list" style={{ fontSize: '0.75rem' }}>
                                    <li>- Isi <strong>nama tempat/gedung saja</strong>, bukan alamat lengkap.</li>
                                    <li>- Contoh: "Kediaman Mempelai Wanita/Pria", "Masjid Agung", atau "Hotel Santika"</li>
                                </ul>
                            </div>
                            <div className="form-group">
                                <label>Link Google Maps</label>
                                <input type="text" name="akadMaps" placeholder="Contoh: https://maps.app.goo.gl/..." value={formData.akadMaps} onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Alamat Lengkap</label>
                                <textarea name="akadAddress" rows="3" value={formData.akadAddress} onChange={handleChange}></textarea>
                            </div>
                        </div>

                        <div className="divider-row" style={{ margin: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                                Jika data akad dan resepsi sama atau mirip, klik tombol ini untuk copy otomatis dari data akad (bisa diedit kembali).
                            </span>

                            <button type="button" className="btn-secondary" onClick={copyAkadToReception}>
                                📋 Salin Data Akad ke Resepsi
                            </button>

                        </div>

                        <h3 className="subsection-title">Resepsi Pernikahan</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Hari & Tanggal</label>
                                <input
                                    type="text"
                                    name="receptionDate"
                                    placeholder="Senin, 31 Januari 2025"
                                    value={formData.receptionDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Waktu Acara</label>
                                <input type="text" name="receptionTime" placeholder="Contoh: 09.00 WIB s/d Selesai" value={formData.receptionTime} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Nama Tempat</label>
                                <input type="text" name="receptionPlace" placeholder="Contoh: Kediaman Mempelai Wanita" value={formData.receptionPlace} onChange={handleChange} />
                                <ul className="helper-list" style={{ fontSize: '0.75rem' }}>
                                    <li>- Isi <strong>nama tempat/gedung saja</strong>, bukan alamat lengkap.</li>
                                    <li>- Contoh: "Kediaman Mempelai Wanita", "Masjid Agung", atau "Hotel Santika"</li>
                                </ul>
                            </div>
                            <div className="form-group">
                                <label>Link Google Maps</label>
                                <input type="text" name="receptionMaps" placeholder="Contoh: https://maps.app.goo.gl/..." value={formData.receptionMaps} onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Alamat Lengkap</label>
                                <textarea name="receptionAddress" rows="3" value={formData.receptionAddress} onChange={handleChange} ></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Data Pelengkap */}
                    <section className="form-section">
                        <h2 className="section-title">📱 5. Data Pelengkap Lainnya</h2>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Link Drive Foto / Video</label>
                                <input type="text" name="photoVideoLink" value={formData.photoVideoLink} onChange={handleChange} placeholder="Link Google Drive / Dropbox" />
                                <ul className="helper-list" style={{ fontSize: '0.8rem', marginTop: '8px', lineHeight: '1.4' }}>
                                    <li>- Jika menggunakan foto dari studio kami, <strong>silakan kosongkan</strong> kolom ini.</li>
                                    <li>- Jika ingin menggunakan foto sendiri, mohon upload ke Drive/Dropbox and <strong>lampirkan link-nya</strong> disini.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 6: Data Amplop Digital */}
                    <section className="form-section">
                        <div className="section-header-row">
                            <h2 className="section-title">💸 6. Data Amplop Digital <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>(Opsional)</span></h2>
                        </div>
                        <p className="helper-text">Maksimal 4 rekening/e-wallet.</p>

                        <div className="envelopes-container">
                            {formData.digitalEnvelopes.map((env, index) => (
                                <div key={index} className="envelope-item">
                                    <div className="envelope-header">
                                        <span>Amplop #{index + 1}</span>
                                        <button type="button" className="btn-danger-link" onClick={() => removeEnvelope(index)}>Hapus</button>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Nama Bank / E-Wallet</label>
                                            <input
                                                type="text"
                                                placeholder="Mandiri / Dana"
                                                value={env.bank}
                                                onChange={(e) => handleEnvelopeChange(index, 'bank', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nomor Rekening</label>
                                            <input
                                                type="text"
                                                placeholder="123xxxxx"
                                                value={env.number}
                                                onChange={(e) => handleEnvelopeChange(index, 'number', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Atas Nama</label>
                                            <input
                                                type="text"
                                                placeholder="Nama Pemilik"
                                                value={env.owner}
                                                onChange={(e) => handleEnvelopeChange(index, 'owner', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {formData.digitalEnvelopes.length === 0 && (
                                <div className="empty-state">Belum ada data amplop digital.</div>
                            )}
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <button type="button" className="btn-secondary" onClick={addEnvelope} disabled={formData.digitalEnvelopes.length >= 4}>
                                    + Tambah Amplop
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Section 7: Love Story */}
                    <section className="form-section">
                        <div className="section-header-row">
                            <h2 className="section-title">🌹 7. Data Love Story <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>(Opsional)</span></h2>


                        </div>
                        <p className="helper-text">Maksimal 3 cerita  (Contoh: Awal Bertemu, Proses, Lamaran/Menikah).</p>


                        <div className="envelopes-container">
                            {formData.loveStories.map((story, index) => (
                                <div key={index} className="envelope-item">
                                    <div className="envelope-header">
                                        <span>Love Story #{index + 1}</span>
                                        <button type="button" className="btn-danger-link" onClick={() => removeLoveStory(index)}>Hapus</button>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group full-width">

                                            <label>Kode / Nama File Foto (di GDrive)</label>

                                            <input
                                                type="text"
                                                placeholder="Contoh: IMG_9928.JPG atau 'Foto Lamaran Slide 1'"
                                                value={story.imageCode}
                                                onChange={(e) => handleLoveStoryChange(index, 'imageCode', e.target.value)}
                                            />
                                            <ul className="helper-list" style={{ fontSize: '0.8rem', marginTop: '8px', lineHeight: '1.4' }}>
                                                <li>- Jika ingin <strong>tambah foto sendiri</strong> bisa letakan nama file yang ada di drive</li>
                                                <li>- <strong>Silakan kosongkan</strong> jika hanya ingin menambahkan kisah cinta tanpa foto.</li>
                                            </ul>
                                        </div>
                                        <div className="form-group">
                                            <label>Judul</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Awal Bertemu"
                                                value={story.title}
                                                onChange={(e) => handleLoveStoryChange(index, 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tanggal / Tahun</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: 2020 atau 12 Januari 2021"
                                                value={story.date}
                                                onChange={(e) => handleLoveStoryChange(index, 'date', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Kisah Cinta</label>
                                            <textarea
                                                placeholder={index === 0
                                                    ? 'Contoh: Di sebuah kota sejuk bernama Langit Senja, Arka dan Nayla pertama kali berkenalan...'
                                                    : 'Ceritakan momen spesial ini...'}
                                                value={story.story}
                                                onChange={(e) => handleLoveStoryChange(index, 'story', e.target.value)}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <button type="button" className="btn-secondary" onClick={addLoveStory} disabled={formData.loveStories.length >= 3}>
                                    + Tambah Cerita
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Section 8: Catatan Tambahan */}
                    <section className="form-section">
                        <h2 className="section-title">📝 8. Catatan Tambahan <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>(Opsional)</span></h2>
                        <div className="form-group full-width">
                            <label>Tuliskan request khusus atau catatan untuk tim kami</label>
                            <textarea
                                name="additionalNotes"
                                placeholder="Contoh: Tolong foto mempelai wanita ditaruh di halaman paling depan, atau request lagu tertentu..."
                                value={formData.additionalNotes}
                                onChange={handleChange}
                                rows="4"
                            ></textarea>
                        </div>
                    </section>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Kirim Data</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default FormPage;
