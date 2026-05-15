import { fabulas as rawFabulas } from '@/db/fabulas'
import { getReadingTime } from '@/lib/readingTime'
import { slugify } from '@/lib/slugify'

const fallbackImages = [
    '/stories/el-leon-y-el-raton.svg',
    '/stories/la-tortuga-y-la-liebre.svg',
    '/stories/el-pajarito-curioso.svg',
    '/stories/suenos-de-estrellas.svg',
    '/stories/placeholder-story.svg',
]

const colorOrder = ['blue', 'mint', 'peach', 'lavender', 'yellow']

const storyImageBySlug = {
    'el-leon-y-el-raton': '/stories/el-leon-y-el-raton.svg',
    'la-tortuga-y-la-liebre': '/stories/la-tortuga-y-la-liebre.svg',
}

const usedSlugs = new Set()

export const fabulas = Object.entries(rawFabulas).map(([id, story], index) => {
    const baseSlug = slugify(story.title || id) || id
    const slug = usedSlugs.has(baseSlug) ? `${baseSlug}-${id.slice(0, 8)}` : baseSlug
    const content = normalizeContent(story.content)
    const fullText = [story.title, ...content, story.teaching].filter(Boolean).join(' ')

    usedSlugs.add(slug)

    return {
        id,
        title: story.title || 'Fabula sin titulo',
        slug,
        content,
        teaching: story.teaching || '',
        category: story.category || 'Fabula',
        ageRange: story.ageRange || '4-8',
        readingTime: story.readingTime || getReadingTime(fullText),
        imageUrl: story.imageUrl || storyImageBySlug[baseSlug] || fallbackImages[index % fallbackImages.length],
        color: story.color || colorOrder[index % colorOrder.length],
    }
})

export function getStories() {
    return fabulas
}

export function getStoryBySlug(slug) {
    return fabulas.find((story) => story.slug === slug) || null
}

export function getStoryById(id) {
    return fabulas.find((story) => story.id === id) || null
}

export function getCategories() {
    return Array.from(new Set(fabulas.map((story) => story.category)))
}

function normalizeContent(content) {
    if (Array.isArray(content)) {
        return content.map((paragraph) => String(paragraph).trim()).filter(Boolean)
    }

    return String(content || '')
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
}
