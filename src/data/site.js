export const SITE = {
    name: 'Berkesan Studio',
    url: 'https://www.berkesanstudio.com',
    title: 'Berkesan Studio — Foto Studio & Undangan Digital',
    description: 'Jasa foto studio di Cibitung, Bekasi untuk prewedding, wedding, wisuda & keluarga. Harga terjangkau, hasil rapi, plus undangan digital. Chat via WhatsApp.',
    phone: '+62-819-1176-7289',
    phoneDisplay: '+62 819-1176-7289',
    whatsapp: '6281911767289',
    address: {
        street: '',
        locality: 'Cibitung',
        region: 'Kabupaten Bekasi, Jawa Barat',
        postalCode: '',
        country: 'ID',
    },
    addressDisplay: 'Cibitung, Kabupaten Bekasi, Jawa Barat',
    hoursDisplay: 'Senin–Minggu, 08.00–21.00 WIB',
    hours: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '21:00',
    },
    geo: { latitude: -6.246857, longitude: 107.086139 },
    socials: [
        'https://www.instagram.com/berkesanstudio',
        'https://www.tiktok.com/@berkesan.studio',
        'https://www.google.com/maps/search/?api=1&query=Berkesan+Studio+Cibitung',
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Berkesan+Studio+Cibitung',
    logo: '/website-logo.png',
    defaultImage: '/og-image.jpg',
    apiBase: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3026',
}

export function absoluteUrl(path = '/') {
    if (/^https?:\/\//.test(path)) return path
    return `${SITE.url}${path.startsWith('/') ? '' : '/'}${path}`
}
