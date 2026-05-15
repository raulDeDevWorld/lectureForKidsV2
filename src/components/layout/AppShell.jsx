import { Suspense } from 'react'
import { BottomNav } from './BottomNav'

export function AppShell({ children, className = '' }) {
    return (
        <div className={`relative min-h-screen overflow-hidden bg-[#FFF9EF] pb-28 text-[#1F2A44] ${className}`}>
            <div className='pointer-events-none absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#A7D8F5]/35 blur-3xl' />
            <div className='pointer-events-none absolute -right-20 top-64 h-56 w-56 rounded-full bg-[#FFC3A1]/35 blur-3xl' />
            <div className='pointer-events-none absolute bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#BFE8D4]/35 blur-3xl' />
            <main className='relative mx-auto min-h-screen w-full max-w-5xl px-4 pb-6 pt-4 sm:px-6 md:px-8'>
                {children}
            </main>
            <Suspense fallback={null}>
                <BottomNav />
            </Suspense>
        </div>
    )
}
