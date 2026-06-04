import Link from 'next/link'
import { ArrowRightIcon } from '@/components/icons/Icons'

const colorClasses = {
    blue: 'bg-[linear-gradient(135deg,#F5FBFF,#B7E3FA)]',
    mint: 'bg-[linear-gradient(135deg,#F6FFF9,#BFE8D4)]',
    peach: 'bg-[linear-gradient(135deg,#FFF8F3,#FFC3A1)]',
    lavender: 'bg-[linear-gradient(135deg,#FBF7FF,#D9C4E6)]',
    yellow: 'bg-[linear-gradient(135deg,#FFFBEA,#FFD166)]',
}

export function HomeCard({ color = 'blue', description, href, icon: Icon, title }) {
    return (
        <Link href={href} className='group block'>
            <article className={`${colorClasses[color]} relative flex min-h-[166px] flex-col justify-between overflow-hidden rounded-[1.8rem] p-5 shadow-[0_14px_34px_rgba(31,42,68,0.09)] ring-1 ring-white/80 transition active:scale-[0.98] md:hover:-translate-y-1`}>
                <div className='flex items-start justify-between gap-3'>
                    <div className='flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-white/80 text-[#1F2A44] shadow-inner'>
                        <Icon className='h-7 w-7' />
                    </div>
                    <span className='flex h-9 w-9 items-center justify-center rounded-full bg-white/75 text-[#1F2A44] transition group-hover:translate-x-0.5'>
                        <ArrowRightIcon className='h-5 w-5' />
                    </span>
                </div>
                <div>
                    <h3 className='text-2xl font-black leading-none text-[#1F2A44]'>{title}</h3>
                    <p className='mt-2 line-clamp-2 text-sm font-bold leading-5 text-[#1F2A44]/65'>{description}</p>
                </div>
            </article>
        </Link>
    )
}
