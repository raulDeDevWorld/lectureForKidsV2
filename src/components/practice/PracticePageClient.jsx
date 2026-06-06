'use client'

import { useMemo, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, BookIcon, GameIcon, MicrophoneIcon, SpeakerIcon, StarIcon } from '@/components/icons/Icons'

const activityStyles = {
    blue: {
        accent: 'bg-[#A7D8F5]',
        action: 'bg-[#EAF7FF] text-[#1D4E89]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#F4FBFF_42%,#B7E3FA_100%)]',
        icon: 'bg-[#EAF7FF] text-[#1D4E89]',
        panel: 'bg-[#F4FBFF]',
        ring: 'ring-[#D7ECFA]',
        sample: 'bg-[#EAF7FF] text-[#1D4E89]',
        selected: 'ring-[#1D4E89]',
    },
    mint: {
        accent: 'bg-[#BFE8D4]',
        action: 'bg-[#EAF8F1] text-[#237A4D]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#F6FFF9_42%,#BFE8D4_100%)]',
        icon: 'bg-[#EAF8F1] text-[#237A4D]',
        panel: 'bg-[#F6FFF9]',
        ring: 'ring-[#D8F0E4]',
        sample: 'bg-[#EAF8F1] text-[#237A4D]',
        selected: 'ring-[#237A4D]',
    },
    peach: {
        accent: 'bg-[#FFC3A1]',
        action: 'bg-[#FFF1E8] text-[#A64B22]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF8F3_42%,#FFC3A1_100%)]',
        icon: 'bg-[#FFF1E8] text-[#A64B22]',
        panel: 'bg-[#FFF8F3]',
        ring: 'ring-[#FFE0CF]',
        sample: 'bg-[#FFF1E8] text-[#A64B22]',
        selected: 'ring-[#A64B22]',
    },
    yellow: {
        accent: 'bg-[#FFD166]',
        action: 'bg-[#FFF7CC] text-[#8A5A00]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#FFFBEA_42%,#FFD166_100%)]',
        icon: 'bg-[#FFF7CC] text-[#8A5A00]',
        panel: 'bg-[#FFFBEA]',
        ring: 'ring-[#FFE8A3]',
        sample: 'bg-[#FFF7CC] text-[#8A5A00]',
        selected: 'ring-[#8A5A00]',
    },
}

const activityMeta = {
    vocales: {
        icon: MicrophoneIcon,
        title: 'Vocales',
        badge: 'Escucha y elige',
        description: 'Reconoce la vocal correcta.',
        prompt: 'Que vocal escuchas en uva?',
        answer: 'U',
        options: ['U', 'A', 'O'],
        samples: ['U', 'A', 'O'],
        speakText: 'U de uva',
    },
    abecedario: {
        icon: BookIcon,
        title: 'Letras',
        badge: 'Letra inicial',
        description: 'Encuentra como empieza la palabra.',
        prompt: 'Con que letra empieza casa?',
        answer: 'C',
        options: ['C', 'S', 'K'],
        samples: ['C', 'S', 'K'],
        speakText: 'Casa empieza con C',
    },
    numeros: {
        icon: GameIcon,
        title: 'Numeros',
        badge: 'Numero y palabra',
        description: 'Une el numero con su nombre.',
        prompt: 'Como se escribe 4?',
        answer: 'cuatro',
        options: ['cuatro', 'siete', 'dos'],
        samples: ['1', '4', '7'],
        speakText: 'Cuatro',
    },
    silabas: {
        icon: StarIcon,
        title: 'Silabas',
        badge: 'Completa la palabra',
        description: 'Toca la silaba que falta.',
        prompt: 'Que silaba completa pa-to?',
        answer: 'pa',
        options: ['pa', 'me', 'su'],
        samples: ['pa', 'me', 'su'],
        speakText: 'pa, como en pato',
    },
}

export function PracticePageClient({ modules }) {
    const activities = useMemo(() => modules.map((module) => ({
        ...module,
        ...activityMeta[module.id],
        color: module.color,
    })), [modules])
    const [activeId, setActiveId] = useState(null)
    const [selectedAnswer, setSelectedAnswer] = useState('')
    const [score, setScore] = useState(0)
    const activeActivity = activities.find((activity) => activity.id === activeId) || null

    function chooseActivity(activityId) {
        setActiveId(activityId)
        setSelectedAnswer('')
    }

    function leaveActivity() {
        setActiveId(null)
        setSelectedAnswer('')
        window.speechSynthesis?.cancel()
    }

    function chooseAnswer(option) {
        if (!activeActivity) return

        setSelectedAnswer(option)
        if (option === activeActivity.answer && selectedAnswer !== activeActivity.answer) {
            setScore((current) => current + 1)
        }
    }

    function speakCurrentChallenge() {
        if (!activeActivity) return
        if (!('speechSynthesis' in window)) return

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(activeActivity.speakText)
        utterance.lang = 'es-ES'
        utterance.rate = 0.9
        window.speechSynthesis.speak(utterance)
    }

    if (!activeActivity) {
        return (
            <section className='grid gap-4 sm:grid-cols-2'>
                {activities.map((activity) => (
                    <PracticeActivityCard
                        key={activity.id}
                        activity={activity}
                        onSelect={() => chooseActivity(activity.id)}
                    />
                ))}
            </section>
        )
    }

    const styles = activityStyles[activeActivity.color] || activityStyles.blue

    return (
        <div className='space-y-5'>
            <section className={`overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_18px_52px_rgba(31,42,68,0.12)] ring-1 ${styles.ring}`}>
                <div className={`${styles.panel} p-5 sm:p-6`}>
                    <div className='grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-start'>
                        <button
                            type='button'
                            onClick={leaveActivity}
                            className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1F2A44] shadow-[0_8px_24px_rgba(31,42,68,0.10)] transition active:scale-95'
                            aria-label='Volver a retos'
                        >
                            <ArrowLeftIcon className='h-6 w-6' />
                        </button>
                        <div className='min-w-0 sm:pt-1'>
                            <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Reto activo</p>
                            <h2 className='mt-1 text-3xl font-black leading-tight text-[#1F2A44]'>{activeActivity.title}</h2>
                            <p className='mt-2 text-sm font-bold leading-6 text-[#5B6477]'>{activeActivity.badge}. {activeActivity.description}</p>
                        </div>
                        <div className='shrink-0 rounded-[1.2rem] bg-white/85 px-4 py-3 text-center shadow-sm ring-1 ring-white/80'>
                            <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Puntos</p>
                            <p className='mt-1 text-2xl font-black text-[#1F2A44]'>{score}</p>
                        </div>
                    </div>
                </div>

                <div className='grid gap-4 p-5 lg:grid-cols-[1fr_1.15fr]'>
                    <div className='rounded-[1.7rem] bg-[#F8FBFF] p-4'>
                        <button
                            type='button'
                            onClick={speakCurrentChallenge}
                            className='flex min-h-14 w-full items-center justify-center gap-3 rounded-[1.4rem] bg-white px-5 text-base font-black text-[#1F2A44] shadow-[inset_0_0_0_2px_#E7EEF8,0_8px_0_rgba(31,42,68,0.08)] transition active:translate-y-1 active:shadow-[inset_0_0_0_2px_#E7EEF8]'
                        >
                            <SpeakerIcon className='h-6 w-6' />
                            Escuchar reto
                        </button>
                        <p className='mt-4 rounded-[1.3rem] bg-white px-4 py-4 text-xl font-black leading-tight text-[#1F2A44] shadow-sm'>
                            {activeActivity.prompt}
                        </p>
                    </div>

                    <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-1'>
                        {activeActivity.options.map((option) => {
                            const selected = selectedAnswer === option
                            const correct = selected && option === activeActivity.answer
                            const wrong = selected && option !== activeActivity.answer

                            return (
                                <button
                                    key={`${activeActivity.id}-${option}`}
                                    type='button'
                                    onClick={() => chooseAnswer(option)}
                                    className={`min-h-16 rounded-[1.4rem] px-5 text-lg font-black shadow-[0_7px_0_rgba(31,42,68,0.08)] transition active:translate-y-1 active:shadow-none ${
                                        correct
                                            ? 'bg-[#BFE8D4] text-[#1F2A44]'
                                            : wrong
                                                ? 'bg-[#FFC3A1] text-[#1F2A44]'
                                                : 'bg-[#F3F4F6] text-[#1F2A44]'
                                    }`}
                                >
                                    {option}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {selectedAnswer ? (
                    <p className={`mx-5 mb-5 rounded-2xl px-4 py-3 text-sm font-black ${selectedAnswer === activeActivity.answer ? 'bg-[#EAF8F1] text-[#237A4D]' : 'bg-[#FFF0E8] text-[#A0471D]'}`}>
                        {selectedAnswer === activeActivity.answer ? 'Correcto.' : `Intenta otra vez. La respuesta es ${activeActivity.answer}.`}
                    </p>
                ) : null}
            </section>
        </div>
    )
}

function PracticeActivityCard({ active = false, activity, onSelect }) {
    const styles = activityStyles[activity.color] || activityStyles.blue
    const Icon = activity.icon

    return (
        <button type='button' onClick={onSelect} className='group block w-full text-left'>
            <article className={`relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[1.65rem] p-4 shadow-[0_14px_34px_rgba(31,42,68,0.08)] ${active ? `ring-2 ${styles.selected}` : `ring-1 ${styles.ring}`} ${styles.background} transition active:scale-[0.98] md:hover:-translate-y-1 md:hover:shadow-[0_18px_42px_rgba(31,42,68,0.12)]`}>
                <span className={`absolute inset-x-0 top-0 h-1.5 ${styles.accent}`} />
                <span className='pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-white/45' />
                <span className='pointer-events-none absolute -bottom-10 right-8 h-20 w-20 rounded-full bg-white/30' />
                <div className='relative z-10 flex items-start justify-between gap-3'>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-[1.1rem] ${styles.icon}`}>
                        <Icon className='h-7 w-7 stroke-[2.4]' />
                    </div>
                    <span className='flex h-9 w-9 items-center justify-center rounded-full bg-[#F8FBFF] text-[#1F2A44] transition group-hover:translate-x-0.5'>
                        <ArrowRightIcon className='h-5 w-5' />
                    </span>
                </div>

                <div className='relative z-10 mt-5 flex justify-end gap-2'>
                    {activity.samples.map((sample) => (
                        <span
                            key={`${activity.id}-${sample}`}
                            className={`flex h-11 min-w-11 items-center justify-center rounded-[1rem] px-3 text-xl font-black leading-none shadow-sm ring-1 ring-white/70 ${styles.sample}`}
                        >
                            {sample}
                        </span>
                    ))}
                </div>

                <div className='relative z-10 mt-5'>
                    <p className='w-fit rounded-full bg-white/75 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>{activity.badge}</p>
                    <h3 className='mt-3 text-2xl font-black leading-none text-[#1F2A44]'>{activity.title}</h3>
                    <p className='mt-2 line-clamp-2 text-sm font-bold leading-5 text-[#5B6477]'>{activity.description}</p>
                    <span className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] ${styles.action}`}>
                        Practicar
                    </span>
                </div>
            </article>
        </button>
    )
}
