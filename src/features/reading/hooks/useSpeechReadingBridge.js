import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SPEECH_EVENT_TYPE } from '@/lib/readingMatcher'

export function useSpeechReadingBridge({
    interimResult,
    onSpeech,
    resetKey,
    results,
}) {
    const [displayText, setDisplayText] = useState('')
    const [sectionFinalStartCount, setSectionFinalStartCount] = useState(results.length)
    const processedFinalCountRef = useRef(0)
    const lastInterimRef = useRef('')
    const resultsLengthRef = useRef(results.length)

    const finalTranscript = useMemo(() => (
        results.slice(sectionFinalStartCount).map((result) => result.transcript).join(' ').trim()
    ), [results, sectionFinalStartCount])

    useEffect(() => {
        resultsLengthRef.current = results.length
    }, [results.length])

    useEffect(() => {
        processedFinalCountRef.current = resultsLengthRef.current
        setSectionFinalStartCount(resultsLengthRef.current)
        lastInterimRef.current = ''
        setDisplayText('')
    }, [resetKey])

    useEffect(() => {
        const cleanInterim = String(interimResult || '').replace(/\s+/g, ' ').trim()
        if (!cleanInterim || cleanInterim === lastInterimRef.current) return

        lastInterimRef.current = cleanInterim
        onSpeech(cleanInterim, SPEECH_EVENT_TYPE.INTERIM)
        setDisplayText([finalTranscript, cleanInterim].filter(Boolean).join(' '))
    }, [finalTranscript, interimResult, onSpeech])

    useEffect(() => {
        if (results.length <= processedFinalCountRef.current) return

        const newResults = results.slice(processedFinalCountRef.current)
        processedFinalCountRef.current = results.length
        const finalSpeech = newResults.map((result) => result.transcript).join(' ').trim()

        if (!finalSpeech) return

        const wasAlreadyProcessedAsInterim = (
            lastInterimRef.current &&
            normalizeTranscript(lastInterimRef.current) === normalizeTranscript(finalSpeech)
        )

        if (!wasAlreadyProcessedAsInterim) {
            onSpeech(finalSpeech, SPEECH_EVENT_TYPE.FINAL)
        }

        lastInterimRef.current = ''
        setDisplayText(results.slice(sectionFinalStartCount).map((result) => result.transcript).join(' '))
    }, [onSpeech, results, sectionFinalStartCount])

    const clearDisplayText = useCallback(() => {
        setDisplayText('')
    }, [])

    return {
        clearDisplayText,
        displayText,
    }
}

function normalizeTranscript(text) {
    return String(text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[.,:;'!?\u00a1\u00bf"()[\]{}]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}
