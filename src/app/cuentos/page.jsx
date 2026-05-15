import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowLeftIcon, SearchIcon } from '@/components/icons/Icons'
import { AppShell } from '@/components/layout/AppShell'
import { RoundedIconButton } from '@/components/ui/RoundedIconButton'
import { getCategories, getStories } from '@/data/fabulas'
import { StoriesListClient } from '@/components/stories/StoriesListClient'

export default function StoriesPage() {
    const stories = getStories()
    const categories = getCategories()

    return (
        <AppShell>
            <div className='space-y-5'>
                <header className='rounded-[2rem] bg-white/75 p-4 shadow-[0_12px_34px_rgba(31,42,68,0.08)] backdrop-blur'>
                    <div className='flex items-center justify-between gap-3'>
                    <Link href='/' aria-label='Volver al inicio' className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(31,42,68,0.10)]'>
                        <ArrowLeftIcon className='h-6 w-6' />
                    </Link>
                    <div className='text-center'>
                        <h1 className='text-3xl font-black text-[#1F2A44]'>Cuentos</h1>
                        <p className='text-sm font-bold text-[#7A8194]'>{stories.length} historias para leer</p>
                    </div>
                    <RoundedIconButton label='Buscar cuentos'>
                        <SearchIcon className='h-6 w-6' />
                    </RoundedIconButton>
                    </div>
                    <div className='mt-4 rounded-3xl bg-[#FFF9EF] px-4 py-3'>
                        <p className='text-sm font-black leading-6 text-[#7A8194]'>Elige un cuento, escucha palabras y practica leyendo en voz alta.</p>
                    </div>
                </header>

                <Suspense fallback={<div className='rounded-3xl bg-white p-6 text-center font-black text-[#7A8194]'>Cargando cuentos...</div>}>
                    <StoriesListClient categories={categories} stories={stories} />
                </Suspense>
            </div>
        </AppShell>
    )
}
