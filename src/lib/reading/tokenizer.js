import { normalizeWord } from './normalize.js'

export function tokenizeWords(text) {
    return String(text)
        .split(/\s+/)
        .map((raw) => ({ raw, normalized: normalizeWord(raw) }))
        .filter((token) => token.normalized.length > 0)
}

export function tokenizeReadingText(text) {
    const visualTokens = []
    const wordTokens = []

    String(text)
        .split(/(\s+)/)
        .forEach((raw, visualIndex) => {
            if (raw === '') return

            if (/^\s+$/.test(raw)) {
                visualTokens.push({
                    type: 'space',
                    raw,
                    visualIndex,
                })
                return
            }

            const normalized = normalizeWord(raw)
            if (!normalized) {
                visualTokens.push({
                    type: 'punctuation',
                    raw,
                    visualIndex,
                })
                return
            }

            const wordIndex = wordTokens.length
            const token = {
                type: 'word',
                raw,
                normalized,
                wordIndex,
                visualIndex,
            }

            visualTokens.push(token)
            wordTokens.push(token)
        })

    return { visualTokens, wordTokens }
}
