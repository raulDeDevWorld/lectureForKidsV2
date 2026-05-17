import { normalizeWord } from './normalize.js'

export function normalizeTranscript(text) {
    return String(text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[.,:;'!?\u00a1\u00bf"()[\]{}]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

export function mergeTranscriptSegments(confirmedText, partialText) {
    return createTranscriptParts(confirmedText, partialText).displayText
}

export function createTranscriptParts(confirmedText, partialText) {
    const confirmed = cleanSpacing(confirmedText)
    const partial = cleanSpacing(partialText)

    if (!confirmed) {
        return createParts('', partial)
    }

    if (!partial) {
        return createParts(confirmed, '')
    }

    const confirmedTokens = tokenizeWithNormalizedWords(confirmed)
    const partialTokens = tokenizeWithNormalizedWords(partial)

    if (!confirmedTokens.length) {
        return createParts('', partial)
    }

    if (!partialTokens.length) {
        return createParts(confirmed, '')
    }

    if (startsWithTokens(partialTokens, confirmedTokens)) {
        return createParts(
            confirmed,
            partialTokens.slice(confirmedTokens.length).map((token) => token.raw).join(' ')
        )
    }

    if (startsWithTokens(confirmedTokens, partialTokens)) {
        return createParts(confirmed, '')
    }

    const overlapSize = getTokenOverlapSize(confirmedTokens, partialTokens)
    const partialSuffix = partialTokens.slice(overlapSize).map((token) => token.raw).join(' ')

    return createParts(confirmed, partialSuffix)
}

export function getTranscriptDelta(previousText, nextText) {
    const previous = cleanSpacing(previousText)
    const next = cleanSpacing(nextText)

    if (!previous || !next) return next

    const previousTokens = previous.split(/\s+/)
    const nextTokens = next.split(/\s+/)
    let sharedPrefixSize = 0

    while (
        sharedPrefixSize < previousTokens.length &&
        sharedPrefixSize < nextTokens.length &&
        normalizeTranscript(previousTokens[sharedPrefixSize]) === normalizeTranscript(nextTokens[sharedPrefixSize])
    ) {
        sharedPrefixSize += 1
    }

    if (sharedPrefixSize === previousTokens.length) {
        return nextTokens.slice(sharedPrefixSize).join(' ').trim()
    }

    const previousToken = normalizeTranscript(previousTokens[sharedPrefixSize])
    const nextToken = normalizeTranscript(nextTokens[sharedPrefixSize])

    if (nextToken.startsWith(previousToken) && previousToken.length >= 2) {
        return nextTokens.slice(sharedPrefixSize).join(' ').trim()
    }

    return next
}

export function isLikelyCarryoverTranscript(speechText, previousText) {
    const speechTokens = tokenizeNormalizedTranscript(speechText)
    const previousTokens = tokenizeNormalizedTranscript(previousText)

    if (!speechTokens.length || !previousTokens.length) return false
    if (speechTokens.length > previousTokens.length) return false

    return containsOrderedTokens(previousTokens, speechTokens)
}

function cleanSpacing(text) {
    return String(text || '').replace(/\s+/g, ' ').trim()
}

function tokenizeNormalizedTranscript(text) {
    return cleanSpacing(text)
        .split(/\s+/)
        .map((word) => normalizeTranscript(word))
        .filter(Boolean)
}

function containsOrderedTokens(haystack, needles) {
    let needleIndex = 0

    for (const token of haystack) {
        if (token === needles[needleIndex]) {
            needleIndex += 1
            if (needleIndex >= needles.length) return true
        }
    }

    return false
}

function tokenizeWithNormalizedWords(text) {
    return cleanSpacing(text)
        .split(' ')
        .map((raw) => ({
            raw,
            normalized: normalizeWord(raw),
        }))
        .filter((token) => token.normalized)
}

function createParts(stableText, unstableText) {
    const stable = cleanSpacing(stableText)
    const unstable = cleanSpacing(unstableText)

    return {
        displayText: [stable, unstable].filter(Boolean).join(' '),
        stableText: stable,
        stableWords: stable ? stable.split(' ') : [],
        unstableText: unstable,
    }
}

function startsWithTokens(tokens, prefixTokens) {
    if (prefixTokens.length > tokens.length) return false

    return prefixTokens.every((token, index) => (
        tokens[index]?.normalized === token.normalized
    ))
}

function getTokenOverlapSize(leftTokens, rightTokens) {
    const maxOverlap = Math.min(leftTokens.length, rightTokens.length)

    for (let size = maxOverlap; size > 0; size -= 1) {
        const leftSlice = leftTokens.slice(leftTokens.length - size)
        const rightSlice = rightTokens.slice(0, size)
        const matches = leftSlice.every((token, index) => (
            token.normalized === rightSlice[index]?.normalized
        ))

        if (matches) return size
    }

    return 0
}
