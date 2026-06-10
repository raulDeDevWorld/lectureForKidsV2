import { BookIcon, GameIcon, HeartIcon, StarIcon } from '@/components/icons/Icons'
import { AppShell } from '@/components/layout/AppShell'
import { HomeCard } from '@/components/home/HomeCard'
import { HomeHero } from '@/components/home/HomeHero'
import { getStories } from '@/data/fabulas'
import { PwaInstallPrompt } from '@/features/pwa/components/PwaInstallPrompt'
import { createBreadcrumbJsonLd, createItemListJsonLd, createJsonLdScript, createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
    title: 'Aprende a leer con cuentos, voz y juegos',
    description: 'Lectorin es una app educativa para aprender a leer con cuentos infantiles, lectura en voz alta, vocales, letras, numeros, silabas y juegos.',
    path: '/',
    keywords: ['lectorin', 'app para aprender a leer', 'ensenar lectura a ninos'],
})

const homeCards = [
    { title: 'Cuentos', description: 'Cuentos infantiles para leer y escuchar.', href: '/cuentos', color: 'blue', icon: BookIcon },
    { title: 'Aprender', description: 'Vocales, letras, numeros y silabas para leer.', href: '/aprender', color: 'mint', icon: StarIcon },
    { title: 'Practicar', description: 'Juegos rapidos para reforzar lectura.', href: '/practicar', color: 'lavender', icon: GameIcon },
    { title: 'Favoritos', description: 'Continua tus historias guardadas.', href: '/cuentos?favoritos=1', color: 'peach', icon: HeartIcon },
]

export default function Home() {
    const stories = getStories()
    const jsonLd = [
        createBreadcrumbJsonLd([{ name: 'Inicio', path: '/' }]),
        createItemListJsonLd({
            name: 'Secciones principales de Lectorin',
            description: 'Cuentos, actividades y practica para aprender a leer.',
            path: '/',
            items: homeCards
                .filter((card) => !card.href.includes('?'))
                .map((card) => ({
                    name: card.title,
                    path: card.href.endsWith('/') ? card.href : `${card.href}/`,
                })),
        }),
        createItemListJsonLd({
            name: 'Cuentos infantiles destacados',
            description: 'Cuentos infantiles con moralejas para practicar lectura.',
            path: '/cuentos/',
            items: stories.slice(0, 12).map((story) => ({
                name: story.title,
                path: `/cuentos/${story.slug}/`,
                image: story.imageUrl,
            })),
        }),
    ]

    return (
        <AppShell>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={createJsonLdScript(jsonLd)}
            />
            <div className='space-y-7'>
                <HomeHero stories={stories} />

                <PwaInstallPrompt variant='card' />

                <section className='grid grid-cols-2 gap-4'>
                    {homeCards.map((card) => (
                        <HomeCard key={card.title} {...card} />
                    ))}
                </section>
            </div>
        </AppShell>
    )
}
