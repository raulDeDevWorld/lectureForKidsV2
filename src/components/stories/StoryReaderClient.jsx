'use client'

import dynamic from 'next/dynamic'
import { useFavorites } from './useFavorites'

const DefaultStoryReader = dynamic(
    () => import('./StoryReader').then((module) => module.StoryReader),
    { ssr: false }
)

export function StoryReaderClient({ ReaderComponent = DefaultStoryReader, story }) {
    const { isFavorite, toggleFavorite } = useFavorites()

    return (
        <ReaderComponent
            story={story}
            isFavorite={isFavorite(story.id)}
            onToggleFavorite={() => toggleFavorite(story.id)}
        />
    )
}
