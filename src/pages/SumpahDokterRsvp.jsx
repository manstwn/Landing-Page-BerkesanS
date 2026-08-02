import React, { useEffect } from 'react';

export default function SumpahDokterRsvp() {
    useEffect(() => {
        window.location.href = "https://docs.google.com/spreadsheets/d/1JaByswPGcLU0jKZecpOKqQDaus7zrLaFSSllu9YfXEY/edit?usp=sharing";
    }, []);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#ffffff', color: '#64748b', fontFamily: 'system-ui, -apple-system, sans-serif', textAlign: 'center' }}>
            <p style={{ fontSize: '0.95rem' }}>Mengalihkan ke data RSVP...</p>
        </div>
    );
}
