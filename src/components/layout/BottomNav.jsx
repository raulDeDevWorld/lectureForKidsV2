'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { HeartIcon, HomeIcon, UserIcon } from '@/components/icons/Icons'

const items = [
    { href: '/', label: 'Inicio', icon: HomeIcon },
    { href: '/cuentos?favoritos=1', label: 'Favoritos', icon: HeartIcon },
    { href: '#perfil', label: 'Perfil', icon: UserIcon },
]

export function BottomNav() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    return (
        <nav className='fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-4 pb-[calc(0.8rem+env(safe-area-inset-bottom))]'>
            <div className='grid grid-cols-3 rounded-[2rem] border border-white/80 bg-white/90 p-2 shadow-[0_18px_60px_rgba(31,42,68,0.16)] backdrop-blur-xl'>
                {items.map((item) => {
                    const Icon = item.icon
                    const active = item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith('/cuentos') && item.label === 'Favoritos' && searchParams.get('favoritos') === '1'
                    const inner = (
                        <span className={`flex flex-col items-center gap-1 rounded-[1.4rem] px-2 py-2 text-xs font-black transition active:scale-95 ${active ? 'bg-[#A7D8F5] text-[#1F2A44] shadow-inner' : 'text-[#7A8194]'}`}>
                            <Icon className='h-5 w-5' />
                            {item.label}
                        </span>
                    )

                    if (item.href.startsWith('#')) {
                        return <button key={item.label} type='button'>{inner}</button>
                    }

                    return (
                        <Link key={item.label} href={item.href} aria-label={item.label}>
                            {inner}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
