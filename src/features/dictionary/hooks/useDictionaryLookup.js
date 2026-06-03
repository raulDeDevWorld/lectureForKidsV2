import { useCallback, useState } from 'react'
import { lookupKidsDefinition } from '@/features/dictionary/lib/kidsDictionaryLookup'

export function useDictionaryLookup() {
    const [definition, setDefinition] = useState(null)

    const closeDefinition = useCallback(() => {
        setDefinition(null)
    }, [])

    const lookupDefinition = useCallback((word) => {
        const dictionaryEntry = lookupKidsDefinition(word)

        setDefinition({
            word: dictionaryEntry?.word || word,
            text: dictionaryEntry?.definition || 'Aun no tenemos una definicion para esta palabra.',
        })
    }, [])

    return {
        definition,
        closeDefinition,
        lookupDefinition,
    }
}
