'use client'

import { useEffect } from 'react'

function isLocalDevelopmentHost() {
    return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
}

export function PwaRuntime() {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return

        if (isLocalDevelopmentHost()) {
            navigator.serviceWorker.getRegistrations()
                .then((registrations) => {
                    registrations.forEach((registration) => registration.unregister())
                })
                .catch(() => {})

            if ('caches' in window) {
                caches.keys()
                    .then((keys) => {
                        keys
                            .filter((key) => key.startsWith('fabulas-3000-') || key.startsWith('lectorin-'))
                            .forEach((key) => caches.delete(key))
                    })
                    .catch(() => {})
            }

            return
        }

        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                registration.update().catch(() => {})
            })
            .catch(() => {})
    }, [])

    return null
}
