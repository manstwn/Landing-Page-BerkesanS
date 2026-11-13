import { SITE, absoluteUrl } from './site'

const CITY = (name) => ({ '@type': 'City', name })

export function localBusinessSchema() {
    const address = {
        '@type': 'PostalAddress',
        addressLocality: SITE.address.locality,
        addressRegion: SITE.address.region,
        addressCountry: SITE.address.country,
    }
    if (SITE.address.street) address.streetAddress = SITE.address.street
    if (SITE.address.postalCode) address.postalCode = SITE.address.postalCode

    return {
        '@context': 'https://schema.org',
        '@type': ['PhotographyBusiness', 'LocalBusiness'],
        '@id': `${SITE.url}/#business`,
        name: SITE.name,
        url: `${SITE.url}/`,
        description: 'Jasa foto studio dan undangan digital di Cibitung, Kabupaten Bekasi. Melayani foto prewedding, wedding, wisuda, keluarga, dan couple.',
        image: absoluteUrl(SITE.defaultImage),
        logo: absoluteUrl(SITE.logo),
        telephone: SITE.phone,
        priceRange: 'Rp',
        address,
        geo: {
            '@type': 'GeoCoordinates',
            latitude: SITE.geo.latitude,
            longitude: SITE.geo.longitude,
        },
        openingHoursSpecification: [{
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: SITE.hours.days,
            opens: SITE.hours.opens,
            closes: SITE.hours.closes,
        }],
        sameAs: SITE.socials,
        areaServed: ['Cibitung', 'Bekasi', 'Cikarang', 'Tambun', 'Jakarta Timur'].map(CITY),
    }
}

export function websiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        name: SITE.name,
        url: `${SITE.url}/`,
        inLanguage: 'id-ID',
        description: SITE.description,
        publisher: { '@id': `${SITE.url}/#business` },
    }
}

export function breadcrumbSchema(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    }
}

export function faqSchema(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
    }
}

export function productSchema(paket, category) {
    const price = Number(
        paket.promo_status && paket.promo_price ? paket.promo_price : paket.price
    )
    const images = (paket.images || []).map((img) => img.url).filter(Boolean)
    if (paket.thumbnail && !images.includes(paket.thumbnail)) images.unshift(paket.thumbnail)

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: paket.name,
        description: (paket.features || []).filter(Boolean).slice(0, 6).join('. ') || `Paket foto ${category || ''} di Berkesan Studio Cibitung, Bekasi.`.trim(),
        image: images,
        brand: { '@type': 'Brand', name: SITE.name },
        category: category || 'Paket Foto',
        offers: {
            '@type': 'Offer',
            url: absoluteUrl(`/paket-foto/${paket.id}`),
            priceCurrency: 'IDR',
            price: Number.isFinite(price) ? price : undefined,
            availability: 'https://schema.org/InStock',
            seller: { '@id': `${SITE.url}/#business` },
        },
    }
}

export function articleSchema(article) {
    const image = article.image ? absoluteUrl(article.image) : absoluteUrl(SITE.defaultImage)
    const excerpt = (article.content || [])[0] || SITE.description

    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: excerpt.length > 160 ? `${excerpt.slice(0, 157)}...` : excerpt,
        image: [image],
        datePublished: article.created_at,
        dateModified: article.updated_at || article.created_at,
        author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
        publisher: {
            '@type': 'Organization',
            name: SITE.name,
            logo: { '@type': 'ImageObject', url: absoluteUrl(SITE.logo) },
        },
        mainEntityOfPage: absoluteUrl(`/artikel/${article.slug}`),
        inLanguage: 'id-ID',
    }
}

export function itemListSchema(items, name) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteUrl(item.path),
            name: item.name,
        })),
    }
}
