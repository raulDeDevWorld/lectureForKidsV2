'use client'

import dynamic from 'next/dynamic'
import { useFavorites } from './useFavorites'

const StoryReader = dynamic(
    () => import('./StoryReader').then((module) => module.StoryReader),
    { ssr: false }
)

export function StoryReaderClient({ story }) {
    const { isFavorite, toggleFavorite } = useFavorites()

    return (
        <StoryReader
            story={story}
            isFavorite={isFavorite(story.id)}
            onToggleFavorite={() => toggleFavorite(story.id)}
        />
    )
}
