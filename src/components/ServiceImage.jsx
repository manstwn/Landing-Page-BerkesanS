import useImageFallback from '../hooks/useImageFallback'

function ServiceImage({ index, alt }) {
    const { src, exhausted, onError } = useImageFallback(`/layanan-kami-img/gambar${index}`)

    return (
        <div
            className={`highlights__media${exhausted ? ' highlights__media--placeholder' : ''}`}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onError={onError}
                />
            ) : (
                <span className="highlights__media-hint">Gambar</span>
            )}
        </div>
    )
}

export default ServiceImage
