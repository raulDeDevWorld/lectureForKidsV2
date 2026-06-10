export const SITE_NAME = 'Lectorin'
export const SITE_URL = 'https://lectorin.com'
export const SITE_LOCALE = 'es_BO'
export const SITE_LANGUAGE = 'es-BO'
export const BRAND_LOGO_PATH = '/logo-lectorin-512.png'
export const DEFAULT_TITLE = 'Lectorin | Aprende a leer con cuentos, voz y juegos'
export const DEFAULT_DESCRIPTION =
    'Lectorin ayuda a ninos a aprender a leer con cuentos infantiles, fabulas, lectura en voz alta, vocales, letras, numeros, silabas y practica guiada.'
export const OG_IMAGE_PATH = '/og-lectorin.webp'
export const DEFAULT_OG_IMAGE_ALT = 'Lectorin - aprende a leer con cuentos y juegos'

export const DEFAULT_KEYWORDS = [
    'aprender a leer',
    'ensenar a leer',
    'lectura infantil',
    'cuentos infantiles',
    'fabulas infantiles',
    'leer en voz alta',
    'vocales para ninos',
    'abecedario para ninos',
    'silabas para ninos',
    'numeros para ninos',
    'app educativa infantil',
]

export const defaultOgImage = {
    url: OG_IMAGE_PATH,
    width: 1200,
    height: 630,
    alt: DEFAULT_OG_IMAGE_ALT,
}

export const noIndexRobots = {
    index: false,
    follow: false,
    googleBot: {
        index: false,
        follow: false,
    },
}

export function absoluteUrl(path = '/') {
    if (!path) return SITE_URL
    if (/^https?:\/\//i.test(path)) return path

    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return new URL(normalizedPath, SITE_URL).toString()
}

export function createJsonLdScript(data) {
    return {
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }
}

export function createPageMetadata({
    title,
    description = DEFAULT_DESCRIPTION,
    path = '/',
    type = 'website',
    images = [defaultOgImage],
    keywords = [],
    robots,
} = {}) {
    const pageTitle = title || DEFAULT_TITLE
    const canonical = absoluteUrl(path)
    const pageDescription = normalizeDescription(description)
    const ogTitle = pageTitle === DEFAULT_TITLE ? DEFAULT_TITLE : `${pageTitle} | ${SITE_NAME}`
    const ogImages = normalizeImages(images)

    return {
        title: pageTitle,
        description: pageDescription,
        keywords: Array.from(new Set([...DEFAULT_KEYWORDS, ...keywords])),
        alternates: {
            canonical,
            languages: {
                es: canonical,
                'es-BO': canonical,
            },
        },
        authors: [{ name: SITE_NAME, url: SITE_URL }],
        creator: SITE_NAME,
        publisher: SITE_NAME,
        category: 'education',
        classification: 'Educacion infantil',
        openGraph: {
            title: ogTitle,
            description: pageDescription,
            url: canonical,
            siteName: SITE_NAME,
            locale: SITE_LOCALE,
            type,
            images: ogImages,
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle,
            description: pageDescription,
            images: ogImages.map((image) => image.url),
        },
        ...(robots ? { robots } : {}),
    }
}

export const siteJsonLd = [
    {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': absoluteUrl('/#organization'),
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
            '@type': 'ImageObject',
            url: absoluteUrl(BRAND_LOGO_PATH),
            width: 512,
            height: 512,
        },
        image: absoluteUrl(BRAND_LOGO_PATH),
    },
    {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': absoluteUrl('/#website'),
        name: SITE_NAME,
        url: SITE_URL,
        publisher: {
            '@id': absoluteUrl('/#organization'),
        },
        inLanguage: SITE_LANGUAGE,
        description: DEFAULT_DESCRIPTION,
    },
    {
        '@context': 'https://schema.org',
        '@type': ['SoftwareApplication', 'WebApplication'],
        '@id': absoluteUrl('/#app'),
        name: SITE_NAME,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: SITE_URL,
        image: absoluteUrl(OG_IMAGE_PATH),
        inLanguage: SITE_LANGUAGE,
        description: DEFAULT_DESCRIPTION,
        publisher: {
            '@id': absoluteUrl('/#organization'),
        },
    },
]

export function createBreadcrumbJsonLd(items = []) {
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

export function createItemListJsonLd({ name, description, path, items = [] }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        description,
        url: absoluteUrl(path),
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            url: absoluteUrl(item.path),
            ...(item.image ? { image: absoluteUrl(item.image) } : {}),
        })),
    }
}

export function createStoryJsonLd(story) {
    const url = absoluteUrl(`/cuentos/${story.slug}/`)

    return {
        '@context': 'https://schema.org',
        '@type': ['LearningResource', 'CreativeWork'],
        '@id': `${url}#story`,
        name: story.title,
        headline: story.title,
        description: story.teaching || DEFAULT_DESCRIPTION,
        mainEntityOfPage: url,
        image: absoluteUrl(story.imageUrl),
        thumbnailUrl: absoluteUrl(story.imageUrl),
        url,
        isPartOf: {
            '@id': absoluteUrl('/#website'),
        },
        inLanguage: SITE_LANGUAGE,
        genre: 'Fabula infantil',
        about: [story.category, 'lectura infantil', 'moraleja'].filter(Boolean),
        keywords: [story.title, story.category, 'cuento infantil', 'fabula infantil', 'aprender a leer'].filter(Boolean),
        learningResourceType: 'Cuento infantil',
        educationalUse: ['Lectura guiada', 'Comprension lectora'],
        educationalLevel: 'Educacion inicial',
        isAccessibleForFree: true,
        audience: {
            '@type': 'EducationalAudience',
            educationalRole: 'student',
        },
        publisher: {
            '@id': absoluteUrl('/#organization'),
        },
    }
}

export function createLearningModuleJsonLd(learningModule) {
    return {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        '@id': `${absoluteUrl(`/aprender/${learningModule.id}/`)}#learning-resource`,
        name: `${learningModule.title} para aprender a leer`,
        description: learningModule.prompt,
        url: absoluteUrl(`/aprender/${learningModule.id}/`),
        mainEntityOfPage: absoluteUrl(`/aprender/${learningModule.id}/`),
        image: absoluteUrl(learningModule.items?.[0]?.imageUrl || OG_IMAGE_PATH),
        inLanguage: SITE_LANGUAGE,
        learningResourceType: 'Actividad educativa infantil',
        educationalUse: 'Practica de lectura',
        educationalLevel: 'Educacion inicial',
        isAccessibleForFree: true,
        teaches: [
            learningModule.title,
            ...((learningModule.items || []).slice(0, 12).map((item) => item.example || item.word).filter(Boolean)),
        ],
        audience: {
            '@type': 'EducationalAudience',
            educationalRole: 'student',
        },
        provider: {
            '@id': absoluteUrl('/#organization'),
        },
    }
}

function normalizeDescription(description) {
    const value = String(description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim()

    if (value.length <= 160) return value

    return `${value.slice(0, 157).trim()}...`
}

function normalizeImages(images) {
    const imageList = Array.isArray(images) ? images : [images]

    return imageList.map((image) => {
        if (typeof image === 'string') {
            return {
                ...defaultOgImage,
                url: absoluteUrl(image),
            }
        }

        return {
            ...defaultOgImage,
            ...image,
            url: absoluteUrl(image.url || defaultOgImage.url),
        }
    })
}
