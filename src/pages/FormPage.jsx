import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/FormStyles.css';

const STORAGE_KEY = 'weddingFormData_v2';

const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

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

    // 3b. Urutan Nama Undangan ('bride' = Wanita dulu, 'groom' = Pria dulu)
    nameOrder: 'bride',

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

    // 5b. Informasi Acara Tambahan
    extraEvents: [{ name: '', date: '', time: '', place: '', maps: '', address: '' }],

    // 6. Data Pelengkap
    groomWhatsapp: '',
    groomInstagram: '',
    brideWhatsapp: '',
    brideInstagram: '',
    photoVideoLink: '',

    // 6. Love Story
    loveStories: [{ imageCode: '', title: '', date: '', story: '', imageFileName: '', imageSize: 0 }],

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
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Check if data is older than 24 hours
                const isRecent = (Date.now() - parsed.timestamp) < 24 * 60 * 60 * 1000;
                if (isRecent) {
                    Object.assign(INITIAL_LOCAL_STATE, parsed.data);
                } else {
                    localStorage.removeItem(STORAGE_KEY); // Expired
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
    const [showCopyModal, setShowCopyModal] = useState(false);
    // Picked files for Love Story (compressed client-side, uploaded on submit)
    const [storyUploads, setStoryUploads] = useState([]);

    // Template chosen from the catalog (/?template=...) must stay fixed
    const isTemplateLocked = Boolean(new URLSearchParams(location.search).get('template'));

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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, [formData]);

    const handleReset = () => {
        if (window.confirm("Apakah Anda yakin ingin mereset formulir? Semua data yang tersimpan akan dihapus.")) {
            setFormData(INITIAL_STATE);
            storyUploads.forEach(upload => {
                if (upload && upload.previewUrl) URL.revokeObjectURL(upload.previewUrl);
            });
            setStoryUploads([]);
            localStorage.removeItem(STORAGE_KEY);
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
                loveStories: [...prev.loveStories, { imageCode: '', title: '', date: '', story: '', imageFileName: '', imageSize: 0 }]
            }));
            setStoryUploads(prev => [...prev, null]);
        }
    };

    const removeLoveStory = (index) => {
        const upload = storyUploads[index];
        if (upload && upload.previewUrl) URL.revokeObjectURL(upload.previewUrl);
        const newStories = formData.loveStories.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            loveStories: newStories
        }));
        setStoryUploads(prev => prev.filter((_, i) => i !== index));
    };

    const compressImage = (file, maxDimension = 1600, quality = 0.8) => {
        return new Promise((resolve, reject) => {
            const objectUrl = URL.createObjectURL(file);
            const image = new Image();

            image.onload = () => {
                URL.revokeObjectURL(objectUrl);

                let width = image.naturalWidth;
                let height = image.naturalHeight;

                if (width > maxDimension || height > maxDimension) {
                    const scale = Math.min(maxDimension / width, maxDimension / height);
                    width = Math.round(width * scale);
                    height = Math.round(height * scale);
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Kompresi gambar tidak didukung browser ini.'));
                    return;
                }

                ctx.drawImage(image, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Gagal mengompres foto.'));
                        return;
                    }
                    resolve(blob);
                }, 'image/jpeg', quality);
            };

            image.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Gagal membaca file gambar.'));
            };

            image.src = objectUrl;
        });
    };

    const handleStoryImageUpload = async (index, file) => {
        if (!file) return;

        const isImageMime = file.type && file.type.startsWith('image/');
        const isImageExt = /\.(jpe?g|png|webp|gif|bmp|heic|heif|avif)$/i.test(file.name || '');

        if (!isImageMime && !isImageExt) {
            setStoryUploads(prev => {
                const next = [...prev];
                next[index] = { error: 'File harus berupa gambar (JPG, PNG, WEBP, GIF, dll).' };
                return next;
            });
            return;
        }

        setStoryUploads(prev => {
            const next = [...prev];
            next[index] = { loading: true, name: file.name };
            return next;
        });

        try {
            const compressedBlob = await compressImage(file);

            if (compressedBlob.size > 5 * 1024 * 1024) {
                setStoryUploads(prev => {
                    const next = [...prev];
                    const previous = next[index];
                    if (previous && previous.previewUrl) URL.revokeObjectURL(previous.previewUrl);
                    next[index] = { error: 'Foto terlalu besar setelah kompresi (maks 5 MB).' };
                    return next;
                });
                return;
            }

            const previewUrl = URL.createObjectURL(compressedBlob);

            setStoryUploads(prev => {
                const next = [...prev];
                const previous = next[index];
                if (previous && previous.previewUrl) URL.revokeObjectURL(previous.previewUrl);
                next[index] = {
                    name: file.name,
                    originalSize: file.size,
                    size: compressedBlob.size,
                    previewUrl,
                    blob: compressedBlob
                };
                return next;
            });

            setFormData(prev => {
                const stories = [...prev.loveStories];
                stories[index] = {
                    ...stories[index],
                    imageFileName: file.name,
                    imageSize: compressedBlob.size
                };
                return { ...prev, loveStories: stories };
            });
        } catch (error) {
            setStoryUploads(prev => {
                const next = [...prev];
                next[index] = { error: error.message || 'Gagal mengompres foto.' };
                return next;
            });
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes && bytes !== 0) return '-';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Extra Event Handlers
    const handleExtraEventChange = (index, field, value) => {
        const newEvents = [...formData.extraEvents];
        newEvents[index] = {
            ...newEvents[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            extraEvents: newEvents
        }));
    };

    const addExtraEvent = () => {
        if (formData.extraEvents.length < 3) {
            setFormData(prev => ({
                ...prev,
                extraEvents: [...prev.extraEvents, { name: '', date: '', time: '', place: '', maps: '', address: '' }]
            }));
        }
    };

    const removeExtraEvent = (index) => {
        const newEvents = formData.extraEvents.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            extraEvents: newEvents
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
        setShowCopyModal(true);
    };

    // Helper to generate HTML for email (all user input is escaped)
    const generateEmailHtml = (data) => {
        const esc = escapeHtml;
        const orDash = (value) => (value === undefined || value === null || String(value).trim() === '')
            ? '-'
            : esc(value);

        const invitationName = (() => {
            const groom = (data.groomNickname || '').trim();
            const bride = (data.brideNickname || '').trim();
            const parts = data.nameOrder === 'bride' ? [bride, groom] : [groom, bride];
            return parts.filter(Boolean).join(' & ') || '-';
        })();

        const html = `
            <h2>Data Pemesan</h2>
            <p><strong>Nama:</strong> ${orDash(data.orderName)}</p>
            <p><strong>Email:</strong> ${orDash(data.orderEmail)}</p>
            <p><strong>WhatsApp:</strong> ${orDash(data.orderWhatsapp)}</p>
            <p><strong>Template:</strong> ${orDash(data.templateName)}</p>
            <p><strong>Lagu Custom:</strong> ${orDash(data.customSong)}</p>
            <hr>

            <h2>Mempelai Pria</h2>
            <p><strong>Nama Lengkap:</strong> ${orDash(data.groomName)}</p>
            <p><strong>Nama Panggilan:</strong> ${orDash(data.groomNickname)}</p>
            <p><strong>Ortu:</strong> ${orDash(data.groomFather)} &amp; ${orDash(data.groomMother)}</p>
            <p><strong>Anak Ke:</strong> ${orDash(data.groomOrderInFamily)}</p>
            <p><strong>Kontak:</strong> ${orDash(data.groomWhatsapp)} / ${orDash(data.groomInstagram)}</p>
            <hr>

            <h2>Mempelai Wanita</h2>
            <p><strong>Nama Lengkap:</strong> ${orDash(data.brideName)}</p>
            <p><strong>Nama Panggilan:</strong> ${orDash(data.brideNickname)}</p>
            <p><strong>Ortu:</strong> ${orDash(data.brideFather)} &amp; ${orDash(data.brideMother)}</p>
            <p><strong>Anak Ke:</strong> ${orDash(data.brideOrderInFamily)}</p>
            <p><strong>Kontak:</strong> ${orDash(data.brideWhatsapp)} / ${orDash(data.brideInstagram)}</p>
            <hr>

            <h2>Nama Undangan</h2>
            <p><strong>Nama:</strong> ${orDash(invitationName)}</p>
            <p><strong>Urutan:</strong> ${data.nameOrder === 'bride' ? 'Wanita dulu' : 'Pria dulu'}</p>
            <hr>

            <h2>Akad Nikah</h2>
        <p><strong>Hari/Tanggal:</strong> ${orDash(data.akadDate)}</p>
        <p><strong>Waktu:</strong> ${orDash(data.akadTime)}</p>
        <p><strong>Tempat:</strong> ${orDash(data.akadPlace)}</p>
        <p><strong>Alamat:</strong> ${orDash(data.akadAddress)}</p>
        <p><strong>Maps:</strong> ${orDash(data.akadMaps)}</p>
        <hr>

        <h2>Resepsi Pernikahan</h2>
        <p><strong>Hari/Tanggal:</strong> ${orDash(data.receptionDate)}</p>
        <p><strong>Waktu:</strong> ${orDash(data.receptionTime)}</p>
        <p><strong>Tempat:</strong> ${orDash(data.receptionPlace)}</p>
        <p><strong>Alamat:</strong> ${orDash(data.receptionAddress)}</p>
        <p><strong>Maps:</strong> ${orDash(data.receptionMaps)}</p>
        <hr>

            <h2>Informasi Acara Tambahan</h2>
            ${(data.extraEvents || []).map((event, i) => `
                <p><strong>#${i + 1} Nama Acara:</strong> ${orDash(event.name)}</p>
                <p><strong>Hari/Tanggal:</strong> ${orDash(event.date)}</p>
                <p><strong>Waktu:</strong> ${orDash(event.time)}</p>
                <p><strong>Tempat:</strong> ${orDash(event.place)}</p>
                <p><strong>Alamat:</strong> ${orDash(event.address)}</p>
                <p><strong>Maps:</strong> ${orDash(event.maps)}</p>
            `).join('')}
            <hr>

            <h2>Data Pelengkap</h2>
            <p><strong>Foto/Video Link:</strong> ${orDash(data.photoVideoLink)}</p>
            <hr>

            <h2>Amplop Digital</h2>
            <ul>
                ${(data.digitalEnvelopes || []).map((env, i) => `
                    <li><strong>#${i + 1}:</strong> ${orDash(env.bank)} ${orDash(env.number)} a.n ${orDash(env.owner)}</li>
                `).join('')}
            </ul>
            <hr>

            <h2>Love Story</h2>
            <ul>
                ${(data.loveStories || []).map((story, i) => `
                    <li>
                        <strong>#${i + 1} ${orDash(story.title) === '-' ? 'Story' : orDash(story.title)} (${orDash(story.date)})</strong><br>
                        <em>Image: ${orDash(story.imageCode)}</em><br>
                        ${story.imageFileName ? `<em>Foto Upload: ${orDash(story.imageFileName)} (terlampir di backend)</em><br>` : ''}
                        ${orDash(story.story)}
                    </li>
                `).join('')}
            </ul>
            <hr>

            <h2>Catatan Tambahan</h2>
            <p>${data.additionalNotes
                ? esc(data.additionalNotes).replace(/\r?\n/g, '<br>')
                : '-'}</p>
        `;
        return html;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submissionData = {
            ...formData,
            loveStories: formData.loveStories.map((story, index) => {
                const upload = storyUploads[index];
                return upload && upload.blob
                    ? story
                    : { ...story, imageFileName: '', imageSize: 0 };
            })
        };

        const htmlBody = generateEmailHtml(submissionData);

        const payload = {
            email_body: htmlBody,
            Data: submissionData
        };

        const hasImages = storyUploads.some(upload => upload && upload.blob);
        if (storyUploads.some(upload => upload && upload.loading)) {
            setErrorMessage('Tunggu kompresi foto selesai sebelum mengirim.');
            setSubmitStatus('error');
            return;
        }

        setSubmitStatus('loading');

        try {
            // 1. Primary Webhook
            const primaryWebhook = import.meta.env.VITE_WEBHOOK_URL;
            if (!primaryWebhook) throw new Error("Primary Webhook URL belum disetting!");

            console.log("Sending to Primary Webhook...");

            let requestBody;
            let requestHeaders;

            if (hasImages) {
                requestBody = new FormData();
                requestBody.append('payload', JSON.stringify(payload));
                storyUploads.forEach((upload, index) => {
                    if (upload && upload.blob) {
                        requestBody.append(`storyImage_${index}`, upload.blob, `story-${index}.jpg`);
                    }
                });
            } else {
                requestBody = JSON.stringify(payload);
                requestHeaders = { 'Content-Type': 'application/json' };
            }

            const primaryResponse = await fetch(primaryWebhook, {
                method: 'POST',
                headers: requestHeaders,
                body: requestBody
            });

            if (!primaryResponse.ok) {
                let serverMessage = '';
                try {
                    const errorBody = await primaryResponse.json();
                    serverMessage = errorBody && errorBody.message ? `: ${errorBody.message}` : '';
                } catch (parseError) {
                    serverMessage = '';
                }
                throw new Error(`Primary Webhook Failed: ${primaryResponse.status}${serverMessage}`);
            }

            const primaryResult = await primaryResponse.json().catch(() => null);
            if (primaryResult && Array.isArray(primaryResult.images) && primaryResult.images.length > 0) {
                console.log('Uploaded images:', primaryResult.images);
            }

            console.log("Primary Webhook Success!");

            // Explicitly save one last time on success to be 100% sure
            const finalDataToSave = {
                timestamp: Date.now(),
                data: formData
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(finalDataToSave));

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

    // Invitation name built from both nicknames, in the chosen order
    const groomNickname = (formData.groomNickname || '').trim();
    const brideNickname = (formData.brideNickname || '').trim();
    const nameParts = formData.nameOrder === 'bride'
        ? [brideNickname, groomNickname]
        : [groomNickname, brideNickname];
    const invitationName = nameParts.filter(Boolean).join(' & ');

    return (
        <div className="form-page-wrapper">
            <div className="form-container">
                {/* Copy Akad Success Modal */}
                {showCopyModal && (
                    <div
                        className="modal-overlay"
                        onClick={() => setShowCopyModal(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px',
                            zIndex: 1100
                        }}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                backgroundColor: '#ffffff',
                                padding: '2rem',
                                borderRadius: '16px',
                                maxWidth: '400px',
                                width: '100%',
                                textAlign: 'center',
                                color: 'var(--text-main)',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <div style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '50%',
                                background: 'rgba(34, 197, 94, 0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.25rem auto',
                                fontSize: '2.25rem',
                                color: '#16a34a'
                            }}>
                                ✓
                            </div>
                            <h2 style={{ marginBottom: '0.5rem', color: '#16a34a', fontSize: '1.35rem', fontWeight: '800' }}>
                                Berhasil Menyalin Data
                            </h2>
                            <p style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: 'var(--text-main)', opacity: 0.85 }}>
                                Berhasil menyalin Data Akad ke Resepsi. Silakan cek/ubah data yang telah disalin.
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowCopyModal(false)}
                                style={{
                                    background: '#1e293b',
                                    color: '#ffffff',
                                    padding: '12px 24px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
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
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.9, marginTop: '8px' }}>
                        Progres mengisi data anda tidak akan hilang apabila keluar dari halaman ini, sampai anda menekan tombol reset.
                    </p>
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
                                    placeholder="Contoh : Budi"
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
                                    placeholder="Contoh : budisaktiawan@gmail.com"
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
                                    placeholder="Contoh : 089654391849"
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
                                    readOnly={isTemplateLocked}
                                    aria-readonly={isTemplateLocked}
                                    title={isTemplateLocked ? 'Template dipilih dari katalog dan tidak dapat diubah' : undefined}
                                    required
                                    style={isTemplateLocked ? {
                                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                        cursor: 'not-allowed'
                                    } : undefined}
                                />
                                {isTemplateLocked && (
                                    <ul className="helper-list" style={{ fontSize: '0.8rem', marginTop: '8px', lineHeight: '1.4' }}>
                                        <li>
                                            Untuk mengubah template, silakan lihat{' '}
                                            <Link
                                                to="/katalog-undangan"
                                                style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'underline' }}
                                            >
                                                Katalog Template Undangan
                                            </Link>{' '}
                                            disini dan klik pesan
                                        </li>
                                    </ul>
                                )}
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
                                <li>Semua data di bawah ini <strong>bersifat opsional</strong>.</li>
                                <li>Silakan <strong>dikosongkan</strong> jika tidak ingin mengisi.</li>
                                <li>Jika tidak berkenan membagikan data atau tidak ingin mengisi, cukup <strong>biarkan kosong</strong>.</li>
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

                    {/* Nama Undangan Preview */}
                    <div className="name-preview-section">
                        <div className="labeled-divider" style={{ marginTop: 0 }}>
                            <span className="labeled-divider__line" />
                            <span className="labeled-divider__text">Contoh Nama Undangan</span>
                            <span className="labeled-divider__line" />
                        </div>

                        <div className="name-preview">
                            <p className="name-preview__eyebrow">Wedding of</p>
                            <div className={`name-preview__value${invitationName ? '' : ' is-placeholder'}`}>
                                {invitationName || 'Nama Panggilan Pria & Nama Panggilan Wanita'}
                            </div>
                            <p className="name-preview__hint">
                                Pilih urutan penulisan nama yang akan dipakai pada undangan.
                            </p>

                            <div className="name-order-switch" role="group" aria-label="Urutan nama undangan">
                                <button
                                    type="button"
                                    className={formData.nameOrder === 'bride' ? 'active' : ''}
                                    aria-pressed={formData.nameOrder === 'bride'}
                                    onClick={() => setFormData(prev => ({ ...prev, nameOrder: 'bride' }))}
                                >
                                    Wanita Dulu
                                </button>
                                <button
                                    type="button"
                                    className={formData.nameOrder === 'groom' ? 'active' : ''}
                                    aria-pressed={formData.nameOrder === 'groom'}
                                    onClick={() => setFormData(prev => ({ ...prev, nameOrder: 'groom' }))}
                                >
                                    Pria Dulu
                                </button>
                            </div>
                        </div>
                    </div>

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

                        <div className="labeled-divider">
                            <span className="labeled-divider__line" />
                            <span className="labeled-divider__text">OPSIONAL</span>
                            <span className="labeled-divider__line" />
                        </div>

                        <div className="extra-event-desc">
                            <span className="extra-event-desc__icon">ℹ️</span>
                            <p>
                                <strong>Informasi acara tambahan.</strong> Apabila resepsi dilakukan 2x di hari berbeda
                                atau acara lain seperti unduh mantu, silakan berikan informasinya dibawah sini.
                            </p>
                        </div>

                        <div className="extra-event-box">
                            <p className="helper-text">Tekan tombol tambah acara dibawah, untuk menambah acara.</p>

                            {formData.extraEvents.map((event, index) => (
                                <div key={index} className="envelope-item">
                                    <div className="envelope-header">
                                        <span>Acara Tambahan #{index + 1}</span>
                                        <button type="button" className="btn-danger-link" onClick={() => removeExtraEvent(index)}>Hapus</button>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Nama Acara</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Unduh Mantu"
                                                value={event.name}
                                                onChange={(e) => handleExtraEventChange(index, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Hari & Tanggal</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Minggu, 1 Februari 2025"
                                                value={event.date}
                                                onChange={(e) => handleExtraEventChange(index, 'date', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Waktu Acara</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: 10.00 WIB s/d Selesai"
                                                value={event.time}
                                                onChange={(e) => handleExtraEventChange(index, 'time', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nama Tempat</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Kediaman Mempelai Pria"
                                                value={event.place}
                                                onChange={(e) => handleExtraEventChange(index, 'place', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Link Google Maps</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: https://maps.app.goo.gl/..."
                                                value={event.maps}
                                                onChange={(e) => handleExtraEventChange(index, 'maps', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Alamat Lengkap</label>
                                            <textarea
                                                rows="3"
                                                placeholder="Tuliskan alamat lengkap acara tambahan"
                                                value={event.address}
                                                onChange={(e) => handleExtraEventChange(index, 'address', e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <button type="button" className="btn-secondary" onClick={addExtraEvent} disabled={formData.extraEvents.length >= 3}>
                                    + Tambah Acara
                                </button>
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
                                                <li>- Silakan berikan <strong>nama/kode </strong> foto apabila foto tersebut ada di link <strong>Google Drive / Dropbox</strong> </li>
                                            </ul>
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Upload Foto (Opsional)</label>
                                            <div className="upload-dropzone">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                    handleStoryImageUpload(index, e.target.files && e.target.files[0]);
                                                    e.target.value = '';
                                                }}
                                                />
                                                <span className="upload-dropzone__hint">📁 Pilih file gambar</span>
                                            </div>
                                            <ul className="helper-list" style={{ fontSize: '0.8rem', marginTop: '8px', lineHeight: '1.4' }}>
                                                 <li>Foto opsional, tinggalkan kosong apabila hanya ingin mengirim cerita saja</li>
                                                 <li>Maks. 5 MB per foto, otomatis dikompres ke 1600px</li>
                                            </ul>
                                            {storyUploads[index] && storyUploads[index].error && (
                                                <span className="error-text">{storyUploads[index].error}</span>
                                            )}
                                            {storyUploads[index] && storyUploads[index].loading && (
                                                <span className="upload-dropzone__file" style={{ color: 'var(--text-muted)' }}>
                                                    ⏳ Mengompres foto...
                                                </span>
                                            )}
                                            {storyUploads[index] && storyUploads[index].previewUrl && (
                                                <div className="upload-preview">
                                                    <img src={storyUploads[index].previewUrl} alt={storyUploads[index].name} />
                                                    <div className="upload-preview__info">
                                                        <span className="upload-preview__name">✅ {storyUploads[index].name}</span>
                                                        <span className="upload-preview__size">
                                                            {formatFileSize(storyUploads[index].originalSize)} → {formatFileSize(storyUploads[index].size)} (terkompresi)
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
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
