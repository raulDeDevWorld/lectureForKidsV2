'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRightIcon, BookIcon, StarIcon } from '@/components/icons/Icons'
import { RoundedIconButton } from '@/components/ui/RoundedIconButton'
import { StoryImage } from '@/components/stories/StoryImage'

function pickRandomIndex(stories, currentIndex = -1) {
    if (!stories.length) return -1
    if (stories.length === 1) return 0

    let nextIndex = Math.floor(Math.random() * stories.length)

    if (nextIndex === currentIndex) {
        nextIndex = (nextIndex + 1) % stories.length
    }

    return nextIndex
}

export function HomeHero({ stories = [] }) {
    const [storyIndex, setStoryIndex] = useState(0)
    const featuredStory = stories[storyIndex] || stories[0] || null

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setStoryIndex((currentIndex) => pickRandomIndex(stories, currentIndex))
        }, 0)

        return () => window.clearTimeout(timeoutId)
    }, [stories])

    function changeStory() {
        setStoryIndex((currentIndex) => pickRandomIndex(stories, currentIndex))
    }

    return (
        <header className='space-y-5'>
            <div className='flex items-center justify-between'>
                <Link href='/' aria-label='Ir al inicio' className='flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-white p-1 shadow-[0_10px_28px_rgba(31,42,68,0.10)]'>
                    <span className='flex h-12 w-12 items-center justify-center rounded-[1.15rem] bg-[#BFE8D4] text-xl font-black text-[#1F2A44]'>
                        F
                    </span>
                </Link>
                <RoundedIconButton label='Ver favoritos'>
                    <StarIcon className='h-6 w-6 text-[#FFD166]' />
                </RoundedIconButton>
            </div>

            <section className='overflow-hidden rounded-[2.3rem] bg-white shadow-[0_20px_55px_rgba(31,42,68,0.12)] ring-1 ring-white/80'>
                <div className='grid gap-0 lg:grid-cols-[1.02fr_0.98fr]'>
                    <div className='flex flex-col justify-between gap-6 bg-[linear-gradient(135deg,#FFF9EF,#EAF7FF)] p-5 sm:p-6 lg:p-7'>
                        <div>
                            <p className='inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#7A8194] shadow-sm'>
                                Lectura del dia
                            </p>
                            <h1 className='mt-4 text-4xl font-black leading-[0.98] text-[#1F2A44] sm:text-5xl'>
                                ¡Hola! Elige una historia y empieza en un minuto.
                            </h1>
                        </div>

                        {featuredStory ? (
                            <div className='hidden flex-wrap gap-3 lg:flex'>
                                <Link
                                    href={`/cuentos/${featuredStory.slug}`}
                                    className='inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.35rem] bg-[#1F2A44] px-5 text-sm font-black text-white shadow-[0_8px_0_rgba(31,42,68,0.14)] transition active:translate-y-1 active:shadow-none'
                                >
                                    Leer ahora
                                    <ArrowRightIcon className='h-5 w-5' />
                                </Link>
                                <button
                                    type='button'
                                    onClick={changeStory}
                                    className='inline-flex min-h-12 items-center justify-center rounded-[1.35rem] bg-white px-5 text-sm font-black text-[#1F2A44] shadow-sm ring-1 ring-[#E7EEF8] transition active:scale-[0.98]'
                                >
                                    Cambiar cuento
                                </button>
                            </div>
                        ) : null}
                    </div>

                    {featuredStory ? (
                        <div className='bg-white p-4 sm:p-5'>
                            <Link href={`/cuentos/${featuredStory.slug}`} className='group relative block' aria-label={`Leer ${featuredStory.title}`}>
                                <div className='absolute left-3 top-3 z-10 rounded-full bg-[#FFD166] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#1F2A44] shadow-sm sm:left-4 sm:top-4'>
                                    Lee y practica
                                </div>
                                <StoryImage
                                    alt={featuredStory.title}
                                    className='aspect-[4/3] bg-[linear-gradient(135deg,#FFF9EF,#EAF7FF)] p-3'
                                    imageUrl={featuredStory.imageUrl}
                                    priority
                                />
                                <div className='mt-4 flex items-end justify-between gap-4'>
                                    <div className='min-w-0'>
                                        <p className='flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>
                                            <BookIcon className='h-4 w-4' />
                                            Cuento sugerido
                                        </p>
                                        <h2 className='mt-1 line-clamp-2 text-2xl font-black leading-tight text-[#1F2A44]'>{featuredStory.title}</h2>
                                        <p className='mt-1 text-sm font-bold text-[#7A8194]'>{featuredStory.readingTime} de lectura</p>
                                    </div>
                                    <span className='hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F8FBFF] text-[#1F2A44] transition group-hover:translate-x-0.5 sm:flex'>
                                        <ArrowRightIcon className='h-6 w-6' />
                                    </span>
                                </div>
                            </Link>

                            <div className='mt-4 grid grid-cols-2 gap-3 lg:hidden'>
                                <Link
                                    href={`/cuentos/${featuredStory.slug}`}
                                    className='inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.35rem] bg-[#1F2A44] px-4 text-sm font-black text-white shadow-[0_8px_0_rgba(31,42,68,0.14)] transition active:translate-y-1 active:shadow-none'
                                >
                                    Leer ahora
                                </Link>
                                <button
                                    type='button'
                                    onClick={changeStory}
                                    className='inline-flex min-h-12 items-center justify-center rounded-[1.35rem] bg-[#F8FBFF] px-4 text-sm font-black text-[#1F2A44] shadow-sm ring-1 ring-[#E7EEF8] transition active:scale-[0.98]'
                                >
                                    Cambiar cuento
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </header>
    )
}
