import { getStories, getStoryById } from '@/data/fabulas'

export function listStories() {
    return getStories()
}

export { getStoryById }

export function getStoryCount() {
    return getStories().length
}
