export function PastelButton({ children, className = '', variant = 'primary', ...props }) {
    const variants = {
        primary: 'bg-[#A7D8F5] text-[#1F2A44] shadow-[0_8px_0_rgba(167,216,245,0.45)]',
        peach: 'bg-[#FFC3A1] text-[#1F2A44] shadow-[0_8px_0_rgba(255,195,161,0.40)]',
        yellow: 'bg-[#FFD166] text-[#1F2A44] shadow-[0_8px_0_rgba(255,209,102,0.38)]',
        coral: 'bg-[#FF7F6E] text-white shadow-[0_8px_0_rgba(255,127,110,0.36)]',
    }

    return (
        <button
            type='button'
            className={`inline-flex min-h-12 items-center justify-center rounded-3xl px-6 py-3 text-base font-black transition active:translate-y-1 active:shadow-none md:hover:-translate-y-0.5 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
