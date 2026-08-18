import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function LiveRequestPage() {
    const { folderName } = useParams()

    useEffect(() => {
        if (folderName === 'pt-kpc' || folderName === 'design2-pt-kpc') {
            document.title = "Undangan Resmi Grand Opening - PT Karya Pratama Cargo"
        } else if (folderName === 'fkung' || folderName === 'sumpahdokter-fkung-2026') {
            document.title = "Undangan Pelantikan & Pengambilan Sumpah Dokter - UNG"
        } else {
            document.title = folderName || "Undangan"
        }

        let link = document.querySelector("link[rel*='icon']")
        if (!link) {
            link = document.createElement('link')
            link.rel = 'icon'
            document.head.appendChild(link)
        }
        if (folderName === 'fkung' || folderName === 'sumpahdokter-fkung-2026') {
            link.href = '/request-page-live-same-system/sumpahdokter-fkung-2026/fkung/assets/logo-ung-CtuJnaXw.png'
        } else if (folderName) {
            link.href = `/request-page-live-same-system/${folderName}/logo-pt-v2.jpg`
        }
    }, [folderName])

    let srcPath = `/request-page-live-same-system/${folderName}/index.html`
    if (folderName === 'pt-kpc' || folderName === 'design2-pt-kpc' || folderName === 'design-pt-kpc') {
        srcPath = `/request-page-live-same-system/design2-pt-kpc/code.html`
    } else if (folderName === 'fkung' || folderName === 'sumpahdokter-fkung-2026') {
        srcPath = `/request-page-live-same-system/sumpahdokter-fkung-2026/index.html`
    }

    const iframeSrc = `${srcPath}${window.location.search}`

    return (
        <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', zIndex: 99999, background: '#050a18' }}>
            <iframe
                src={iframeSrc}
                title={folderName}
                allow="autoplay; fullscreen; camera; microphone"
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
