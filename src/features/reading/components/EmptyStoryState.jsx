import Link from 'next/link'

export function EmptyStoryState() {
    return (
        <div className='flex min-h-screen w-full items-center justify-center bg-[#f8fafc] p-5'>
            <div className='max-w-md rounded-[28px] bg-white p-6 text-center shadow-[0_20px_70px_rgba(20,33,61,0.12)]'>
                <h1 className='text-2xl font-black text-[#14213d]'>Fabula no encontrada</h1>
                <p className='mt-2 text-sm font-semibold text-slate-600'>Vuelve al inicio y selecciona una historia disponible.</p>
                <Link href='/' className='mt-5 inline-flex rounded-full bg-[#14213d] px-5 py-3 text-sm font-black text-white'>
                    Ir al inicio
                </Link>
            </div>
        </div>
    )
}
