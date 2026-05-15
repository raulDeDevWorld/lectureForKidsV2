'use client'

import { useEffect, useRef } from 'react'
import style from '@/components/SpeechToText.module.css'
import { SPEECH_EVENT_TYPE } from '@/lib/readingMatcher'

function SpeechToText({
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

    useEffect(() => {
        processedFinalCountRef.current = results.length
        lastInterimRef.current = ''
        setValue('')
    }, [resetKey, setValue])

    useEffect(() => {
        if (!isRecording || !interimResult) return
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

    if (error) {
        return (
            <div className='fixed bottom-4 left-4 right-4 z-20 rounded-lg border-4 border-[#ffd166] bg-white p-4 text-center text-sm font-bold text-[#1f3a5f] shadow'>
                El reconocimiento de voz no esta disponible en este navegador.
            </div>
        )
    }

    const helperText = isRecording
        ? missedStreak >= 3
            ? 'Intenta repetir la palabra resaltada'
            : currentWord
                ? `Ahora lee: ${currentWord}`
                : 'Sigue leyendo'
        : 'Presiona el microfono y empieza a leer'

    return (
        <div className='fixed bottom-4 left-0 right-0 z-10 flex justify-center px-4 pointer-events-none'>
            <div className='flex w-full max-w-3xl items-center gap-3 rounded-full border-4 border-white bg-white/95 p-3 shadow-[0_8px_0_rgba(15,23,42,0.14)] pointer-events-auto'>
                <div className={isRecording ? style.spinnerContainer : ''}>
                    <div className={isRecording ? style.spinner : ''}>
                        <button
                            type='button'
                            className={`relative z-50 flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border-4 p-2 shadow transition-all ${isRecording ? 'border-[#ef6c00] bg-[#ff8a65]' : 'border-[#ffd166] bg-[#fff2b8]'} ${style.animation}`}
                            onClick={isRecording ? stopSpeechToText : startSpeechToText}
                            aria-label={isRecording ? 'Detener lectura' : 'Iniciar lectura'}
                        >
                            <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'>
                                <path
                                    fill='none'
                                    stroke={isRecording ? 'white' : '#1f3a5f'}
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='1.8'
                                    d='M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z'
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className='min-w-0 flex-1'>
                    <p className='text-xs font-black uppercase tracking-[0.16em] text-[#ef6c00]'>
                        {isRecording ? 'Escuchando' : 'Practica de lectura'}
                    </p>
                    <div className='mt-1 min-h-[38px] rounded-full bg-[#e8f7ff] px-4 py-2 text-base font-bold text-[#1f3a5f]'>
                        {value || helperText}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpeechToText
