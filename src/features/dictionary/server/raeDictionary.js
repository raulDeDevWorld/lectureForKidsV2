import { RAE } from 'rae-api'

const DICTIONARY_TIMEOUT_MS = 6000

function withTimeout(promise, timeoutMs = DICTIONARY_TIMEOUT_MS) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Dictionary lookup timeout')), timeoutMs)
        }),
    ])
}

export async function getDefinition(word) {
    const normalizedWord = String(word || '').trim()

    if (!normalizedWord || normalizedWord.length > 60) {
        return ''
    }

    const rae = new RAE()
    const search = await withTimeout(rae.searchWord(normalizedWord))
    const firstResult = search.getRes()[0]

    if (!firstResult) {
        return ''
    }

    const result = await withTimeout(rae.fetchWord(firstResult.getId()))
    return result.getDefinitions()[0]?.getDefinition() || ''
}
