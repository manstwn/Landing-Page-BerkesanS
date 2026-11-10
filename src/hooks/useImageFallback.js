import { useState } from 'react'

const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

export default function useImageFallback(base) {
    const [attempt, setAttempt] = useState(0)
    const exhausted = attempt >= EXTENSIONS.length

    return {
        src: exhausted ? null : `${base}.${EXTENSIONS[attempt]}`,
        exhausted,
        onError: () => setAttempt((a) => a + 1),
    }
}
