import { getAnalytics, isSupported } from 'firebase/analytics'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyA999AH2jAk_AObD4G25gOoxcTtgdOAFKo',
    authDomain: 'lectorcito-3f6d7.firebaseapp.com',
    projectId: 'lectorcito-3f6d7',
    storageBucket: 'lectorcito-3f6d7.firebasestorage.app',
    messagingSenderId: '734845969367',
    appId: '1:734845969367:web:51fca36ba295edd212e192',
    measurementId: 'G-Z0X6FXW7GN',
}

let analyticsPromise = null

export function getFirebaseApp() {
    return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

export function getFirebaseAuth() {
    return getAuth(getFirebaseApp())
}

export function getGoogleProvider() {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    return provider
}

export function initializeFirebaseAnalytics() {
    if (typeof window === 'undefined') {
        return Promise.resolve(null)
    }

    if (!analyticsPromise) {
        analyticsPromise = isSupported()
            .then((supported) => (supported ? getAnalytics(getFirebaseApp()) : null))
            .catch(() => null)
    }

    return analyticsPromise
}
