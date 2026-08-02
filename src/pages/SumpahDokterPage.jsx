import React, { useEffect } from 'react'

export default function SumpahDokterPage() {
    useEffect(() => {
        document.title = 'Undangan Pelantikan & Pengambilan Sumpah Dokter - UNG'

        let link = document.querySelector("link[rel*='icon']")
        if (!link) {
            link = document.createElement('link')
            link.rel = 'icon'
            document.head.appendChild(link)
        }
        link.href = '/request-page-live-same-system/sumpahdokter-fkung-2026/fkung/assets/logo-ung-CtuJnaXw.png'
    }, [])

    const iframeSrc = `/request-page-live-same-system/sumpahdokter-fkung-2026/index.html${window.location.search}`

    return (
        <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
            <iframe
                src={iframeSrc}
                title="Sumpah Dokter FKUNG 2026"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block'
                }}
            />
        </div>
    )
}
