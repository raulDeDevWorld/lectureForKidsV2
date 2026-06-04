import Link from 'next/link'
import { ArrowRightIcon } from '@/components/icons/Icons'

const cardStyles = {
    blue: {
        accent: 'bg-[#A7D8F5]',
        action: 'bg-[#EAF7FF] text-[#1D4E89]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#F4FBFF_42%,#B7E3FA_100%)]',
        icon: 'bg-[#EAF7FF] text-[#1D4E89]',
        ring: 'ring-[#D7ECFA]',
    },
    mint: {
        accent: 'bg-[#BFE8D4]',
        action: 'bg-[#EAF8F1] text-[#237A4D]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#F6FFF9_42%,#BFE8D4_100%)]',
        icon: 'bg-[#EAF8F1] text-[#237A4D]',
        ring: 'ring-[#D8F0E4]',
    },
    peach: {
        accent: 'bg-[#FFC3A1]',
        action: 'bg-[#FFF1E8] text-[#A64B22]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF8F3_42%,#FFC3A1_100%)]',
        icon: 'bg-[#FFF1E8] text-[#A64B22]',
        ring: 'ring-[#FFE0CF]',
    },
    lavender: {
        accent: 'bg-[#CDB4DB]',
        action: 'bg-[#F7EDFF] text-[#6D4D83]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#FBF7FF_42%,#D9C4E6_100%)]',
        icon: 'bg-[#F7EDFF] text-[#6D4D83]',
        ring: 'ring-[#E8D8F0]',
    },
    yellow: {
        accent: 'bg-[#FFD166]',
        action: 'bg-[#FFF7CC] text-[#8A5A00]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#FFFBEA_42%,#FFD166_100%)]',
        icon: 'bg-[#FFF7CC] text-[#8A5A00]',
        ring: 'ring-[#FFE8A3]',
    },
}

export function HomeCard({ color = 'blue', description, href, icon: Icon, title }) {
    const styles = cardStyles[color] || cardStyles.blue

    return (
        <Link href={href} className='group block' aria-label={title}>
            <article className={`relative flex min-h-[172px] flex-col justify-between overflow-hidden rounded-[1.65rem] p-4 shadow-[0_14px_34px_rgba(31,42,68,0.08)] ring-1 ${styles.ring} ${styles.background} transition active:scale-[0.98] md:hover:-translate-y-1 md:hover:shadow-[0_18px_42px_rgba(31,42,68,0.12)]`}>
                <span className={`absolute inset-x-0 top-0 h-1.5 ${styles.accent}`} />
                <span className='pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-white/45' />
                <span className='pointer-events-none absolute -bottom-10 right-8 h-20 w-20 rounded-full bg-white/30' />
                <div className='relative z-10 flex items-start justify-between gap-3'>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-[1.1rem] ${styles.icon}`}>
                        <Icon className='h-7 w-7 stroke-[2.4]' />
                    </div>
                    <span className='flex h-9 w-9 items-center justify-center rounded-full bg-[#F8FBFF] text-[#1F2A44] transition group-hover:translate-x-0.5'>
                        <ArrowRightIcon className='h-5 w-5' />
                    </span>
                </div>
                <div className='relative z-10'>
                    <h3 className='text-2xl font-black leading-none text-[#1F2A44]'>{title}</h3>
                    <p className='mt-2 line-clamp-2 text-sm font-bold leading-5 text-[#5B6477]'>{description}</p>
                    <span className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] ${styles.action}`}>
                        Abrir
                    </span>
                </div>
            </article>
        </Link>
    )
}
