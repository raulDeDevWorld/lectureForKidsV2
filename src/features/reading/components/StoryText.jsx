import { useState } from 'react'
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
    const [selectedTokenKey, setSelectedTokenKey] = useState(null)
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

    function handleWordInteraction(tokenKey, raw) {
        setSelectedTokenKey(tokenKey)
        onPlayWord(raw)
    }

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
                const tokenKey = `${section}-${index}`
                const status = sectionCompleted ? 'matched' : sectionActive ? token.status : 'pending'
                const isCurrent = status === 'current'
                const isHearing = status === 'hearing'
                const isSelected = selectedTokenKey === tokenKey
                const classNames = [
                    'cursor-pointer rounded-xl px-1.5 py-0.5 transition-all duration-200 hover:bg-[#fff1c7]',
                    status === 'matched' ? 'bg-[#FFE08A] text-[#7C4A00] underline decoration-[#F59E0B] decoration-4 underline-offset-4 ring-1 ring-[#F59E0B]' : '',
                    status === 'assisted' ? 'bg-[#FFF7CC] text-[#8a5a00] underline decoration-[#FACC15] decoration-dashed decoration-4 underline-offset-4 ring-1 ring-[#FACC15]' : '',
                    isHearing ? 'bg-[#DFF2FD] text-[#075985] underline decoration-[#38BDF8] decoration-4 underline-offset-4 shadow-[0_4px_0_rgba(2,132,199,0.14)] ring-2 ring-[#38BDF8]' : '',
                    isCurrent ? 'bg-[#4cc9f0] text-[#082f49] underline decoration-[#ff6b6b] decoration-4 underline-offset-4 shadow-[0_4px_0_rgba(8,47,73,0.14)] ring-2 ring-[#0284C7]' : '',
                    isSelected ? 'text-[#1F2A44] ring-2 ring-[#F59E0B] shadow-[0_4px_0_rgba(245,158,11,0.20)]' : '',
                ].join(' ')

                return (
                    <span
                        key={tokenKey}
                        aria-current={isCurrent ? 'true' : undefined}
                        aria-label={`Palabra ${raw}. ${getStatusLabel(status)}`}
                        className={classNames}
                        role='button'
                        style={isSelected ? { backgroundColor: '#FFE08A' } : undefined}
                        tabIndex={0}
                        onDoubleClick={() => onLookupWord(cleanToken || raw)}
                        onClick={() => handleWordInteraction(tokenKey, raw)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                handleWordInteraction(tokenKey, raw)
                            }
                        }}
                    >
                        {raw}
                    </span>
                )
            })}
        </p>
    )
}

function getStatusLabel(status) {
    if (status === 'matched') return 'Leida correctamente.'
    if (status === 'assisted') return 'Avanzada con ayuda.'
    if (status === 'hearing') return 'Detectando lectura.'
    if (status === 'current') return 'Palabra actual.'
    return 'Pendiente.'
}
