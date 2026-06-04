'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/features/auth/components/AuthProvider'
import { getPricingSelection } from '@/data/pricing'

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

export function PlanRequestClient() {
    const { authError, isAuthBusy, isAuthReady, loginWithGoogle, user } = useAuth()
    const searchParams = useSearchParams()
    const [step, setStep] = useState('form')
    const [form, setForm] = useState({
        recoveryPhone: '',
        payerName: '',
        studentAge: '',
        studentName: '',
    })
    const { group, plan } = getPricingSelection(searchParams.get('plan'))

    function updateField(event) {
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value }))
    }

    function submitForm(event) {
        event.preventDefault()

        const request = {
            createdAt: new Date().toISOString(),
            form,
            plan: {
                groupId: group.id,
                groupTitle: group.title,
                id: plan.id,
                name: plan.name,
                price: plan.offerPrice,
            },
            user: {
                email: user?.email || '',
                name: user?.displayName || '',
                uid: user?.uid || '',
            },
        }

        window.localStorage.setItem('fabulas-3000:last-plan-request', JSON.stringify(request))
        setStep('qr')
    }

    return (
        <section className='overflow-hidden rounded-[2.2rem] bg-white/95 shadow-[0_18px_52px_rgba(31,42,68,0.12)] ring-1 ring-white/80'>
            <div className='grid gap-4 bg-[#F8FBFF] p-5 sm:grid-cols-[1fr_auto] sm:items-center'>
                <div>
                    <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>{group.eyebrow}</p>
                    <h2 className='mt-1 text-2xl font-black leading-tight text-[#1F2A44]'>{group.title} - {plan.name}</h2>
                    <p className='mt-1 text-sm font-bold text-[#7A8194]'>{plan.offerPrice} Bs por {plan.period}</p>
                </div>
                <div className='rounded-[1.4rem] bg-white px-4 py-3 shadow-sm'>
                    <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Paso</p>
                    <p className='mt-1 text-lg font-black text-[#1F2A44]'>{user ? step === 'qr' ? 'QR' : 'Datos' : 'Google'}</p>
                </div>
            </div>

            {!isAuthReady ? (
                <div className='p-5 text-sm font-black text-[#7A8194]'>Preparando inicio de sesión...</div>
            ) : !user ? (
                <div className='p-5'>
                    <div className='rounded-[2rem] bg-white p-5 shadow-[0_10px_26px_rgba(31,42,68,0.08)] ring-1 ring-[#EEF2F7]'>
                        <h3 className='text-2xl font-black leading-tight text-[#1F2A44]'>Inicia con Gmail para continuar</h3>
                        <p className='mt-2 text-sm font-bold leading-6 text-[#7A8194]'>Tu acceso quedará vinculado a esta cuenta.</p>
                        {authError ? (
                            <p className='mt-3 rounded-2xl bg-[#FFE8E3] px-4 py-3 text-sm font-black text-[#9F2D20]'>{authError}</p>
                        ) : null}
                        <button
                            type='button'
                            onClick={loginWithGoogle}
                            disabled={isAuthBusy}
                            className='mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-[1.5rem] bg-white px-5 text-base font-black text-[#1F2A44] shadow-[inset_0_0_0_2px_#E7EEF8,0_8px_0_rgba(31,42,68,0.08)] transition active:translate-y-1 active:shadow-[inset_0_0_0_2px_#E7EEF8] disabled:opacity-60'
                        >
                            <GoogleMark className='h-5 w-5' />
                            {isAuthBusy ? 'Conectando...' : 'Continuar con Google'}
                        </button>
                    </div>
                </div>
            ) : step === 'qr' ? (
                <QrStep form={form} group={group} plan={plan} user={user} onBack={() => setStep('form')} />
            ) : (
                <form onSubmit={submitForm} className='grid gap-4 p-5'>
                    <div className='rounded-[1.6rem] bg-[#F8FBFF] p-4'>
                        <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Cuenta Google</p>
                        <p className='mt-1 truncate text-base font-black text-[#1F2A44]'>{user.displayName || user.email}</p>
                        <p className='truncate text-sm font-bold text-[#7A8194]'>{user.email}</p>
                    </div>

                    <div className='grid gap-4 sm:grid-cols-2'>
                        <div className='grid gap-2 sm:col-span-2'>
                            <label className='grid gap-2 text-sm font-black text-[#1F2A44]'>
                                Nombre completo del responsable
                                <input required name='payerName' value={form.payerName} onChange={updateField} placeholder='Nombre de quien hará el pago' className='min-h-12 rounded-[1.2rem] border border-[#E5E7EB] bg-white px-4 font-bold outline-none focus:border-[#A7D8F5]' />
                            </label>
                            <p className='rounded-[1.2rem] bg-[#FFF7CC] px-4 py-3 text-xs font-black leading-5 text-[#8A5A00]'>
                                Usa el mismo nombre que aparecerá en el comprobante de pago.
                            </p>
                        </div>

                        <label className='grid gap-2 text-sm font-black text-[#1F2A44]'>
                            Celular de recuperación
                            <input required name='recoveryPhone' value={form.recoveryPhone} onChange={updateField} inputMode='tel' placeholder='Ej. 70000000' className='min-h-12 rounded-[1.2rem] border border-[#E5E7EB] bg-white px-4 font-bold outline-none focus:border-[#A7D8F5]' />
                        </label>

                        <label className='grid gap-2 text-sm font-black text-[#1F2A44]'>
                            Estudiante
                            <input required name='studentName' value={form.studentName} onChange={updateField} placeholder='Nombre del estudiante' className='min-h-12 rounded-[1.2rem] border border-[#E5E7EB] bg-white px-4 font-bold outline-none focus:border-[#A7D8F5]' />
                        </label>

                        <label className='grid gap-2 text-sm font-black text-[#1F2A44]'>
                            Edad estudiante
                            <input required name='studentAge' value={form.studentAge} onChange={updateField} inputMode='numeric' min='3' max='18' type='number' placeholder='Ej. 7' className='min-h-12 rounded-[1.2rem] border border-[#E5E7EB] bg-white px-4 font-bold outline-none focus:border-[#A7D8F5]' />
                        </label>
                    </div>

                    <button type='submit' className='min-h-12 rounded-[1.5rem] bg-[#1F2A44] px-5 text-base font-black text-white shadow-[0_8px_0_rgba(31,42,68,0.16)] transition active:translate-y-1 active:shadow-none'>
                        Continuar al QR
                    </button>
                </form>
            )}
        </section>
    )
}

function QrStep({ form, group, onBack, plan, user }) {
    const [isVerifyingPayment, setIsVerifyingPayment] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState('')
    const [showSupportButton, setShowSupportButton] = useState(false)

    function contactSupport() {
        const message = [
            'Hola, quiero activar mi cuenta inmediatamente.',
            `Plan: ${group.title} - ${plan.name}`,
            `Monto: ${plan.offerPrice} Bs`,
            `Cuenta Google: ${user.email}`,
            `Responsable del pago: ${form.payerName}`,
            `Estudiante: ${form.studentName}, ${form.studentAge} años`,
            `Celular: ${form.recoveryPhone}`,
        ].join('\n')

        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    }

    async function verifyPayment() {
        if (isVerifyingPayment) return

        setIsVerifyingPayment(true)
        setPaymentStatus('')
        setShowSupportButton(false)

        try {
            const storedPayment = window.localStorage.getItem(`fabulas-3000:paid-plan:${plan.id}`)

            if (storedPayment) {
                setPaymentStatus('Pago confirmado. Tu plan ya puede activarse.')
                return
            }

            setPaymentStatus('Aún no encontramos el pago. Intenta nuevamente en unos minutos.')
            setShowSupportButton(true)
        } finally {
            setIsVerifyingPayment(false)
        }
    }

    return (
        <div className='grid gap-5 p-5 lg:grid-cols-[280px_1fr]'>
            <div className='rounded-[2rem] bg-white p-5 text-center shadow-[0_10px_26px_rgba(31,42,68,0.08)] ring-1 ring-[#EEF2F7]'>
                <div className='mx-auto grid h-52 w-52 grid-cols-5 gap-1 rounded-[1.4rem] bg-white p-3 shadow-inner ring-1 ring-[#E5E7EB]'>
                    {Array.from({ length: 25 }).map((_, index) => (
                        <span key={index} className={`rounded-sm ${[0, 1, 3, 4, 6, 8, 10, 11, 14, 16, 18, 20, 21, 23, 24].includes(index) ? 'bg-[#1F2A44]' : 'bg-[#F3F4F6]'}`} />
                    ))}
                </div>
                <p className='mt-4 text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>QR de pago</p>
                <p className='mt-1 text-2xl font-black text-[#1F2A44]'>{plan.offerPrice} Bs</p>
                <button
                    type='button'
                    onClick={verifyPayment}
                    disabled={isVerifyingPayment}
                    className='mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-[1.4rem] bg-[#FFD166] px-4 text-sm font-black text-[#1F2A44] shadow-[0_8px_0_rgba(255,209,102,0.25)] transition active:translate-y-1 active:shadow-none disabled:opacity-60'
                >
                    {isVerifyingPayment ? 'Verificando...' : 'Verificar pago'}
                </button>
                {paymentStatus ? (
                    <p className='mt-3 rounded-[1.2rem] bg-[#F8FBFF] px-4 py-3 text-sm font-black leading-5 text-[#7A8194]'>
                        {paymentStatus}
                    </p>
                ) : null}
                {showSupportButton ? (
                    <button
                        type='button'
                        onClick={contactSupport}
                        className='mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-[1.4rem] bg-[#1F2A44] px-4 text-sm font-black leading-5 text-white shadow-[0_8px_0_rgba(31,42,68,0.16)] transition active:translate-y-1 active:shadow-none'
                    >
                        Contacta soporte y activa tu cuenta inmediatamente
                    </button>
                ) : null}
            </div>

            <div className='rounded-[2rem] bg-[#F8FBFF] p-5'>
                <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Solicitud registrada</p>
                <h3 className='mt-1 text-2xl font-black leading-tight text-[#1F2A44]'>{group.title} - {plan.name}</h3>
                <div className='mt-4 space-y-2 text-sm font-bold text-[#5B6477]'>
                    <p>Cuenta: {user.email}</p>
                    <p>Responsable del pago: {form.payerName}</p>
                    <p>Estudiante: {form.studentName}, {form.studentAge} años</p>
                    <p>Celular: {form.recoveryPhone}</p>
                </div>
                <p className='mt-4 rounded-[1.4rem] bg-white px-4 py-3 text-sm font-black leading-6 text-[#7A8194]'>
                    Realiza el pago con el nombre registrado y conserva tu comprobante.
                </p>
                <button type='button' onClick={onBack} className='mt-4 rounded-[1.4rem] bg-white px-4 py-3 text-sm font-black text-[#1F2A44] shadow-sm'>
                    Editar datos
                </button>
            </div>
        </div>
    )
}
