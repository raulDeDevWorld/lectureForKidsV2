'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { StarIcon } from '@/components/icons/Icons'
import { RoundedIconButton } from '@/components/ui/RoundedIconButton'
import { StoryImage } from '@/components/stories/StoryImage'

function pickRandomStory(stories) {
    if (!stories.length) return null
    return stories[Math.floor(Math.random() * stories.length)]
}

export function HomeHero({ stories = [] }) {
    const [featuredStory, setFeaturedStory] = useState(stories[0] || null)

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setFeaturedStory(pickRandomStory(stories))
        }, 0)

        return () => window.clearTimeout(timeoutId)
    }, [stories])

    return (
        <header className='space-y-5'>
            <div className='flex items-center justify-between'>
                <div className='flex h-14 w-14 items-center justify-center rounded-full bg-white p-1 shadow-[0_10px_28px_rgba(31,42,68,0.10)]'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#BFE8D4] text-xl font-black text-[#1F2A44]'>
                        F
                    </div>
                </div>
                <RoundedIconButton label='Ver favoritos'>
                    <StarIcon className='h-6 w-6 text-[#FFD166]' />
                </RoundedIconButton>
            </div>

            <div className='rounded-[2rem] bg-white/70 p-4 shadow-[0_12px_34px_rgba(31,42,68,0.07)] backdrop-blur'>
                <p className='text-4xl font-black leading-tight text-[#1F2A44]'>¡Hola, amigo!</p>
                <p className='mt-2 text-xl font-extrabold text-[#7A8194]'>¿Qué te gustaría hacer hoy?</p>
            </div>

            {featuredStory ? (
                <Link href={`/cuentos/${featuredStory.slug}`} className='group block' aria-label={`Leer ${featuredStory.title}`}>
                    <section className='relative overflow-hidden rounded-[2.25rem] bg-white p-4 shadow-[0_18px_50px_rgba(31,42,68,0.10)] transition active:scale-[0.99] md:hover:-translate-y-1'>
                        <div className='absolute left-5 top-5 z-10 rounded-full bg-[#FFD166] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#1F2A44] shadow-sm'>
                            Lee y practica
                        </div>
                        <StoryImage
                            alt={featuredStory.title}
                            className='aspect-[4/3] bg-[linear-gradient(135deg,#FFF9EF,#EAF7FF)] p-3'
                            imageUrl={featuredStory.imageUrl}
                            priority
                        />
                        <div className='mt-4 grid gap-3 rounded-[1.7rem] bg-[#F8FBFF] p-4 sm:grid-cols-[1fr_auto] sm:items-center'>
                            <div className='min-w-0'>
                                <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Cuento sugerido</p>
                                <h2 className='mt-1 line-clamp-2 text-2xl font-black leading-tight text-[#1F2A44]'>{featuredStory.title}</h2>
                                <p className='mt-1 text-sm font-bold text-[#7A8194]'>{featuredStory.readingTime} min de lectura</p>
                            </div>
                            <span className='inline-flex min-h-12 items-center justify-center rounded-[1.4rem] bg-[#1F2A44] px-5 text-sm font-black text-white shadow-[0_8px_0_rgba(31,42,68,0.14)] transition group-active:translate-y-1 group-active:shadow-none'>
                                Leer ahora
                            </span>
                        </div>
                    </section>
                </Link>
            ) : null}
        </header>
    )
}
