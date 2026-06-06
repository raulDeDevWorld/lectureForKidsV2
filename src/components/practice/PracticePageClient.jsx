'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
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
        badge: 'Entrenador diario',
        description: '10 retos mezclados con sonido, palabra e imagen.',
        prompt: 'Que vocal escuchas en uva?',
        answer: 'U',
        options: ['U', 'A', 'O'],
        samples: ['A', 'E', 'I', 'O', 'U'],
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

const VOWEL_ROUND_SIZE = 10
const VOWEL_EXERCISE_TYPES = ['listen', 'image', 'complete', 'match', 'hidden']

function shuffleItems(items) {
    return [...items].sort(() => Math.random() - 0.5)
}

function buildVowelRound(items) {
    const vowelItems = items.filter((item) => item.value && item.word)
    const orderedItems = shuffleItems(vowelItems)
    const orderedTypes = shuffleItems(VOWEL_EXERCISE_TYPES)

    return Array.from({ length: VOWEL_ROUND_SIZE }, (_, index) => {
        const target = orderedItems[index % orderedItems.length]
        const type = orderedTypes[index % orderedTypes.length]

        return buildVowelQuestion(target, vowelItems, type, index)
    })
}

function buildVowelQuestion(target, items, type, index) {
    if (type === 'match') {
        return {
            id: `${type}-${target.value}-${index}`,
            type,
            badge: 'Asocia',
            prompt: `Que palabra empieza con ${target.value}?`,
            instruction: 'Elige la palabra correcta.',
            target,
            answer: target.word,
            answerLabel: target.word,
            options: buildOptions(items, target.value, (item) => ({
                label: item.word,
                value: item.word,
            })),
            speakText: `Busca una palabra que empieza con ${target.value}`,
        }
    }

    const questionByType = {
        complete: {
            badge: 'Completa',
            prompt: `Completa la palabra ${blankFirstLetter(target.word)}`,
            instruction: 'Toca la vocal que falta.',
            speakText: `${target.example}. Completa la palabra ${target.word}`,
        },
        hidden: {
            badge: 'Encuentra',
            prompt: `Que vocal escuchas al inicio de ${target.word}?`,
            instruction: 'Observa la palabra y elige.',
            speakText: `${target.word} empieza con ${target.value}`,
        },
        image: {
            badge: 'Mira',
            prompt: `Con que vocal empieza ${target.word}?`,
            instruction: 'Mira la imagen y responde.',
            speakText: target.example,
        },
        listen: {
            badge: 'Escucha',
            prompt: 'Escucha la palabra y elige la vocal inicial.',
            instruction: 'Pulsa escuchar si necesitas ayuda.',
            speakText: target.example,
        },
    }
    const copy = questionByType[type] || questionByType.listen

    return {
        id: `${type}-${target.value}-${index}`,
        type,
        ...copy,
        target,
        answer: target.value,
        answerLabel: target.value,
        options: buildOptions(items, target.value, (item) => ({
            label: item.value,
            value: item.value,
        })),
    }
}

function buildOptions(items, correctValue, mapOption) {
    const correct = items.find((item) => item.value === correctValue)
    const wrongOptions = shuffleItems(items.filter((item) => item.value !== correctValue)).slice(0, 2)

    return shuffleItems([correct, ...wrongOptions]).map(mapOption)
}

function blankFirstLetter(word) {
    return `_${word.slice(1)}`
}

function speakText(text) {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
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
        speakText(activeActivity.speakText)
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

    if (activeActivity.id === 'vocales') {
        return (
            <VowelPracticeTrainer
                activity={activeActivity}
                styles={styles}
                onBack={leaveActivity}
            />
        )
    }

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

function VowelPracticeTrainer({ activity, styles, onBack }) {
    const [round, setRound] = useState(() => buildVowelRound(activity.items))
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState('')
    const [answers, setAnswers] = useState([])
    const currentQuestion = round[currentIndex]
    const score = answers.filter((answer) => answer.correct).length
    const progress = Math.round((answers.length / round.length) * 100)
    const finished = currentIndex >= round.length
    const missedVowels = [...new Set(answers
        .filter((answer) => !answer.correct)
        .map((answer) => answer.question.target.value))]

    function chooseAnswer(option) {
        if (!currentQuestion || selectedAnswer) return

        const correct = option.value === currentQuestion.answer
        setSelectedAnswer(option.value)
        setAnswers((current) => [
            ...current,
            {
                correct,
                question: currentQuestion,
                selected: option.label,
            },
        ])
    }

    function nextQuestion() {
        if (currentIndex >= round.length - 1) {
            setCurrentIndex(round.length)
        } else {
            setCurrentIndex((current) => current + 1)
        }
        setSelectedAnswer('')
    }

    function restartRound() {
        window.speechSynthesis?.cancel()
        setRound(buildVowelRound(activity.items))
        setCurrentIndex(0)
        setSelectedAnswer('')
        setAnswers([])
    }

    function speakCurrentQuestion() {
        if (!currentQuestion) return
        speakText(currentQuestion.speakText)
    }

    if (finished) {
        return (
            <section className={`overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_18px_52px_rgba(31,42,68,0.12)] ring-1 ${styles.ring}`}>
                <div className={`${styles.panel} p-5 sm:p-6`}>
                    <div className='flex items-start gap-4'>
                        <button
                            type='button'
                            onClick={onBack}
                            className='inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#1F2A44] shadow-[0_8px_24px_rgba(31,42,68,0.10)] transition active:scale-95'
                            aria-label='Volver a retos'
                        >
                            <ArrowLeftIcon className='h-6 w-6' />
                        </button>
                        <div className='min-w-0'>
                            <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Reporte para padres</p>
                            <h2 className='mt-1 text-3xl font-black leading-tight text-[#1F2A44]'>Ronda terminada</h2>
                            <p className='mt-2 text-sm font-bold leading-6 text-[#5B6477]'>
                                Practico sonido, palabra e imagen con las vocales de Aprender.
                            </p>
                        </div>
                    </div>
                </div>

                <div className='grid gap-4 p-5 sm:grid-cols-3'>
                    <ResultStat label='Aciertos' value={`${score}/${round.length}`} />
                    <ResultStat label='Dominio' value={`${Math.round((score / round.length) * 100)}%`} />
                    <ResultStat label='Retos' value={round.length} />
                </div>

                <div className='px-5 pb-5'>
                    <div className='rounded-[1.7rem] bg-[#F8FBFF] p-4 ring-1 ring-[#E7EEF8]'>
                        <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Recomendacion</p>
                        <p className='mt-2 text-base font-black leading-6 text-[#1F2A44]'>
                            {missedVowels.length
                                ? `Necesita reforzar: ${missedVowels.join(', ')}.`
                                : 'Domina esta ronda. Puede repetir para ganar seguridad.'}
                        </p>
                    </div>
                    <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                        <button
                            type='button'
                            onClick={restartRound}
                            className='min-h-14 rounded-[1.4rem] bg-[#1D4E89] px-5 text-base font-black text-white shadow-[0_8px_0_rgba(29,78,137,0.18)] transition active:translate-y-1 active:shadow-none'
                        >
                            Practicar otra vez
                        </button>
                        <button
                            type='button'
                            onClick={onBack}
                            className='min-h-14 rounded-[1.4rem] bg-[#F3F4F6] px-5 text-base font-black text-[#1F2A44] shadow-[0_8px_0_rgba(31,42,68,0.08)] transition active:translate-y-1 active:shadow-none'
                        >
                            Volver a retos
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className={`overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_18px_52px_rgba(31,42,68,0.12)] ring-1 ${styles.ring}`}>
            <div className={`${styles.panel} p-5 sm:p-6`}>
                <div className='grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-start'>
                    <button
                        type='button'
                        onClick={onBack}
                        className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1F2A44] shadow-[0_8px_24px_rgba(31,42,68,0.10)] transition active:scale-95'
                        aria-label='Volver a retos'
                    >
                        <ArrowLeftIcon className='h-6 w-6' />
                    </button>
                    <div className='min-w-0 sm:pt-1'>
                        <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Entrenador de vocales</p>
                        <h2 className='mt-1 text-3xl font-black leading-tight text-[#1F2A44]'>{activity.title}</h2>
                        <p className='mt-2 text-sm font-bold leading-6 text-[#5B6477]'>
                            Ronda de 10 retos con A, E, I, O y U.
                        </p>
                    </div>
                    <div className='shrink-0 rounded-[1.2rem] bg-white/85 px-4 py-3 text-center shadow-sm ring-1 ring-white/80'>
                        <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Puntos</p>
                        <p className='mt-1 text-2xl font-black text-[#1F2A44]'>{score}</p>
                    </div>
                </div>

                <div className='mt-5'>
                    <div className='flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>
                        <span>Reto {currentIndex + 1} de {round.length}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className='mt-2 h-3 overflow-hidden rounded-full bg-white/80'>
                        <div className='h-full rounded-full bg-[#1D4E89] transition-all' style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            <div className='grid gap-4 p-5 lg:grid-cols-[1fr_1.15fr]'>
                <div className='rounded-[1.7rem] bg-[#F8FBFF] p-4 ring-1 ring-[#E7EEF8]'>
                    <div className='flex items-start justify-between gap-3'>
                        <div>
                            <p className='w-fit rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>{currentQuestion.badge}</p>
                            <h3 className='mt-3 text-2xl font-black leading-tight text-[#1F2A44]'>{currentQuestion.prompt}</h3>
                            <p className='mt-2 text-sm font-bold leading-5 text-[#5B6477]'>{currentQuestion.instruction}</p>
                        </div>
                        <button
                            type='button'
                            onClick={speakCurrentQuestion}
                            className='inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#1D4E89] shadow-[0_8px_22px_rgba(31,42,68,0.10)] transition active:scale-95'
                            aria-label='Escuchar reto'
                        >
                            <SpeakerIcon className='h-6 w-6' />
                        </button>
                    </div>

                    <VowelQuestionVisual question={currentQuestion} styles={styles} />
                </div>

                <div className='flex flex-col justify-between gap-4'>
                    <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-1'>
                        {currentQuestion.options.map((option) => {
                            const selected = selectedAnswer === option.value
                            const correctOption = option.value === currentQuestion.answer
                            const showCorrect = selectedAnswer && correctOption
                            const showWrong = selected && !correctOption

                            return (
                                <button
                                    key={`${currentQuestion.id}-${option.value}`}
                                    type='button'
                                    onClick={() => chooseAnswer(option)}
                                    className={`min-h-16 rounded-[1.4rem] px-5 text-lg font-black shadow-[0_7px_0_rgba(31,42,68,0.08)] transition active:translate-y-1 active:shadow-none ${
                                        showCorrect
                                            ? 'bg-[#BFE8D4] text-[#1F2A44]'
                                            : showWrong
                                                ? 'bg-[#FFC3A1] text-[#1F2A44]'
                                                : selectedAnswer
                                                    ? 'bg-[#F8FBFF] text-[#8A91A3]'
                                                    : 'bg-[#F3F4F6] text-[#1F2A44]'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>

                    {selectedAnswer ? (
                        <div className={`rounded-[1.4rem] px-4 py-3 text-sm font-black ${selectedAnswer === currentQuestion.answer ? 'bg-[#EAF8F1] text-[#237A4D]' : 'bg-[#FFF0E8] text-[#A0471D]'}`}>
                            {selectedAnswer === currentQuestion.answer
                                ? 'Correcto. Muy bien.'
                                : `La respuesta correcta es ${currentQuestion.answerLabel}.`}
                        </div>
                    ) : null}

                    <button
                        type='button'
                        onClick={nextQuestion}
                        disabled={!selectedAnswer}
                        className='min-h-14 rounded-[1.4rem] bg-[#1D4E89] px-5 text-base font-black text-white shadow-[0_8px_0_rgba(29,78,137,0.18)] transition enabled:active:translate-y-1 enabled:active:shadow-none disabled:cursor-not-allowed disabled:bg-[#CBD5E1] disabled:shadow-none'
                    >
                        {currentIndex >= round.length - 1 ? 'Ver resultado' : 'Siguiente reto'}
                    </button>
                </div>
            </div>
        </section>
    )
}

function VowelQuestionVisual({ question, styles }) {
    if (question.type === 'image' && question.target.imageUrl) {
        return (
            <div className='mt-5 grid gap-3 sm:grid-cols-[150px_1fr] sm:items-center'>
                <div className='relative aspect-square overflow-hidden rounded-[1.4rem] bg-white shadow-sm ring-1 ring-white'>
                    <Image
                        src={question.target.imageUrl}
                        width={320}
                        height={320}
                        alt={question.target.example}
                        className='h-full w-full object-cover'
                    />
                    <span className={`absolute left-3 top-3 flex h-12 w-12 items-center justify-center rounded-full ${styles.sample} text-2xl font-black shadow-sm`}>
                        ?
                    </span>
                </div>
                <p className='rounded-[1.4rem] bg-white px-4 py-5 text-xl font-black leading-tight text-[#1F2A44] shadow-sm'>
                    {question.target.word}
                </p>
            </div>
        )
    }

    if (question.type === 'complete') {
        return (
            <div className='mt-5 rounded-[1.5rem] bg-white px-5 py-6 text-center shadow-sm'>
                <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Completa</p>
                <p className='mt-2 text-5xl font-black leading-none text-[#1F2A44]'>{blankFirstLetter(question.target.word)}</p>
            </div>
        )
    }

    if (question.type === 'match') {
        return (
            <div className='mt-5 rounded-[1.5rem] bg-white px-5 py-6 text-center shadow-sm'>
                <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Vocal</p>
                <p className={`mx-auto mt-3 flex h-24 w-24 items-center justify-center rounded-[1.5rem] ${styles.sample} text-6xl font-black leading-none`}>
                    {question.target.value}
                </p>
            </div>
        )
    }

    if (question.type === 'hidden') {
        return (
            <div className='mt-5 rounded-[1.5rem] bg-white px-5 py-6 text-center shadow-sm'>
                <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Palabra</p>
                <p className='mt-2 text-4xl font-black leading-none text-[#1F2A44]'>{question.target.word}</p>
            </div>
        )
    }

    return (
        <div className='mt-5 rounded-[1.5rem] bg-white px-5 py-6 text-center shadow-sm'>
            <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Escucha</p>
            <div className={`mx-auto mt-3 flex h-24 w-24 items-center justify-center rounded-[1.5rem] ${styles.sample}`}>
                <SpeakerIcon className='h-11 w-11' />
            </div>
        </div>
    )
}

function ResultStat({ label, value }) {
    return (
        <div className='rounded-[1.5rem] bg-[#F8FBFF] px-4 py-5 text-center ring-1 ring-[#E7EEF8]'>
            <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>{label}</p>
            <p className='mt-2 text-3xl font-black leading-none text-[#1F2A44]'>{value}</p>
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
