'use client'

import { useEffect } from 'react'
import { useAuth } from './AuthProvider'

function GoogleMark(props) {
    return (
        <svg viewBox='0 0 24 24' aria-hidden='true' {...props}>
            <path fill='#4285F4' d='M21.6 12.23c0-.73-.07-1.43-.19-2.1H12v3.97h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.31 2.98-7.4Z' />
            <path fill='#34A853' d='M12 22c2.7 0 4.96-.89 6.62-2.4l-3.24-2.52c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.59-4.12H3.07v2.6A10 10 0 0 0 12 22Z' />
            <path fill='#FBBC05' d='M6.41 13.91a6 6 0 0 1 0-3.82v-2.6H3.07a10 10 0 0 0 0 9.02l3.34-2.6Z' />
            <path fill='#EA4335' d='M12 5.97c1.47 0 2.79.51 3.83 1.5l2.86-2.86A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.6C7.2 7.73 9.4 5.97 12 5.97Z' />
        </svg>
    )
}

export function ProfileLoginModal({ isOpen, onClose }) {
    const { user, isAuthReady, isAuthBusy, authError, clearAuthError, loginWithGoogle, logout } = useAuth()

    useEffect(() => {
        if (!isOpen) {
            clearAuthError()
        }
    }, [clearAuthError, isOpen])

    if (!isOpen) {
        return null
    }

    const displayName = user?.displayName || user?.email || 'Usuario'
    const photoURL = user?.photoURL

    return (
        <div className='fixed inset-0 z-[80] flex items-end justify-center bg-[#1F2A44]/35 px-4 pb-[calc(6.7rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center sm:pb-4'>
            <button type='button' aria-label='Cerrar perfil' className='absolute inset-0 cursor-default' onClick={onClose} />

            <section className='relative w-full max-w-sm rounded-[2rem] border border-white/80 bg-white p-5 text-[#1F2A44] shadow-[0_22px_70px_rgba(31,42,68,0.22)]'>
                <div className='flex items-start justify-between gap-4'>
                    <div>
                        <p className='text-xs font-black uppercase tracking-[0.12em] text-[#7A8194]'>Perfil</p>
                        <h2 className='mt-1 text-2xl font-black leading-tight'>
                            {user ? 'Sesion activa' : 'Inicia sesion'}
                        </h2>
                    </div>
                    <button
                        type='button'
                        className='flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF6FF] text-lg font-black text-[#1F2A44] transition active:scale-95'
                        onClick={onClose}
                        aria-label='Cerrar'
                    >
                        x
                    </button>
                </div>

                <div className='mt-5 rounded-[1.5rem] bg-[#F7FBFF] p-4'>
                    {user ? (
                        <div className='flex items-center gap-3'>
                            {photoURL ? (
                                <div
                                    aria-hidden='true'
                                    className='h-12 w-12 rounded-full bg-cover bg-center'
                                    style={{ backgroundImage: `url("${photoURL}")` }}
                                />
                            ) : (
                                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#BFE8D4] text-lg font-black'>
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className='min-w-0'>
                                <p className='truncate text-base font-black'>{displayName}</p>
                                <p className='truncate text-sm font-bold text-[#7A8194]'>{user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <p className='text-sm font-bold leading-6 text-[#5B6477]'>
                            El login solo crea usuarios en Firebase Authentication para medir cuantas personas usan la app.
                        </p>
                    )}
                </div>

                {authError && (
                    <p className='mt-3 rounded-2xl bg-[#FFE8E3] px-4 py-3 text-sm font-black text-[#9F2D20]'>
                        {authError}
                    </p>
                )}

                <div className='mt-5'>
                    {user ? (
                        <button
                            type='button'
                            className='w-full rounded-3xl bg-[#FF7F6E] px-5 py-3 text-base font-black text-white shadow-[0_8px_0_rgba(255,127,110,0.28)] transition active:translate-y-1 active:shadow-none disabled:opacity-60'
                            onClick={logout}
                            disabled={!isAuthReady || isAuthBusy}
                        >
                            {isAuthBusy ? 'Cerrando...' : 'Cerrar sesion'}
                        </button>
                    ) : (
                        <button
                            type='button'
                            className='flex w-full items-center justify-center gap-3 rounded-3xl bg-white px-5 py-3 text-base font-black text-[#1F2A44] shadow-[inset_0_0_0_2px_#E7EEF8,0_8px_0_rgba(31,42,68,0.08)] transition active:translate-y-1 active:shadow-[inset_0_0_0_2px_#E7EEF8] disabled:opacity-60'
                            onClick={loginWithGoogle}
                            disabled={!isAuthReady || isAuthBusy}
                        >
                            <GoogleMark className='h-5 w-5' />
                            {isAuthBusy ? 'Conectando...' : 'Continuar con Google'}
                        </button>
                    )}
                </div>
            </section>
        </div>
    )
}
