import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowLeftIcon, SearchIcon } from '@/components/icons/Icons'
import { AppShell } from '@/components/layout/AppShell'
import { RoundedIconButton } from '@/components/ui/RoundedIconButton'
import { getCategories, getStories } from '@/data/fabulas'
import { StoriesListClient } from '@/components/stories/StoriesListClient'
import { createBreadcrumbJsonLd, createItemListJsonLd, createJsonLdScript, createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
    title: 'Cuentos infantiles para aprender a leer',
    description: 'Lee cuentos infantiles y fabulas con imagenes, moralejas y practica de lectura en voz alta para ninos que estan aprendiendo a leer.',
    path: '/cuentos/',
    keywords: ['cuentos para aprender a leer', 'fabulas para ninos', 'cuentos con moraleja'],
})

export default function StoriesPage() {
    const stories = getStories()
    const categories = getCategories()
    const jsonLd = [
        createBreadcrumbJsonLd([
            { name: 'Inicio', path: '/' },
            { name: 'Cuentos', path: '/cuentos/' },
        ]),
        createItemListJsonLd({
            name: 'Cuentos infantiles para aprender a leer',
            description: 'Coleccion de cuentos infantiles y fabulas con moralejas para practicar lectura.',
            path: '/cuentos/',
            items: stories.map((story) => ({
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
            <div className='space-y-5'>
                <header className='rounded-[2rem] bg-white/75 p-4 shadow-[0_12px_34px_rgba(31,42,68,0.08)] backdrop-blur'>
                    <div className='flex items-center justify-between gap-3'>
                    <Link href='/' aria-label='Volver al inicio' className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(31,42,68,0.10)]'>
                        <ArrowLeftIcon className='h-6 w-6' />
                    </Link>
                    <div className='text-center'>
                        <h1 className='text-3xl font-black text-[#1F2A44]'>Lee Conmigo</h1>
                        <p className='text-sm font-bold text-[#7A8194]'>{stories.length} historias para leer</p>
                    </div>
                  
                    </div>
                  
                </header>

                <Suspense fallback={<div className='rounded-3xl bg-white p-6 text-center font-black text-[#7A8194]'>Cargando cuentos...</div>}>
                    <StoriesListClient categories={categories} stories={stories} />
                </Suspense>
            </div>
        </AppShell>
    )
}
