'use client'

import style from './SpeechToText.module.css'

export function SpeechToText({
    value,
    stableWords = [],
    unstableText = '',
    currentWord,
    missedStreak,
    error,
    isRecording,
    onManualAdvance,
    startSpeechToText,
    stopSpeechToText,
}) {
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
    const hasTranscriptParts = stableWords.length > 0 || unstableText
    const canAdvanceManually = Boolean(currentWord && onManualAdvance)

    function handleMicrophoneClick() {
        if (!canRecord) return

        const action = isRecording ? stopSpeechToText : startSpeechToText
        action()
    }

    return (
        <div className='fixed inset-x-0 bottom-0 z-50 flex justify-center md:px-3 pt-3'>
            <div className='pointer-events-auto flex w-full max-w-3xl items-center  rounded-t-[30px] bg-[#f3f3f3] p-3 shadow-[0_12px_0_rgba(23,37,84,0.10),0_22px_60px_rgba(23,37,84,0.22)]'>
                <div className='w-full'>
                    {/* <div className='mb-2 line-clamp-2 min-h-[42px] rounded-2xl bg-[#fff7df] px-4 py-2 text-sm font-black leading-6 text-[#172554] sm:text-base'>
                        {hasTranscriptParts ? (
                            <>
                                {stableWords.map((word, index) => (
                                    <span key={`${word}-${index}`} className='text-[#172554]'>
                                        {word}{' '}
                                    </span>
                                ))}
                                {unstableText && (
                                    <span className='animate-pulse text-[#7A8194]'>
                                        {unstableText}
                                    </span>
                                )}
                            </>
                        ) : (
                            value || helperText
                        )}
                    </div> */}

                    <div className='mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2'>
                        <button
                            type='button'
                            className='flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black shadow-[0_5px_0_rgba(23,37,84,0.16)] transition active:translate-y-0.5 active:shadow-none'
                            style={{
                                backgroundColor: buttonBackground,
                                border: '3px solid #FFD166',
                                color: '#FFFFFF',
                                cursor: canRecord ? 'pointer' : 'not-allowed',
                                opacity: canRecord ? 1 : 0.55,
                            }}
                            onClick={handleMicrophoneClick}
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
                            {error ? 'Sin voz' : (isRecording ? 'Detener microfono' : 'Activar microfono')}
                        </button>

                        <button
                            type='button'
                            className='flex w-full items-center justify-center rounded-2xl border-[3px] border-[#172554] bg-white px-4 py-3 text-sm font-black text-[#172554] shadow-[0_5px_0_rgba(23,37,84,0.12)] transition active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50'
                            onClick={onManualAdvance}
                            disabled={!canAdvanceManually}
                        >
                            Avanzar manual
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
