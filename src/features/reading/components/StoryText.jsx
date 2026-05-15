import { normalizeWord } from '@/lib/readingMatcher'

export function StoryText({
    activeSection,
    className = '',
    onLookupWord,
    onPlayWord,
    renderableTokens,
    section,
    text,
}) {
    const sectionIndex = ['title', 'content', 'teaching'].indexOf(section)
    const activeIndex = ['title', 'content', 'teaching'].indexOf(activeSection)
    const sectionCompleted = activeSection === 'COMPLETE' || sectionIndex < activeIndex
    const sectionActive = section === activeSection
    const tokens = sectionActive ? renderableTokens : null
    const displayText = Array.isArray(text) ? text.join('\n\n') : String(text || '')

    const paragraphClassName = [
        'text-[1.05rem] font-bold leading-9 text-slate-800 sm:text-xl sm:leading-10',
        className,
    ].filter(Boolean).join(' ')

    return (
        <p className={paragraphClassName}>
            {(tokens || displayText.split(/(\s+)/)).map((token, index) => {
                if (tokens && token.type !== 'word') {
                    return token.raw.includes('\n') ? <br key={`${section}-${index}`} /> : token.raw
                }

                if (!tokens && /^\s+$/.test(token)) {
                    return token.includes('\n') ? <br key={`${section}-${index}`} /> : token
                }

                const raw = tokens ? token.raw : token
                const cleanToken = normalizeWord(raw)
                const status = sectionCompleted ? 'matched' : sectionActive ? token.status : 'pending'
                const isCurrent = status === 'current'
                const classNames = [
                    'cursor-pointer rounded-xl px-1.5 py-0.5 transition-all duration-200 hover:bg-[#fff1c7]',
                    status === 'matched' ? 'bg-[#CFF8DE] text-[#14532d] ring-1 ring-[#86EFAC]' : '',
                    status === 'assisted' ? 'bg-[#FFF1B8] text-[#8a5a00] ring-1 ring-[#FACC15]' : '',
                    isCurrent ? 'bg-[#4cc9f0] text-[#082f49] underline decoration-[#ff6b6b] decoration-4 underline-offset-4 shadow-[0_4px_0_rgba(8,47,73,0.14)] ring-2 ring-[#0284C7]' : '',
                ].join(' ')

                return (
                    <span
                        key={`${section}-${index}`}
                        className={classNames}
                        onDoubleClick={() => onLookupWord(cleanToken || raw)}
                        onClick={() => onPlayWord(raw)}
                    >
                        {raw}
                    </span>
                )
            })}
        </p>
    )
}
