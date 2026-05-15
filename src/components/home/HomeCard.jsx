import Link from 'next/link'

const colorClasses = {
    blue: 'bg-[linear-gradient(135deg,#DFF2FD,#A7D8F5)]',
    mint: 'bg-[linear-gradient(135deg,#F1FFF8,#BFE8D4)]',
    peach: 'bg-[linear-gradient(135deg,#FFF2EA,#FFC3A1)]',
    lavender: 'bg-[linear-gradient(135deg,#FAF3FF,#CDB4DB)]',
    yellow: 'bg-[linear-gradient(135deg,#FFF9DE,#FFD166)]',
}

export function HomeCard({ color = 'blue', href, icon: Icon, title }) {
    return (
        <Link href={href} className='group block'>
            <article className={`${colorClasses[color]} flex min-h-[148px] flex-col justify-between overflow-hidden rounded-[2rem] p-5 shadow-[0_14px_36px_rgba(31,42,68,0.10)] ring-1 ring-white/70 transition active:scale-[0.98] md:hover:-translate-y-1`}>
                <div className='flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-white/75 text-[#1F2A44] shadow-inner'>
                    <Icon className='h-8 w-8' />
                </div>
                <div>
                    <h3 className='text-2xl font-black leading-none text-[#1F2A44]'>{title}</h3>
                    <p className='mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#1F2A44]/55'>Abrir</p>
                </div>
            </article>
        </Link>
    )
}
