import { BookIcon, HeartIcon, StarIcon, TicketIcon } from '@/components/icons/Icons'
import { AppShell } from '@/components/layout/AppShell'
import { HomeCard } from '@/components/home/HomeCard'
import { HomeHero } from '@/components/home/HomeHero'

const homeCards = [
    { title: 'Cuentos', href: '/cuentos', color: 'blue', icon: BookIcon },
    { title: 'Aprender', href: '/aprender', color: 'mint', icon: StarIcon },
    { title: 'Favoritos', href: '/cuentos?favoritos=1', color: 'peach', icon: HeartIcon },
    { title: 'Planes', href: '/precios', color: 'lavender', icon: TicketIcon },
]

export default function Home() {
    return (
        <AppShell>
            <div className='space-y-7'>
                <HomeHero />

                <section className='grid grid-cols-2 gap-4'>
                    {homeCards.map((card) => (
                        <HomeCard key={card.title} {...card} />
                    ))}
                </section>
            </div>
        </AppShell>
    )
}
