export function getReadingTime(text) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.ceil(words / 90))
    return `${minutes} min`
}
