export function DictionaryModal({ definition, onClose }) {
    if (!definition) return null

    return (
        <div className='fixed inset-0 z-30 flex items-end justify-center bg-[#14213d]/55 p-3 backdrop-blur-sm sm:items-center' onClick={onClose}>
            <div className='w-full max-w-md rounded-[28px] bg-white p-5 shadow-[0_24px_80px_rgba(20,33,61,0.25)] sm:p-6' onClick={(event) => event.stopPropagation()}>
                <p className='text-xs font-black uppercase tracking-[0.18em] text-[#126782]'>Diccionario</p>
                <h2 className='mt-2 text-3xl font-black capitalize text-[#14213d]'>{definition.word}</h2>
                <p className='mt-3 text-lg font-semibold leading-8 text-slate-700'>{definition.text}</p>
                <button
                    type='button'
                    className='mt-5 w-full rounded-full bg-[#14213d] px-5 py-3 text-sm font-black text-white sm:w-auto'
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>
    )
}
