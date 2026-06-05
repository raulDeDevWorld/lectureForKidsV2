import { BookIcon, HeartIcon, StarIcon, TicketIcon } from '@/components/icons/Icons'
import { AppShell } from '@/components/layout/AppShell'
import { HomeCard } from '@/components/home/HomeCard'
import { HomeHero } from '@/components/home/HomeHero'
import { getStories } from '@/data/fabulas'
import { PwaInstallPrompt } from '@/features/pwa/components/PwaInstallPrompt'

const homeCards = [
    { title: 'Cuentos', description: 'Historias cortas para leer hoy.', href: '/cuentos', color: 'blue', icon: BookIcon },
    { title: 'Aprender', description: 'Vocales, números y sílabas.', href: '/aprender', color: 'mint', icon: StarIcon },
    { title: 'Favoritos', description: 'Continúa con lo que guardaste.', href: '/cuentos?favoritos=1', color: 'peach', icon: HeartIcon },
    { title: 'Planes', description: 'Activa el acceso completo.', href: '/precios', color: 'lavender', icon: TicketIcon },
]

export default function Home() {
    const stories = getStories()

    return (
        <AppShell>
            <div className='space-y-7'>
                <HomeHero stories={stories} />

                <PwaInstallPrompt variant='card' />

                <section className='grid grid-cols-2 gap-4'>
                    {homeCards.map((card) => (
                        <HomeCard key={card.title} {...card} />
                    ))}
                </section>
            </div>
        </AppShell>
    )
}
