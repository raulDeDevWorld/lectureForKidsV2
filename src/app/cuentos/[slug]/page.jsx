import { notFound } from 'next/navigation'
import { getStories, getStoryBySlug } from '@/data/fabulas'
import { StoryReaderClient } from '@/components/stories/StoryReaderClient'

export function generateStaticParams() {
    return getStories().map((story) => ({
        slug: story.slug,
    }))
}

export async function generateMetadata({ params }) {
    const { slug } = await params
    const story = getStoryBySlug(slug)

    if (!story) {
        return {
            title: 'Cuento no encontrado',
        }
    }

    return {
        title: `${story.title} | Fabulas 3000`,
        description: story.teaching,
    }
}

export default async function StoryPage({ params }) {
    const { slug } = await params
    const story = getStoryBySlug(slug)

    if (!story) {
        notFound()
    }

    return <StoryReaderClient story={story} />
}
