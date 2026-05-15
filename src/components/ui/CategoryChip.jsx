export function CategoryChip({ active = false, children, className = '', ...props }) {
    return (
        <button
            type='button'
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black transition active:scale-95 ${active ? 'bg-[#A7D8F5] text-[#1F2A44]' : 'bg-white text-[#7A8194] shadow-sm'} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
