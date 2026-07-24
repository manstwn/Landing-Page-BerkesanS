import React from 'react'
import { useParams } from 'react-router-dom'

export default function LiveRequestPage() {
    const { folderName } = useParams()

    return (
        <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
            <iframe
                src={`/request-page-live-same-system/${folderName}/code.html`}
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
