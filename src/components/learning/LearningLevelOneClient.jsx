'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SpeakerIcon, StarIcon } from '@/components/icons/Icons'

const moduleColors = {
    blue: {
        active: 'bg-[#A7D8F5] text-[#1F2A44] shadow-inner',
        card: 'bg-[linear-gradient(135deg,#F8FCFF,#E4F4FD)]',
        tile: 'bg-[#DFF2FD]',
    },
    mint: {
        active: 'bg-[#BFE8D4] text-[#1F2A44] shadow-inner',
        card: 'bg-[linear-gradient(135deg,#FBFFFD,#EAF8F1)]',
        tile: 'bg-[#E0F6EA]',
    },
    yellow: {
        active: 'bg-[#FFD166] text-[#1F2A44] shadow-inner',
        card: 'bg-[linear-gradient(135deg,#FFFFF7,#FFF7DC)]',
        tile: 'bg-[#FFF0B8]',
    },
    peach: {
        active: 'bg-[#FFC3A1] text-[#1F2A44] shadow-inner',
        card: 'bg-[linear-gradient(135deg,#FFFCFA,#FFF0E8)]',
        tile: 'bg-[#FFE1D0]',
    },
}

export function LearningLevelOneClient({ modules }) {
    const activeModule = modules[0]
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [spokenValue, setSpokenValue] = useState(null)
    const colors = moduleColors[activeModule.color] || moduleColors.blue
    const isCorrect = selectedAnswer === activeModule.quiz.answer

    function speak(text) {
        if (!('speechSynthesis' in window)) return

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'es-ES'
        utterance.rate = 0.86
        window.speechSynthesis.speak(utterance)
        setSpokenValue(text)
    }

    return (
        <div className='space-y-5'>
            <section className={`${colors.card} rounded-[2rem] p-4 shadow-[0_16px_42px_rgba(31,42,68,0.10)] ring-1 ring-white/80 sm:p-5`}>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                    <div>
                        <p className='w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>{activeModule.badge}</p>
                        <h2 className='mt-2 text-3xl font-black leading-tight text-[#1F2A44]'>{activeModule.title}</h2>
                        <p className='mt-1 text-sm font-bold text-[#6B7280]'>{activeModule.prompt}</p>
                    </div>
                    <button
                        type='button'
                        onClick={() => speak(activeModule.title)}
                        className='inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#1F2A44] shadow-[0_8px_22px_rgba(31,42,68,0.10)] transition active:scale-95'
                        aria-label={`Escuchar ${activeModule.title}`}
                    >
                        <SpeakerIcon className='h-6 w-6' />
                    </button>
                </div>

                <div className='mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5'>
                    {activeModule.items.map((item) => (
                        <button
                            key={`${activeModule.id}-${item.value}-${item.word}`}
                            type='button'
                            onClick={() => speak(item.example)}
                            className='group min-h-[132px] rounded-[1.5rem] bg-white/85 p-3 text-left shadow-[0_10px_26px_rgba(31,42,68,0.08)] ring-1 ring-white/80 transition active:scale-[0.98] md:hover:-translate-y-0.5'
                        >
                            {item.imageUrl ? (
                                <span className='relative block aspect-square w-full overflow-hidden rounded-[1.2rem] bg-white'>
                                    <Image
                                        src={item.imageUrl}
                                        width={240}
                                        height={240}
                                        alt={item.example}
                                        className='h-full w-full object-cover'
                                    />
                                    {activeModule.id !== 'numeros' ? (
                                        <span className={`absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-full ${colors.tile} text-2xl font-black leading-none text-[#1F2A44] shadow-sm`}>
                                            {item.value}
                                        </span>
                                    ) : null}
                                </span>
                            ) : (
                                <span className={`flex h-16 w-full items-center justify-center rounded-[1.2rem] ${colors.tile} text-4xl font-black leading-none text-[#1F2A44]`}>
                                    {item.value}
                                </span>
                            )}
                            <span className='mt-3 block truncate text-base font-black text-[#1F2A44]'>{item.word}</span>
                            <span className='mt-1 flex items-center gap-1 text-xs font-black uppercase tracking-[0.1em] text-[#7A8194]'>
                                <SpeakerIcon className='h-3.5 w-3.5' />
                                Escuchar
                            </span>
                        </button>
                    ))}
                </div>

                {spokenValue ? (
                    <p className='mt-4 rounded-2xl bg-white/75 px-4 py-3 text-sm font-black text-[#7A8194]'>
                        Escuchando: {spokenValue}
                    </p>
                ) : null}
            </section>

            <section className='rounded-[2rem] bg-white/85 p-4 shadow-[0_16px_42px_rgba(31,42,68,0.10)] ring-1 ring-white/80 sm:p-5'>
                <div className='flex items-start gap-3'>
                    <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF7CC] text-[#8A5A00]'>
                        <StarIcon className='h-6 w-6' />
                    </div>
                    <div className='min-w-0'>
                        <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Práctica rápida</p>
                        <h3 className='mt-1 text-xl font-black leading-tight text-[#1F2A44]'>{activeModule.quiz.question}</h3>
                    </div>
                </div>

                <div className='mt-4 grid gap-3 sm:grid-cols-3'>
                    {activeModule.quiz.options.map((option) => {
                        const selected = selectedAnswer === option
                        const correctSelected = selected && option === activeModule.quiz.answer
                        const wrongSelected = selected && option !== activeModule.quiz.answer

                        return (
                            <button
                                key={`${activeModule.id}-${option}`}
                                type='button'
                                onClick={() => setSelectedAnswer(option)}
                                className={`min-h-14 rounded-2xl px-4 py-3 text-lg font-black shadow-[0_7px_0_rgba(31,42,68,0.08)] transition active:translate-y-1 active:shadow-none ${
                                    correctSelected
                                        ? 'bg-[#BFE8D4] text-[#1F2A44]'
                                        : wrongSelected
                                            ? 'bg-[#FFC3A1] text-[#1F2A44]'
                                            : 'bg-[#F3F4F6] text-[#1F2A44]'
                                }`}
                            >
                                {option}
                            </button>
                        )
                    })}
                </div>

                {selectedAnswer ? (
                    <div className={`mt-4 rounded-2xl px-4 py-3 text-sm font-black ${isCorrect ? 'bg-[#EAF8F1] text-[#237A4D]' : 'bg-[#FFF0E8] text-[#A0471D]'}`}>
                        {isCorrect ? 'Correcto. Muy bien.' : `Intenta otra vez. La respuesta es ${activeModule.quiz.answer}.`}
                    </div>
                ) : null}
            </section>
        </div>
    )
}
