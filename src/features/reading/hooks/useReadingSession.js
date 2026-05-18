import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    applySpeechEvent,
    createReadingSession,
    createSpeechEvent,
    getProgressRatio,
    getRenderableTokens,
    READING_EVENT_TYPE,
    SPEECH_EVENT_TYPE,
} from '@/lib/readingMatcher'
import { readStoryProgress, saveStoryProgress } from '@/lib/readingProgressStorage'
import { isLikelyCarryoverTranscript } from '@/lib/reading/transcript'
import { NEXT_READING_SECTION } from '../constants/sections'

const SECTION_CARRYOVER_GUARD_MS = 1800
const SECTION_ADVANCE_DELAY_MS = 60
export function useReadingSession(story, options = {}) {
    const initialSection = options.initialSection || 'title'
    const [section, setSection] = useState(() => {
        const storedSection = readStoryProgress(story?.id)?.section
        return storedSection && storedSection !== 'COMPLETE' ? storedSection : initialSection
    })
    const animationFrameRef = useRef(null)
    const carryoverGuardRef = useRef({ expiresAt: 0, text: '' })
    const currentTextRef = useRef('')
    const sectionCarryoverEventsRef = useRef([])
    const pendingSpeechEventsRef = useRef([])
    const [readingState, setReadingState] = useState(() => ({
        text: '',
        session: createReadingSession(''),
    }))

    const currentText = useMemo(() => {
        if (!story || section === 'COMPLETE') return ''
        const sectionText = Array.isArray(story[section])
            ? story[section].join('\n\n')
            : story[section]

        return String(sectionText || '')
            .replace(/[^\S\n]+/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trim()
    }, [section, story])

    const freshSession = useMemo(() => createReadingSession(currentText), [currentText])
    const session = readingState.text === currentText ? readingState.session : freshSession
    const renderableTokens = useMemo(() => getRenderableTokens(session), [session])
    const progressPercent = Math.round(getProgressRatio(session) * 100)
    const currentWord = session.wordTokens[session.currentIndex]?.raw || ''

    useEffect(() => {
        currentTextRef.current = currentText
        pendingSpeechEventsRef.current = []

        if (animationFrameRef.current) {
            window.cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }
    }, [currentText])

    useEffect(() => {
        if (!story?.id) return

        saveStoryProgress(story.id, {
            section,
            progressPercent,
            currentIndex: session.currentIndex,
            totalWords: session.wordTokens.length,
            completed: section === 'COMPLETE',
        })
    }, [progressPercent, section, session.currentIndex, session.wordTokens.length, story?.id])

    useEffect(() => () => {
        if (animationFrameRef.current) {
            window.cancelAnimationFrame(animationFrameRef.current)
        }
    }, [])

    useEffect(() => {
        if (!currentText || !session.isComplete || section === 'COMPLETE') return

        const timeout = window.setTimeout(() => {
            carryoverGuardRef.current = {
                expiresAt: Date.now() + SECTION_CARRYOVER_GUARD_MS,
                text: currentText,
            }
            setSection(NEXT_READING_SECTION[section])
        }, SECTION_ADVANCE_DELAY_MS)

        return () => window.clearTimeout(timeout)
    }, [currentText, section, session.isComplete])

    const flushPendingSpeechEvents = useCallback(() => {
        animationFrameRef.current = null

        const pendingEvents = pendingSpeechEventsRef.current
        pendingSpeechEventsRef.current = []

        if (!pendingEvents.length) return

        setReadingState((previous) => {
            const text = currentTextRef.current
            let nextSession = previous.text === text
                ? previous.session
                : createReadingSession(text)

            for (const speechEvent of pendingEvents) {
                if (nextSession.isComplete) {
                    queueSectionCarryoverEvent(sectionCarryoverEventsRef, speechEvent)
                    continue
                }

                const result = applySpeechEvent(nextSession, speechEvent)
                nextSession = result.session
                queueSectionCarryoverEvents(sectionCarryoverEventsRef, result.events, speechEvent.type)
            }

            return {
                text,
                session: nextSession,
            }
        })
    }, [])

    const scheduleSpeechEvent = useCallback((speechEvent) => {
        pendingSpeechEventsRef.current.push(speechEvent)

        if (animationFrameRef.current) return

        animationFrameRef.current = window.requestAnimationFrame(flushPendingSpeechEvents)
    }, [flushPendingSpeechEvents])

    useEffect(() => {
        if (!currentText || section === 'COMPLETE' || !sectionCarryoverEventsRef.current.length) return

        const carryoverEvents = sectionCarryoverEventsRef.current
        sectionCarryoverEventsRef.current = []

        for (const speechEvent of carryoverEvents) {
            scheduleSpeechEvent(speechEvent)
        }
    }, [currentText, scheduleSpeechEvent, section])

    const handleSpeech = useCallback((speechText, type = SPEECH_EVENT_TYPE.INTERIM) => {
        const carryoverGuard = carryoverGuardRef.current
        if (
            carryoverGuard.text &&
            Date.now() < carryoverGuard.expiresAt &&
            isLikelyCarryoverTranscript(speechText, carryoverGuard.text)
        ) {
            return
        }

        scheduleSpeechEvent(createSpeechEvent({ text: speechText, type }))
    }, [scheduleSpeechEvent])

    const advanceManually = useCallback(() => {
        const currentToken = session.wordTokens[session.currentIndex]
        if (!currentToken) return

        scheduleSpeechEvent(createSpeechEvent({
            text: currentToken.raw,
            type: SPEECH_EVENT_TYPE.FINAL,
        }))
    }, [scheduleSpeechEvent, session.currentIndex, session.wordTokens])

    return {
        advanceManually,
        currentText,
        currentWord,
        handleSpeech,
        progressPercent,
        renderableTokens,
        section,
        session,
    }
}

function queueSectionCarryoverEvents(carryoverEventsRef, events, type) {
    const completedEvent = events.find((event) => (
        event.type === READING_EVENT_TYPE.SECTION_COMPLETED && event.remainingText
    ))

    if (!completedEvent) return

    queueSectionCarryoverEvent(
        carryoverEventsRef,
        createSpeechEvent({ text: completedEvent.remainingText, type })
    )
}

function queueSectionCarryoverEvent(carryoverEventsRef, speechEvent) {
    if (!speechEvent?.text) return

    carryoverEventsRef.current = [
        ...carryoverEventsRef.current,
        speechEvent,
    ]
}
