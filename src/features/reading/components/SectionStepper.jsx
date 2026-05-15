import { READING_SECTION_LABELS, READING_SECTION_ORDER } from '../constants/sections'

export function SectionStepper({ activeSection }) {
    const activeIndex = activeSection === 'COMPLETE'
        ? READING_SECTION_ORDER.length
        : READING_SECTION_ORDER.indexOf(activeSection)

    return (
        <div className='flex min-w-0 flex-1 justify-end gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0'>
            {READING_SECTION_ORDER.map((section, index) => {
                const isDone = index < activeIndex
                const isActive = section === activeSection

                return (
                    <span
                        key={section}
                        className={`whitespace-nowrap rounded-2xl px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition sm:px-4 ${isDone ? 'bg-[#5ee38a] text-[#12351f]' : ''} ${isActive ? 'bg-[#ffd447] text-[#172554] shadow-[0_4px_0_rgba(0,0,0,0.18)]' : ''} ${!isDone && !isActive ? 'bg-white/15 text-white/75' : ''}`}
                    >
                        {READING_SECTION_LABELS[section]}
                    </span>
                )
            })}
        </div>
    )
}
