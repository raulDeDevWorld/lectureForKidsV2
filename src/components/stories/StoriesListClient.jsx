'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CategoryChip } from '@/components/ui/CategoryChip'
import { SearchInput } from '@/components/ui/SearchInput'
import { StoryCard } from './StoryCard'
import { useFavorites } from './useFavorites'

const colorOrder = ['blue', 'mint', 'peach', 'lavender', 'yellow']

export function StoriesListClient({ categories, stories }) {
    const searchParams = useSearchParams()
    const favoritesOnly = searchParams.get('favoritos') === '1'
    const [query, setQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState(() => searchParams.get('categoria') || 'Todos')
    const { favorites, isFavorite, toggleFavorite } = useFavorites()

    const visibleStories = useMemo(() => {
        return stories
            .map((story, index) => ({ ...story, color: story.color || colorOrder[index % colorOrder.length] }))
            .filter((story) => !favoritesOnly || favorites.includes(story.id))
            .filter((story) => activeCategory === 'Todos' || story.category === activeCategory)
            .filter((story) => story.title.toLowerCase().includes(query.toLowerCase().trim()))
    }, [activeCategory, favorites, favoritesOnly, query, stories])

    return (
        <div className='space-y-5'>
            <SearchInput value={query} onChange={setQuery} />

            <div className='flex gap-2 overflow-x-auto pb-1'>
                {['Todos', ...categories].map((category) => (
                    <CategoryChip
                        key={category}
                        active={activeCategory === category}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </CategoryChip>
                ))}
            </div>

            <div className='space-y-4'>
                {visibleStories.map((story) => (
                    <StoryCard
                        key={story.id}
                        story={story}
                        isFavorite={isFavorite(story.id)}
                        onToggleFavorite={() => toggleFavorite(story.id)}
                    />
                ))}
            </div>

            {!visibleStories.length && (
                <div className='rounded-3xl bg-white p-6 text-center shadow-sm'>
                    <p className='text-xl font-black text-[#1F2A44]'>No encontré cuentos</p>
                    <p className='mt-2 font-bold text-[#7A8194]'>Prueba con otra palabra o categoría.</p>
                </div>
            )}
        </div>
    )
}
