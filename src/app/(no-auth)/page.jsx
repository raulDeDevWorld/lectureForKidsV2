import { BookIcon, GameIcon, HeartIcon, StarIcon } from '@/components/icons/Icons'
import { AppShell } from '@/components/layout/AppShell'
import { HomeCard } from '@/components/home/HomeCard'
import { HomeHero } from '@/components/home/HomeHero'
import { getStories } from '@/data/fabulas'
import { PwaInstallPrompt } from '@/features/pwa/components/PwaInstallPrompt'

const homeCards = [
    { title: 'Cuentos', description: 'Historias para leer y escuchar.', href: '/cuentos', color: 'blue', icon: BookIcon },
    { title: 'Aprender', description: 'Vocales, letras, numeros y silabas.', href: '/aprender', color: 'mint', icon: StarIcon },
    { title: 'Practicar', description: 'Juegos rapidos para reforzar.', href: '/practicar', color: 'lavender', icon: GameIcon },
    { title: 'Favoritos', description: 'Continua tus historias guardadas.', href: '/cuentos?favoritos=1', color: 'peach', icon: HeartIcon },
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
