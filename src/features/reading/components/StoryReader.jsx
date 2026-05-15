'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import useSpeechToText from 'react-hook-speech-to-text'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { useDictionaryLookup } from '@/features/dictionary/hooks/useDictionaryLookup'
import { PwaInstallPrompt } from '@/features/pwa/components/PwaInstallPrompt'
import { getStoryById } from '@/features/stories/data/stories'
import { DEFAULT_STORY_IMAGE, READING_SECTION_ORDER } from '../constants/sections'
import { useReadingSession } from '../hooks/useReadingSession'
import { useSpeechPlayback } from '../hooks/useSpeechPlayback'
import { DictionaryModal } from './DictionaryModal'
import { EmptyStoryState } from './EmptyStoryState'
import { ReadingProgress } from './ReadingProgress'
import { SectionStepper } from './SectionStepper'
import { SpeechToText } from './SpeechToText'
import { StoryText } from './StoryText'

export function StoryReader() {
    const searchParams = useSearchParams()
    const story = getStoryById(searchParams.get('item'))
    const [speechValue, setSpeechValue] = useState('')
    const { width, height } = useWindowSize()
    const playWord = useSpeechPlayback()
    const { closeDefinition, definition, lookupDefinition } = useDictionaryLookup()
    const {
        currentWord,
        handleSpeech,
        progressPercent,
        renderableTokens,
        section,
        session,
    } = useReadingSession(story)

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

    if (!story) {
        return <EmptyStoryState />
    }

    return (
        <div className='kid-bg relative min-h-screen w-full overflow-hidden px-3 pb-40 pt-3 text-[#172554] sm:px-5 md:px-8 md:pb-44 md:pt-6'>
            {section === 'COMPLETE' && <Confetti width={width} height={height} />}

            <div className='relative mx-auto max-w-4xl'>
                <div className='sticky top-3 z-10 mb-4 overflow-hidden rounded-[28px] bg-[#172554] text-white shadow-[0_18px_50px_rgba(23,37,84,0.22)]'>
                    <div className='h-2 bg-[linear-gradient(90deg,#ff6b6b,#ffd447,#5ee38a,#4cc9f0,#8b5cf6)]' />
                    <div className='flex flex-col gap-3 p-3 md:p-4'>
                    <div className='flex items-center justify-between gap-3'>
                        <Link href='/' className='inline-flex shrink-0 items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-[#172554] shadow-[0_5px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5'>
                            Volver
                        </Link>
                        <div className='hidden sm:block'>
                            <PwaInstallPrompt compact />
                        </div>
                        <SectionStepper activeSection={section} />
                    </div>

                    {section !== 'COMPLETE' && (
                        <ReadingProgress progressPercent={progressPercent} session={session} />
                    )}
                    </div>
                </div>

                <article className='overflow-hidden rounded-[34px] bg-white shadow-[0_18px_0_rgba(23,37,84,0.10),0_30px_80px_rgba(23,37,84,0.16)]'>
                    <div className='h-3 bg-[linear-gradient(90deg,#4cc9f0,#5ee38a,#ffd447,#ff6b6b)]' />
                    <div className='p-5 sm:p-7 md:p-9'>
                    <StoryText
                        activeSection={section}
                        className='text-center text-4xl font-black leading-[0.95] text-[#172554] sm:text-5xl md:text-6xl'
                        onLookupWord={lookupDefinition}
                        onPlayWord={playWord}
                        renderableTokens={renderableTokens}
                        section={READING_SECTION_ORDER[0]}
                        text={story.title}
                    />

                    <div className='my-6 flex justify-center sm:my-8'>
                        <div className='rounded-[34px] bg-[linear-gradient(135deg,#fff1c7,#e0f7ff)] p-3 shadow-[inset_0_0_0_3px_rgba(255,255,255,0.7),0_14px_0_rgba(23,37,84,0.08)]'>
                            <Image
                                src={story.img || story.face || DEFAULT_STORY_IMAGE}
                                width={260}
                                height={260}
                                className='h-[190px] w-[190px] rounded-[22px] object-contain sm:h-[230px] sm:w-[230px] md:h-[260px] md:w-[260px]'
                                alt={story.title}
                                priority
                            />
                        </div>
                    </div>

                    <section className='rounded-[28px] bg-[#f2fbff] p-4 shadow-inner sm:p-5 md:p-6'>
                        <StoryText
                            activeSection={section}
                            onLookupWord={lookupDefinition}
                            onPlayWord={playWord}
                            renderableTokens={renderableTokens}
                            section={READING_SECTION_ORDER[1]}
                            text={story.content}
                        />
                    </section>

                    <section className='mt-5 rounded-[28px] bg-[#fff4bf] p-4 shadow-inner sm:p-5 md:p-6'>
                        <p className='mb-3 text-center text-xs font-black uppercase tracking-[0.16em] text-[#8a5a00]'>Moraleja final</p>
                        <StoryText
                            activeSection={section}
                            className='text-center font-black text-[#14213d]'
                            onLookupWord={lookupDefinition}
                            onPlayWord={playWord}
                            renderableTokens={renderableTokens}
                            section={READING_SECTION_ORDER[2]}
                            text={story.teaching}
                        />
                    </section>
                    </div>
                </article>
            </div>

            <DictionaryModal definition={definition} onClose={closeDefinition} />

            <SpeechToText
                error={error}
                interimResult={interimResult}
                isRecording={isRecording}
                results={results}
                startSpeechToText={startSpeechToText}
                stopSpeechToText={stopSpeechToText}
                setValue={setSpeechValue}
                value={speechValue}
                resetKey={section}
                currentWord={currentWord}
                missedStreak={session.missedStreak}
                onSpeech={handleSpeech}
            />
        </div>
    )
}
