import { readdirSync } from 'node:fs'
import path from 'node:path'
import { fabulas as rawFabulas } from '@/db/fabulas'
import { getReadingTime } from '@/lib/readingTime'
import { slugify } from '@/lib/slugify'

const fallbackImages = [
    '/stories/el_leon_y_el_raton.webp',
    '/stories/la_liebre_y_la_tortuga.webp',
    '/stories/la_zorra_y_las_uvas.webp',
    '/stories/la_hormiga_y_la_cigarra.webp',
    '/stories/el_cuervo_y_la_jarra.webp',
]

const colorOrder = ['blue', 'mint', 'peach', 'lavender', 'yellow']
const storyImageExtensions = ['webp', 'png', 'jpg', 'jpeg', 'svg']
const storyImageFilenames = getStoryImageFilenames()

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
        imageUrl: story.imageUrl || getStoryImageUrl(baseSlug, index),
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

function getStoryImageUrl(baseSlug, index) {
    const filenameBase = baseSlug.replaceAll('-', '_')
    const filename = storyImageExtensions
        .map((extension) => `${filenameBase}.${extension}`)
        .find((candidate) => storyImageFilenames.has(candidate))

    return filename ? `/stories/${filename}` : fallbackImages[index % fallbackImages.length]
}

function getStoryImageFilenames() {
    try {
        return new Set(readdirSync(path.join(process.cwd(), 'public', 'stories')))
    } catch {
        return new Set()
    }
}
