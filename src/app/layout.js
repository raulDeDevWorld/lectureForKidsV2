import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="es" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="icon" href="/tiger.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/tiger.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Aplicacion de lectura infantil con fabulas, voz y diccionario." />
        <meta name="keywords" content="fabulas, lectura infantil, cuentos, voz" />
        <meta name="author" content="Fabulas 3000" />
        <title>Fabulas 3000</title>
      </head>
      <body className={inter.className}>
        <main id="home" className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
