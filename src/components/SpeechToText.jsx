'use client'
import useSpeechToText from 'react-hook-speech-to-text';
import style from '@/components/SpeechToText.module.css'
function AnyComponent({ value, setValue, lecture, setLecture, refLecture, stories2, refLecture2, refLecture3, error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText, }) {


    if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

    // var nombres = ["Rita", "Pedro", "Miguel", "Ana", "Vanesa"];
    // var masculinos = nombres.slice(1);
    // console.log(masculinos)

    const handlerSpeechText = () => {
        if (isRecording) {
            if (interimResult !== undefined) {
                if (refLecture3.current.value !== undefined) refLecture3.current.value = interimResult
                refLecture.current.value = refLecture.current.value !== undefined ? [...refLecture.current.value, interimResult.split(' ').pop()] : [interimResult.split(' ').pop()]

                if (refLecture.current.value !== undefined) {
                    const data = stories2.split(' ').map((i, index) => refLecture.current.value.slice(index).find((element) => element.toLowerCase() === i.toLowerCase().replaceAll(',', '').replaceAll('.', '').toLowerCase()))
                    refLecture2.current.value = data.indexOf(undefined) !== -1 ? [...data.slice(0, data.indexOf(undefined))] : data
                }
            }

            const res = results.reduce((acc, result) => {
                return acc + result.transcript
            }, '')

            setValue(res)
        }
        console.log('repeat')
    }
    handlerSpeechText()

    return (
        <div className='hidden md:flex w-full items-center'>

            <div className={isRecording && style.spinnerContainer}>
                <div className={isRecording && style.spinner}>
                    <button className={`w-[45px] h-[45px] flex justify-center items-center relative cursor-pointer  rounded-full transition-all  p-[2px] text-[12px] border-[2px] border-[brown] shadow z-50 ${isRecording ? 'bg-[brown]' : 'bg-[transparent]'} ${style.animation}`} onClick={isRecording ? stopSpeechToText : startSpeechToText}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke={isRecording ? 'white' : 'brown'} stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>
                    </button>
                    <div>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
            <div className={`bg-white w-full rounded-[10px] ml-[10px] flex items-center ${interimResult && 'px-5 min-h-[45px]'}`}>{interimResult}</div>

        </div>
    );
}



export default AnyComponent
