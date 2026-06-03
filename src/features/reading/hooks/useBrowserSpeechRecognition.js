'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getTranscriptDelta, normalizeTranscript } from '@/lib/reading/transcript'

const UNSUPPORTED_ERROR = 'El reconocimiento de voz no esta disponible en este navegador.'
const RESTART_RECOGNITION_DELAY_MS = 350
const BLOCKING_RECOGNITION_ERRORS = new Set(['not-allowed', 'service-not-allowed'])

function hasSpeechRecognitionSupport() {
    if (typeof window === 'undefined') return true
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
}

export function useBrowserSpeechRecognition({
    lang = 'es-MX',
    onFinalResult,
    onInterimResult,
    resetKey,
} = {}) {
    const recognitionRef = useRef(null)
    const restartTimeoutRef = useRef(null)
    const shouldListenRef = useRef(false)
    const lastInterimTranscriptRef = useRef('')
    const onFinalResultRef = useRef(onFinalResult)
    const onInterimResultRef = useRef(onInterimResult)
    const [error, setError] = useState(() => (hasSpeechRecognitionSupport() ? '' : UNSUPPORTED_ERROR))
    const [interimResult, setInterimResult] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [results, setResults] = useState([])

    useEffect(() => {
        onFinalResultRef.current = onFinalResult
    }, [onFinalResult])

    useEffect(() => {
        onInterimResultRef.current = onInterimResult
    }, [onInterimResult])

    useEffect(() => {
        lastInterimTranscriptRef.current = ''
    }, [resetKey])

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

            if (interimText) {
                const speechDelta = getTranscriptDelta(lastInterimTranscriptRef.current, interimText)
                lastInterimTranscriptRef.current = interimText
                if (speechDelta) {
                    onInterimResultRef.current?.(speechDelta)
                }
            }

            setInterimResult(interimText)

            if (finalResults.length) {
                const finalSpeech = finalResults.map((result) => result.transcript).join(' ').trim()
                const wasAlreadyProcessedAsInterim = (
                    lastInterimTranscriptRef.current &&
                    normalizeTranscript(lastInterimTranscriptRef.current) === normalizeTranscript(finalSpeech)
                )

                if (finalSpeech && !wasAlreadyProcessedAsInterim) {
                    onFinalResultRef.current?.(finalSpeech)
                }

                setResults((previous) => [...previous, ...finalResults])

                lastInterimTranscriptRef.current = ''
            }
        }

        recognition.onerror = (event) => {
            if (event.error === 'no-speech' || event.error === 'aborted') return

            if (BLOCKING_RECOGNITION_ERRORS.has(event.error)) {
                shouldListenRef.current = false
                setError('Permiso de microfono denegado.')
            } else {
                setError('')
            }
        }

        recognition.onend = () => {
            setIsRecording(false)

            if (!shouldListenRef.current) return

            window.clearTimeout(restartTimeoutRef.current)
            restartTimeoutRef.current = window.setTimeout(() => {
                if (!shouldListenRef.current) return

                try {
                    recognition.start()
                } catch {
                    // The browser can throw if a new recognition cycle is already starting.
                }
            }, RESTART_RECOGNITION_DELAY_MS)
        }

        recognitionRef.current = recognition

        return () => {
            shouldListenRef.current = false
            window.clearTimeout(restartTimeoutRef.current)
            recognition.onend = null
            recognition.stop()
            recognitionRef.current = null
        }
    }, [lang])

    const startSpeechToText = useCallback(() => {
        const recognition = recognitionRef.current
        if (!recognition) return

        shouldListenRef.current = true
        window.clearTimeout(restartTimeoutRef.current)
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
        window.clearTimeout(restartTimeoutRef.current)
        lastInterimTranscriptRef.current = ''
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
