import { fabulas } from '@/db/fabulas'

export function listStories() {
    return Object.entries(fabulas).map(([id, story]) => ({
        id,
        ...story,
    }))
}

export function getStoryById(id) {
    if (!id) return null
    return fabulas[id] || null
}

export function getStoryCount() {
    return Object.keys(fabulas).length
}
