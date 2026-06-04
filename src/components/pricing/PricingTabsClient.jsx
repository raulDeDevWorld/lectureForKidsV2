'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

const audienceStyles = {
    familia: {
        accent: 'bg-[#FFF7CC] text-[#8A5A00]',
        button: 'bg-[#FFD166] text-[#1F2A44] shadow-[0_8px_0_rgba(255,209,102,0.24)]',
        featured: 'border-[#FFD166] bg-[#1F2A44] text-white shadow-[0_20px_48px_rgba(31,42,68,0.20)]',
        pill: 'bg-[#FFD166] text-[#1F2A44]',
        tab: 'bg-[#1F2A44] text-white',
    },
    profesor: {
        accent: 'bg-[#EAF2FF] text-[#1D4E89]',
        button: 'bg-white text-[#1D4E89] shadow-[0_8px_0_rgba(255,255,255,0.18)]',
        featured: 'border-[#1D4E89] bg-[#1D4E89] text-white shadow-[0_20px_48px_rgba(29,78,137,0.20)]',
        pill: 'bg-[#D7E8FF] text-[#1D4E89]',
        tab: 'bg-[#1D4E89] text-white',
    },
    institucion: {
        accent: 'bg-[#EAF8F1] text-[#237A4D]',
        button: 'bg-white text-[#237A4D] shadow-[0_8px_0_rgba(255,255,255,0.18)]',
        featured: 'border-[#237A4D] bg-[#237A4D] text-white shadow-[0_20px_48px_rgba(35,122,77,0.20)]',
        pill: 'bg-[#BFE8D4] text-[#1F2A44]',
        tab: 'bg-[#237A4D] text-white',
    },
}

export function PricingTabsClient({ groups }) {
    const [activeId, setActiveId] = useState(groups[0]?.id)
    const activeGroup = useMemo(
        () => groups.find((group) => group.id === activeId) || groups[0],
        [activeId, groups]
    )
    const styles = audienceStyles[activeGroup.id] || audienceStyles.familia
    const featuredPlan = activeGroup.plans.find((plan) => plan.featured)

    return (
        <div className='space-y-5'>
            <nav className='grid grid-cols-3 rounded-[2rem] bg-white/82 p-2 shadow-[0_10px_28px_rgba(31,42,68,0.08)] ring-1 ring-white/80'>
                {groups.map((group) => {
                    const active = group.id === activeGroup.id

                    return (
                        <button
                            key={group.id}
                            type='button'
                            onClick={() => setActiveId(group.id)}
                            className={`min-h-14 rounded-[1.6rem] px-2 py-2 text-center transition active:scale-[0.98] ${active ? styles.tab : 'text-[#7A8194]'}`}
                        >
                            <span className='block truncate text-sm font-black'>{group.eyebrow}</span>
                            <span className={`mt-0.5 block text-[10px] font-black uppercase tracking-[0.12em] ${active ? 'text-white/60' : 'text-[#7A8194]'}`}>
                                {active ? 'Activo' : 'Ver'}
                            </span>
                        </button>
                    )
                })}
            </nav>

            <section className='overflow-hidden rounded-[2.4rem] bg-white/95 shadow-[0_18px_52px_rgba(31,42,68,0.12)] ring-1 ring-white/80'>
                <div className={`grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6 ${styles.accent}`}>
                    <div>
                        <p className='text-xs font-black uppercase tracking-[0.16em]'>{activeGroup.eyebrow}</p>
                        <h2 className='mt-2 text-3xl font-black leading-tight text-[#1F2A44]'>{activeGroup.title}</h2>
                        <p className='mt-2 max-w-2xl text-sm font-black leading-6 opacity-80'>{activeGroup.audience}</p>
                    </div>

                    {featuredPlan ? (
                        <div className='rounded-[1.8rem] bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(31,42,68,0.10)] sm:min-w-[210px]'>
                            <p className='text-xs font-black uppercase tracking-[0.14em] opacity-70'>Oferta anual</p>
                            <p className='mt-1 text-3xl font-black leading-none text-[#1F2A44]'>{featuredPlan.offerPrice} Bs</p>
                            <p className='mt-1 text-xs font-black text-[#7A8194]'>
                                Precio normal <span className='line-through'>{featuredPlan.normalPrice} Bs</span>
                            </p>
                        </div>
                    ) : null}
                </div>

                <div className='p-4 sm:p-6'>
                    <div className='rounded-[1.8rem] bg-[#1F2A44] px-4 py-3 text-white'>
                        <p className='text-xs font-black uppercase tracking-[0.14em] text-[#FFD166]'>{activeGroup.highlight}</p>
                    </div>

                    <div className='mt-4 grid gap-3 lg:grid-cols-3'>
                        {activeGroup.plans.map((plan) => (
                            <PlanCard key={plan.id} group={activeGroup} plan={plan} styles={styles} />
                        ))}
                    </div>

                    <div className='mt-5 rounded-[2rem] bg-[#F8FBFF] p-4'>
                        <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Incluye</p>
                        <ul className='mt-3 grid gap-2 sm:grid-cols-2'>
                            {activeGroup.benefits.map((benefit) => (
                                <li key={benefit} className='flex gap-2 rounded-[1.6rem] bg-white px-3 py-2 text-sm font-bold leading-5 text-[#374151] shadow-sm'>
                                    <span className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#BFE8D4] text-[11px] font-black text-[#1F2A44]'>&#10003;</span>
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}

function PlanCard({ group, plan, styles }) {
    const featured = Boolean(plan.featured)

    return (
        <article className={`flex min-h-[236px] flex-col rounded-[2rem] border p-5 ${featured ? styles.featured : 'border-[#E5E7EB] bg-white text-[#1F2A44] shadow-[0_8px_22px_rgba(31,42,68,0.05)]'}`}>
            <div className='flex items-start justify-between gap-3'>
                <div>
                    <h3 className={`text-2xl font-black leading-tight ${featured ? 'text-white' : 'text-[#1F2A44]'}`}>{plan.name}</h3>
                    <p className={`mt-1 text-xs font-black uppercase tracking-[0.13em] ${featured ? 'text-white/60' : 'text-[#7A8194]'}`}>por {plan.period}</p>
                </div>
                {featured ? (
                    <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${styles.pill}`}>
                        Oferta
                    </span>
                ) : null}
            </div>

            <div className='mt-6'>
                {plan.offerPrice < plan.normalPrice ? (
                    <p className={`mb-1 text-sm font-black ${featured ? 'text-white/65' : 'text-[#7A8194]'}`}>
                        Antes <span className='line-through'>{plan.normalPrice} Bs</span>
                    </p>
                ) : null}
                <div className='flex items-end gap-2'>
                    <span className={`text-6xl font-black leading-none ${featured ? 'text-white' : 'text-[#1F2A44]'}`}>{plan.offerPrice}</span>
                    <span className={`pb-1 text-lg font-black ${featured ? 'text-white' : 'text-[#1F2A44]'}`}>Bs</span>
                </div>
            </div>

            <Link
                href={`/solicitar?plan=${plan.id}`}
                className={`mt-auto inline-flex min-h-12 items-center justify-center rounded-[1.4rem] px-4 text-sm font-black transition active:scale-[0.98] ${featured ? styles.button : 'bg-[#F3F4F6] text-[#1F2A44]'}`}
            >
                {featured ? group.cta : `Elegir ${plan.name}`}
            </Link>
        </article>
    )
}
