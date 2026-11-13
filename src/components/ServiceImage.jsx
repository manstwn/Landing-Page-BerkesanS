import { useState } from 'react'
import useImageFallback from '../hooks/useImageFallback'

function ServiceImage({ index, alt }) {
    const [loaded, setLoaded] = useState(false)
    const { src, onError } = useImageFallback(`/layanan-kami-img/gambar${index}`)

    if (!src) return null

    return (
        <div className="highlights__media" style={loaded ? undefined : { display: 'none' }}>
            <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={onError}
            />
        </div>
    )
}

export default ServiceImage
