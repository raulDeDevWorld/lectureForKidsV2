'use client'

import Link from 'next/link'
import { BookIcon, HeartIcon, TicketIcon } from '@/components/icons/Icons'
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

const accountLinks = [
    {
        href: '/cuentos',
        icon: BookIcon,
        label: 'Biblioteca',
        text: 'Explora todos los cuentos disponibles.',
    },
    {
        href: '/cuentos?favoritos=1',
        icon: HeartIcon,
        label: 'Favoritos',
        text: 'Continua las historias guardadas.',
    },
    {
        href: '/precios',
        icon: TicketIcon,
        label: 'Planes',
        text: 'Revisa opciones para casa o aula.',
    },
]

export function ProfilePageClient() {
    const { user, isAuthReady, isAuthBusy, authError, loginWithGoogle, logout } = useAuth()
    const displayName = user?.displayName || user?.email || 'Invitado'
    const initial = displayName.charAt(0).toUpperCase()

    return (
        <div className='space-y-5'>
            <section className='overflow-hidden rounded-[2rem] bg-white/90 shadow-[0_18px_52px_rgba(31,42,68,0.12)] ring-1 ring-white/80'>
                <div className='bg-[linear-gradient(135deg,#F8FCFF,#EAF8F1)] p-5 sm:p-6'>
                    <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Cuenta</p>
                    <h2 className='mt-2 text-3xl font-black leading-tight text-[#1F2A44]'>
                        {user ? 'Sesion activa' : 'Inicia sesion'}
                    </h2>
                    <p className='mt-2 max-w-2xl text-sm font-bold leading-6 text-[#6B7280]'>
                        {user
                            ? 'Gestiona tu acceso, tus rutas de lectura y las acciones principales de la app.'
                            : 'Conecta tu cuenta de Google para asociar solicitudes de plan y mantener tu acceso identificado.'}
                    </p>
                </div>

                <div className='grid gap-5 p-5 lg:grid-cols-[1fr_1.2fr]'>
                    <div className='rounded-[1.7rem] bg-[#F8FBFF] p-4'>
                        {user ? (
                            <div className='flex items-center gap-4'>
                                {user.photoURL ? (
                                    <div
                                        aria-hidden='true'
                                        className='h-16 w-16 shrink-0 rounded-full bg-cover bg-center shadow-sm ring-4 ring-white'
                                        style={{ backgroundImage: `url("${user.photoURL}")` }}
                                    />
                                ) : (
                                    <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#BFE8D4] text-2xl font-black text-[#1F2A44] shadow-sm ring-4 ring-white'>
                                        {initial}
                                    </div>
                                )}
                                <div className='min-w-0'>
                                    <p className='truncate text-lg font-black text-[#1F2A44]'>{displayName}</p>
                                    <p className='truncate text-sm font-bold text-[#7A8194]'>{user.email}</p>
                                    <p className='mt-2 w-fit rounded-full bg-[#EAF8F1] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#237A4D]'>
                                        Conectado
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className='rounded-[1.4rem] bg-white p-4 shadow-sm ring-1 ring-[#EEF2F7]'>
                                <p className='text-base font-black text-[#1F2A44]'>Cuenta no conectada</p>
                                <p className='mt-2 text-sm font-bold leading-6 text-[#7A8194]'>
                                    Puedes leer cuentos sin iniciar sesion. Para compras o solicitudes, usa Google.
                                </p>
                            </div>
                        )}

                        {authError ? (
                            <p className='mt-4 rounded-2xl bg-[#FFE8E3] px-4 py-3 text-sm font-black text-[#9F2D20]'>
                                {authError}
                            </p>
                        ) : null}

                        <div className='mt-4'>
                            {user ? (
                                <button
                                    type='button'
                                    className='min-h-12 w-full rounded-[1.4rem] bg-[#FF7F6E] px-5 text-base font-black text-white shadow-[0_8px_0_rgba(255,127,110,0.24)] transition active:translate-y-1 active:shadow-none disabled:opacity-60'
                                    onClick={logout}
                                    disabled={!isAuthReady || isAuthBusy}
                                >
                                    {isAuthBusy ? 'Cerrando...' : 'Cerrar sesion'}
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='flex min-h-12 w-full items-center justify-center gap-3 rounded-[1.4rem] bg-white px-5 text-base font-black text-[#1F2A44] shadow-[inset_0_0_0_2px_#E7EEF8,0_8px_0_rgba(31,42,68,0.08)] transition active:translate-y-1 active:shadow-[inset_0_0_0_2px_#E7EEF8] disabled:opacity-60'
                                    onClick={loginWithGoogle}
                                    disabled={!isAuthReady || isAuthBusy}
                                >
                                    <GoogleMark className='h-5 w-5' />
                                    {isAuthBusy ? 'Conectando...' : 'Continuar con Google'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-1'>
                        {accountLinks.map((item) => {
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className='group flex min-h-[104px] items-center gap-4 rounded-[1.7rem] bg-white p-4 shadow-sm ring-1 ring-[#EEF2F7] transition active:scale-[0.99] md:hover:-translate-y-0.5'
                                >
                                    <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#A7D8F5] text-[#1F2A44] shadow-inner'>
                                        <Icon className='h-6 w-6' />
                                    </span>
                                    <span className='min-w-0'>
                                        <span className='block text-base font-black text-[#1F2A44]'>{item.label}</span>
                                        <span className='mt-1 block text-sm font-bold leading-5 text-[#7A8194]'>{item.text}</span>
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className='grid gap-4 sm:grid-cols-2'>
                <div className='rounded-[2rem] bg-[#FFF7CC] p-5 shadow-[0_14px_36px_rgba(31,42,68,0.08)] ring-1 ring-white/80'>
                    <p className='text-xs font-black uppercase tracking-[0.14em] text-[#8A5A00]'>Estado del plan</p>
                    <h3 className='mt-2 text-2xl font-black leading-tight text-[#1F2A44]'>Acceso basico</h3>
                    <p className='mt-2 text-sm font-bold leading-6 text-[#8A5A00]'>
                        La activacion de planes se gestiona desde precios y solicitud de pago.
                    </p>
                </div>

                <div className='rounded-[2rem] bg-[#EAF8F1] p-5 shadow-[0_14px_36px_rgba(31,42,68,0.08)] ring-1 ring-white/80'>
                    <p className='text-xs font-black uppercase tracking-[0.14em] text-[#237A4D]'>Soporte</p>
                    <h3 className='mt-2 text-2xl font-black leading-tight text-[#1F2A44]'>Ayuda con tu cuenta</h3>
                    <p className='mt-2 text-sm font-bold leading-6 text-[#237A4D]'>
                        Si hiciste una solicitud, conserva tu comprobante y revisa el flujo de pago.
                    </p>
                </div>
            </section>
        </div>
    )
}
