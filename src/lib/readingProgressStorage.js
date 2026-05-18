const PROGRESS_KEY = 'fabulas-3000:reading-progress'
const VALID_SECTIONS = new Set(['title', 'content', 'teaching', 'COMPLETE'])

export function readStoryProgress(storyId) {
    if (typeof window === 'undefined' || !storyId) return null

    try {
        const progress = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || '{}')
        const storyProgress = progress[storyId]

        if (!storyProgress || !VALID_SECTIONS.has(storyProgress.section)) {
            return null
        }

        return storyProgress
    } catch {
        return null
    }
}

export function saveStoryProgress(storyId, progress) {
    if (typeof window === 'undefined' || !storyId) return

    try {
        const current = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || '{}')
        const next = {
            ...current,
            [storyId]: {
                ...progress,
                updatedAt: new Date().toISOString(),
            },
        }

        window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next))
    } catch {
        // Storage can fail in private browsing or when quota is exceeded.
    }
}
