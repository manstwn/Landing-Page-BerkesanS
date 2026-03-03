import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './InfiniteMarquee.css'

// --- drag / swipe helpers ---
function useDragScroll({ trackRef, offsetRef, pausedRef, manualPauseRef, lastTimeRef }) {
    const dragRef = useRef({ active: false, startX: 0, lastX: 0, velocity: 0, lastTime: 0 })

    const getHalfWidth = () => {
        const el = trackRef.current
        return el ? el.scrollWidth / 2 : 0
    }

    const applyOffset = (delta) => {
        const el = trackRef.current
        if (!el) return
        const halfWidth = getHalfWidth()
        offsetRef.current += delta
        if (offsetRef.current >= halfWidth) offsetRef.current -= halfWidth
        if (offsetRef.current < 0) offsetRef.current += halfWidth
        el.style.transform = `translateX(-${offsetRef.current}px)`
    }

    const onDragStart = useCallback((clientX) => {
        dragRef.current = { active: true, startX: clientX, lastX: clientX, velocity: 0, lastTime: performance.now() }
        pausedRef.current = true
        manualPauseRef.current = true
    }, [pausedRef, manualPauseRef])

    const onDragMove = useCallback((clientX) => {
        if (!dragRef.current.active) return
        const now = performance.now()
        const dt = (now - dragRef.current.lastTime) / 1000 || 0.016
        const delta = clientX - dragRef.current.lastX
        dragRef.current.velocity = delta / dt
        dragRef.current.lastX = clientX
        dragRef.current.lastTime = now
        applyOffset(-delta) // drag right → scroll right (offset increases)
    }, [])

    const onDragEnd = useCallback(() => {
        if (!dragRef.current.active) return
        dragRef.current.active = false

        // momentum / flick
        let velocity = -dragRef.current.velocity // px/s, positive = scrolling forward
        const DAMPING = 0.92
        const MIN_V = 10

        const momentum = () => {
            if (Math.abs(velocity) < MIN_V) {
                // resume auto-scroll after a short rest
                setTimeout(() => {
                    manualPauseRef.current = false
                    pausedRef.current = false
                    lastTimeRef.current = null
                }, 400)
                return
            }
            applyOffset(velocity * 0.016)
            velocity *= DAMPING
            requestAnimationFrame(momentum)
        }
        requestAnimationFrame(momentum)
    }, [manualPauseRef, pausedRef, lastTimeRef])

    // Mouse events
    const onMouseDown = useCallback((e) => { onDragStart(e.clientX) }, [onDragStart])
    const onMouseMove = useCallback((e) => { onDragMove(e.clientX) }, [onDragMove])
    const onMouseUp = useCallback(() => { onDragEnd() }, [onDragEnd])
    const onMouseLeave = useCallback(() => {
        if (dragRef.current.active) onDragEnd()
        else { pausedRef.current = false; lastTimeRef.current = null }
    }, [onDragEnd, pausedRef, lastTimeRef])

    // Touch events
    const onTouchStart = useCallback((e) => { onDragStart(e.touches[0].clientX) }, [onDragStart])
    const onTouchMove = useCallback((e) => { onDragMove(e.touches[0].clientX) }, [onDragMove])
    const onTouchEnd = useCallback(() => { onDragEnd() }, [onDragEnd])

    return { onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onTouchStart, onTouchMove, onTouchEnd, dragRef }
}

// Fisher-Yates shuffle
function shuffle(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

// Robust IDR formatter
function formatIDR(val) {
    const num = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9]/g, ''))
    if (!isNaN(num) && num > 0) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', maximumFractionDigits: 0
        }).format(num)
    }
    return val ?? '-'
}

function FotoCard({ id, image, name, price }) {
    return (
        <div className="marquee-card">
            <div className="marquee-card__img">
                {image
                    ? <img src={image} alt={name} loading="lazy" />
                    : <div className="marquee-card__img-placeholder">📸</div>
                }
            </div>
            <div className="marquee-card__info">
                <p className="marquee-card__name">{name}</p>
                <p className="marquee-card__price">{formatIDR(price)}</p>
                <Link
                    to={`/paket-foto/${id}`}
                    className="marquee-card__btn"
                    onClick={e => e.stopPropagation()}
                >
                    Lihat Detail →
                </Link>
            </div>
        </div>
    )
}

function UndanganCard({ image, name, price, demoUrl }) {
    return (
        <div className="marquee-card">
            <div className="marquee-card__img">
                {image
                    ? <img src={image} alt={name} loading="lazy" />
                    : <div className="marquee-card__img-placeholder">💌</div>
                }
            </div>
            <div className="marquee-card__info">
                <p className="marquee-card__name">{name}</p>
                <p className="marquee-card__price">{formatIDR(price)}</p>
                {demoUrl && (
                    <a
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="marquee-card__btn"
                        onClick={e => e.stopPropagation()}
                    >
                        👁 Demo →
                    </a>
                )}
            </div>
        </div>
    )
}

// Shared in-memory cache
const _cache = {}

async function fetchFoto() {
    if (_cache.foto) return _cache.foto
    const res = await fetch(import.meta.env.VITE_API_PAKET_FOTO || 'http://localhost:3000/paket-foto')
    if (!res.ok) throw new Error('Failed to fetch paket foto')
    const categories = await res.json()
    const items = []
    categories.forEach(cat => {
        (cat.packages || []).forEach(pkg => {
            items.push({ id: pkg.id, image: pkg.thumbnail || null, name: pkg.name, price: pkg.price })
        })
    })
    _cache.foto = items
    return items
}

async function fetchUndangan() {
    if (_cache.undangan) return _cache.undangan
    const res = await fetch(import.meta.env.VITE_API_KATALOG_UNDANGAN || 'http://localhost:3000/katalog-undangan')
    if (!res.ok) throw new Error('Failed to fetch katalog undangan')
    const categories = await res.json()
    const items = []
    categories.forEach(cat => {
        (cat.items || []).forEach(item => {
            items.push({
                id: item.id,
                image: item.thumbnail || null,
                name: item.name,
                price: item.price,
                demoUrl: item.demo_url || null,
            })
        })
    })
    _cache.undangan = items
    return items
}

// px per second for auto-scroll — constant speed regardless of item count
const SCROLL_SPEED = 60  // px/s
const CARD_WIDTH = 220   // px, must match CSS
const CARD_GAP = 16      // px, must match CSS
const CARD_STEP = CARD_WIDTH + CARD_GAP

/**
 * @param {'foto' | 'undangan'} type
 * @param {'left' | 'right'} direction
 */
export default function InfiniteMarquee({ type = 'foto', direction = 'left' }) {
    const [original, setOriginal] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // offset in px — positive = scrolled right, we'll apply negative translateX
    const offsetRef = useRef(0)
    const rafRef = useRef(null)
    const lastTimeRef = useRef(null)
    const trackRef = useRef(null)
    const pausedRef = useRef(false)  // hover pause
    const manualPauseRef = useRef(false) // after manual click, pause briefly

    const drag = useDragScroll({ trackRef, offsetRef, pausedRef, manualPauseRef, lastTimeRef })
    const shellRef = useRef(null)

    // Non-passive touchmove so we can preventDefault (blocks page scroll while swiping)
    useEffect(() => {
        const el = shellRef.current
        if (!el) return
        const handler = (e) => {
            if (drag.dragRef.current.active) {
                e.preventDefault()
                drag.onTouchMove(e)
            }
        }
        el.addEventListener('touchmove', handler, { passive: false })
        return () => el.removeEventListener('touchmove', handler)
    }, [drag])

    useEffect(() => {
        const fetcher = type === 'foto' ? fetchFoto : fetchUndangan
        fetcher()
            .then(items => setOriginal(shuffle(items)))
            .catch(e => { console.error(e); setError(e.message) })
            .finally(() => setLoading(false))
    }, [type])

    // --- Animation loop ---
    const animate = useCallback((timestamp) => {
        if (!trackRef.current) return

        if (!lastTimeRef.current) lastTimeRef.current = timestamp
        const dt = (timestamp - lastTimeRef.current) / 1000 // seconds
        lastTimeRef.current = timestamp

        if (!pausedRef.current && !manualPauseRef.current) {
            const speed = window.innerWidth <= 768 ? 30 : SCROLL_SPEED
            const step = speed * dt * (direction === 'right' ? -1 : 1)
            offsetRef.current += step

            // Total width of ONE copy (half the doubled track)
            const el = trackRef.current
            const halfWidth = el.scrollWidth / 2
            // Wrap offset
            if (offsetRef.current >= halfWidth) offsetRef.current -= halfWidth
            if (offsetRef.current < 0) offsetRef.current += halfWidth

            el.style.transform = `translateX(-${offsetRef.current}px)`
        }

        rafRef.current = requestAnimationFrame(animate)
    }, [direction])

    useEffect(() => {
        if (original.length === 0) return
        rafRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafRef.current)
    }, [original, animate])

    // --- Manual nav ---
    const scrollBy = useCallback((cards) => {
        const target = offsetRef.current + cards * CARD_STEP
        const el = trackRef.current
        if (!el) return

        // Brief pause then resume
        manualPauseRef.current = true
        const stepCount = Math.abs(cards)
        const stepDir = cards > 0 ? 1 : -1
        let moved = 0

        const smoothStep = () => {
            if (moved >= stepCount * CARD_STEP) {
                setTimeout(() => { manualPauseRef.current = false }, 1200)
                return
            }
            const delta = Math.min(12, stepCount * CARD_STEP - moved)
            offsetRef.current += delta * stepDir
            moved += delta

            // Wrap
            const halfWidth = el.scrollWidth / 2
            if (offsetRef.current >= halfWidth) offsetRef.current -= halfWidth
            if (offsetRef.current < 0) offsetRef.current += halfWidth

            el.style.transform = `translateX(-${offsetRef.current}px)`
            requestAnimationFrame(smoothStep)
        }
        smoothStep()
    }, [])

    if (loading) {
        return (
            <div className="marquee-shell marquee-shell--skeleton">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="marquee-card marquee-card--skeleton" />
                ))}
            </div>
        )
    }

    if (error || !original.length) {
        return (
            <div className="marquee-shell marquee-shell--empty">
                <p>Data belum tersedia.</p>
            </div>
        )
    }

    // Render each card twice for seamless loop
    const doubled = [...original, ...original]
    const CardComp = type === 'foto' ? FotoCard : UndanganCard

    return (
        <div className="marquee-outer">
            {/* Prev button */}
            <button
                className="marquee-nav marquee-nav--prev"
                onClick={() => scrollBy(-1)}
                aria-label="Sebelumnya"
            >
                ‹
            </button>

            <div
                ref={shellRef}
                className="marquee-shell"
                onMouseDown={drag.onMouseDown}
                onMouseMove={drag.onMouseMove}
                onMouseUp={drag.onMouseUp}
                onMouseLeave={drag.onMouseLeave}
                onTouchStart={drag.onTouchStart}
                onTouchEnd={drag.onTouchEnd}
                style={{ cursor: 'grab' }}
            >
                <div
                    ref={trackRef}
                    className="marquee-track marquee-track--js"
                    style={{ transform: 'translateX(0)' }}
                >
                    {doubled.map((c, i) => <CardComp key={i} {...c} />)}
                </div>
            </div>

            {/* Next button */}
            <button
                className="marquee-nav marquee-nav--next"
                onClick={() => scrollBy(1)}
                aria-label="Berikutnya"
            >
                ›
            </button>
        </div>
    )
}
