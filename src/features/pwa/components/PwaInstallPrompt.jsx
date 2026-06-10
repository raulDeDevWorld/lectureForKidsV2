'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

function isLocalDevelopmentHost() {
    return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
}

function isStandaloneApp() {
    if (typeof window === 'undefined') return false

    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
}

export function PwaInstallPrompt({ compact = false, variant = 'button' }) {
    const [installEvent, setInstallEvent] = useState(null)
    const [isDismissed, setIsDismissed] = useState(false)
    const [isInstalled, setIsInstalled] = useState(() => isStandaloneApp())
    const [showIosHint] = useState(() => {
        if (typeof window === 'undefined') return false

        const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
        return isIos && !isStandaloneApp()
    })

    useEffect(() => {
        if ('serviceWorker' in navigator && !isLocalDevelopmentHost()) {
            navigator.serviceWorker.register('/sw.js').catch(() => {})
        }

        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault()
            setIsDismissed(false)
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

    if (isInstalled || isDismissed) return null

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

    if (variant === 'card') {
        return (
            <section className='overflow-hidden rounded-[2rem] bg-[#172554] p-4 text-white shadow-[0_16px_42px_rgba(31,42,68,0.16)] ring-1 ring-white/60 sm:p-5'>
                <div className='flex items-start gap-3'>
                    <Image
                        src='/logo-lectorin-192.png'
                        alt=''
                        width={48}
                        height={48}
                        className='h-12 w-12 shrink-0 rounded-[1rem] object-cover shadow-sm ring-1 ring-white/20'
                    />
                    <div className='min-w-0 flex-1'>
                        <p className='text-xs font-black uppercase tracking-[0.14em] text-[#BFE8D4]'>Acceso rapido</p>
                        <h2 className='mt-1 text-xl font-black leading-tight'>Instala Lectorin</h2>
                        <p className='mt-1 text-sm font-bold leading-5 text-white/78'>
                            Abrela desde la pantalla de inicio y entra directo a cuentos y actividades.
                        </p>
                    </div>
                </div>

                <div className='mt-4 grid grid-cols-[1fr_auto] gap-3'>
                    <button
                        type='button'
                        onClick={installApp}
                        className='inline-flex min-h-12 items-center justify-center rounded-[1.2rem] bg-white px-4 text-sm font-black text-[#172554] shadow-[0_6px_0_rgba(255,255,255,0.18)] transition active:translate-y-0.5 active:shadow-none'
                    >
                        Instalar
                    </button>
                    <button
                        type='button'
                        onClick={() => setIsDismissed(true)}
                        className='inline-flex min-h-12 items-center justify-center rounded-[1.2rem] bg-white/10 px-4 text-xs font-black text-white ring-1 ring-white/18 transition active:scale-[0.98]'
                    >
                        Ahora no
                    </button>
                </div>
            </section>
        )
    }

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
