import { useCallback, useState } from 'react'

export function useDictionaryLookup() {
    const [definition, setDefinition] = useState(null)

    const closeDefinition = useCallback(() => {
        setDefinition(null)
    }, [])

    const lookupDefinition = useCallback(async (word) => {
        try {
            const response = await fetch('/api/dictionary', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word }),
            })
            const data = await response.json()

            setDefinition({
                word,
                text: data.data || 'No se encontro una definicion.',
            })
        } catch {
            setDefinition({
                word,
                text: 'No se pudo consultar el diccionario.',
            })
        }
    }, [])

    return {
        definition,
        closeDefinition,
        lookupDefinition,
    }
}
