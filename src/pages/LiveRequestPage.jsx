import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function LiveRequestPage() {
    const { folderName } = useParams()

    useEffect(() => {
        if (folderName === 'pt-kpc' || folderName === 'design2-pt-kpc') {
            document.title = "Undangan Resmi Grand Opening - PT Karya Pratama Cargo"
        } else {
            document.title = folderName || "PT Karya Pratama Cargo"
        }

        let link = document.querySelector("link[rel*='icon']")
        if (!link) {
            link = document.createElement('link')
            link.rel = 'icon'
            document.head.appendChild(link)
        }
        if (folderName) {
            link.href = `/request-page-live-same-system/${folderName}/logo-pt-v2.jpg`
        }
    }, [folderName])

    const iframeSrc = `/request-page-live-same-system/${folderName}/code.html${window.location.search}`

    return (
        <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
            <iframe
                src={iframeSrc}
                title={folderName}
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
