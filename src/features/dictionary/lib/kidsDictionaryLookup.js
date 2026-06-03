import kidsDictionary from '@/data/kidsDictionary.json'

export function lookupKidsDefinition(word) {
    const normalizedWord = normalizeDictionaryWord(word)

    if (!normalizedWord) {
        return null
    }

    return kidsDictionary[normalizedWord] || null
}

export function normalizeDictionaryWord(word) {
    return String(word || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-zñü]/g, '')
}
