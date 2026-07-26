import React, { useEffect } from 'react';

export default function PtKpcRsvp() {
    useEffect(() => {
        window.location.href = "https://docs.google.com/spreadsheets/d/1TW288kwiawAeuD-qM0PT5s9om1Px5PVe8gCXKuSqANw/edit?usp=sharing";
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#001735', color: '#D4AF37', fontFamily: 'sans-serif', textAlign: 'center', padding: '1rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>PT KARYA PRATAMA CARGO</h2>
            <p style={{ color: '#ffffff', opacity: 0.9 }}>Mengalihkan ke Data RSVP Google Sheets...</p>
        </div>
    );
}
