'use client'

import dynamic from 'next/dynamic'

const StoryReader = dynamic(
    () => import('@/features/reading/components/StoryReader').then((module) => module.StoryReader),
    { ssr: false }
)

export default function LecturePage() {
    return <StoryReader />
}
