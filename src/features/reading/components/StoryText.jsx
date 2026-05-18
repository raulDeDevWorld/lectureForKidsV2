import { memo, useCallback, useState } from 'react'
import { normalizeWord } from '@/lib/readingMatcher'

export function StoryText({
    activeSection,
    className = '',
    narrationHighlight,
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

    const handleWordInteraction = useCallback((tokenKey, raw) => {
        setSelectedTokenKey(tokenKey)
        onPlayWord(raw)
    }, [onPlayWord])

    const handleLookupWord = useCallback((raw) => {
        const cleanToken = normalizeWord(raw)
        onLookupWord(cleanToken || raw)
    }, [onLookupWord])

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
                const tokenKey = `${section}-${index}`
                const wordIndex = tokens ? token.wordIndex : getWordIndexFromText(displayText, index)
                const isNarrating = narrationHighlight?.section === section && narrationHighlight?.wordIndex === wordIndex
                const status = isNarrating ? 'narrating' : sectionCompleted ? 'matched' : sectionActive ? token.status : 'pending'
                const isSelected = selectedTokenKey === tokenKey

                return (
                    <WordToken
                        key={tokenKey}
                        isSelected={isSelected}
                        onLookupWord={handleLookupWord}
                        onWordInteraction={handleWordInteraction}
                        raw={raw}
                        status={status}
                        tokenKey={tokenKey}
                    />
                )
            })}
        </p>
    )
}

const WordToken = memo(function WordToken({
    isSelected,
    onLookupWord,
    onWordInteraction,
    raw,
    status,
    tokenKey,
}) {
    const isCurrent = status === 'current'
    const isHearing = status === 'hearing'
    const classNames = [
        'cursor-pointer rounded-xl px-1.5 py-0.5 transition-all duration-200 hover:bg-[#fff1c7]',
        status === 'narrating' ? 'bg-[#BFE8D4] text-[#064E3B] underline decoration-[#10B981] decoration-4 underline-offset-4 ring-2 ring-[#10B981] shadow-[0_4px_0_rgba(16,185,129,0.18)]' : '',
        status === 'matched' ? 'bg-[#FFE08A] text-[#7C4A00] underline decoration-[#F59E0B] decoration-4 underline-offset-4 ring-1 ring-[#F59E0B]' : '',
        status === 'assisted' ? 'bg-[#FFF7CC] text-[#8a5a00] underline decoration-[#FACC15] decoration-dashed decoration-4 underline-offset-4 ring-1 ring-[#FACC15]' : '',
        isHearing ? 'bg-[#DFF2FD] text-[#075985] underline decoration-[#38BDF8] decoration-4 underline-offset-4 shadow-[0_4px_0_rgba(2,132,199,0.14)] ring-2 ring-[#38BDF8]' : '',
        isCurrent ? 'bg-[#4cc9f0] text-[#082f49] underline decoration-[#ff6b6b] decoration-4 underline-offset-4 shadow-[0_4px_0_rgba(8,47,73,0.14)] ring-2 ring-[#0284C7]' : '',
        isSelected ? 'text-[#1F2A44] ring-2 ring-[#F59E0B] shadow-[0_4px_0_rgba(245,158,11,0.20)]' : '',
    ].join(' ')

    return (
        <span
            aria-current={isCurrent ? 'true' : undefined}
            aria-label={`Palabra ${raw}. ${getStatusLabel(status)}`}
            className={classNames}
            role='button'
            style={isSelected ? { backgroundColor: '#FFE08A' } : undefined}
            tabIndex={0}
            onDoubleClick={() => onLookupWord(raw)}
            onClick={() => onWordInteraction(tokenKey, raw)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onWordInteraction(tokenKey, raw)
                }
            }}
        >
            {raw}
        </span>
    )
})

function getStatusLabel(status) {
    if (status === 'narrating') return 'Leyendo ahora.'
    if (status === 'matched') return 'Leida correctamente.'
    if (status === 'assisted') return 'Avanzada con ayuda.'
    if (status === 'hearing') return 'Detectando lectura.'
    if (status === 'current') return 'Palabra actual.'
    return 'Pendiente.'
}

function getWordIndexFromText(text, tokenIndex) {
    const tokens = String(text || '').split(/(\s+)/)
    let wordIndex = -1

    for (let index = 0; index <= tokenIndex; index += 1) {
        if (!/^\s+$/.test(tokens[index]) && normalizeWord(tokens[index])) {
            wordIndex += 1
        }
    }

    return wordIndex
}
