'use client'

import Link from 'next/link'
import { FavoriteButton } from './FavoriteButton'
import { StoryImage } from './StoryImage'

const colorClasses = {
    blue: 'bg-[linear-gradient(135deg,#F8FCFF,#E8F5FD)]',
    mint: 'bg-[linear-gradient(135deg,#FBFFFD,#EAF8F1)]',
    peach: 'bg-[linear-gradient(135deg,#FFFCFA,#FFF0E8)]',
    lavender: 'bg-[linear-gradient(135deg,#FFFBFF,#F5ECFA)]',
    yellow: 'bg-[linear-gradient(135deg,#FFFFF7,#FFF7DC)]',
}

export function StoryCard({ isFavorite, onToggleFavorite, story }) {
    return (
        <Link href={`/cuentos/${story.slug}`} className='group block'>
            <article className={`${colorClasses[story.color] || colorClasses.blue} grid grid-cols-[1fr_112px] items-center gap-3 rounded-[2rem] p-4 shadow-[0_14px_38px_rgba(31,42,68,0.09)] ring-1 ring-white/80 transition active:scale-[0.985] md:grid-cols-[1fr_140px] md:hover:-translate-y-1`}>
                <div className='min-w-0'>
                    <div className='flex items-start justify-between gap-2'>
                        <div>
                            <p className='mb-2 w-fit rounded-full bg-white/75 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#7A8194]'>{story.category}</p>
                            <h2 className='line-clamp-2 text-xl font-black leading-tight text-[#1F2A44]'>{story.title}</h2>
                        </div>
                        <FavoriteButton active={isFavorite} onToggle={onToggleFavorite} />
                    </div>
                    <div className='mt-4 flex flex-wrap gap-2 text-xs font-black text-[#7A8194]'>
                        <span className='rounded-full bg-white/80 px-3 py-1.5 shadow-sm'>{story.readingTime}</span>
                        <span className='rounded-full bg-white/80 px-3 py-1.5 shadow-sm'>Edad {story.ageRange}</span>
                    </div>
                </div>

                <StoryImage
                    alt={story.title}
                    className='aspect-square bg-white/60 p-2 shadow-inner'
                    imageUrl={story.imageUrl}
                    size='thumb'
                />
            </article>
        </Link>
    )
}
