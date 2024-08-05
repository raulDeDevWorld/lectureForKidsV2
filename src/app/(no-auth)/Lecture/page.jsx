'use client'
import { useState, useRef, useEffect } from 'react'
// import SpeechToText from '@/components/SpeechToText'
// import useSpeechToText from 'react-hook-speech-to-text';
import { fabulas } from '@/db/fabulas'
// import Speech from 'speak-tts'
import React from 'react'
// import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
function Home() {

    const { width, height } = useWindowSize()

    // ---------------Speach TTS

    // const speech = new Speech()
    // if (speech.hasBrowserSupport()) {
    //     speech.init({
    //         'volume': 1,
    //         'lang': 'es-US',
    //         'rate': 2,
    //         'pitch': .5,
    //         'voice': 'Microsoft Pablo - Spanish (Spain)',
    //         'splitSentences': true,
    //         'listeners': {
    //             'onvoiceschanged': (voices) => {
    //                 // console.log("Event voiceschanged", voices)
    //                 // setVoicesTTS(voices)
    //             }
    //         }
    //     })
    // }

    function play(text) {
        speech.paused()
            ? speech.resume()
            : speech.speak({
                text: text,
                queue: false,
            }).then(() => {
                alert("Success !")
            }).catch(e => {
                alert("An error occurred :", e)
            })
    }

    // ---------------Speach to text

    // const {
    //     error,
    //     interimResult,
    //     isRecording,
    //     results,
    //     startSpeechToText,
    //     stopSpeechToText,
    // } = useSpeechToText({
    //     continuous: true,
    //     useLegacyResults: false,
    //     timeout: 1,
    //     speechRecognitionProperties: {
    //         lang: 'es-MX',
    //         interimResults: true // Allows for displaying real-time speech results
    //     }
    // });
    const [stories, setStories] = useState(undefined)
    const [select, setSelect] = useState(null);
    const [query, setQuery] = useState(undefined);

    const [value, setValue] = useState('');
    const [lecture, setLecture] = useState('title');
    const refLecture = useRef([])
    const refLecture2 = useRef([])


    const refLecture3 = useRef('title')

    console.log(lecture)
    async function handlerSelect(i) {
        const res = await fetch('/api', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                word: i
            })
        })

        const data = await res.json()
        setSelect(data.data)
    }

    useEffect(() => {
        // if (window && typeof window !== "undefined") {
        //     setQuery(window.location.href.split('=')[1].replaceAll('%20', ' '))
        // }
        if (stories === undefined && query !== undefined) {
            setStories(fabulas[query])
        }
    }, [query])


    return (
        <div className='relative bg-gradient-to-tr from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-screen w-screen p-10'>
            {/* {lecture === 'COMPLETE' && <Confetti
                width={width}
                height={height}
            />} */}
            {/* {stories !== undefined && <div>
                <div className='bg-white p-10 rounded-md'>
                    <p className='text-center'>{stories.title.split(' ').map((i, index) => <>
                        <span
                            className={`cursor-pointer hover:bg-yellow-500 
                                    ${((refLecture2.current.value !== undefined &&
                                    refLecture2.current.value[index] !== undefined &&
                                    refLecture2.current.value[index !== 0 ? index - 1 : index] !== undefined &&
                                    refLecture2.current.value[index > 1 ? index - 2 : index] !== undefined &&
                                    i.toLowerCase().includes(refLecture2.current.value[index].toLowerCase())) ||
                                    lecture === 'content' ||
                                    lecture === 'teaching')
                                    ? 'bg-green-500'
                                    : (refLecture2.current.value !== undefined && refLecture2.current.value[index] && refLecture2.current.value[index] == '----' ? 'bg-red-500' : '')}
                                    ${index !== 0 && refLecture2.current.value !== undefined && refLecture2.current.value[index - 1] !== undefined && interimResult !== undefined && interimResult.toLowerCase().includes(i.toLowerCase()) && lecture === 'title' ? 'bg-green-500' : ''}
                                    ${index === 0 && interimResult !== undefined && interimResult.toLowerCase().includes(i.toLowerCase()) ? 'bg-green-500' : ''}`}
                            onDoubleClickCapture={(e) => handlerSelect(i)}
                            onClick={() => play(i)}>
                            {i + ' '}
                        </span>
                        {i.includes('\n') ? <br /> : ''}
                        {i.includes('\n\n') ? <><br /><br /></> : ''}

                    </>)}</p>

                    <div className='flex justify-center p-5'>
                        <img src={stories.img} className='relative left-0 right-0 mx-auto w-[200px] text-center' alt="" />
                    </div>

                    <p>{stories.content.split(' ').map((i, index) => <>
                        <span
                            className={`cursor-pointer hover:bg-yellow-500 
                                    ${(refLecture2.current.value !== undefined &&
                                    refLecture2.current.value[index] !== undefined &&
                                    refLecture2.current.value[index !== 0 ? index - 1 : index] !== undefined &&
                                    refLecture2.current.value[index > 1 ? index - 2 : index] !== undefined &&
                                    i.toLowerCase().includes(refLecture2.current.value[index].toLowerCase())) ||
                                    lecture === 'teaching'
                                    ? 'bg-green-500'
                                    : (refLecture2.current.value !== undefined && refLecture2.current.value[index] && refLecture2.current.value[index] == '----' ? 'bg-red-500' : '')}
                                    ${index !== 0 && refLecture2.current.value !== undefined && refLecture2.current.value[index - 1] !== undefined && interimResult !== undefined && interimResult.toLowerCase().includes(i.toLowerCase()) && lecture === 'content' ? 'bg-green-500' : ''}
                                    ${index === 0 && interimResult !== undefined && interimResult.toLowerCase().includes(i.toLowerCase()) ? 'bg-green-500' : ''}`}
                            onDoubleClickCapture={(e) => handlerSelect(i)}
                            onClick={() => play(i)}>
                            {i + ' '}
                        </span>
                        {i.includes('\n') ? <br /> : ''}
                        {i.includes('\n\n') ? <><br /><br /></> : ''}

                    </>)}</p>
                    <br />
                    <p className='text-center'>{stories.teaching.split(' ').map((i, index) => <>
                        <span
                            className={`cursor-pointer hover:bg-yellow-500 
                                    ${refLecture2.current.value !== undefined &&
                                    refLecture2.current.value[index] !== undefined &&
                                    refLecture2.current.value[index !== 0 ? index - 1 : index] !== undefined &&
                                    refLecture2.current.value[index > 1 ? index - 2 : index] !== undefined &&
                                    i.toLowerCase().includes(refLecture2.current.value[index].toLowerCase())
                                    ? 'bg-green-500'
                                    : (refLecture2.current.value !== undefined && refLecture2.current.value[index] && refLecture2.current.value[index] == '----' ? 'bg-red-500' : '')}
                                    ${index !== 0 && refLecture2.current.value !== undefined && refLecture2.current.value[index - 1] !== undefined && interimResult !== undefined && interimResult.toLowerCase().includes(i.toLowerCase()) ? 'bg-green-500' : ''}
                                    ${index === 0 && interimResult !== undefined && interimResult.toLowerCase().includes(i.toLowerCase()) ? 'bg-green-500' : ''}`}
                            onDoubleClickCapture={(e) => handlerSelect(i)}
                            onClick={() => play(i)}>
                            {i + ' '}
                        </span>
                        {i.includes('\n') ? <br /> : ''}
                        {i.includes('\n\n') ? <><br /><br /></> : ''}

                    </>)}</p>
                </div>
                {select && select !== undefined && <div className='fixed top-0 left-0 bg-[#000000ab] w-full h-full flex justify-center items-center z-20' onClick={() => setSelect(null)}>
                    <div className='absolute w-[350px] h-[450px] top-0 bottom-0 left-0 right-0 m-auto bg-white flex flex-col justify-center items-center rounded-md' onClick={(e) => e.stopPropagation()}>
                        <img src={`/${select}.png`} className='w-[300px] p-5' alt="" />
                        <p>Siginificado: {select}</p>
                    </div>
                </div>}
                <SpeechToText error={error}
                    interimResult={interimResult}
                    isRecording={isRecording}
                    results={results}
                    startSpeechToText={startSpeechToText}
                    stopSpeechToText={stopSpeechToText}

                    value={value}
                    setValue={setValue}
                    lecture={lecture}
                    setLecture={setLecture}
                    refLecture={refLecture}
                    stories2={stories[lecture !== 'COMPLETE' ? lecture : 'teaching'].replaceAll('\n', '').replace(/^\s+|\s+$|\s+(?=\s)/g, "").trim()}
                    // stories2={
                    //     lecture === 'title'
                    //         ? stories.title.replaceAll('\n', '').replace(/^\s+|\s+$|\s+(?=\s)/g, "").trim()
                    //         : (lecture === 'content'
                    //             ? stories.content.replaceAll('\n', '').replace(/^\s+|\s+$|\s+(?=\s)/g, "").trim()
                    //             : stories.teaching.replaceAll('\n', '').replace(/^\s+|\s+$|\s+(?=\s)/g, "").trim())}
                    refLecture2={refLecture2}
                    refLecture3={refLecture3} />
            </div>} */}

        </div>
    )
}
export default Home





















