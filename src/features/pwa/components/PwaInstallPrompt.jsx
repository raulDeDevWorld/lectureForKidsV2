'use client'

import { useEffect, useState } from 'react'

export function PwaInstallPrompt({ compact = false }) {
    const [installEvent, setInstallEvent] = useState(null)
    const [isInstalled, setIsInstalled] = useState(false)
    const [showIosHint] = useState(() => {
        if (typeof window === 'undefined') return false

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
        const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
        return isIos && !isStandalone
    })

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {})
        }

        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault()
            setInstallEvent(event)
        }

        const handleInstalled = () => {
            setIsInstalled(true)
            setInstallEvent(null)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleInstalled)
        }
    }, [])

    if (isInstalled) return null

    async function installApp() {
        await installEvent.prompt()
        await installEvent.userChoice
        setInstallEvent(null)
    }

    if (!installEvent && showIosHint && !compact) {
        return (
            <p className='rounded-2xl bg-white/80 px-4 py-3 text-center text-xs font-bold leading-5 text-slate-600 sm:text-left'>
                En iPhone o iPad: Compartir y luego Agregar a inicio.
            </p>
        )
    }

    if (!installEvent) return null

    return (
        <button
            type='button'
            onClick={installApp}
            className={compact
                ? 'rounded-full bg-[#14213d] px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#24345c]'
                : 'inline-flex w-full items-center justify-center rounded-full bg-[#14213d] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#24345c] sm:w-auto'}
        >
            Instalar app
        </button>
    )
}
