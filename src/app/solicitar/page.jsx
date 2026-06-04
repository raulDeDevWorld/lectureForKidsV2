import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowLeftIcon } from '@/components/icons/Icons'
import { AppShell } from '@/components/layout/AppShell'
import { PlanRequestClient } from '@/components/pricing/PlanRequestClient'

export const metadata = {
    title: 'Solicitar plan | Fabulas 3000',
    description: 'Completa tus datos para solicitar un plan.',
}

export default function RequestPlanPage() {
    return (
        <AppShell>
            <div className='mx-auto max-w-3xl space-y-5 pb-4'>
                <header className='rounded-[2rem] bg-white/90 p-4 shadow-[0_12px_34px_rgba(31,42,68,0.08)] ring-1 ring-white/80 backdrop-blur sm:p-5'>
                    <div className='flex items-center gap-3'>
                        <Link href='/precios' aria-label='Volver a precios' className='inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(31,42,68,0.10)]'>
                            <ArrowLeftIcon className='h-6 w-6' />
                        </Link>
                        <div className='min-w-0'>
                            <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Solicitud</p>
                            <h1 className='text-3xl font-black leading-tight text-[#1F2A44]'>Completa tu acceso</h1>
                            <p className='mt-1 text-sm font-bold leading-6 text-[#7A8194]'>Registro seguro para activar tu plan.</p>
                        </div>
                    </div>
                </header>

                <Suspense fallback={<div className='rounded-[2rem] bg-white/90 p-5 text-sm font-black text-[#7A8194]'>Preparando solicitud...</div>}>
                    <PlanRequestClient />
                </Suspense>
            </div>
        </AppShell>
    )
}
