import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SPEECH_EVENT_TYPE } from '@/lib/readingMatcher'
import { createTranscriptParts, normalizeTranscript } from '@/lib/reading/transcript'

const EMPTY_TRANSCRIPT_PARTS = {
    displayText: '',
    stableText: '',
    stableWords: [],
    unstableText: '',
}

export function useSpeechReadingBridge({
    interimResult,
    onSpeech,
    resetKey,
    results,
}) {
    const [transcriptParts, setTranscriptParts] = useState(EMPTY_TRANSCRIPT_PARTS)
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
        setTranscriptParts(EMPTY_TRANSCRIPT_PARTS)
    }, [resetKey])

    useEffect(() => {
        const cleanInterim = String(interimResult || '').replace(/\s+/g, ' ').trim()
        if (!cleanInterim || cleanInterim === lastInterimRef.current) return

        lastInterimRef.current = cleanInterim
        onSpeech(cleanInterim, SPEECH_EVENT_TYPE.INTERIM)
        setTranscriptParts(createTranscriptParts(finalTranscript, cleanInterim))
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
        setTranscriptParts(createTranscriptParts(
            results.slice(sectionFinalStartCount).map((result) => result.transcript).join(' '),
            ''
        ))
    }, [onSpeech, results, sectionFinalStartCount])

    const clearDisplayText = useCallback(() => {
        setTranscriptParts(EMPTY_TRANSCRIPT_PARTS)
    }, [])

    return {
        clearDisplayText,
        displayText: transcriptParts.displayText,
        stableText: transcriptParts.stableText,
        stableWords: transcriptParts.stableWords,
        transcriptParts,
        unstableText: transcriptParts.unstableText,
    }
}
