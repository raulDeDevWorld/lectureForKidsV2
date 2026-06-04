import { BookIcon, HeartIcon, StarIcon, TicketIcon } from '@/components/icons/Icons'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { HomeCard } from '@/components/home/HomeCard'
import { HomeHero } from '@/components/home/HomeHero'
import { getStories } from '@/data/fabulas'

const homeCards = [
    { title: 'Cuentos', description: 'Historias cortas para leer hoy.', href: '/cuentos', color: 'blue', icon: BookIcon },
    { title: 'Aprender', description: 'Vocales, números y sílabas.', href: '/aprender', color: 'mint', icon: StarIcon },
    { title: 'Favoritos', description: 'Continúa con lo que guardaste.', href: '/cuentos?favoritos=1', color: 'peach', icon: HeartIcon },
    { title: 'Planes', description: 'Activa el acceso completo.', href: '/precios', color: 'lavender', icon: TicketIcon },
]

const quickPractice = [
    { title: 'Vocales', href: '/aprender/vocales', color: 'bg-[#FFD166]', text: 'text-[#1F2A44]' },
    { title: 'Abecedario', href: '/aprender/abecedario', color: 'bg-[#A7D8F5]', text: 'text-[#1F2A44]' },
    { title: 'Sílabas', href: '/aprender/silabas', color: 'bg-[#BFE8D4]', text: 'text-[#1F2A44]' },
]

export default function Home() {
    const stories = getStories()

    return (
        <AppShell>
            <div className='space-y-7'>
                <HomeHero stories={stories} />

                <section className='grid grid-cols-2 gap-4'>
                    {homeCards.map((card) => (
                        <HomeCard key={card.title} {...card} />
                    ))}
                </section>

                <section className='rounded-[2rem] bg-white/80 p-5 shadow-[0_14px_36px_rgba(31,42,68,0.08)] ring-1 ring-white/80'>
                    <div className='flex items-end justify-between gap-4'>
                        <div>
                            <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Práctica rápida</p>
                            <h2 className='mt-1 text-2xl font-black leading-tight text-[#1F2A44]'>Entrena una habilidad</h2>
                        </div>
                        <Link href='/aprender' className='shrink-0 rounded-full bg-[#F8FBFF] px-4 py-2 text-xs font-black text-[#1F2A44] shadow-sm'>
                            Ver todo
                        </Link>
                    </div>

                    <div className='mt-4 grid gap-3 sm:grid-cols-3'>
                        {quickPractice.map((item) => (
                            <Link key={item.title} href={item.href} className={`min-h-16 rounded-[1.4rem] px-4 py-3 text-sm font-black shadow-sm transition active:scale-[0.98] ${item.color} ${item.text}`}>
                                <span className='block text-lg leading-tight'>{item.title}</span>
                                <span className='mt-1 block text-xs uppercase tracking-[0.12em] opacity-60'>Abrir</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </AppShell>
    )
}
