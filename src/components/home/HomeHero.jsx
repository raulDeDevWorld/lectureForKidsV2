import { StarIcon } from '@/components/icons/Icons'
import { RoundedIconButton } from '@/components/ui/RoundedIconButton'
import { StoryImage } from '@/components/stories/StoryImage'

export function HomeHero() {
    return (
        <header className='space-y-5'>
            <div className='flex items-center justify-between'>
                <div className='flex h-14 w-14 items-center justify-center rounded-full bg-white p-1 shadow-[0_10px_28px_rgba(31,42,68,0.10)]'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#BFE8D4] text-xl font-black text-[#1F2A44]'>
                        F
                    </div>
                </div>
                <RoundedIconButton label='Ver favoritos'>
                    <StarIcon className='h-6 w-6 text-[#FFD166]' />
                </RoundedIconButton>
            </div>

            <div className='rounded-[2rem] bg-white/70 p-4 shadow-[0_12px_34px_rgba(31,42,68,0.07)] backdrop-blur'>
                <p className='text-4xl font-black leading-tight text-[#1F2A44]'>¡Hola, amigo!</p>
                <p className='mt-2 text-xl font-extrabold text-[#7A8194]'>¿Qué te gustaría hacer hoy?</p>
            </div>

            <section className='relative overflow-hidden rounded-[2.25rem] bg-white p-4 shadow-[0_18px_50px_rgba(31,42,68,0.10)]'>
                <div className='absolute left-5 top-5 z-10 rounded-full bg-[#FFD166] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#1F2A44] shadow-sm'>
                    Lee y practica
                </div>
                <StoryImage
                    alt='Leon leyendo un cuento'
                    className='aspect-[4/3] bg-[linear-gradient(135deg,#FFF9EF,#EAF7FF)] p-3'
                    imageUrl='/stories/el-leon-y-el-raton.svg'
                    priority
                />
            </section>
        </header>
    )
}
