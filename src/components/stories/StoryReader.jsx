'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, DownloadIcon, HeartIcon, SpeakerIcon } from '@/components/icons/Icons'
import { useDictionaryLookup } from '@/features/dictionary/hooks/useDictionaryLookup'
import { DictionaryModal } from '@/features/reading/components/DictionaryModal'
import { SpeechToText } from '@/features/reading/components/SpeechToText'
import { StoryText } from '@/features/reading/components/StoryText'
import { useBrowserSpeechRecognition } from '@/features/reading/hooks/useBrowserSpeechRecognition'
import { useReadingSession } from '@/features/reading/hooks/useReadingSession'
import { useSpeechReadingBridge } from '@/features/reading/hooks/useSpeechReadingBridge'
import { useSpeechPlayback } from '@/features/reading/hooks/useSpeechPlayback'
import { exportFullStoryPdf } from '@/lib/exportStoryPdf.jsx'
import { SPEECH_EVENT_TYPE } from '@/lib/readingMatcher'
import { FavoriteButton } from './FavoriteButton'
import { StoryImage } from './StoryImage'

const textSizes = [
    'text-lg leading-9',
    'text-xl leading-10',
    'text-2xl leading-[3rem]',
]

const SPEECH_SECTION_PAUSE_MS = 650
const SPEECH_PARAGRAPH_PAUSE_MS = 320

export function StoryReader({ isFavorite, onToggleFavorite, story }) {
    const [shouldKeepListening, setShouldKeepListening] = useState(false)
    const [isExportingPdf, setIsExportingPdf] = useState(false)
    const [textSizeIndex, setTextSizeIndex] = useState(1)
    const speechQueueRef = useRef([])
    const speechTimeoutRef = useRef(null)
    const speechUtteranceRef = useRef(null)
    const playWord = useSpeechPlayback()
    const { closeDefinition, definition, lookupDefinition } = useDictionaryLookup()
    const {
        advanceManually,
        currentText,
        currentWord,
        handleSpeech,
        progressPercent,
        renderableTokens,
        section,
        session,
    } = useReadingSession(story, { initialSection: 'title' })

    const handleInterimResult = useCallback((speechText) => {
        handleSpeech(speechText, SPEECH_EVENT_TYPE.INTERIM)
    }, [handleSpeech])

    const handleFinalResult = useCallback((speechText) => {
        handleSpeech(speechText, SPEECH_EVENT_TYPE.FINAL)
    }, [handleSpeech])

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useBrowserSpeechRecognition({
        lang: 'es-MX',
        onFinalResult: handleFinalResult,
        onInterimResult: handleInterimResult,
        resetKey: `${story.id}-${section}`,
    })
    const { displayText, stableWords, unstableText } = useSpeechReadingBridge({
        interimResult,
        resetKey: `${story.id}-${section}`,
        results,
    })

    function toggleTextSize() {
        setTextSizeIndex((current) => (current + 1) % textSizes.length)
    }

    useEffect(() => () => {
        clearStorySpeechQueue(speechQueueRef, speechTimeoutRef, speechUtteranceRef)
    }, [])

    function readCurrentSection() {
        if (!('speechSynthesis' in window)) return

        clearStorySpeechQueue(speechQueueRef, speechTimeoutRef, speechUtteranceRef)
        speechQueueRef.current = createStorySpeechSegments(story)
        speakNextStorySegment(speechQueueRef, speechTimeoutRef, speechUtteranceRef)
    }

    async function exportFullStory() {
        if (isExportingPdf) return

        setIsExportingPdf(true)
        try {
            await exportFullStoryPdf(story)
        } finally {
            setIsExportingPdf(false)
        }
    }

    const canRecord = !error
    const listeningActive = shouldKeepListening || isRecording

    const startListening = useCallback(() => {
        setShouldKeepListening(true)
        startSpeechToText()
    }, [startSpeechToText])

    const stopListening = useCallback(() => {
        setShouldKeepListening(false)
        stopSpeechToText()
    }, [stopSpeechToText])

    return (
        <div className='relative min-h-screen overflow-hidden bg-[#a6e5fc] pb-40 text-[#1F2A44]'>
            <div className='absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#A7D8F5]/35 blur-3xl' />
            <div className='absolute -right-20 top-72 h-56 w-56 rounded-full bg-[#FFC3A1]/35 blur-3xl' />

            <div className='relative mx-auto flex min-h-screen w-full max-w-3xl flex-col'>
                <header className='sticky top-0 z-30 px-3 py-3'>
                    <div className='flex items-center justify-between gap-3 rounded-[2rem] bg-white/90 p-2 shadow-[0_14px_42px_rgba(31,42,68,0.12)] backdrop-blur-xl'>
                        <Link href='/cuentos' aria-label='Volver a cuentos' className='inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_8px_22px_rgba(31,42,68,0.10)]'>
                            <ArrowLeftIcon className='h-6 w-6' />
                        </Link>

                        <div className='min-w-0 flex-1 px-1'>
                            <p className='truncate text-[11px] font-black uppercase tracking-[0.14em] text-[#7A8194]'>Modo practica</p>
                            <p className='truncate text-sm font-black text-[#1F2A44]'>Lee en voz alta y avanza palabra por palabra</p>
                        </div>

                        <div className='flex shrink-0 gap-2'>
                            <button
                                type='button'
                                aria-label='Cambiar tamaño de texto'
                                onClick={toggleTextSize}
                                className='inline-flex h-12 min-w-12 items-center justify-center rounded-full bg-white px-4 text-base font-black shadow-[0_8px_22px_rgba(31,42,68,0.10)]'
                            >
                                Aa
                            </button>
                            <button
                                type='button'
                                aria-label='Escuchar sección actual'
                                onClick={readCurrentSection}
                                className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_8px_22px_rgba(31,42,68,0.10)]'
                            >
                                <SpeakerIcon className='h-6 w-6' />
                            </button>
                        </div>
                    </div>
                </header>

                <section className='px-4'>
                    <StoryImage
                        alt={story.title}
                        className='mx-auto aspect-[4/3] max-h-[42vh] bg-[#F3F4F6] p-4 shadow-[0_18px_48px_rgba(31,42,68,0.10)]'
                        imageUrl={story.imageUrl}
                        priority
                    />
                </section>

                <article className='relative -mt-4 mx-4 flex-1 rounded-[2.25rem] bg-[#ffffffb0] p-5 shadow-[0_20px_58px_rgba(31,42,68,0.12)] ring-1 ring-white/80 sm:p-7'>
                    <div className='flex items-start justify-between gap-4'>
                        <div>
                            <p className='w-fit rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>{story.category}</p>
                            <StoryText
                                activeSection={section}
                                className='mt-1 text-3xl font-black leading-tight text-[#1F2A44] sm:text-4xl'
                                onLookupWord={lookupDefinition}
                                onPlayWord={playWord}
                                renderableTokens={renderableTokens}
                                section='title'
                                text={story.title}
                            />
                        </div>
                        <FavoriteButton active={isFavorite} onToggle={onToggleFavorite} />
                    </div>

                    <div className='mt-5 rounded-3xl bg-[#ffffff] p-4'>
                        <div className='flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>
                            <span>Progreso {progressPercent}%</span>
                            <span>{session.currentIndex}/{session.wordTokens.length}</span>
                        </div>
                        <div className='mt-2 h-3  rounded-full bg-[#ffffff] border-[#eeeeee] border-[1px] shadow-lg'>
                            <div
                                className='h-full rounded-full bg-[linear-gradient(90deg,#A7D8F5,#BFE8D4,#FFD166)] transition-all duration-300'
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        <p className='mt-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-black text-[#7A8194]'>
                            {listeningActive
                                ? currentWord
                                    ? `Escuchando: ${currentWord}`
                                    : 'Escuchando tu lectura'
                                : currentWord
                                    ? `Lee en voz alta: ${currentWord}`
                                    : canRecord
                                        ? 'Activa el microfono en la tarjeta inferior para comenzar.'
                                        : 'El reconocimiento de voz no esta disponible.'}
                        </p>

                        <div className='mt-3'>
                            <button
                                type='button'
                                aria-label='Descargar fabula completa en PDF'
                                onClick={exportFullStory}
                                disabled={isExportingPdf}
                                className='inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#FFF7CC] px-3 text-xs font-black text-[#8A5A00] shadow-[0_4px_0_rgba(245,158,11,0.14)] transition active:translate-y-0.5 active:shadow-none sm:text-sm'
                            >
                                <DownloadIcon className='h-4 w-4 shrink-0' />
                                {isExportingPdf ? 'Preparando PDF...' : 'Descargar fabula PDF'}
                            </button>
                        </div>
                    </div>

                    <section className='mt-6 rounded-[2rem] bg-[#F8FBFF] p-4 shadow-inner'>
                        <StoryText
                            activeSection={section}
                            className={`font-bold text-[#374151] ${textSizes[textSizeIndex]}`}
                            onLookupWord={lookupDefinition}
                            onPlayWord={playWord}
                            renderableTokens={renderableTokens}
                            section='content'
                            text={story.content}
                        />
                    </section>

                    <section className='mt-5 rounded-[2rem] bg-[#FFF3C4] p-4 shadow-inner'>
                        <div className='flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#8A5A00]'>
                            <HeartIcon filled className='h-4 w-4' />
                            Moraleja
                        </div>
                        <StoryText
                            activeSection={section}
                            className='mt-2 text-lg font-black leading-8 text-[#1F2A44]'
                            onLookupWord={lookupDefinition}
                            onPlayWord={playWord}
                            renderableTokens={renderableTokens}
                            section='teaching'
                            text={story.teaching}
                        />
                    </section>
                </article>
            </div>

            <SpeechToText
                error={error}
                isRecording={listeningActive}
                onManualAdvance={advanceManually}
                startSpeechToText={startListening}
                stopSpeechToText={stopListening}
                value={displayText}
                stableWords={stableWords}
                unstableText={unstableText}
                currentWord={currentWord}
                missedStreak={session.missedStreak}
            />

            <DictionaryModal definition={definition} onClose={closeDefinition} />
        </div>
    )
}

function createStorySpeechSegments(story) {
    const content = Array.isArray(story.content) ? story.content : [story.content]

    return [
        { pauseAfter: SPEECH_SECTION_PAUSE_MS, text: story.title },
        ...content
            .filter(Boolean)
            .map((paragraph) => ({
                pauseAfter: SPEECH_PARAGRAPH_PAUSE_MS,
                text: paragraph,
            })),
        story.teaching
            ? { pauseAfter: 0, text: `Moraleja. ${story.teaching}` }
            : null,
    ].filter((segment) => segment?.text)
}

function speakNextStorySegment(queueRef, timeoutRef, utteranceRef) {
    if (!('speechSynthesis' in window)) return

    const segment = queueRef.current.shift()
    if (!segment) {
        utteranceRef.current = null
        return
    }

    const utterance = new SpeechSynthesisUtterance(segment.text)
    utterance.lang = 'es-ES'
    utterance.rate = 0.9
    utterance.onend = () => {
        timeoutRef.current = window.setTimeout(() => {
            speakNextStorySegment(queueRef, timeoutRef, utteranceRef)
        }, segment.pauseAfter)
    }
    utteranceRef.current = utterance

    window.speechSynthesis.speak(utterance)
}

function clearStorySpeechQueue(queueRef, timeoutRef, utteranceRef) {
    queueRef.current = []
    utteranceRef.current = null

    if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
    }

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
    }
}
