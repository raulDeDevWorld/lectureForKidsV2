'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { getFirebaseAuth, getGoogleProvider, initializeFirebaseAnalytics } from '@/lib/firebaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthReady, setIsAuthReady] = useState(false)
    const [isAuthBusy, setIsAuthBusy] = useState(false)
    const [authError, setAuthError] = useState('')

    useEffect(() => {
        initializeFirebaseAnalytics()

        const auth = getFirebaseAuth()
        return onAuthStateChanged(auth, (nextUser) => {
            setUser(nextUser)
            setIsAuthReady(true)
        })
    }, [])

    const value = useMemo(() => {
        async function loginWithGoogle() {
            setIsAuthBusy(true)
            setAuthError('')

            try {
                await signInWithPopup(getFirebaseAuth(), getGoogleProvider())
            } catch (error) {
                const message = error?.code === 'auth/popup-closed-by-user'
                    ? 'Cerraste la ventana antes de iniciar sesion.'
                    : 'No se pudo iniciar sesion con Google.'
                setAuthError(message)
            } finally {
                setIsAuthBusy(false)
            }
        }

        async function logout() {
            setIsAuthBusy(true)
            setAuthError('')

            try {
                await signOut(getFirebaseAuth())
            } catch {
                setAuthError('No se pudo cerrar la sesion.')
            } finally {
                setIsAuthBusy(false)
            }
        }

        return {
            user,
            isAuthReady,
            isAuthBusy,
            authError,
            clearAuthError: () => setAuthError(''),
            loginWithGoogle,
            logout,
        }
    }, [authError, isAuthBusy, isAuthReady, user])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider')
    }

    return context
}
