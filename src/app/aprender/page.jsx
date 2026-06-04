import Link from 'next/link'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons/Icons'
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
                        <Link key={module.id} href={`/aprender/${module.id}`} className='group block'>
                            <article className={`${getModuleCardClass(module.color)} flex min-h-[154px] items-center justify-between gap-4 rounded-[2rem] p-5 shadow-[0_14px_36px_rgba(31,42,68,0.10)] ring-1 ring-white/80 transition active:scale-[0.98] md:hover:-translate-y-1`}>
                                <div className='min-w-0'>
                                    <p className='w-fit rounded-full bg-white/75 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>{module.badge}</p>
                                    <h2 className='mt-3 text-2xl font-black leading-tight text-[#1F2A44]'>{module.title}</h2>
                                    <p className='mt-2 line-clamp-2 text-sm font-bold text-[#6B7280]'>{module.prompt}</p>
                                </div>
                                <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/85 text-[#1F2A44] shadow-[0_8px_22px_rgba(31,42,68,0.10)] transition group-active:scale-95'>
                                    <ArrowRightIcon className='h-6 w-6' />
                                </span>
                            </article>
                        </Link>
                    ))}
                </section>
            </div>
        </AppShell>
    )
}

function getModuleCardClass(color) {
    const classes = {
        blue: 'bg-[linear-gradient(135deg,#F8FCFF,#E4F4FD)]',
        mint: 'bg-[linear-gradient(135deg,#FBFFFD,#EAF8F1)]',
        yellow: 'bg-[linear-gradient(135deg,#FFFFF7,#FFF7DC)]',
        peach: 'bg-[linear-gradient(135deg,#FFFCFA,#FFF0E8)]',
    }

    return classes[color] || classes.blue
}
