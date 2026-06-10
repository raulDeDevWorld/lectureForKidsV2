import { getStories } from '@/data/fabulas'
import { levelOneModules } from '@/data/learningLevelOne'
import { absoluteUrl } from '@/lib/seo'

export const dynamic = 'force-static'

const staticRoutes = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/cuentos/', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/aprender/', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/practicar/', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/precios/', changeFrequency: 'monthly', priority: 0.45 },
]

export default function sitemap() {
    const lastModified = new Date()
    const learningRoutes = levelOneModules.map((learningModule) => ({
        url: absoluteUrl(`/aprender/${learningModule.id}/`),
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.82,
    }))
    const storyRoutes = getStories().map((story) => ({
        url: absoluteUrl(`/cuentos/${story.slug}/`),
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.72,
    }))

    return [
        ...staticRoutes.map((route) => ({
            url: absoluteUrl(route.path),
            lastModified,
            changeFrequency: route.changeFrequency,
            priority: route.priority,
        })),
        ...learningRoutes,
        ...storyRoutes,
    ]
}
