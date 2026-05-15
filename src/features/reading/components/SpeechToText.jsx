'use client'

import { useEffect, useRef } from 'react'
import { SPEECH_EVENT_TYPE } from '@/lib/readingMatcher'
import style from './SpeechToText.module.css'

export function SpeechToText({
    setValue,
    value,
    resetKey,
    currentWord,
    missedStreak,
    onSpeech,
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
}) {
    const processedFinalCountRef = useRef(0)
    const lastInterimRef = useRef('')
    const resultsLengthRef = useRef(0)

    useEffect(() => {
        resultsLengthRef.current = results.length
    }, [results.length])

    useEffect(() => {
        processedFinalCountRef.current = resultsLengthRef.current
        lastInterimRef.current = ''
        setValue('')
    }, [resetKey, setValue])

    useEffect(() => {
        if (!interimResult) return
        if (interimResult === lastInterimRef.current) return

        lastInterimRef.current = interimResult
        onSpeech(interimResult, SPEECH_EVENT_TYPE.INTERIM)

        const finalTranscript = results.map((result) => result.transcript).join(' ')
        setValue(`${finalTranscript} ${interimResult}`.trim())
    }, [interimResult, isRecording, onSpeech, results, setValue])

    useEffect(() => {
        if (results.length <= processedFinalCountRef.current) return

        const newResults = results.slice(processedFinalCountRef.current)
        processedFinalCountRef.current = results.length
        const finalSpeech = newResults.map((result) => result.transcript).join(' ').trim()

        if (finalSpeech) {
            onSpeech(finalSpeech, SPEECH_EVENT_TYPE.FINAL)
            setValue(results.map((result) => result.transcript).join(' '))
        }
    }, [onSpeech, results, setValue])

    const helperText = isRecording
        ? missedStreak >= 3
            ? 'Intenta repetir la palabra resaltada'
            : currentWord
                ? `Ahora lee: ${currentWord}`
                : 'Sigue leyendo'
        : error
            ? 'El reconocimiento de voz no esta disponible en este navegador.'
            : 'Presiona el microfono y empieza a leer'

    const canRecord = !error
    const buttonBackground = isRecording ? '#ff6b6b' : '#172554'

    return (
        <div className='pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3'>
            <div className='pointer-events-auto flex w-full max-w-3xl items-center gap-3 rounded-[30px] bg-white p-3 shadow-[0_12px_0_rgba(23,37,84,0.10),0_22px_60px_rgba(23,37,84,0.22)]'>
                <div className='min-w-0 flex-1'>
                    <p className='text-[11px] font-black uppercase tracking-[0.16em] text-[#ff6b6b]'>
                        {isRecording ? 'Escuchando' : 'Practica de lectura'} · Microfono
                    </p>
                    <div className='mt-1 line-clamp-2 min-h-[42px] rounded-2xl bg-[#fff7df] px-4 py-2 text-sm font-black leading-6 text-[#172554] sm:text-base'>
                        {value || helperText}
                    </div>
                    <button
                        type='button'
                        className='mt-2 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black shadow-[0_5px_0_rgba(23,37,84,0.16)] transition active:translate-y-0.5 active:shadow-none'
                        style={{
                            backgroundColor: buttonBackground,
                            border: '3px solid #FFD166',
                            color: '#FFFFFF',
                            cursor: canRecord ? 'pointer' : 'not-allowed',
                            opacity: canRecord ? 1 : 0.55,
                        }}
                        onClick={canRecord ? (isRecording ? stopSpeechToText : startSpeechToText) : undefined}
                        disabled={!canRecord}
                    >
                        <span className={isRecording ? style.spinnerContainer : ''} style={{ height: 28, margin: 0, width: 28 }}>
                            <span className={isRecording ? style.spinner : ''} style={{ display: 'inline-flex', height: 28, width: 28 }}>
                                <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' aria-hidden='true'>
                                    <path
                                        fill='none'
                                        stroke='white'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2.2'
                                        d='M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z'
                                    />
                                </svg>
                            </span>
                        </span>
                        {isRecording ? 'Detener microfono' : 'Activar microfono'}
                    </button>
                </div>
            </div>
        </div>
    )
}
