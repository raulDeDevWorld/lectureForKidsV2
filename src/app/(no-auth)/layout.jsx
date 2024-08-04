'use client'

import { useEffect, useState, useRef } from 'react'


export default function RootLayout({ children }) {

    const audioPlayer = useRef();


    audioPlayer.current !== undefined ? audioPlayer.current.volume = 0.08 : ''

  return (
    
     
          <>
            {children}
            <audio src="/news_1.mp3" loop autoPlay ref={audioPlayer}></audio>

          </>
      
  )
}


