import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/FormStyles.css';

const SumpahDokterShare = () => {
    const [searchParams] = useSearchParams();
    const [slug, setSlug] = useState('fkung');
    const [guestNames, setGuestNames] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('formal_resmi');
    const [customTemplate, setCustomTemplate] = useState('');
    const [generatedList, setGeneratedList] = useState([]);
    const [previewVisibility, setPreviewVisibility] = useState({});
    const [generationMode, setGenerationMode] = useState('message'); // 'message' or 'link'

    const TEMPLATES = {
        formal_resmi: {
            id: 'formal_resmi',
            label: 'Formal Resmi (Tamu / Undangan)',
            content: `Kepada Yth.
Bapak/Ibu/Saudara/i {{nama}}

Dengan hormat,

Sehubungan dengan pelaksanaan Acara Pelantikan & Pengambilan Sumpah Dokter Angkatan III Periode 2026 Fakultas Kedokteran Universitas Negeri Gorontalo, kami mengundang Bapak/Ibu/Saudara/i untuk berkenan hadir menyaksikan prosesi ini.

Silakan buka tautan berikut untuk informasi selengkapnya:
🔗 {{link}}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Atas perhatian dan kehadirannya, kami ucapkan terima kasih.

Hormat kami,
*Panitia Sumpah Dokter FK UNG*`
        },
        formal_singkat: {
            id: 'formal_singkat',
            label: 'Formal Ringkas',
            content: `Yth. {{nama}}

Dengan hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i pada Acara *Pelantikan & Pengambilan Sumpah Dokter Angkatan III Periode 2026* Fakultas Kedokteran UNG.

Silakan buka tautan berikut untuk rincian acara:
🔗 {{link}}

Terima kasih atas perhatian dan keikutsertaan Bapak/Ibu/Saudara/i.

Hormat kami,
*Fakultas Kedokteran UNG*`
        },
        vip_kehormatan: {
            id: 'vip_kehormatan',
            label: 'Undangan VIP / Tamu Kehormatan',
            content: `UNDANGAN KEHORMATAN

Kepada Yth.
{{nama}}

Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Tamu Kehormatan untuk hadir dalam acara *Pelantikan & Pengambilan Sumpah Dokter Angkatan III Periode 2026 Fakultas Kedokteran UNG*.

Untuk informasi selengkapnya mengenai rincian acara, silakan klik tautan di bawah ini:
🔗 {{link}}

Kehadiran Bapak/Ibu merupakan suatu kehormatan dan kebanggaan bagi kami. Terima kasih.

Hormat kami,
*Panitia Pelantikan & Pengambilan Sumpah Dokter FK UNG*`
        },
        custom: {
            id: 'custom',
            label: 'Buat Sendiri (Kustom)',
            content: `Kepada Yth. {{nama}}

Dengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara Pelantikan & Pengambilan Sumpah Dokter Angkatan III Periode 2026 FK UNG.

Detail undangan selengkapnya:
🔗 {{link}}

Terima kasih.`
        }
    };

    // Load persisted data
    useEffect(() => {
        const savedNames = localStorage.getItem('sumpahdokter_fkung_share_guestNames');
        if (savedNames) setGuestNames(savedNames);
    }, []);

    // Persist Guest Names
    useEffect(() => {
        localStorage.setItem('sumpahdokter_fkung_share_guestNames', guestNames);
    }, [guestNames]);

    // Handle preview generation for templates
    useEffect(() => {
        if (selectedTemplateId === 'custom') return;

        const firstGuest = guestNames.split('\n')[0].trim() || 'Bapak/Ibu Tamu Undangan';
        const baseUrl = window.location.origin.replace('://www.', '://');
        const cleanSlug = slug.trim() || 'fkung';

        const guestLink = `${baseUrl}/${cleanSlug}?to=${encodeURIComponent(firstGuest).replace(/%20/g, '+')}`;
        const rawContent = TEMPLATES[selectedTemplateId].content;
        const boldGuestName = `*${firstGuest}*`;

        const messageBody = rawContent
            .replace(/{{nama}}/g, boldGuestName)
            .replace(/{{link}}/g, guestLink);

        setCustomTemplate(messageBody);
    }, [selectedTemplateId, guestNames, slug]);

    const handleTemplateChange = (id) => {
        setSelectedTemplateId(id);
        if (id === 'custom') {
            setCustomTemplate(TEMPLATES['custom'].content);
        }
    };

    const handleGenerate = () => {
        const guests = guestNames.split('\n').filter(name => name.trim() !== '');
        const baseUrl = window.location.origin.replace('://www.', '://');
        const cleanSlug = slug.trim() || 'fkung';

        const results = guests.map(guest => {
            const guestName = guest.trim();
            const guestLink = `${baseUrl}/${cleanSlug}?to=${encodeURIComponent(guestName).replace(/%20/g, '+')}`;

            if (generationMode === 'link') {
                return {
                    name: guestName,
                    link: guestLink,
                    message: guestLink
                };
            }

            let messageTemplate = '';
            if (selectedTemplateId === 'custom') {
                messageTemplate = customTemplate;
            } else {
                messageTemplate = TEMPLATES[selectedTemplateId].content;
            }

            let replacementName = selectedTemplateId !== 'custom' ? `*${guestName}*` : guestName;

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
                fallbackCopyTextToClipboard(text);
            });
        } else {
            fallbackCopyTextToClipboard(text);
        }
    };

    const fallbackCopyTextToClipboard = (text) => {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            if (successful) alert('Teks berhasil disalin!');
        } catch (err) {
            console.error('Fallback error:', err);
        }
        document.body.removeChild(textArea);
    };

    const shareToWA = (message) => {
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const togglePreview = (index) => {
        setPreviewVisibility(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

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
        <div className="form-page-wrapper" style={{ background: 'linear-gradient(to bottom, #0c1829, #1b2a4a)', color: '#ffffff', minHeight: '100vh', padding: '2rem 1rem' }}>
            <div className="form-container" style={{ maxWidth: '900px', margin: '0 auto', background: '#ffffff', color: '#0c1829', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', padding: '2rem' }}>
                
                {/* Header Banner */}
                <header className="form-header" style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #D4AF37', paddingBottom: '1.5rem' }}>
                    <div style={{ background: '#0c1829', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', color: '#D4AF37', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        FAKULTAS KEDOKTERAN UNG
                    </div>
                    <h1 style={{ color: '#0c1829', fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>
                        Generator Undangan WhatsApp
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                        Pelantikan & Pengambilan Sumpah Dokter Angkatan III Periode 2026
                    </p>
                </header>

                {/* Mode Switcher Cards (Compact) */}
                <div className="form-section mode-section" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0c1829', display: 'block', marginBottom: '0.5rem' }}>
                        Pilih Mode Hasil Undangan:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                        {/* Card 1: Pesan WhatsApp Lengkap */}
                        <div
                            onClick={() => setGenerationMode('message')}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                border: generationMode === 'message' ? '2px solid #0c1829' : '1px solid #cbd5e1',
                                background: generationMode === 'message' ? '#0c1829' : '#f8fafc',
                                color: generationMode === 'message' ? '#ffffff' : '#334155',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                boxShadow: generationMode === 'message' ? '0 4px 12px rgba(12,24,41,0.2)' : '0 1px 3px rgba(0,0,0,0.03)'
                            }}
                        >
                            <div style={{ fontSize: '1.35rem', flexShrink: 0 }}>📝</div>
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <div style={{ fontWeight: '700', fontSize: '0.88rem', color: generationMode === 'message' ? '#D4AF37' : '#0c1829', lineHeight: '1.2' }}>
                                    Pesan WhatsApp Lengkap
                                </div>
                                <div style={{ fontSize: '0.73rem', color: generationMode === 'message' ? '#cbd5e1' : '#64748b', marginTop: '2px' }}>
                                    Pesan formal + link nama tamu
                                </div>
                            </div>
                            {generationMode === 'message' && (
                                <span style={{ background: '#D4AF37', color: '#0c1829', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', flexShrink: 0 }}>✓</span>
                            )}
                        </div>

                        {/* Card 2: Tautan Link Saja */}
                        <div
                            onClick={() => setGenerationMode('link')}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                border: generationMode === 'link' ? '2px solid #0c1829' : '1px solid #cbd5e1',
                                background: generationMode === 'link' ? '#0c1829' : '#f8fafc',
                                color: generationMode === 'link' ? '#ffffff' : '#334155',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                boxShadow: generationMode === 'link' ? '0 4px 12px rgba(12,24,41,0.2)' : '0 1px 3px rgba(0,0,0,0.03)'
                            }}
                        >
                            <div style={{ fontSize: '1.35rem', flexShrink: 0 }}>🔗</div>
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <div style={{ fontWeight: '700', fontSize: '0.88rem', color: generationMode === 'link' ? '#D4AF37' : '#0c1829', lineHeight: '1.2' }}>
                                    Tautan Link Saja
                                </div>
                                <div style={{ fontSize: '0.73rem', color: generationMode === 'link' ? '#cbd5e1' : '#64748b', marginTop: '2px' }}>
                                    Hanya tautan link tertera nama
                                </div>
                            </div>
                            {generationMode === 'link' && (
                                <span style={{ background: '#D4AF37', color: '#0c1829', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', flexShrink: 0 }}>✓</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Step 1: Guest Names */}
                <div className="form-section" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0c1829', display: 'block', marginBottom: '0.5rem' }}>
                        1. Daftar Nama Tamu / Undangan (Satu Nama per Baris):
                    </label>
                    <textarea
                        rows="9"
                        value={guestNames}
                        onChange={(e) => setGuestNames(e.target.value)}
                        placeholder={`dr. Ahmad Sukarna, Sp.B / RSUD Prof. Dr. H. Aloei Saboe\nDr. Hj. Siti Rahma, M.Kes / Dinas Kesehatan\nBapak Budi Santoso, S.Pd`}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontFamily: 'inherit' }}
                    />
                </div>

                {/* Form Step 2: Template Choice (if in message mode) */}
                {generationMode === 'message' && (
                    <div className="form-section" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0c1829', display: 'block', marginBottom: '0.5rem' }}>
                            2. Pilih Template Pesan Formal:
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            {Object.values(TEMPLATES).map((tmpl) => (
                                <button
                                    key={tmpl.id}
                                    type="button"
                                    onClick={() => handleTemplateChange(tmpl.id)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: selectedTemplateId === tmpl.id ? '2px solid #0c1829' : '1px solid #cbd5e1',
                                        background: selectedTemplateId === tmpl.id ? '#0c1829' : '#ffffff',
                                        color: selectedTemplateId === tmpl.id ? '#D4AF37' : '#334155',
                                        fontWeight: selectedTemplateId === tmpl.id ? '700' : '500',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {tmpl.label}
                                </button>
                            ))}
                        </div>

                        {selectedTemplateId === 'custom' && (
                            <div style={{ color: '#475569', marginBottom: '0.75rem', background: '#f1f5f9', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                                <div style={{ fontWeight: '700', color: '#0c1829', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    💡 Informasi
                                </div>
                                <ul style={{ margin: '0 0 0.5rem 0', paddingLeft: '1.2rem', lineHeight: '1.5' }}>
                                    <li>Gunakan <code>&#123;&#123;nama&#125;&#125;</code> untuk lokasi nama tamu</li>
                                    <li>Gunakan <code>&#123;&#123;link&#125;&#125;</code> untuk tautan undangan.</li>
                                </ul>
                                <div style={{ fontWeight: '600', color: '#64748b', fontSize: '0.8rem', borderTop: '1px solid #cbd5e1', paddingTop: '6px' }}>
                                    Silakan edit kolom di bawah ini:
                                </div>
                            </div>
                        )}

                        {/* Template Textarea */}
                        <textarea
                            rows="15"
                            value={customTemplate}
                            onChange={(e) => {
                                setCustomTemplate(e.target.value);
                                if (selectedTemplateId !== 'custom') {
                                    setSelectedTemplateId('custom');
                                }
                            }}
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'monospace', background: '#f8fafc', whiteSpace: 'pre-wrap' }}
                        />
                    </div>
                )}

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #0c1829 0%, #1b2a4a 100%)',
                        color: '#D4AF37',
                        border: '1px solid #D4AF37',
                        fontWeight: '800',
                        fontSize: '1rem',
                        padding: '0.85rem 1.5rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 12px rgba(12,24,41,0.3)',
                        marginBottom: '2rem'
                    }}
                >
                    Generate Tautan Undangan ({guestNames.split('\n').filter(n => n.trim() !== '').length} Tamu)
                </button>

                {/* Results Section */}
                {generatedList.length > 0 && (
                    <div style={{ marginTop: '2rem', borderTop: '2px solid #e2e8f0', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.2rem', color: '#0c1829', fontWeight: '800', margin: 0 }}>
                                {generationMode === 'link' ? `Hasil link dengan nama (${generatedList.length})` : `Hasil Undangan Siap Kirim (${generatedList.length})`}
                            </h3>
                            {generationMode === 'link' && (
                                <button
                                    onClick={() => {
                                        const allText = generatedList.map((item) => item.message).join('\n');
                                        copyToClipboard(allText);
                                    }}
                                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', color: '#334155' }}
                                >
                                    📋 Salin Semua Link
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {generatedList.map((item, idx) => (
                                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                                    {/* Guest Name Header */}
                                    <div style={{ fontWeight: '800', color: '#0c1829', fontSize: '1rem', marginBottom: '0.6rem' }}>
                                        {idx + 1}. {item.name}
                                    </div>

                                    {generationMode === 'link' ? (
                                        /* Link Only Mode */
                                        <div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                                <button
                                                    onClick={() => shareToWA(item.link)}
                                                    style={{ background: '#25D366', color: '#ffffff', border: 'none', padding: '11px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center', width: '100%' }}
                                                >
                                                    Kirim WA
                                                </button>
                                                <button
                                                    onClick={() => window.open(item.link, '_blank')}
                                                    style={{ background: '#0c1829', color: '#D4AF37', border: '1px solid #D4AF37', padding: '11px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center', width: '100%' }}
                                                >
                                                    Lihat Undangan
                                                </button>
                                            </div>

                                            {/* Directly display actual link with copy button below it */}
                                            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '0.82rem', wordBreak: 'break-all', color: '#1e293b', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
                                                    {item.link}
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(item.link)}
                                                    style={{ width: '100%', background: '#e2e8f0', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                                >
                                                    📋 Salin Link
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Full Message Mode */
                                        <div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem', marginBottom: '0.6rem', width: '100%' }}>
                                                <button
                                                    onClick={() => shareToWA(item.message)}
                                                    style={{ background: '#25D366', color: '#ffffff', border: 'none', padding: '11px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center', width: '100%' }}
                                                >
                                                    Kirim WA
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(item.message)}
                                                    style={{ background: '#e2e8f0', border: 'none', padding: '11px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', color: '#1e293b', textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center', width: '100%' }}
                                                >
                                                    Salin Pesan
                                                </button>
                                                <button
                                                    onClick={() => window.open(item.link, '_blank')}
                                                    style={{ background: '#0c1829', color: '#D4AF37', border: '1px solid #D4AF37', padding: '11px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center', width: '100%' }}
                                                >
                                                    Lihat Undangan
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => togglePreview(idx)}
                                                style={{
                                                    width: '100%',
                                                    background: previewVisibility[idx] ? '#e2e8f0' : '#ffffff',
                                                    border: '1px solid #cbd5e1',
                                                    padding: '10px 14px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    color: '#334155',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {previewVisibility[idx] ? 'Tutup Pesan WhatsApp' : 'Lihat Pesan WhatsApp'}
                                            </button>

                                            {previewVisibility[idx] && (
                                                <div style={{ marginTop: '0.75rem', background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#334155', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                                                    {renderPreviewText(item.message)}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SumpahDokterShare;
