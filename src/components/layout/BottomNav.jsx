'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { BookIcon, HeartIcon, HomeIcon, StarIcon, UserIcon } from '@/components/icons/Icons'
import { ProfileLoginModal } from '@/features/auth/components/ProfileLoginModal'
import { useAuth } from '@/features/auth/components/AuthProvider'

const items = [
    { href: '/', label: 'Inicio', icon: HomeIcon },
    { href: '/cuentos', label: 'Cuentos', icon: BookIcon },
    { href: '/aprender', label: 'Aprender', icon: StarIcon },
    { href: '/cuentos?favoritos=1', label: 'Favoritos', icon: HeartIcon },
    { href: '#perfil', label: 'Perfil', icon: UserIcon },
]

export function BottomNav() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const { user } = useAuth()

    return (
        <>
            <nav className='fixed inset-x-0 bottom-0 z-40 w-screen pb-[env(safe-area-inset-bottom)]'>
                <div className='grid w-full grid-cols-5 rounded-t-[2rem] border border-b-0 border-white/80 bg-white/90 p-1.5 shadow-[0_-8px_40px_rgba(31,42,68,0.16)] backdrop-blur-xl'>
                    {items.map((item) => {
                        const Icon = item.icon
                        const favoritesActive = pathname.startsWith('/cuentos') && searchParams.get('favoritos') === '1'
                        const active = item.label === 'Inicio'
                            ? pathname === '/'
                            : item.label === 'Cuentos'
                                ? pathname.startsWith('/cuentos') && !favoritesActive
                                : item.label === 'Aprender'
                                    ? pathname.startsWith('/aprender')
                                    : item.label === 'Favoritos'
                                        ? favoritesActive
                                        : false
                        const profileActive = item.label === 'Perfil' && Boolean(user)
                        const inner = (
                            <span className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[1.25rem] px-1 py-1.5 text-[10px] font-black transition active:scale-95 sm:text-xs ${active || profileActive ? 'bg-[#A7D8F5] text-[#1F2A44] shadow-inner' : 'text-[#7A8194]'}`}>
                                <Icon className='h-5 w-5' />
                                {item.label}
                                {profileActive && (
                                    <span className='absolute right-3 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#22C55E]' />
                                )}
                            </span>
                        )

                        if (item.href.startsWith('#')) {
                            return (
                                <button key={item.label} type='button' onClick={() => setIsProfileOpen(true)}>
                                    {inner}
                                </button>
                            )
                        }

                        return (
                            <Link key={item.label} href={item.href} aria-label={item.label}>
                                {inner}
                            </Link>
                        )
                    })}
                </div>
            </nav>
            <ProfileLoginModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </>
    )
}
