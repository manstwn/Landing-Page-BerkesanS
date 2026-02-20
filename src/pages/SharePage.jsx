import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import '../styles/FormStyles.css';

const SharePage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [slug, setSlug] = useState('');
    const [guestNames, setGuestNames] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('semi');
    const [customTemplate, setCustomTemplate] = useState('');
    const [generatedList, setGeneratedList] = useState([]);
    const [isSlugLocked, setIsSlugLocked] = useState(false);
    const [previewVisibility, setPreviewVisibility] = useState({});

    const [generationMode, setGenerationMode] = useState('message'); // 'message' or 'link'

    const togglePreview = (index) => {
        setPreviewVisibility(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const TEMPLATES = {

        semi: {
            id: 'semi',
            label: 'Semi Formal',
            content: `Kepada Yth.
{{nama}}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk memberikan doa restu pada acara pernikahan kami.

Detail acara dapat dilihat di link berikut:
🔗 {{link}}

Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir.

Terima kasih.`
        },
        formal: {
            id: 'formal',
            label: 'Formal',
            content: `Yth. Bapak/Ibu/Saudara/i
{{nama}}
Di Tempat

Assalamualaikum Wr. Wb.

Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara kami.

Untuk informasi lebih lengkap mengenai acara dapat diakses melalui tautan berikut:

🔗 {{link}}

Kami berharap Bapak/Ibu/Saudara/i dapat meluangkan waktu untuk hadir.

Mohon maaf undangan ini hanya disampaikan melalui pesan ini.

Terima kasih.`
        },
        santai: {
            id: 'santai',
            label: 'Santai',
            content: `Halo {{nama}}! 👋

Kami punya kabar bahagia! Kami akan menikah dan sangat berharap kamu bisa datang merayakan momen spesial ini bersama kami.

Cek detail undangannya di sini ya:
👉 {{link}}

Ditunggu kehadirannya ya! Terima kasih!`
        },
        singkat: {
            id: 'singkat',
            label: 'Singkat',
            content: `Undangan Pernikahan untuk {{nama}}

Mohon doa restu untuk pernikahan kami.
Link undangan: 
🔗 {{link}}

Terima kasih.`
        },
        custom: {
            id: 'custom',
            label: 'Buat Sendiri',
            content: `` // User start from empty or last selected
        }
    };

    // Initialize state from URL params
    useEffect(() => {
        // Priority: Path Param > Query Param
        const urlId = id || searchParams.get('id');
        if (urlId) {
            setSlug(urlId);
            setIsSlugLocked(true);
        } else {
            setIsSlugLocked(false);
        }
    }, [id, searchParams]);

    // Load persisted data (Guest Names & Slug if not locked)
    useEffect(() => {
        const savedGuestNames = localStorage.getItem('share_guestNames');
        if (savedGuestNames) setGuestNames(savedGuestNames);

        if (!id && !searchParams.get('id')) {
            const savedSlug = localStorage.getItem('share_slug');
            if (savedSlug) setSlug(savedSlug);
        }
    }, [id, searchParams]);

    // Persist Guest Names
    useEffect(() => {
        localStorage.setItem('share_guestNames', guestNames);
    }, [guestNames]);

    // Persist Slug (only if not locked by URL)
    useEffect(() => {
        if (!isSlugLocked) {
            localStorage.setItem('share_slug', slug);
        }
    }, [slug, isSlugLocked]);

    // Handle preview generation for non-custom templates or initialization
    useEffect(() => {
        if (selectedTemplateId === 'custom') return;

        const firstGuest = guestNames.split('\n')[0].trim() || 'Nama Tamu';
        const baseUrl = import.meta.env.VITE_INVITATION_HOST || 'https://m.berkesanstudio.com';
        const cleanSlug = slug.trim() || 'slug-undangan-anda';

        // Encode guest name just for the link in the preview
        const guestLink = `${baseUrl}/${cleanSlug}?to=${encodeURIComponent(firstGuest).replace(/%20/g, '+')}`;

        // Get raw template content
        const rawContent = TEMPLATES[selectedTemplateId].content;

        // Wrap name in stars for bolding in WA
        const boldGuestName = `*${firstGuest}*`;

        // Replace placeholders for the preview
        const messageBody = rawContent
            .replace(/{{nama}}/g, boldGuestName)
            .replace(/{{link}}/g, guestLink);

        setCustomTemplate(messageBody);
    }, [selectedTemplateId, guestNames, slug]);

    const handleTemplateChange = (id) => {
        setSelectedTemplateId(id);
        if (id === 'custom') {
            // Initialize with Formal template content (raw) so it's editable and not blank
            setCustomTemplate(TEMPLATES['formal'].content);
        }
    };

    const handleGenerate = () => {
        const guests = guestNames.split('\n').filter(name => name.trim() !== '');
        const baseUrl = import.meta.env.VITE_INVITATION_HOST || 'https://m.berkesanstudio.com';
        const cleanSlug = slug.trim() || 'slug-undangan-anda';

        const results = guests.map(guest => {
            const guestName = guest.trim();
            // Encode guest name for URL
            const guestLink = `${baseUrl}/${cleanSlug}?to=${encodeURIComponent(guestName).replace(/%20/g, '+')}`;

            if (generationMode === 'link') {
                return {
                    name: guestName,
                    link: guestLink,
                    message: guestLink // For easy copying
                };
            }

            let messageTemplate = '';

            if (selectedTemplateId === 'custom') {
                messageTemplate = customTemplate;
            } else {
                // For non-custom, use the raw template content, NOT the preview text in customTemplate
                messageTemplate = TEMPLATES[selectedTemplateId].content;
            }

            // Replace placeholders
            // Logic: If Preset -> Bold the name (*Name*)
            //        If Custom -> Keep as is (User defines stars if they want)
            let replacementName = guestName;
            if (selectedTemplateId !== 'custom') {
                replacementName = `*${guestName}*`;
            }

            let message = messageTemplate
                .replace(/{{nama}}/g, replacementName)
                .replace(/{{link}}/g, guestLink);

            return {
                name: guestName,
                link: guestLink,
                message: message
            };
        });

        setGeneratedList(results);
    };

    const copyToClipboard = (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Teks berhasil disalin!');
            }).catch(err => {
                console.error('Failed to copy: ', err);
                fallbackCopyTextToClipboard(text);
            });
        } else {
            fallbackCopyTextToClipboard(text);
        }
    };

    const fallbackCopyTextToClipboard = (text) => {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";  // avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            if (successful) alert('Teks berhasil disalin!');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    }

    const shareToWA = (message) => {
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // Helper to render bold text from stars
    const renderPreviewText = (text) => {
        if (!text) return null;
        const parts = text.split(/(\*[^*]+\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('*') && part.endsWith('*')) {
                return <strong key={index}>{part.slice(1, -1)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="form-page-wrapper">
            <div className="form-container">
                <header className="form-header">
                    <h1>Generator Undangan</h1>
                    <p>Buat dan bagikan undangan personal secara otomatis.</p>
                </header>

                {/* MODE TOGGLE */}
                <div className="form-section mode-section" style={{ padding: '20px', textAlign: 'center', background: 'transparent', boxShadow: 'none' }}>
                    <div style={{
                        display: 'inline-flex',
                        background: '#e2e8f0',
                        padding: '4px',
                        borderRadius: '12px',
                        position: 'relative',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
                    }}>
                        <button
                            onClick={() => setGenerationMode('message')}
                            style={{
                                padding: '10px 24px',
                                border: 'none',
                                borderRadius: '10px',
                                background: generationMode === 'message' ? 'white' : 'transparent',
                                color: generationMode === 'message' ? '#4f46e5' : '#64748b',
                                fontWeight: generationMode === 'message' ? '700' : '600',
                                boxShadow: generationMode === 'message' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease',
                                fontSize: '0.95rem'
                            }}
                        >
                            📝 Pesan WhatsApp
                        </button>
                        <button
                            onClick={() => setGenerationMode('link')}
                            style={{
                                padding: '10px 24px',
                                border: 'none',
                                borderRadius: '10px',
                                background: generationMode === 'link' ? 'white' : 'transparent',
                                color: generationMode === 'link' ? '#4f46e5' : '#64748b',
                                fontWeight: generationMode === 'link' ? '700' : '600',
                                boxShadow: generationMode === 'link' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease',
                                fontSize: '0.95rem'
                            }}
                        >
                            🔗 Hanya Link
                        </button>
                    </div>
                </div>

                {/* GUIDE SECTION */}
                <div className="form-section guide-section" style={{ padding: 0, overflow: 'hidden' }}>
                    <button
                        onClick={(e) => {
                            const content = e.currentTarget.nextElementSibling;
                            content.style.display = content.style.display === 'none' ? 'block' : 'none';
                            e.currentTarget.querySelector('.arrow').textContent = content.style.display === 'block' ? '▲' : '▼';
                        }}
                        style={{
                            width: '100%',
                            padding: '16px',
                            textAlign: 'left',
                            background: 'var(--bg-card, #fff)',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '1rem'
                        }}
                    >
                        <span>💡 Panduan & Tips Penggunaan</span>
                        <span className="arrow">▼</span>
                    </button>

                    <div style={{ display: 'none', padding: '0 16px 16px 16px', background: 'var(--bg-card, #fff)', borderTop: '1px solid var(--border-color, #eee)' }}>
                        <div style={{ padding: '16px', background: 'var(--bg-secondary, #f9f9f9)', borderRadius: '8px', marginTop: '10px' }}>
                            <h4 style={{ marginTop: 0, marginBottom: '8px' }}>📝 Cara Pakai</h4>
                            <ol style={{ margin: '0 0 16px 20px', padding: 0, lineHeight: '1.6' }}>
                                <li>Pilih Mode: <strong>Pesan WhatsApp</strong> atau <strong>Hanya Link</strong>.</li>
                                <li>Pastikan <strong>ID Undangan</strong> (kode unik link undangan) sesuai.</li>
                                <li>Tulis <strong>Daftar Nama Tamu</strong> (satu nama per baris).</li>
                                {generationMode === 'message' && <li>Pilih <strong>Template Pesan</strong> yang diinginkan.</li>}
                                <li>Klik <strong>Generate {generationMode === 'message' ? 'Pesan' : 'Link'}</strong>.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* SETTING CONFIGURATION */}
                <section className="form-section">
                    <h2 className="section-title">⚙️ 1. Pengaturan Tautan</h2>
                    <div className="form-group">
                        <label>Slug Undangan (ID Undangan)</label>
                        <input
                            type="text"
                            placeholder="Contoh: dimas-ayu"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            disabled={isSlugLocked}
                            style={isSlugLocked ? { backgroundColor: '#e9ecef', cursor: 'not-allowed' } : {}}
                        />
                        <p className="helper-text">
                            Link akan menjadi: <code>{import.meta.env.VITE_INVITATION_HOST || 'https://m.berkesanstudio.com'}/{slug || 'dimas-ayu'}?to=Nama+Tamu</code>
                        </p>
                    </div>
                </section>

                {/* GUEST LIST */}
                <section className="form-section">
                    <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h2 className="section-title" style={{ marginBottom: 0 }}>👥 2. Daftar Nama Tamu</h2>
                        <button
                            onClick={() => {
                                if (window.confirm('Yakin ingin menghapus semua nama tamu?')) {
                                    setGuestNames('');
                                }
                            }}
                            style={{
                                background: '#ffebee',
                                color: '#e53935',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            🗑️ Reset
                        </button>
                    </div>
                    <div className="form-group full-width">
                        <label>Masukkan Nama Tamu (Satu nama per baris)</label>
                        <textarea
                            rows="6"
                            placeholder="Budi Saktiawan&#10;Siti Aminah&#10;Andi Pratama"
                            value={guestNames}
                            onChange={(e) => setGuestNames(e.target.value)}
                        ></textarea>
                    </div>
                </section>

                {/* TEMPLATE SELECTION - Only for 'message' mode */}
                {generationMode === 'message' && (
                    <section className="form-section">
                        <h2 className="section-title">📝 3. Template Pesan</h2>

                        <label style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'block' }}>✏️ Pilih Template</label>
                        <div className="template-selector">

                            {Object.values(TEMPLATES).map(t => (
                                <button
                                    key={t.id}
                                    className={`template-btn ${selectedTemplateId === t.id ? 'active' : ''}`}
                                    onClick={() => handleTemplateChange(t.id)}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {selectedTemplateId === 'custom' && (
                            <div className="info-banner" style={{ marginTop: '20px', marginBottom: '15px', display: 'block', lineHeight: '1.6' }}>
                                <p style={{ margin: '0 0 10px 0' }}><strong>Panduan Custom Pesan:</strong></p>
                                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                                    <li>Pastikan telah mengisi nama, minimal 1 di <strong> Daftar Nama Tamu</strong></li>
                                    <li>Gunakan kode <code>{`{{nama}}`}</code> : Akan otomatis berubah menjadi <strong>Nama Tamu</strong>.</li>
                                    <li>Gunakan kode <code>{`{{link}}`}</code> : Akan otomatis berubah menjadi <strong>Link Undangan</strong> unik.</li>
                                    <li>Apabila ingin mengubah pesan, silakan edit di bagian ini.</li>
                                    <li>Tekan <strong>Generate Pesan</strong> untuk melihat hasilnya</li>
                                </ul>
                            </div>
                        )}


                        <div className="form-group full-width" style={{ marginTop: '1rem' }}>
                            <label style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'block' }}>
                                {selectedTemplateId === 'custom'
                                    ? '✏️ Editor Pesan'
                                    : <span>📄 Contoh Pesan untuk Tamu "<strong>{guestNames.split('\n')[0].trim() || 'Nama Tamu'}"</strong></span>
                                }
                            </label>

                            {selectedTemplateId === 'custom' ? (
                                <textarea
                                    className="template-editor"
                                    rows="16"
                                    value={customTemplate}
                                    onChange={(e) => setCustomTemplate(e.target.value)}
                                    style={{
                                        fontSize: '1rem',
                                        backgroundColor: 'white',
                                        color: 'inherit',
                                        cursor: 'text'
                                    }}
                                ></textarea>
                            ) : (
                                <div
                                    className="template-preview-box"
                                    style={{
                                        padding: '14px 16px',
                                        border: '2px solid rgba(var(--section-color), 0.15)',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        backgroundColor: '#f5f5f5',
                                        color: '#333',
                                        whiteSpace: 'pre-wrap',
                                        minHeight: '120px',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    {renderPreviewText(customTemplate)}
                                </div>
                            )}
                        </div>

                    </section>
                )}

                {/* ACTION */}
                <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                    <button
                        className="generate-btn"
                        onClick={handleGenerate}
                        disabled={!guestNames.trim()}
                    >
                        ✨ Generate {generationMode === 'message' ? 'Pesan' : 'Link'} ({guestNames.split('\n').filter(n => n.trim()).length} Tamu)
                    </button>
                </div>

                {/* RESULTS */}
                {generatedList.length > 0 && (
                    <section className="form-section results-section">
                        <h2 className="section-title">📤 {generationMode === 'message' ? '4.' : '3.'} Hasil ({generatedList.length})</h2>
                        <div className="info-banner" style={{ marginBottom: '20px', display: 'block' }}>
                            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Keterangan Tombol:</p>
                            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.5' }}>
                                <li>📋 <strong>Copy</strong>: Menyalin {generationMode === 'message' ? 'teks pesan' : 'link'}.</li>
                                {generationMode === 'message' && <li>📲 <strong>WhatsApp</strong>: Membuka WhatsApp dengan pesan otomatis terisi.</li>}
                                {generationMode === 'message' && <li>👁️ <strong>Preview</strong>: Melihat pesan yang akan di kirim.</li>}
                                <li>🔗 <strong>Lihat</strong>: Membuka link undangan atas nama tamu tersebut.</li>
                            </ul>
                        </div>
                        <div className="results-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {generatedList.map((item, idx) => (
                                <div key={idx} className="result-item" style={{
                                    background: 'white',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        padding: '16px',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '16px',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <h3 className="guest-name" style={{ margin: 0, fontSize: '1.2rem', flex: '1 1 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '28px',
                                                height: '28px',
                                                background: 'var(--bg-input)', // Subtle background
                                                color: '#666',
                                                borderRadius: '50%',
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold',
                                                flexShrink: 0
                                            }}>
                                                {idx + 1}
                                            </span>
                                            {item.name}
                                        </h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flex: '0 0 auto' }}>
                                            <div className="action-buttons" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                <button
                                                    className="btn-copy"
                                                    onClick={() => copyToClipboard(item.message)}
                                                    style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                                                >
                                                    📋 Copy
                                                </button>

                                                {generationMode === 'message' && (
                                                    <button
                                                        className="btn-wa"
                                                        onClick={() => shareToWA(item.message)}
                                                        style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                                                    >
                                                        📲 WhatsApp
                                                    </button>
                                                )}

                                                <button
                                                    className="btn-view"
                                                    onClick={() => window.open(item.link, '_blank')}
                                                    style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                                                >
                                                    🔗 Lihat
                                                </button>
                                            </div>

                                            {generationMode === 'message' && (
                                                <button
                                                    className="btn-preview"
                                                    onClick={() => togglePreview(idx)}
                                                    style={{
                                                        padding: '12px 18px',
                                                        fontSize: '0.85rem',
                                                        background: previewVisibility[idx] ? '#e5e7eb' : 'transparent',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        width: '100%',
                                                        color: '#666'
                                                    }}
                                                >
                                                    {previewVisibility[idx] ? '🙈 Sembunyikan' : '👁️ Preview'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {generationMode === 'link' && (
                                        <div style={{ padding: '0 16px 16px', marginTop: '-8px' }}>
                                            <code style={{
                                                display: 'block',
                                                background: '#f5f5f5',
                                                padding: '8px',
                                                borderRadius: '6px',
                                                wordBreak: 'break-all',
                                                color: '#666',
                                                fontSize: '0.85rem'
                                            }}>
                                                {item.link}
                                            </code>
                                        </div>
                                    )}

                                    {generationMode === 'message' && previewVisibility[idx] && (
                                        <div className="preview-box-container" style={{
                                            padding: '0 16px 16px',
                                            borderTop: '2px dashed var(--border-color)',
                                            marginTop: '-8px',
                                        }}>
                                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '8px', marginTop: '12px' }}>Preview Pesan:</p>
                                            <div
                                                style={{
                                                    padding: '14px 16px',
                                                    border: '2px solid rgba(var(--section-color), 0.15)',
                                                    borderRadius: '12px',
                                                    fontSize: '1rem',
                                                    backgroundColor: '#f5f5f5',
                                                    color: '#333',
                                                    whiteSpace: 'pre-wrap',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                {renderPreviewText(item.message)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <style>{`
                /* share-page-container removed to match WeddingForm width */
                .form-page-wrapper .template-selector {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-bottom: 1rem;
                }
                .form-page-wrapper .template-btn {
                    padding: 8px 16px;
                    border: 1px solid var(--border-color, #ddd);
                    border-radius: 20px;
                    background: var(--bg-card, #fff);
                    color: var(--text-main, #333);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .form-page-wrapper .template-btn.active {
                    background: var(--primary-color, #667eea);
                    color: white;
                    border-color: var(--primary-color, #667eea);
                }
                .form-page-wrapper .template-editor {
                    font-family: monospace;
                    line-height: 1.5;
                }
                .form-page-wrapper .generate-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 16px 32px;
                    border-radius: 50px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(118, 75, 162, 0.4);
                    transition: transform 0.2s;
                }
                .form-page-wrapper .generate-btn:hover {
                    transform: translateY(-2px);
                }
                .form-page-wrapper .generate-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                .form-page-wrapper .results-grid {
                    display: grid;
                    gap: 20px;
                }
                .form-page-wrapper .result-card {
                    background: var(--bg-card, #fff);
                    border: 1px solid var(--border-color, #eee);
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .form-page-wrapper .guest-name {
                    margin: 0 0 10px 0;
                    font-size: 1.1rem;
                    color: var(--text-main, #333);
                }
                .form-page-wrapper .preview-box {
                    background: var(--bg-secondary, #f9f9f9);
                    padding: 12px;
                    border-radius: 8px;
                    white-space: pre-wrap;
                    font-size: 0.9rem;
                    color: var(--text-muted, #555);
                    max-height: 150px;
                    overflow-y: auto;
                    margin-bottom: 12px;
                    border: 1px solid var(--border-color, #eee);
                }
                .form-page-wrapper .action-buttons {
                    display: flex;
                    gap: 10px;
                }
                .form-page-wrapper .action-buttons button {
                    flex: 1;
                    padding: 10px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    transition: opacity 0.2s;
                }
                .form-page-wrapper .btn-copy {
                    background: var(--bg-secondary, #e2e8f0);
                    color: var(--text-main, #333);
                }
                .form-page-wrapper .btn-wa {
                    background: #25D366;
                    color: white;
                }
                .form-page-wrapper .btn-view {
                    background: #3b82f6;
                    color: white;
                }
                .form-page-wrapper .action-buttons button:hover {
                    opacity: 0.9;
                }
                .form-page-wrapper .helper-text code {
                    background: rgba(0,0,0,0.05);
                    padding: 2px 4px;
                    border-radius: 4px;
                    color: #667eea;
                }
            `}</style>
            </div>
        </div>
    );
};

export default SharePage;
