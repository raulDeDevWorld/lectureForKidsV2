'use client'

import { useEffect } from 'react'

export function PwaRuntime() {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return

        navigator.serviceWorker.register('/sw.js').catch(() => {})
    }, [])

    return null
}
