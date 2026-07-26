import React, { useEffect } from 'react'

export default function PtKpc() {
    useEffect(() => {
        document.title = "Undangan Resmi Grand Opening - PT Karya Pratama Cargo"
        let link = document.querySelector("link[rel*='icon']")
        if (!link) {
            link = document.createElement('link')
            link.rel = 'icon'
            document.head.appendChild(link)
        }
        link.href = "/request-page-live-same-system/design2-pt-kpc/logo-pt-v2.jpg"
    }, [])

    const iframeSrc = `/request-page-live-same-system/design2-pt-kpc/code.html${window.location.search}`

    return (
        <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
            <iframe
                src={iframeSrc}
                title="Undangan Resmi Grand Opening - PT Karya Pratama Cargo"
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

