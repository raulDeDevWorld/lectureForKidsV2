import './globals.css'
import { Quicksand } from 'next/font/google'
import { AuthProvider } from '@/features/auth/components/AuthProvider'
import { PwaRuntime } from '@/features/pwa/components/PwaRuntime'

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="es" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="icon" href="/tiger.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/tiger.png" />
        <meta name="theme-color" content="#f8fafc" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Fabulas 3000" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="description" content="Aplicacion de lectura infantil con fabulas, voz y diccionario." />
        <meta name="keywords" content="fabulas, lectura infantil, cuentos, voz" />
        <meta name="author" content="Fabulas 3000" />
        <title>Fabulas 3000</title>
      </head>
      <body className={quicksand.className}>
        <AuthProvider>
          <PwaRuntime />
          <main id="home" className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
