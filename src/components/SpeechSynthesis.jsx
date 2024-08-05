
'use client'
import { useRef, useState } from 'react'
import Speech from 'speak-tts'

function TemplateOne({ text }) {
    const [voicesTTS, setVoicesTTS] = useState(null)
    const speech = new Speech()
    if (speech.hasBrowserSupport()) {
        speech.init({
            'volume': 1,
            'lang': 'es-US',
            'rate': 2,
            'pitch': .5,
            'voice': 'Microsoft Pablo - Spanish (Spain)',
            'splitSentences': true,
            'listeners': {
                'onvoiceschanged': (voices) => {
                    // console.log("Event voiceschanged", voices)
                    // setVoicesTTS(voices)
                }
            }
        })
    }
    function play() {


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

    function stop() {
        speech.cancel()
    }

    function pause() {
        console.log('pause')
        speech.pause()
    }
    console.log(text)
    return (
        speech.hasBrowserSupport() ?
            <div className='flex justify-center items-center w-[300px] z-30 bg-[#00404a] px-[100px] py-2 rounded-[10px] mb-[20px]' style={{ background: 'linear-gradient(to right, #00404a, #007483, #00404a)' }}>
                <button onClick={pause} className='px-5'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="white" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07zM7 6v8h2V6H7zm4 0v8h2V6h-2z" /></svg>
                </button>
                <button onClick={play} className='px-5'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648l12.812 6.968Z" /></svg>
                </button>
                {/* {!speech.speaking() ?<button onClick={play} className='px-5'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648l12.812 6.968Z" /></svg>
                </button>
                :<div class=" flex justify-center items-center">
                    <div class="relative inline-flex">
                        <div class="w-8 h-8 bg-yellow-300 rounded-full"></div>
                        <div class="w-8 h-8 bg-yellow-300 rounded-full absolute top-0 left-0 animate-ping"></div>
                        <div class="w-8 h-8 bg-yellow-300 rounded-full absolute top-0 left-0 animate-pulse"></div>
                    </div>
                </div>} */}
                {/* <div class="flex gap-2">
                    <div class="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                    <div class="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                    <div class="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                </div> */}

                <button onClick={stop} className='px-5'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm3 14H9c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1h6c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1z" /></svg>
                </button>

            </div>
            : ''
    )
}
export default TemplateOne
















