'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import useSpeechToText from 'react-hook-speech-to-text'
import Speech from 'speak-tts'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import SpeechToText from '@/components/SpeechToText'
import { fabulas } from '@/db/fabulas'
import {
    applySpeechEvent,
    createReadingSession,
    createSpeechEvent,
    getProgressRatio,
    getRenderableTokens,
    normalizeWord,
    SPEECH_EVENT_TYPE,
} from '@/lib/readingMatcher'

const DEFAULT_STORY_IMAGE = '/tiger.png'
const SECTION_ORDER = ['title', 'content', 'teaching']
const SECTION_LABELS = {
    title: 'Titulo',
    content: 'Historia',
    teaching: 'Moraleja',
}
const NEXT_SECTION = {
    title: 'content',
    content: 'teaching',
    teaching: 'COMPLETE',
}

function Component() {
    const searchParams = useSearchParams()
    const storyId = searchParams.get('item')
    const story = storyId ? fabulas[storyId] : null

    const [definition, setDefinition] = useState(null)
    const [value, setValue] = useState('')
    const [lecture, setLecture] = useState('title')
    const [readingSession, setReadingSession] = useState(() => createReadingSession(''))
    const speechRef = useRef(null)
    const { width, height } = useWindowSize()

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
        timeout: 2500,
        speechRecognitionProperties: {
            lang: 'es-MX',
            interimResults: true,
        },
    })

    const currentText = useMemo(() => {
        if (!story || lecture === 'COMPLETE') return ''
        return story[lecture].replaceAll('\n', ' ').replace(/\s+/g, ' ').trim()
    }, [lecture, story])

    const progressPercent = Math.round(getProgressRatio(readingSession) * 100)
    const currentWord = readingSession.wordTokens[readingSession.currentIndex]?.raw || ''
    const renderableTokens = useMemo(() => getRenderableTokens(readingSession), [readingSession])

    useEffect(() => {
        setReadingSession(createReadingSession(currentText))
        setValue('')
    }, [currentText])

    useEffect(() => {
        if (!currentText || !readingSession.isComplete || lecture === 'COMPLETE') return

        const timeout = window.setTimeout(() => {
            setLecture(NEXT_SECTION[lecture])
        }, 450)

        return () => window.clearTimeout(timeout)
    }, [currentText, lecture, readingSession.isComplete])

    const handleSpeech = useCallback((speechText, type = SPEECH_EVENT_TYPE.INTERIM) => {
        setReadingSession((previous) => applySpeechEvent(
            previous,
            createSpeechEvent({ text: speechText, type })
        ).session)
    }, [])

    function play(text) {
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
    }

    async function handlerSelect(word) {
        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word }),
            })
            const data = await response.json()
            setDefinition({ word, text: data.data || 'No se encontro una definicion.' })
        } catch {
            setDefinition({ word, text: 'No se pudo consultar el diccionario.' })
        }
    }

    function renderText(text, section, className = '') {
        const sectionIndex = SECTION_ORDER.indexOf(section)
        const lectureIndex = SECTION_ORDER.indexOf(lecture)
        const sectionCompleted = lecture === 'COMPLETE' || sectionIndex < lectureIndex
        const sectionActive = section === lecture
        const tokens = sectionActive ? renderableTokens : null

        return (
            <p className={className}>
                {(tokens || text.split(/(\s+)/)).map((token, index) => {
                    if (tokens && token.type !== 'word') {
                        return token.raw.includes('\n') ? <br key={`${section}-${index}`} /> : token.raw
                    }

                    if (!tokens && /^\s+$/.test(token)) {
                        return token.includes('\n') ? <br key={`${section}-${index}`} /> : token
                    }

                    const raw = tokens ? token.raw : token
                    const cleanToken = normalizeWord(raw)
                    const status = sectionCompleted ? 'matched' : sectionActive ? token.status : 'pending'
                    const isCurrent = status === 'current'
                    const classNames = [
                        'cursor-pointer rounded-md px-1 transition-colors hover:bg-[#ffe66d]',
                        status === 'matched' ? 'bg-[#8ee99d] text-[#143d1c]' : '',
                        status === 'assisted' ? 'bg-[#ffe66d] text-[#6b3f00]' : '',
                        isCurrent ? 'bg-[#dff4ff] text-[#1f3a5f] underline decoration-[#ef6c00] decoration-4 underline-offset-4' : '',
                    ].join(' ')

                    return (
                        <span
                            key={`${section}-${index}`}
                            className={classNames}
                            onDoubleClick={() => handlerSelect(cleanToken || raw)}
                            onClick={() => play(raw)}
                        >
                            {raw}
                        </span>
                    )
                })}
            </p>
        )
    }

    if (!story) {
        return (
            <div className='flex min-h-screen w-full items-center justify-center bg-[#fff7d6] p-6'>
                <div className='max-w-md rounded-lg border-4 border-white bg-white p-6 text-center shadow-[0_10px_0_rgba(15,23,42,0.12)]'>
                    <h1 className='text-2xl font-black text-[#1f3a5f]'>Fabula no encontrada</h1>
                    <p className='mt-2 text-sm font-semibold text-slate-600'>Vuelve al inicio y selecciona una historia disponible.</p>
                    <Link href='/' className='mt-5 inline-flex rounded-full bg-[#1f3a5f] px-5 py-3 text-sm font-bold text-white'>
                        Ir al inicio
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className='relative min-h-screen w-full overflow-hidden bg-[#fff7d6] px-4 py-5 pb-48 md:px-8 md:py-8'>
            <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#fff7d6_0%,#b7ecff_50%,#d8ffd4_100%)]' />
            <div className='pointer-events-none absolute left-0 right-0 top-0 h-24 bg-[linear-gradient(90deg,#ff8a65,#ffd166,#5ed3f3,#8bd17c)] opacity-90' />
            {lecture === 'COMPLETE' && <Confetti width={width} height={height} />}

            <div className='relative mx-auto max-w-5xl'>
                <div className='mb-5 flex flex-col gap-4 rounded-lg border-4 border-white bg-white/90 p-4 shadow-[0_8px_0_rgba(15,23,42,0.12)]'>
                    <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                        <Link href='/' className='inline-flex w-fit rounded-full bg-[#1f3a5f] px-4 py-2 text-sm font-bold text-white shadow'>
                            Volver
                        </Link>
                        <div className='flex flex-wrap gap-2'>
                            {SECTION_ORDER.map((section, index) => {
                                const activeIndex = lecture === 'COMPLETE' ? SECTION_ORDER.length : SECTION_ORDER.indexOf(lecture)
                                const isDone = index < activeIndex
                                const isActive = section === lecture

                                return (
                                    <span
                                        key={section}
                                        className={`rounded-full px-4 py-2 text-sm font-black shadow-sm ${isDone ? 'bg-[#8ee99d] text-[#143d1c]' : ''} ${isActive ? 'bg-[#ffe66d] text-[#6b3f00]' : ''} ${!isDone && !isActive ? 'bg-slate-100 text-slate-500' : ''}`}
                                    >
                                        {SECTION_LABELS[section]}
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    {lecture !== 'COMPLETE' && (
                        <div>
                            <div className='flex items-center justify-between gap-4 text-xs font-black uppercase tracking-[0.14em] text-[#1f3a5f]'>
                                <span>Progreso {progressPercent}%</span>
                                <span>{readingSession.currentIndex}/{readingSession.wordTokens.length} palabras</span>
                            </div>
                            <div className='mt-2 h-4 overflow-hidden rounded-full bg-[#dff4ff]'>
                                <div
                                    className='h-full rounded-full bg-[linear-gradient(90deg,#8ee99d,#ffd166)] transition-all duration-300'
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <article className='rounded-lg border-4 border-white bg-white p-5 text-xl leading-10 text-slate-900 shadow-[0_14px_0_rgba(15,23,42,0.12)] md:p-8 md:text-2xl md:leading-[3.4rem]'>
                    {renderText(story.title, 'title', 'text-center text-3xl font-black leading-tight text-[#1f3a5f] md:text-5xl')}

                    <div className='my-7 flex justify-center'>
                        <div className='rounded-[2rem] border-4 border-[#ffd166] bg-[#fff2b8] p-4 shadow-inner'>
                            <img
                                src={story.img || story.face || DEFAULT_STORY_IMAGE}
                                className='h-[220px] w-[220px] rounded-[1.4rem] object-contain md:h-[260px] md:w-[260px]'
                                alt={story.title}
                            />
                        </div>
                    </div>

                    <section className='rounded-lg bg-[#f8fbff] p-4 md:p-6'>
                        {renderText(story.content, 'content')}
                    </section>

                    <section className='mt-6 rounded-lg border-4 border-dashed border-[#ffd166] bg-[#fffdf0] p-4 md:p-6'>
                        <p className='mb-2 text-center text-base font-black uppercase tracking-[0.16em] text-[#ef6c00]'>Moraleja</p>
                        {renderText(story.teaching, 'teaching', 'text-center font-black text-[#1f3a5f]')}
                    </section>
                </article>
            </div>

            {definition && (
                <div className='fixed inset-0 z-20 flex items-center justify-center bg-black/70 p-4' onClick={() => setDefinition(null)}>
                    <div className='max-w-md rounded-lg border-4 border-[#ffd166] bg-white p-6 shadow-[0_12px_0_rgba(15,23,42,0.18)]' onClick={(event) => event.stopPropagation()}>
                        <p className='text-xs font-black uppercase tracking-[0.18em] text-[#ef6c00]'>Diccionario</p>
                        <h2 className='mt-2 text-3xl font-black capitalize text-[#1f3a5f]'>{definition.word}</h2>
                        <p className='mt-3 text-lg font-semibold leading-8 text-slate-700'>{definition.text}</p>
                        <button
                            type='button'
                            className='mt-5 rounded-full bg-[#1f3a5f] px-5 py-3 text-sm font-bold text-white'
                            onClick={() => setDefinition(null)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            <SpeechToText
                error={error}
                interimResult={interimResult}
                isRecording={isRecording}
                results={results}
                startSpeechToText={startSpeechToText}
                stopSpeechToText={stopSpeechToText}
                setValue={setValue}
                value={value}
                resetKey={lecture}
                currentWord={currentWord}
                missedStreak={readingSession.missedStreak}
                onSpeech={handleSpeech}
            />
        </div>
    )
}

export default Component
