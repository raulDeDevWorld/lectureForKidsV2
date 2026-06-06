import Link from 'next/link'
import { ArrowLeftIcon, ArrowRightIcon, BookIcon, MicrophoneIcon, StarIcon, TicketIcon } from '@/components/icons/Icons'
import { AppShell } from '@/components/layout/AppShell'
import { levelOneModules } from '@/data/learningLevelOne'

export const metadata = {
    title: 'Aprender | Fabulas 3000',
    description: 'Practica vocales, abecedario, numeros y silabas.',
}

export default function LearnPage() {
    return (
        <AppShell>
            <div className='space-y-5'>
                <header className='rounded-[2rem] bg-white/80 p-4 shadow-[0_12px_34px_rgba(31,42,68,0.08)] ring-1 ring-white/80 backdrop-blur'>
                    <div className='flex items-center gap-3'>
                        <Link href='/' aria-label='Volver al inicio' className='inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(31,42,68,0.10)]'>
                            <ArrowLeftIcon className='h-6 w-6' />
                        </Link>
                        <div className='min-w-0'>
                            <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Nivel 1</p>
                            <h1 className='text-3xl font-black leading-tight text-[#1F2A44]'>Aprender</h1>
                            <p className='mt-1 text-sm font-bold text-[#7A8194]'>Vocales, letras, numeros y silabas para empezar a leer.</p>
                        </div>
                    </div>
                </header>

                <section className='grid gap-4 sm:grid-cols-2'>
                    {levelOneModules.map((module) => (
                        <LearningModuleCard key={module.id} module={module} />
                    ))}
                </section>
            </div>
        </AppShell>
    )
}

const moduleStyles = {
    blue: {
        accent: 'bg-[#A7D8F5]',
        action: 'bg-[#EAF7FF] text-[#1D4E89]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#F4FBFF_42%,#B7E3FA_100%)]',
        icon: 'bg-[#EAF7FF] text-[#1D4E89]',
        ring: 'ring-[#D7ECFA]',
        sample: 'bg-[#EAF7FF] text-[#1D4E89]',
    },
    mint: {
        accent: 'bg-[#BFE8D4]',
        action: 'bg-[#EAF8F1] text-[#237A4D]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#F6FFF9_42%,#BFE8D4_100%)]',
        icon: 'bg-[#EAF8F1] text-[#237A4D]',
        ring: 'ring-[#D8F0E4]',
        sample: 'bg-[#EAF8F1] text-[#237A4D]',
    },
    peach: {
        accent: 'bg-[#FFC3A1]',
        action: 'bg-[#FFF1E8] text-[#A64B22]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF8F3_42%,#FFC3A1_100%)]',
        icon: 'bg-[#FFF1E8] text-[#A64B22]',
        ring: 'ring-[#FFE0CF]',
        sample: 'bg-[#FFF1E8] text-[#A64B22]',
    },
    yellow: {
        accent: 'bg-[#FFD166]',
        action: 'bg-[#FFF7CC] text-[#8A5A00]',
        background: 'bg-[linear-gradient(135deg,#FFFFFF_0%,#FFFBEA_42%,#FFD166_100%)]',
        icon: 'bg-[#FFF7CC] text-[#8A5A00]',
        ring: 'ring-[#FFE8A3]',
        sample: 'bg-[#FFF7CC] text-[#8A5A00]',
    },
}

const moduleVisuals = {
    vocales: {
        icon: MicrophoneIcon,
        samples: ['A', 'E', 'I'],
    },
    abecedario: {
        icon: BookIcon,
        samples: ['B', 'M', 'S'],
    },
    numeros: {
        icon: TicketIcon,
        samples: ['1', '2', '3'],
    },
    silabas: {
        icon: StarIcon,
        samples: ['ma', 'pe', 'lu'],
    },
}

function LearningModuleCard({ module }) {
    const styles = moduleStyles[module.color] || moduleStyles.blue
    const visual = moduleVisuals[module.id] || moduleVisuals.vocales
    const Icon = visual.icon

    return (
        <Link href={`/aprender/${module.id}`} className='group block' aria-label={module.title}>
            <article className={`relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[1.65rem] p-4 shadow-[0_14px_34px_rgba(31,42,68,0.08)] ring-1 ${styles.ring} ${styles.background} transition active:scale-[0.98] md:hover:-translate-y-1 md:hover:shadow-[0_18px_42px_rgba(31,42,68,0.12)]`}>
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

                <div className='relative z-10 mt-5 flex justify-end gap-2'>
                    {visual.samples.map((sample) => (
                        <span
                            key={`${module.id}-${sample}`}
                            className={`flex h-11 min-w-11 items-center justify-center rounded-[1rem] px-3 text-xl font-black leading-none shadow-sm ring-1 ring-white/70 ${styles.sample}`}
                        >
                            {sample}
                        </span>
                    ))}
                </div>

                <div className='relative z-10 mt-5'>
                    <p className='w-fit rounded-full bg-white/75 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>{module.badge}</p>
                    <h2 className='mt-3 text-2xl font-black leading-none text-[#1F2A44]'>{module.title}</h2>
                    <p className='mt-2 line-clamp-2 text-sm font-bold leading-5 text-[#5B6477]'>{module.prompt}</p>
                    <span className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] ${styles.action}`}>
                        Abrir
                    </span>
                </div>
            </article>
        </Link>
    )
}
