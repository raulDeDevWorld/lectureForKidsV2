'use client'

import { HeartIcon } from '@/components/icons/Icons'

export function FavoriteButton({ active, className = '', onToggle }) {
    return (
        <button
            type='button'
            aria-label={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onToggle()
            }}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#FF7F6E] shadow-[0_8px_20px_rgba(31,42,68,0.10)] transition active:scale-95 ${className}`}
        >
            <HeartIcon filled={active} className='h-5 w-5' />
        </button>
    )
}
