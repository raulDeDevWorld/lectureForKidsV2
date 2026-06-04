import Link from 'next/link'
import { ArrowLeftIcon } from '@/components/icons/Icons'
import { AppShell } from '@/components/layout/AppShell'
import { pricingGroups } from '@/data/pricing'

export const metadata = {
    title: 'Precios | Fabulas 3000',
    description: 'Planes para acceder a lectura y aprendizaje infantil.',
}

export default function PricingPage() {
    const activeGroup = pricingGroups.find((group) => group.status === 'available') || pricingGroups[0]
    const upcomingGroups = pricingGroups.filter((group) => group.status !== 'available')

    return (
        <AppShell>
            <div className='mx-auto max-w-4xl space-y-5 pb-4'>
                <header className='rounded-[2rem] bg-white/90 p-4 shadow-[0_12px_34px_rgba(31,42,68,0.08)] ring-1 ring-white/80 backdrop-blur'>
                    <div className='flex items-center gap-3'>
                        <Link href='/' aria-label='Volver al inicio' className='inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(31,42,68,0.10)]'>
                            <ArrowLeftIcon className='h-6 w-6' />
                        </Link>
                        <div className='min-w-0'>
                            <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Precios</p>
                            <h1 className='text-3xl font-black leading-tight text-[#1F2A44]'>Planes simples</h1>
                            <p className='mt-1 text-sm font-bold text-[#7A8194]'>Elige el acceso que mejor se adapte a tu familia.</p>
                        </div>
                    </div>
                </header>

                <section className='grid grid-cols-3 rounded-[1.6rem] bg-white/75 p-1.5 shadow-[0_10px_28px_rgba(31,42,68,0.08)] ring-1 ring-white/80'>
                    {pricingGroups.map((group) => (
                        <div
                            key={group.id}
                            className={`rounded-[1.2rem] px-2 py-3 text-center ${group.status === 'available' ? 'bg-[#1F2A44] text-white shadow-sm' : 'text-[#7A8194]'}`}
                        >
                            <p className='truncate text-sm font-black'>{group.title}</p>
                            <p className={`mt-0.5 text-[10px] font-black uppercase tracking-[0.12em] ${group.status === 'available' ? 'text-white/60' : 'text-[#7A8194]'}`}>{group.status === 'available' ? 'Disponible' : 'Pronto'}</p>
                        </div>
                    ))}
                </section>

                <section className='rounded-[2rem] bg-white/90 p-4 shadow-[0_16px_42px_rgba(31,42,68,0.10)] ring-1 ring-white/80 sm:p-6'>
                    <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
                        <div>
                            <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>{activeGroup.title}</p>
                            <h2 className='mt-1 text-2xl font-black leading-tight text-[#1F2A44]'>Acceso familiar</h2>
                        </div>
                        <p className='max-w-sm text-sm font-bold leading-6 text-[#7A8194]'>{activeGroup.description}</p>
                    </div>

                    <div className='mt-6 grid gap-3 lg:grid-cols-3'>
                        {activeGroup.plans.map((plan) => (
                            <article
                                key={plan.id}
                                className={`relative flex min-h-[284px] flex-col rounded-[1.5rem] border p-5 transition ${plan.featured ? 'border-[#1F2A44] bg-white shadow-[0_18px_42px_rgba(31,42,68,0.14)]' : 'border-[#E5E7EB] bg-white/70 shadow-[0_8px_22px_rgba(31,42,68,0.06)]'}`}
                            >
                                {plan.featured ? (
                                    <span className='absolute right-4 top-4 rounded-full bg-[#1F2A44] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-white'>
                                        Recomendado
                                    </span>
                                ) : null}

                                <div>
                                    <h3 className='text-2xl font-black leading-tight text-[#1F2A44]'>{plan.name}</h3>
                                    <p className='mt-1 text-sm font-black text-[#7A8194]'>{plan.summary}</p>
                                </div>

                                <div className='mt-6'>
                                    {plan.offerPrice < plan.normalPrice ? (
                                        <p className='mb-1 text-sm font-black text-[#7A8194]'>
                                            Antes <span className='line-through'>{plan.normalPrice} Bs</span>
                                        </p>
                                    ) : null}
                                    <div className='flex items-end gap-2'>
                                        <span className='text-6xl font-black leading-none text-[#1F2A44]'>{plan.offerPrice}</span>
                                        <span className='pb-1 text-lg font-black text-[#1F2A44]'>Bs</span>
                                    </div>
                                    <p className='mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>por {plan.period}</p>
                                </div>

                                <p className='mt-5 text-sm font-bold leading-6 text-[#6B7280]'>{plan.description}</p>

                                <button
                                    type='button'
                                    className={`mt-auto inline-flex min-h-12 items-center justify-center rounded-2xl px-4 text-sm font-black transition active:scale-[0.98] ${plan.featured ? 'bg-[#1F2A44] text-white shadow-[0_8px_0_rgba(31,42,68,0.16)]' : 'bg-[#F3F4F6] text-[#1F2A44]'}`}
                                >
                                    Elegir plan
                                </button>
                            </article>
                        ))}
                    </div>

                    <div className='mt-5 rounded-[1.5rem] bg-[#F8FBFF] p-4'>
                        <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Incluye</p>
                        <div className='mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4'>
                            {activeGroup.benefits.map((benefit) => (
                                <div key={benefit} className='rounded-2xl bg-white px-3 py-2 text-sm font-black text-[#1F2A44]'>
                                    {benefit}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className='grid gap-3 sm:grid-cols-2'>
                    {upcomingGroups.map((group) => (
                        <article key={group.id} className='rounded-[1.5rem] border border-dashed border-white bg-white/55 p-4'>
                            <div className='flex items-center justify-between gap-3'>
                                <div>
                                    <h3 className='text-lg font-black leading-tight text-[#1F2A44]'>{group.title}</h3>
                                    <p className='mt-1 text-sm font-bold text-[#7A8194]'>{group.description}</p>
                                </div>
                                <span className='shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#7A8194]'>Pronto</span>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </AppShell>
    )
}
