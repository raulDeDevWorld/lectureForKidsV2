import { useCallback, useRef } from 'react'
import Speech from 'speak-tts'

export function useSpeechPlayback() {
    const speechRef = useRef(null)

    return useCallback((text) => {
        if (!speechRef.current) {
            speechRef.current = new Speech()
        }

        const speech = speechRef.current
        if (!speech.hasBrowserSupport()) return

        speech
            .init({
                volume: 1,
                lang: 'es-US',
                rate: 1.25,
                pitch: 0.9,
                splitSentences: true,
            })
            .then(() => speech.speak({ text, queue: false }))
            .catch(() => {})
    }, [])
}
