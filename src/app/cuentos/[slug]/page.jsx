import { notFound } from 'next/navigation'
import { getStories, getStoryBySlug } from '@/data/fabulas'
import { StoryReaderClient } from '@/components/stories/StoryReaderClient'
import { createBreadcrumbJsonLd, createJsonLdScript, createPageMetadata, createStoryJsonLd } from '@/lib/seo'

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

    const metadata = createPageMetadata({
        title: `${story.title} - cuento infantil para leer`,
        description: `Lee ${story.title}, un cuento infantil con moraleja: ${story.teaching || 'practica lectura guiada y comprension.'}`,
        path: `/cuentos/${story.slug}/`,
        type: 'article',
        images: [
            {
                url: story.imageUrl,
                width: 1200,
                height: 900,
                alt: `${story.title} - cuento infantil en Lectorin`,
            },
        ],
        keywords: [story.title, story.category, `${story.title} moraleja`, 'cuento infantil para leer'],
    })

    return {
        ...metadata,
        openGraph: {
            ...metadata.openGraph,
            authors: ['Lectorin'],
            section: story.category,
            tags: [story.category, 'cuento infantil', 'fabula infantil', 'lectura guiada'].filter(Boolean),
        },
    }
}

export default async function StoryPage({ params }) {
    const { slug } = await params
    const story = getStoryBySlug(slug)

    if (!story) {
        notFound()
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={createJsonLdScript([
                    createStoryJsonLd(story),
                    createBreadcrumbJsonLd([
                        { name: 'Inicio', path: '/' },
                        { name: 'Cuentos', path: '/cuentos/' },
                        { name: story.title, path: `/cuentos/${story.slug}/` },
                    ]),
                ])}
            />
            <StoryReaderClient story={story} />
        </>
    )
}
