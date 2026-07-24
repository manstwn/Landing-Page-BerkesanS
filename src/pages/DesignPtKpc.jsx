import React, { useEffect } from 'react'

export default function DesignPtKpc() {
    useEffect(() => {
        document.title = "Grand Opening - PT Karya Pratama Cargo"
    }, [])

    return (
        <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
            <iframe
                src="/request-page-live-same-system/design-pt-kpc/code.html"
                title="Grand Opening - PT Karya Pratama Cargo"
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
