import { useEffect } from 'react'
import { SITE, absoluteUrl } from '../data/site'

function setMeta(attr, key, content) {
    if (content === undefined || content === null) return
    let el = document.head.querySelector(`meta[${attr}="${key}"]`)
    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
    }
    el.setAttribute('content', content)
}

function setLink(rel, href) {
    let el = document.head.querySelector(`link[rel="${rel}"]`)
    if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
    }
    el.setAttribute('href', href)
}

export function toJsonLdPayload(jsonLd) {
    if (!jsonLd) return null
    if (Array.isArray(jsonLd)) {
        return {
            '@context': 'https://schema.org',
            '@graph': jsonLd.map((schema) => {
                const { '@context': _context, ...rest } = schema
                return rest
            }),
        }
    }
    return jsonLd
}

export default function Seo({ title, description, canonical, robots, image, type, jsonLd }) {
    useEffect(() => {
        if (title) document.title = title
        if (description) setMeta('name', 'description', description)
        if (robots) setMeta('name', 'robots', robots)

        if (canonical) {
            const resolvedCanonical = absoluteUrl(canonical)
            setLink('canonical', resolvedCanonical)
            setMeta('property', 'og:url', resolvedCanonical)
        }

        if (image) {
            const resolvedImage = absoluteUrl(image)
            setMeta('property', 'og:image', resolvedImage)
            setMeta('name', 'twitter:image', resolvedImage)
        }

        if (title) {
            setMeta('property', 'og:title', title)
            setMeta('name', 'twitter:title', title)
        }
        if (description) {
            setMeta('property', 'og:description', description)
            setMeta('name', 'twitter:description', description)
        }
        if (type) setMeta('property', 'og:type', type)

        setMeta('property', 'og:site_name', SITE.name)
        setMeta('property', 'og:locale', 'id_ID')

        let script = document.getElementById('seo-jsonld')
        const payload = toJsonLdPayload(jsonLd)
        if (payload) {
            if (!script) {
                script = document.createElement('script')
                script.id = 'seo-jsonld'
                script.type = 'application/ld+json'
                document.head.appendChild(script)
            }
            script.textContent = JSON.stringify(payload)
        } else if (script) {
            script.remove()
        }
    }, [title, description, canonical, robots, image, type, jsonLd])

    return null
}
