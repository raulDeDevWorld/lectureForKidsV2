'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const UNSUPPORTED_ERROR = 'El reconocimiento de voz no esta disponible en este navegador.'

function hasSpeechRecognitionSupport() {
    if (typeof window === 'undefined') return true
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
}

export function useBrowserSpeechRecognition({ lang = 'es-MX' } = {}) {
    const recognitionRef = useRef(null)
    const shouldListenRef = useRef(false)
    const [error, setError] = useState(() => (hasSpeechRecognitionSupport() ? '' : UNSUPPORTED_ERROR))
    const [interimResult, setInterimResult] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [results, setResults] = useState([])

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

        if (!SpeechRecognition) {
            return undefined
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = lang
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
            setError('')
            setIsRecording(true)
        }

        recognition.onresult = (event) => {
            let interimText = ''
            const finalResults = []

            for (let index = event.resultIndex; index < event.results.length; index += 1) {
                const transcript = event.results[index][0]?.transcript?.trim()
                if (!transcript) continue

                if (event.results[index].isFinal) {
                    finalResults.push({
                        transcript,
                        timestamp: Math.floor(Date.now() / 1000),
                    })
                } else {
                    interimText = `${interimText} ${transcript}`.trim()
                }
            }

            setInterimResult(interimText)

            if (finalResults.length) {
                setResults((previous) => [...previous, ...finalResults])
            }
        }

        recognition.onerror = (event) => {
            if (event.error === 'no-speech') return

            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                shouldListenRef.current = false
                setError('Permiso de microfono denegado.')
            } else {
                setError(`Error de reconocimiento: ${event.error}`)
            }
        }

        recognition.onend = () => {
            setIsRecording(false)

            if (!shouldListenRef.current) return

            window.setTimeout(() => {
                try {
                    recognition.start()
                } catch {
                    // The browser can throw if a new recognition cycle is already starting.
                }
            }, 250)
        }

        recognitionRef.current = recognition

        return () => {
            shouldListenRef.current = false
            recognition.onend = null
            recognition.stop()
            recognitionRef.current = null
        }
    }, [lang])

    const startSpeechToText = useCallback(() => {
        const recognition = recognitionRef.current
        if (!recognition) return

        shouldListenRef.current = true
        setError('')

        try {
            recognition.start()
        } catch {
            // start() throws when recognition is already active; in that case the session is usable.
        }
    }, [])

    const stopSpeechToText = useCallback(() => {
        const recognition = recognitionRef.current
        shouldListenRef.current = false
        setInterimResult('')

        if (!recognition) return

        try {
            recognition.stop()
        } catch {
            setIsRecording(false)
        }
    }, [])

    return {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    }
}
