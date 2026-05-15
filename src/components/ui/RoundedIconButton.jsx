export function RoundedIconButton({ children, className = '', label, ...props }) {
    return (
        <button
            type='button'
            aria-label={label}
            className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1F2A44] shadow-[0_8px_24px_rgba(31,42,68,0.10)] transition active:scale-95 md:hover:-translate-y-0.5 ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
