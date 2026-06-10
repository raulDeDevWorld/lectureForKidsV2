import { absoluteUrl, SITE_URL } from '@/lib/seo'

export const dynamic = 'force-static'

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
            },
        ],
        sitemap: absoluteUrl('/sitemap.xml'),
        host: SITE_URL,
    }
}
