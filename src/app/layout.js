import './globals.css'
import { Quicksand } from 'next/font/google'
import { AuthProvider } from '@/features/auth/components/AuthProvider'
import { PwaRuntime } from '@/features/pwa/components/PwaRuntime'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  createJsonLdScript,
  defaultOgImage,
  siteJsonLd,
} from '@/lib/seo'

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'education',
  alternates: {
    canonical: absoluteUrl('/'),
    languages: {
      es: absoluteUrl('/'),
      'es-BO': absoluteUrl('/'),
    },
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl('/'),
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: 'website',
    images: [defaultOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl(defaultOgImage.url)],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-lectorin-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon-32x32.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
}

export const viewport = {
  themeColor: '#FFF9EF',
  colorScheme: 'light',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es-BO" style={{ scrollBehavior: 'smooth' }}>
      <body className={quicksand.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={createJsonLdScript(siteJsonLd)}
        />
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
