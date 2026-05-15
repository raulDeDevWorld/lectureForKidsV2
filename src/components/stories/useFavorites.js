'use client'

import { useCallback, useSyncExternalStore } from 'react'

const FAVORITES_KEY = 'fabulas-3000:favorites'
const EMPTY_FAVORITES = []

let cachedRawFavorites = null
let cachedFavorites = EMPTY_FAVORITES

function readFavorites() {
    if (typeof window === 'undefined') return EMPTY_FAVORITES

    try {
        const raw = window.localStorage.getItem(FAVORITES_KEY) || '[]'

        if (raw === cachedRawFavorites) {
            return cachedFavorites
        }

        const parsed = JSON.parse(raw)
        cachedRawFavorites = raw
        cachedFavorites = Array.isArray(parsed) ? parsed : EMPTY_FAVORITES
        return cachedFavorites
    } catch {
        cachedRawFavorites = '[]'
        cachedFavorites = EMPTY_FAVORITES
        return cachedFavorites
    }
}

export function useFavorites() {
    const favorites = useSyncExternalStore(subscribeFavorites, readFavorites, getServerFavorites)

    const toggleFavorite = useCallback((storyId) => {
        const current = readFavorites()
        const next = current.includes(storyId)
            ? current.filter((id) => id !== storyId)
            : [...current, storyId]

        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
        window.dispatchEvent(new Event('favorites-change'))
    }, [])

    const isFavorite = useCallback((storyId) => favorites.includes(storyId), [favorites])

    return { favorites, isFavorite, toggleFavorite }
}

function getServerFavorites() {
    return EMPTY_FAVORITES
}

function subscribeFavorites(callback) {
    window.addEventListener('storage', callback)
    window.addEventListener('favorites-change', callback)

    return () => {
        window.removeEventListener('storage', callback)
        window.removeEventListener('favorites-change', callback)
    }
}
