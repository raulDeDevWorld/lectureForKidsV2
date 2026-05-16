import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createTranscriptParts } from '@/lib/reading/transcript'

const EMPTY_TRANSCRIPT_PARTS = {
    displayText: '',
    stableText: '',
    stableWords: [],
    unstableText: '',
}

export function useSpeechReadingBridge({
    interimResult,
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
        setTranscriptParts(createTranscriptParts(finalTranscript, cleanInterim))
    }, [finalTranscript, interimResult])

    useEffect(() => {
        if (results.length <= processedFinalCountRef.current) return

        const newResults = results.slice(processedFinalCountRef.current)
        processedFinalCountRef.current = results.length
        const finalSpeech = newResults.map((result) => result.transcript).join(' ').trim()

        if (!finalSpeech) return

        lastInterimRef.current = ''
        setTranscriptParts(createTranscriptParts(
            results.slice(sectionFinalStartCount).map((result) => result.transcript).join(' '),
            ''
        ))
    }, [results, sectionFinalStartCount])

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
