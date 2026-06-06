import Link from 'next/link'
import { ArrowLeftIcon } from '@/components/icons/Icons'
import { AppShell } from '@/components/layout/AppShell'
import { PracticePageClient } from '@/components/practice/PracticePageClient'
import { levelOneModules } from '@/data/learningLevelOne'

export const metadata = {
    title: 'Practicar | Fabulas 3000',
    description: 'Juegos de practica para reforzar vocales, letras, numeros y silabas.',
}

export default function PracticePage() {
    return (
        <AppShell>
            <div className='mx-auto max-w-5xl space-y-5 pb-4'>
                <header className='rounded-[2rem] bg-white/90 p-4 shadow-[0_12px_34px_rgba(31,42,68,0.08)] ring-1 ring-white/80 backdrop-blur sm:p-5'>
                    <div className='flex items-center gap-3'>
                        <Link href='/' aria-label='Volver al inicio' className='inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(31,42,68,0.10)]'>
                            <ArrowLeftIcon className='h-6 w-6' />
                        </Link>
                        <div className='min-w-0'>
                            <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Reto diario</p>
                            <h1 className='text-3xl font-black leading-tight text-[#1F2A44]'>Practicar</h1>
                            <p className='mt-1 max-w-2xl text-sm font-bold leading-6 text-[#7A8194]'>Refuerza lo aprendido con respuestas rapidas.</p>
                        </div>
                    </div>
                </header>

                <PracticePageClient modules={levelOneModules} />
            </div>
        </AppShell>
    )
}
