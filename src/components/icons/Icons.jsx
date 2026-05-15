export function BookIcon(props) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' {...props}>
            <path d='M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z' />
            <path d='M4 5.5A2.5 2.5 0 0 1 6.5 8H20' />
        </svg>
    )
}

export function StarIcon(props) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' {...props}>
            <path d='m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6-5.4-2.84-5.4 2.84 1.03-6-4.36-4.25 6.03-.88L12 3Z' />
        </svg>
    )
}

export function HeartIcon({ filled = false, ...props }) {
    return (
        <svg viewBox='0 0 24 24' fill={filled ? 'currentColor' : 'none'} stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' {...props}>
            <path d='M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z' />
        </svg>
    )
}

export function SearchIcon(props) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' {...props}>
            <circle cx='11' cy='11' r='7' />
            <path d='m20 20-3.5-3.5' />
        </svg>
    )
}

export function HomeIcon(props) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' {...props}>
            <path d='m3 11 9-8 9 8' />
            <path d='M5 10v10h14V10' />
            <path d='M9 20v-6h6v6' />
        </svg>
    )
}

export function UserIcon(props) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' {...props}>
            <circle cx='12' cy='8' r='4' />
            <path d='M4 21a8 8 0 0 1 16 0' />
        </svg>
    )
}

export function GameIcon(props) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' {...props}>
            <rect x='3' y='8' width='18' height='10' rx='5' />
            <path d='M8 13h3M9.5 11.5v3' />
            <path d='M16 12h.01M18 15h.01' />
        </svg>
    )
}

export function ArrowLeftIcon(props) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' {...props}>
            <path d='m15 18-6-6 6-6' />
        </svg>
    )
}

export function ArrowRightIcon(props) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' {...props}>
            <path d='m9 18 6-6-6-6' />
        </svg>
    )
}

export function SpeakerIcon(props) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' {...props}>
            <path d='M4 10v4h4l5 4V6l-5 4H4Z' />
            <path d='M16 9.5a4 4 0 0 1 0 5' />
            <path d='M18.5 7a7 7 0 0 1 0 10' />
        </svg>
    )
}

export function MicrophoneIcon(props) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' {...props}>
            <path d='M12 15a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v7a3 3 0 0 0 3 3Z' />
            <path d='M19 11a7 7 0 0 1-14 0' />
            <path d='M12 18v3' />
            <path d='M8 21h8' />
        </svg>
    )
}
