const DEFAULT_MAX_LOOKAHEAD = 8
const DEFAULT_PARTIAL_MAX_LOOKAHEAD = 4

export function findBestMatch(wordTokens, currentIndex, heard, options = {}) {
    const maxLookahead = options.maxLookahead ?? DEFAULT_MAX_LOOKAHEAD
    const maxIndex = Math.min(wordTokens.length - 1, currentIndex + maxLookahead)

    for (let index = currentIndex; index <= maxIndex; index += 1) {
        const expected = wordTokens[index]?.normalized
        const score = getWordMatchScore(expected, heard)
        const isCurrent = index === currentIndex

        if (!isCurrent && String(heard).length <= 3) continue
        if (score >= 1) return { index, score, source: 'exact' }
        if (isCurrent && score >= 0.8) return { index, score, source: 'fuzzy' }
        if (!isCurrent && score >= 0.9) return { index, score, source: 'lookahead' }
    }

    return null
}

export function getWordMatchScore(expected, heard) {
    if (!expected || !heard) return 0
    if (expected === heard) return 1

    const shortest = Math.min(expected.length, heard.length)
    const longest = Math.max(expected.length, heard.length)

    if (shortest <= 3) return 0

    if (expected.startsWith(heard) && heard.length >= 4 && expected.length - heard.length <= 2) {
        return 0.82
    }

    if (heard.startsWith(expected) && expected.length >= 4 && heard.length - expected.length <= 2) {
        return 0.82
    }

    const distance = levenshteinDistance(expected, heard)
    if (longest >= 7 && distance <= 2) return 0.84
    if (longest >= 4 && distance <= 1) return 0.86

    return 0
}

export function getPartialWordMatchScore(expected, heard) {
    if (!expected || !heard) return 0
    if (expected === heard) return 1
    if (expected.length <= 3 || heard.length < 2) return 0
    if (!expected.startsWith(heard)) return 0

    const coverage = heard.length / expected.length
    if (coverage >= 0.75) return 0.74
    if (coverage >= 0.5) return 0.62

    return 0.5
}

export function findPartialLookaheadMatch(wordTokens, currentIndex, heard, options = {}) {
    const maxLookahead = options.maxLookahead ?? DEFAULT_PARTIAL_MAX_LOOKAHEAD
    const maxIndex = Math.min(wordTokens.length - 1, currentIndex + maxLookahead)

    for (let index = currentIndex + 1; index <= maxIndex; index += 1) {
        const expected = wordTokens[index]?.normalized
        const score = getPartialWordMatchScore(expected, heard)

        if (score > 0) {
            return { index, score, source: 'partial-lookahead' }
        }
    }

    return null
}

export function levenshteinDistance(a, b) {
    const previous = Array.from({ length: b.length + 1 }, (_, index) => index)
    const current = Array.from({ length: b.length + 1 }, () => 0)

    for (let i = 1; i <= a.length; i += 1) {
        current[0] = i

        for (let j = 1; j <= b.length; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1
            current[j] = Math.min(
                current[j - 1] + 1,
                previous[j] + 1,
                previous[j - 1] + cost
            )
        }

        for (let j = 0; j <= b.length; j += 1) {
            previous[j] = current[j]
        }
    }

    return previous[b.length]
}
