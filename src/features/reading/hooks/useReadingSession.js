import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    applySpeechEvent,
    createReadingSession,
    createSpeechEvent,
    getProgressRatio,
    getRenderableTokens,
    SPEECH_EVENT_TYPE,
} from '@/lib/readingMatcher'
import { NEXT_READING_SECTION } from '../constants/sections'

export function useReadingSession(story) {
    const [section, setSection] = useState('title')
    const [readingState, setReadingState] = useState(() => ({
        text: '',
        session: createReadingSession(''),
    }))

    const currentText = useMemo(() => {
        if (!story || section === 'COMPLETE') return ''
        return story[section].replaceAll('\n', ' ').replace(/\s+/g, ' ').trim()
    }, [section, story])

    const freshSession = useMemo(() => createReadingSession(currentText), [currentText])
    const session = readingState.text === currentText ? readingState.session : freshSession
    const renderableTokens = useMemo(() => getRenderableTokens(session), [session])
    const progressPercent = Math.round(getProgressRatio(session) * 100)
    const currentWord = session.wordTokens[session.currentIndex]?.raw || ''

    useEffect(() => {
        if (!currentText || !session.isComplete || section === 'COMPLETE') return

        const timeout = window.setTimeout(() => {
            setSection(NEXT_READING_SECTION[section])
        }, 450)

        return () => window.clearTimeout(timeout)
    }, [currentText, section, session.isComplete])

    const handleSpeech = useCallback((speechText, type = SPEECH_EVENT_TYPE.INTERIM) => {
        setReadingState((previous) => {
            const previousSession = previous.text === currentText
                ? previous.session
                : createReadingSession(currentText)

            return {
                text: currentText,
                session: applySpeechEvent(
                    previousSession,
                    createSpeechEvent({ text: speechText, type })
                ).session,
            }
        })
    }, [currentText])

    return {
        currentText,
        currentWord,
        handleSpeech,
        progressPercent,
        renderableTokens,
        section,
        session,
    }
}
