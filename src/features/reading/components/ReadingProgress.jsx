export function ReadingProgress({ progressPercent, session }) {
    return (
        <div>
            <div className='flex items-center justify-between gap-4 text-[11px] font-black uppercase tracking-[0.14em] text-white/80'>
                <span>Progreso {progressPercent}%</span>
                <span>{session.currentIndex}/{session.wordTokens.length} palabras</span>
            </div>
            <div className='mt-2 h-3 overflow-hidden rounded-full bg-white/20'>
                <div
                    className='h-full rounded-full bg-[linear-gradient(90deg,#5ee38a,#4cc9f0,#ffd447)] transition-all duration-300'
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    )
}
