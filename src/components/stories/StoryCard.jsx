'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@/components/icons/Icons'
import { FavoriteButton } from './FavoriteButton'
import { StoryImage } from './StoryImage'

const cardStyles = {
    blue: {
        accent: 'bg-[#A7D8F5]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#F4FBFF_42%,#B7E3FA_100%)]',
        chip: 'bg-[#EAF7FF] text-[#1D4E89]',
        ring: 'ring-[#D7ECFA]',
    },
    mint: {
        accent: 'bg-[#BFE8D4]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#F6FFF9_42%,#BFE8D4_100%)]',
        chip: 'bg-[#EAF8F1] text-[#237A4D]',
        ring: 'ring-[#D8F0E4]',
    },
    peach: {
        accent: 'bg-[#FFC3A1]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF8F3_42%,#FFC3A1_100%)]',
        chip: 'bg-[#FFF1E8] text-[#A64B22]',
        ring: 'ring-[#FFE0CF]',
    },
    lavender: {
        accent: 'bg-[#CDB4DB]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#FBF7FF_42%,#D9C4E6_100%)]',
        chip: 'bg-[#F7EDFF] text-[#6D4D83]',
        ring: 'ring-[#E8D8F0]',
    },
    yellow: {
        accent: 'bg-[#FFD166]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#FFFBEA_42%,#FFD166_100%)]',
        chip: 'bg-[#FFF7CC] text-[#8A5A00]',
        ring: 'ring-[#FFE8A3]',
    },
}

export function StoryCard({ isFavorite, onToggleFavorite, story }) {
    const styles = cardStyles[story.color] || cardStyles.blue

    return (
        <article className={`group relative grid grid-cols-[1fr_112px] items-center gap-3 overflow-hidden rounded-[1.7rem] p-4 shadow-[0_14px_34px_rgba(31,42,68,0.08)] ring-1 ${styles.ring} ${styles.background} transition active:scale-[0.985] md:grid-cols-[1fr_140px] md:hover:-translate-y-1 md:hover:shadow-[0_18px_42px_rgba(31,42,68,0.12)]`}>
            <Link href={`/cuentos/${story.slug}`} aria-label={`Leer ${story.title}`} className='absolute inset-0 z-10' />
            <span className={`absolute inset-x-0 top-0 h-1.5 ${styles.accent}`} />
            <span className='pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-white/45' />
            <span className='pointer-events-none absolute -bottom-10 right-10 h-20 w-20 rounded-full bg-white/30' />

            <div className='pointer-events-none relative z-20 min-w-0'>
                <div className='flex items-start justify-between gap-2'>
                    <div className='min-w-0'>
                        <p className={`mb-2 w-fit rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${styles.chip}`}>{story.category}</p>
                        <h2 className='line-clamp-2 text-xl font-black leading-tight text-[#1F2A44]'>{story.title}</h2>
                    </div>
                    <FavoriteButton active={isFavorite} onToggle={onToggleFavorite} className='pointer-events-auto relative z-30 shrink-0' />
                </div>

                <div className='mt-4 flex flex-wrap gap-2 text-xs font-black text-[#5B6477]'>
                    <span className='rounded-full bg-white/80 px-3 py-1.5 shadow-sm'>{story.readingTime}</span>
                    <span className='rounded-full bg-white/80 px-3 py-1.5 shadow-sm'>Edad {story.ageRange}</span>
                </div>

                <span className='mt-4 inline-flex items-center gap-1 rounded-full bg-white/82 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#1F2A44] shadow-sm'>
                    Leer
                    <ArrowRightIcon className='h-4 w-4' />
                </span>
            </div>

            <div className='pointer-events-none relative z-20'>
                <StoryImage
                    alt={story.title}
                    className='aspect-square bg-white/65 p-2 shadow-inner'
                    imageUrl={story.imageUrl}
                    size='thumb'
                />
            </div>
        </article>
    )
}
