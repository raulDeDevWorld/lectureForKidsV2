'use client'

import dynamic from 'next/dynamic'
import { Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { StoryReaderClient } from '@/components/stories/StoryReaderClient'
import { listStories } from '@/features/stories/data/stories'
import { DEFAULT_STORY_IMAGE } from '@/features/reading/constants/sections'

const StoryReader = dynamic(
    () => import('@/components/stories/StoryReader').then((module) => module.StoryReader),
    { ssr: false }
)

export default function LecturePage() {
    return (
        <Suspense fallback={null}>
            <LectureReader />
        </Suspense>
    )
}

function LectureReader() {
    const searchParams = useSearchParams()
    const story = useMemo(() => {
        const requestedId = searchParams.get('item')
        const stories = listStories()
        const selectedStory = stories.find((item) => item.id === requestedId) || stories[0]
        return adaptStoryForReader(selectedStory)
    }, [searchParams])

    return <StoryReaderClientShell story={story} />
}

function StoryReaderClientShell({ story }) {
    return <StoryReaderClient story={story} ReaderComponent={StoryReader} />
}

function adaptStoryForReader(story) {
    const content = Array.isArray(story.content)
        ? story.content
        : String(story.content || '')
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)

    return {
        id: story.id,
        title: story.title,
        content,
        teaching: story.teaching || '',
        category: story.category || 'Fabula',
        imageUrl: story.imageUrl || story.img || story.face || DEFAULT_STORY_IMAGE,
    }
}
