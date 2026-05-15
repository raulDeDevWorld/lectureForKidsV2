import { SearchIcon } from '@/components/icons/Icons'

export function SearchInput({ value, onChange, placeholder = 'Buscar cuentos...' }) {
    return (
        <label className='flex min-h-14 items-center gap-3 rounded-3xl border border-white/80 bg-white/90 px-4 text-[#1F2A44] shadow-[0_12px_32px_rgba(31,42,68,0.08)] backdrop-blur'>
            <SearchIcon className='h-5 w-5 shrink-0 text-[#7A8194]' />
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className='h-12 min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-[#A5ABBA]'
            />
        </label>
    )
}
